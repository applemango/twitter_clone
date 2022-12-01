import os, json, random
from secrets import token_hex, token_urlsafe
import secrets
from flask import Flask,jsonify,request, session
from flask import send_from_directory
from flask.wrappers import Request
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
from sqlalchemy import and_, desc
from werkzeug.utils import secure_filename

from os import path
import sys

basedir = os.path.abspath(os.path.dirname(__file__))
uploads_file_path = os.path.join(basedir, 'contents')
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
    icon = db.Column(db.String(), default="default")
    admin = db.Column(db.Boolean(), default=False)
    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)
    def to_object(self):
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "admin": self.admin,
        }

class Tweet(db.Model): # type: ignore
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    text = db.Column(db.String())
    content = db.Column(db.String())
    content_type = db.Column(db.String())
    timestamp = db.Column(db.DateTime, index=True, server_default=func.now())
    def to_object(self):
        user = User.query.get(self.user_id)
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": user.name,
            "user_icon": user.icon,
            "text": self.text,
            "content": self.content,
            "content_type": self.content_type,
            "timestamp": self.timestamp
        }

class Image(db.Model): # type: ignore
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    path = db.Column(db.String(), nullable=False)
    timestamp = db.Column(db.DateTime, index=True, server_default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Message(db.Model): # type: ignore
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    to = db.Column(db.Integer, db.ForeignKey("user.id"))
    send = db.Column(db.Integer, db.ForeignKey("user.id")) # from
    body = db.Column(db.String)
    timestamp = db.Column(db.DateTime, index=True, server_default=func.now())
    file = db.Column(db.String, default="")
    def to_object(self):
        to = User.query.get(self.to)
        send = User.query.get(self.send)
        return {
            "id": self.id,
            "to": to.to_object(),
            "send": send.to_object(),
            "body": self.body,
            "timestamp": self.timestamp,
            "file": self.file,
        }
    def to_object_safe(self):
        data = self.to_object()
        data["timestamp"] = str(self.timestamp)
        return data



@app.route("/tweets", methods=["POST"])
@cross_origin()
@jwt_required()
def route_tweet_post():
    text = request_data(request, "text")
    content_type = request_data(request, "content_type")
    content = request_data(request, "content")
    
    tweet = Tweet(
        user_id = request_user(),
        text = text,
        content = content,
        content_type = content_type,
    )

    db.session.add(tweet)
    db.session.commit()
    return jsonify({"tweet": tweet.to_object()})

@app.route("/tweets", methods=["GET"])
@cross_origin()
@cross_origin()
def route_tweet_get():
    tweets = get_tweets(
        start = request_arg_int(request, "start"),
        limit = request_arg_int(request, "limit")
    ).all()
    return jsonify({"data": to_objects(tweets)})

@app.route("/tweets/image", methods=["POST"])
@cross_origin()
@jwt_required()
def route_tweet_image_post():
    if "file" not in request.files:
        return jsonify("file not found"), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify("file not fined"), 400
    if file.filename and file and allowed_file(file.filename):
        random_str = generate_random_str(15)
        filename = secure_filename(random_str+"_"+file.filename)
        file.save(os.path.join(uploads_file_path, filename))
        user = request_user()
        db.session.add(Image(
            path=filename
            ,user_id=user
        ))
        db.session.commit()
        return jsonify({"path": filename}),200
    return jsonify("file not supported"), 400

@app.route("/tweets/image/<path>", methods=["GET"])
@cross_origin()
def route_tweet_image_get(path):
    image = Image.query.filter(Image.path == path).first()
    if not image:
        return jsonify("image not found"), 404
    return send_from_directory(uploads_file_path, path)

@app.route("/messages/user", methods=["GET"])
@cross_origin()
@jwt_required()
def route_messages_user_get():
    user = User.query.filter(User.id != request_user()).all()
    return jsonify({"data": to_objects(user)})

@app.route("/messages/<user>", methods=["GET"])
@cross_origin()
@jwt_required()
def route_messages_get(user):
    user = int(user)
    me = request_user()
    messages = Message.query.filter(and_(Message.to == me,Message.send == user) | and_(Message.to == user,Message.send == me))
    return jsonify({"data": to_objects(messages)})

###########################
###########################
###########################
@socketIo.on('connect')
def connect():
    if not token_auth(request.args.get('token')):
        raise ConnectionRefusedError("Token not found")
    token = get_token_data(request.args.get('token'))
    if not token:
        raise ConnectionRefusedError("Token not found")
    join_room(str(token["sub"]))

@socketIo.event
def socket_send_message_to_user(message):
    if not token_auth(request.args.get('token')):
        raise RuntimeError("Token not found")
    token_data = decode_token(request.args.get('token'))  # type: ignore
    u: User = User.query.get(int(token_data["sub"]))
    t: User = User.query.get(int(message["to"]))
    if not t or not u:
        return jsonify("user not found"), 403
    msg = Message(
        to=t.id,
        send=u.id,
        body=message["body"],
        file= message["file"] if message["file"] else None,
    )
    db.session.add(msg)
    db.session.commit()
    emit("message_from_user", msg.to_object_safe(), to=str(t.id))
    emit("message_to_user", msg.to_object_safe(), to=str(u.id))

###########################
###########################
###########################
def get_tweets( # Alternative syntax for unions requires Python 3.10 or newer
    start = None,
    limit = None,
    user_id = None
):
    tweets = Tweet.query.order_by(desc(Tweet.timestamp)) \
        .filter(Tweet.user_id == user_id if user_id else True)
    if limit:
        tweets = tweets.limit(limit)
    if start:
        tweets = tweets[start:]
    return tweets

def to_objects(data: list):
    result = []
    for d in data:
        result.append(d.to_object())
    return result

def request_arg(request: Request, name: str):
    try:
        return request.args.get(name)
    except:
        return None

def request_arg_int(request: Request, name: str):
    try:
        r = request.args.get(name)
        if r:
            return int(r)
    except:
        return None
    return None

def request_data(request: Request, name: str):
    return json.loads(json.loads(request.get_data().decode('utf-8'))["body"])[name]

def request_user():
    return current_user.id  # type: ignore

def generate_random_str(length: int) -> str:
    a,r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",""
    for i in range(length):r += random.choice(a)
    return r

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def token_auth(jwt):
    try:
        if not decode_token(jwt):
            return False
    except:
        return False
    return True

def get_token_data(jwt):
    if not token_auth(jwt):
        return False
    data = decode_token(jwt)
    return data

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