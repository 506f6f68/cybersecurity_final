from server import create_app
from datetime import timedelta

app = create_app({
    'SECRET_KEY': 'secret',
    'OAUTH2_REFRESH_TOKEN_GENERATOR': True,
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///db.sqlite',
    'OAUTH2_TOKEN_EXPIRES_IN': {
        'authorization_code': 600,
        'implicit': 600,
        'password': 600,
        'client_credentials': 600
    },
    "JWT_SECRET_KEY": "jwt_secret_key",
    "JWT_ACCESS_TOKEN_EXPIRES": timedelta(hours=1)
})
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)