import os, json, random
from secrets import token_hex, token_urlsafe
import secrets
from flask import Flask,jsonify,request, session
from flask import send_from_directory
from datetime import datetime, timedelta, timezone
from sqlalchemy import func
from flask_jwt_extended import get_current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required,JWTManager \
    ,get_jwt,get_jwt_identity,current_user,create_refresh_token
from flask_jwt_extended import decode_token
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from flask_socketio import ConnectionRefusedError
from sqlalchemy import and_
from werkzeug.utils import secure_filename

from os import path
import sys

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    ,SQLALCHEMY_TRACK_MODIFICATIONS = False
    ,SECRET_KEY = "secret"
    ,JWT_SECRET_KEY = "secret"
    ,JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3)
    ,JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    ,JWT_TOKEN_LOCATION = ["headers"]
    ,JSON_AS_ASCII = False
)
socketIo = SocketIO(app, cors_allowed_origins="*")
cors = CORS(app, responses={r"/*": {"origins": "*"}})
jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class User(db.Model):  # type: ignore
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(), nullable=False)
    password = db.Column(db.String())

############################################################################################################################################################
############################################################################################################################################################
##########        TOKEN          ###########################################################################################################################
############################################################################################################################################################
############################################################################################################################################################
class TokenBlocklist(db.Model): # type: ignore
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    type = db.Column(db.String(16), nullable=False)
    user_id = db.Column(db.ForeignKey('user.id'), default=lambda: get_current_user().id, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    username = json.loads(json.loads(request.get_data().decode('utf-8'))["body"])["username"]
    password = json.loads(json.loads(request.get_data().decode('utf-8'))["body"])["password"]
    if password is None or username is None or password == "" or username == "": return jsonify({"msg": "password or username has not been entered"}), 400
    if len(password) < 5: return jsonify({"msg": "password is too short"}), 400
    if len(username) < 3: return jsonify({"msg": "username is too short"}), 400
    if User.query.filter_by(name=username).first() is not None: return jsonify({"msg": "The username is already in use"}), 409
    user = User(name=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify("create account")

@app.route('/token', methods=['POST'])
@cross_origin()
def create_token():
    username = json.loads(json.loads(request.get_data().decode('utf-8'))["body"])["username"]
    password = json.loads(json.loads(request.get_data().decode('utf-8'))["body"])["password"]
    user = User.query.filter_by(name=username).first()
    if user is None or not user.check_password(password):
        return jsonify({"msg": "Incorrect password or username"}), 401
    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)
    return jsonify(access_token=access_token, refresh_token=refresh_token)

@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
@cross_origin()
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)

@app.route("/logout", methods=["DELETE"])
@jwt_required(verify_type=False)
@cross_origin()
def modify_token():
    token = get_jwt()
    jti = token["jti"]
    ttype = token["type"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, type=ttype, created_at=now))
    db.session.commit()
    return jsonify(msg=f"{ttype.capitalize()} token successfully revoked")

@jwt.user_identity_loader
def user_identity_lookup(user):
    u = User.query.filter_by(name=user).first()
    if type(user) is int:
        u = User.query.filter_by(id=user).first()
    if u == None:return
    return u.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

@jwt.token_in_blocklist_loader
def token_block(_jwt_header, jwt_data):
    if TokenBlocklist.query.filter_by(jti=jwt_data["jti"]).first():
        return True
    return False


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)