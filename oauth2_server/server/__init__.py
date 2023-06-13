import os
from flask import Flask
from .models import db
from .oauth2 import config_oauth
from flask_cors import CORS
from flask_jwt_extended import JWTManager

def create_app(config=None):
    app = Flask(__name__)
    CORS(app)

    # load default configuration
    app.config.from_object('server.settings')

    # load environment configuration
    if 'WEBSITE_CONF' in os.environ:
        app.config.from_envvar('WEBSITE_CONF')

    # load app specified configuration
    if config is not None:
        if isinstance(config, dict):
            app.config.update(config)
        elif config.endswith('.py'):
            app.config.from_pyfile(config)

    setup_app(app)
    return app


def setup_app(app):
    # Create tables if they do not exist already
    @app.before_first_request
    def create_tables():
        db.create_all()

    db.init_app(app)
    config_oauth(app)

    jwt = JWTManager(app)

    from .oauth2_routes import oauth2 as oauth2_blueprint
    app.register_blueprint(oauth2_blueprint, url_prefix='')

    from .auth_routes import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    
    from .test_routes import test as test_blueprint
    app.register_blueprint(test_blueprint, url_prefix='/test')
