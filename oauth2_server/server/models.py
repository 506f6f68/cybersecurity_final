import time, json
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.sqla_oauth2 import (
    OAuth2ClientMixin,
    OAuth2AuthorizationCodeMixin,
    OAuth2TokenMixin,
)

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.String(40), primary_key=True)
    public_key = db.Column(db.String(400))
    personal_id = db.Column(db.String(40), unique=True)
    first_name = db.Column(db.String(40))
    last_name = db.Column(db.String(40))

    def __str__(self):
        return json.dumps({
            "personal_id": self.personal_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "id": self.id,
            "public_key": self.public_key
        })

    def get_profile(self):
        return {
            "personal_id": self.personal_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "id": self.id,
            "public_key": self.public_key
        }

    def get_user_id(self):
        return self.id

    # def check_password(self, password):
    #     return password == 'valid'

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}



class OAuth2Client(db.Model, OAuth2ClientMixin):
    __tablename__ = 'oauth2_client'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    user = db.relationship('User')

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class OAuth2AuthorizationCode(db.Model, OAuth2AuthorizationCodeMixin):
    __tablename__ = 'oauth2_code'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    user = db.relationship('User')


class OAuth2Token(db.Model, OAuth2TokenMixin):
    __tablename__ = 'oauth2_token'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    user = db.relationship('User')

    def is_refresh_token_active(self):
        if self.revoked:
            return False
        expires_at = self.issued_at + self.expires_in * 2
        return expires_at >= time.time()
