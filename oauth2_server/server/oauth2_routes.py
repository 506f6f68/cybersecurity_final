import time, json
from flask import Blueprint, request, session, url_for
from flask import render_template, redirect, jsonify
from werkzeug.security import gen_salt
from authlib.integrations.flask_oauth2 import current_token
from authlib.oauth2 import OAuth2Error
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, OAuth2Client
from .oauth2 import authorization, require_oauth


oauth2 = Blueprint('oauth2', __name__)

def current_user():
    if 'id' in session:
        print(session)
        uid = session['id']
        return User.query.get(uid)
    return None


def split_by_crlf(s):
    return [v for v in s.splitlines() if v]

@oauth2.route('/alive', methods=['GET'])
def alive():
    return {"message":"alive"}

@oauth2.route('/', methods=('GET', 'POST'))
def home():
    if request.method == 'POST':
        personal_id = request.form.get('personal_id')
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        user = User.query.filter_by(personal_id=personal_id).first()
        if not user:
            user = User(personal_id=personal_id, first_name=first_name, last_name=last_name)
            db.session.add(user)
            db.session.commit()
        session['id'] = user.id
        # if user is not just to log in, but need to head back to the auth page, then go for it
        next_page = request.args.get('next')
        if next_page:
            return redirect(next_page)
        return redirect('/')
    user = current_user()
    if user:
        clients = OAuth2Client.query.filter_by(user_id=user.id).all()
    else:
        clients = []

    return render_template('home.html', user=user, clients=clients)


@oauth2.route('/clients', methods=['GET'])
@jwt_required()
def get_clients():
    personal_id = get_jwt_identity()
    user = User.query.filter_by(personal_id=personal_id).first()
    if user:
        clients = OAuth2Client.query.filter_by(user_id=user.id).all()
    else:
        clients = []
    if len(clients) > 0:
        for i in range(len(clients)):
            clients[i] = clients[i].as_dict()

    return clients, 200

@oauth2.route('/clients/<client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    personal_id = get_jwt_identity()
    user = User.query.filter_by(personal_id=personal_id).first()

    if not user:
        return {"message": "Invalid JWT token"}, 400
    
    client = OAuth2Client.query.filter_by(user_id=user.id).filter_by(client_id=client_id).first()
    if not client:
        return {"message": "Client not found"}, 404
    
    return client.as_dict(), 200

@oauth2.route('/clients/<client_id>/name', methods=['GET'])
def get_client_name(client_id):

    client = OAuth2Client.query.filter_by(client_id=client_id).first()
    if not client:
        return {"message": "Client not found"}, 404

    return {"client_name": client.as_dict()["client_metadata"]["client_name"]}, 200

@oauth2.route('/clients/<client_id>', methods=["PATCH"])
@jwt_required()
def update_client(client_id):
    personal_id = get_jwt_identity()
    user = User.query.filter_by(personal_id=personal_id).first()

    if not user:
        return {"message": "Invalid JWT token"}, 400
    
    client = OAuth2Client.query.filter_by(user_id=user.id).filter_by(client_id=client_id).first()
    if not client:
        return {"message": "Client not found"}, 404
    
    # Get request data
    data = request.json
    client_metadata = {
        "client_name": data["client_name"],
        "client_uri": data["client_uri"],
        "grant_types": split_by_crlf(data["grant_type"]),
        "redirect_uris": split_by_crlf(data["redirect_uri"]),
        "response_types": split_by_crlf(data["response_type"]),
        "scope": data["scope"],
        "token_endpoint_auth_method": data["token_endpoint_auth_method"]
    }
    client.set_client_metadata(client_metadata)

    db.session.commit()
    return {"message":"Successfully updated a client!"}, 200



@oauth2.route('/logout')
def logout():
    del session['id']
    return redirect('/')


@oauth2.route('/create_client', methods=('GET', 'POST'))
@jwt_required()
def create_client():
    personal_id = get_jwt_identity()
    user = User.query.filter_by(personal_id=personal_id).first()
    # user = current_user()   
    if not user:
        print("not a user!")
        return redirect('/')
    if request.method == 'GET':
        return render_template('create_client.html')

    client_id = gen_salt(24)
    client_id_issued_at = int(time.time())
    client = OAuth2Client(
        client_id=client_id,
        client_id_issued_at=client_id_issued_at,
        user_id=user.id,
    )

    # Get request data
    data = request.json

    client_metadata = {
        "client_name": data["client_name"],
        "client_uri": data["client_uri"],
        "grant_types": split_by_crlf(data["grant_type"]),
        "redirect_uris": split_by_crlf(data["redirect_uri"]),
        "response_types": split_by_crlf(data["response_type"]),
        "scope": data["scope"],
        "token_endpoint_auth_method": data["token_endpoint_auth_method"]
    }
    client.set_client_metadata(client_metadata)

    if data['token_endpoint_auth_method'] == 'none':
        client.client_secret = ''
    else:
        client.client_secret = gen_salt(48)

    db.session.add(client)
    db.session.commit()
    return {"message":"Successfully created a client!"}, 200


@oauth2.route('/oauth/authorize', methods=['GET', 'POST'])
@jwt_required()
def authorize():
    personal_id = get_jwt_identity()
    user = User.query.filter_by(personal_id=personal_id).first()
   
    # user = current_user()
    # if user log status is not true (Auth server), then to log it in
    # if not user:
    #     return redirect(url_for('oauth2.home', next=request.url))
    # if request.method == 'GET':
    #     try:
    #         grant = authorization.get_consent_grant(end_user=user)
    #     except OAuth2Error as error:
    #         return error.error
    #     return render_template('authorize.html', user=user, grant=grant)
    # if not user and 'personal_id' in request.form:
    #     personal_id = request.form.get('personal_id')
    #     user = User.query.filter_by(personal_id=personal_id).first()

    if request.json['confirm']:
        grant_user = user
    else:
        grant_user = None

    res = authorization.create_authorization_response(grant_user=grant_user)
    redirect_url = res.headers.get("Location")
    return {"redirect_url": redirect_url}, 200


@oauth2.route('/oauth/token', methods=['POST'])
def issue_token():
    return authorization.create_token_response()


@oauth2.route('/oauth/revoke', methods=['POST'])
def revoke_token():
    return authorization.create_endpoint_response('revocation')


@oauth2.route('/api/me')
@require_oauth('profile')
def api_me():
    user = current_token.user
    return jsonify(id=user.id, personal_id=user.personal_id, first_name=user.first_name,  last_name=user.last_name,)
