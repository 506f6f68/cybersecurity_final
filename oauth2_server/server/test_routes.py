import json
from flask import Flask, request, jsonify, Blueprint
from .models import db, User

test = Blueprint('test', __name__)


@test.route('/get_all_users', methods=["GET"])
def get_all_users():
    users = User.query.all()
    response = []
    for user in users:
        response.append(user.get_profile())
    return response, 200