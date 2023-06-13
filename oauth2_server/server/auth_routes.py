import json
from flask import Flask, request, jsonify, Blueprint
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from .models import db, User

auth = Blueprint('auth', __name__)

@auth.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
@auth.route('/register', methods=["POST"])
def register():
    # Get request data
    data = request.json
    personal_id = data['personal_id']
    first_name = data['first_name']
    last_name = data['last_name']

    # Get the user
    user = User.query.filter_by(personal_id=personal_id).first()

    # If the personal_id has been occupied, return 
    if user:
        return {"message": "Invalid personal_id"}, 400
    
    # Create a new user
    user = User(personal_id=personal_id, first_name=first_name, last_name=last_name)
    db.session.add(user)
    db.session.commit()

    # Issue JWT token
    access_token = create_access_token(identity=personal_id)
    response = {"access_token": access_token}

    return response, 200, {'ContentType':'application/json'} 


@auth.route('/login', methods=["POST"])
def login():
    personal_id = request.json['personal_id']
    user = User.query.filter_by(personal_id=personal_id).first()
    # Check if the user exists
    if not user:
        # User does not exist
        return {"message":"User not exist"}, 404
    # Authenticate the user
    # TODO

    access_token = create_access_token(identity=personal_id)
    response = {"access_token":access_token}
    return response

@auth.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@auth.route('/profile', methods=["GET"])
@jwt_required()
def my_profile():
    personal_id = get_jwt_identity()
    user = User.query.filter_by(personal_id=personal_id).first()
    response_body = user.get_profile()
    return response_body, 200

@auth.route('/profile', methods=["POST"])
@jwt_required()
def update_profile():
    personal_id = get_jwt_identity()
    user = User.query.filter_by(personal_id=personal_id).first()

    # Get request data
    data = request.json
    new_personal_id = data['personal_id']
    new_first_name = data['first_name']
    new_last_name = data['last_name']

    # Check new_personal_id available
    if new_personal_id != personal_id:
        check = User.query.filter_by(personal_id=new_personal_id).first()
        if check:
            return {"message": "Invalid personal_id"}, 400 

    # Update profile
    user.personal_id = new_personal_id
    user.first_name = new_first_name
    user.last_name = new_last_name
    db.session.commit()

    # Create new access token with new personal_id
    access_token = create_access_token(identity=new_personal_id)
    response = {"access_token": access_token}

    return response, 200