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
from mecab import wakati

from tag import tag_parse

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


followers = db.Table('followers',
    db.Column('follower', db.Integer, db.ForeignKey('user.id')),
    db.Column('following', db.Integer, db.ForeignKey('user.id'))
)
class User(db.Model):  # type: ignore
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(), nullable=False, unique=True)
    name_display = db.Column(db.String())
    profile = db.Column(db.String())
    location = db.Column(db.String(), default="japan")
    website = db.Column(db.String())
    password = db.Column(db.String())
    icon = db.Column(db.String(), default="")
    header = db.Column(db.String(), default="")
    admin = db.Column(db.Boolean(), default=False)
    timestamp = db.Column(db.DateTime, index=True, server_default=func.now())
    following = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower == id),
        secondaryjoin=(followers.c.following == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic')
    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)
    def is_following(self, user):
        return self.following.filter(
            followers.c.following == user.id).count() > 0
    def follow(self, user):
        if not self.is_following(user):
            self.following.append(user)
    def unfollow(self, user):
        if self.is_following(user):
            self.following.remove(user)
    def follower(self):
        return self.followers
    def follower_count(self):
        return self.follower().count()
    def followed(self):
        return self.following.filter(followers.c.follower == self.id)
    def followed_count(self):
        return self.followed().count()
    def to_claims(self):
        return {
            "name": self.name,
            "name_display": self.name_display,
            "icon": self.icon,
        }
    def to_object(self):
        return {
            "id": self.id,
            "name": self.name,
            "name_display": self.name_display,
            "icon": self.icon,
            "header": self.header,
            "joined": self.timestamp,
            "admin": self.admin,
            "follower": self.follower_count(),
            "following": self.followed_count() ,
            "profile": self.profile,
            "location": self.location,
            "website": self.website
        }
    def to_object_user(self, user):
        data = {
            "follow": user.is_following(self)
        }
        return dict(self.to_object(), **data)


class Tweet(db.Model): # type: ignore
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    tweet_id = db.Column(db.Integer, db.ForeignKey("tweet.id"))
    text = db.Column(db.String())
    content = db.Column(db.String())
    content_type = db.Column(db.String())
    timestamp = db.Column(db.DateTime, index=True, server_default=func.now())
    def likes(self):
        return TweetLikes.query.filter(TweetLikes.tweet_id==self.id, TweetLikes.isLike==True)
    def retweets(self):
        return Tweet.query.filter(Tweet.text=="", Tweet.content_type=="retweet", Tweet.content==str(self.id))
    def quoteTweets(self):
        return Tweet.query.filter(Tweet.text!="", Tweet.content_type=="retweet", Tweet.content==str(self.id))
    def replays(self):
        return Tweet.query.filter(Tweet.tweet_id==self.id)
    def replay_top(self):
        def gT(tweet:Tweet, tT: list = []):
            if not tweet.tweet_id:
                return tT
            t = Tweet.query.get(tweet.tweet_id)
            return gT(t, tT+[t])
        return gT(self)
    def to_object(self):
        user = User.query.get(self.user_id)
        retweet = None
        if self.content_type == "retweet":
            retweet = Tweet.query.get(int(self.content)).to_object() or None
        return {
            "id": self.id,
            "user": user.to_object(),
            "user_id": self.user_id,
            "user_name": user.name,
            "user_icon": user.icon,
            "text": self.text,
            "content": self.content,
            "content_type": self.content_type,
            "timestamp": self.timestamp,
            "likes": self.likes().count(),
            "retweets": self.retweets().count(),
            "quoteTweets": self.quoteTweets().count(),
            "replays": self.replays().count(),
            "replay": to_objects(self.replays().all()),
            "retweet": retweet,
        }
    def to_object_user(self, user):
        like = TweetLikes.query.filter(TweetLikes.user_id==user.id, TweetLikes.tweet_id==self.id).first()
        retweet = Tweet.query.filter(Tweet.user_id==user.id,Tweet.content_type == "retweet",Tweet.content == str(self.id)).first()
        replays = Tweet.query.filter(Tweet.user_id==user.id,Tweet.tweet_id == self.id).count()
        user = User.query.get(self.user_id)

        retweets = None
        if self.content_type == "retweet":
            retweets = Tweet.query.get(int(self.content)).to_object_user(user) or None
        data = {
            "liked": like.isLike if like else False,
            "retweeted": True if retweet else False,
            "replayed": True if replays else False,
            "user": user.to_object_user(user),
            "replay": to_objects(self.replays().all(), user),
            "retweet": retweets,
        }
        return dict(self.to_object(), **data)

class TweetLikes(db.Model): # type: ignore
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    tweet_id = db.Column(db.Integer, db.ForeignKey("tweet.id"))
    isLike = db.Column(db.Boolean, default=True)
    def to_object(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "tweet_id": self.tweet_id,
            "like": self.isLike
        }

class TweetTag(db.Model): # type: ignore
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    tweet_id = db.Column(db.Integer, db.ForeignKey("tweet.id"))
    data = db.Column(db.String)


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
        data["to"]["joined"] = str(data["to"]["joined"])
        data["send"]["joined"] = str(data["send"]["joined"])
        return data

@app.route("/replays", methods=["POST"])
@cross_origin()
@jwt_required()
def route_replay_post():
    id = int(request_data(request, "id") or -1)
    if not id:
        return jsonify({"tweet": None}), 400
    text = request_data(request, "text")
    content_type = request_data(request, "content_type")
    content = request_data(request, "content")

    tweet = Tweet(
        user_id = request_user(),
        tweet_id = id,
        text = text,
        content = content,
        content_type = content_type,
    )
    db.session.add(tweet)
    db.session.commit()
    return jsonify({"tweet": tweet.to_object_user(User.query.get(request_user()))})

@app.route("/replays/<id>", methods=["GET"])
@cross_origin()
@jwt_required()
def route_replays_get(id):
    id = int(id)
    tweet = get_tweets(
        tweet_id = id,
        replay = True
    ).all()
    return jsonify({"tweet": to_objects(tweet, User.query.get(request_user()))})

@app.route("/tweets", methods=["POST"])
@cross_origin()
@jwt_required()
def route_tweet_post():
    text = request_data(request, "text")
    content_type = request_data(request, "content_type")
    content = request_data(request, "content")
    if content_type == "retweet" and (t := Tweet.query.filter(
        Tweet.user_id==request_user(),
        Tweet.content_type == "retweet",
        Tweet.content == content
        ).first()):
            db.session.delete(t)
            db.session.commit()
            return  jsonify({"msg": "deleted"})

    tweet = Tweet(
        user_id = request_user(),
        text = text,
        content = content,
        content_type = content_type,
    )
    db.session.add(tweet)
    db.session.commit()
    tag_add(tweet.text, tweet)
    return jsonify({"tweet": tweet.to_object_user(User.query.get(request_user())),"msg": "created"})

@app.route("/tweets", methods=["GET"])
@cross_origin()
@jwt_required()
def route_tweet_get():
    tweets = page(get_tweets(
        user = User.query.get(request_user()),
        replay = request_arg_bool(request, "reply"),
        user_id = request_arg_int(request, "user"),
        user_name = request_arg(request, "username"),
        tweet_id = request_arg_int(request, "tweet"),
        media = request_arg_bool(request, "media"),
        like = request_arg_bool(request, "like"),
        tag = request_arg(request, "tag"),
        search = request_arg(request, "q"),
    ), request_arg_int(request, "p"), request_arg_int(request, "limit"))
    return jsonify({"data": to_objects(tweets, User.query.get(request_user()))})

@app.route("/tweets/<id>", methods=["GET"])
@cross_origin()
@jwt_required()
def route_tweet_id_get(id):
    tweet = Tweet.query.get(int(id))
    if not tweet:
        return jsonify({"data": None})
    return jsonify({"data": tweet.to_object_user(User.query.get(request_user()))})

@app.route("/tweets/<id>/if-replay-top", methods=["GET"])
@cross_origin()
@jwt_required()
def route_tweet_id_if_replay_top_get(id):
    tweet = Tweet.query.get(int(id))
    u = User.query.get(request_user())
    if not tweet or not u:
        return jsonify({"data": None})
    t = to_objects(tweet.replay_top(), u)
    return jsonify({"data": t})

@app.route("/tweets/<id>/like", methods=["POST"])
@cross_origin()
@jwt_required()
def route_tweet_id_like_post(id):
    tweet = Tweet.query.get(int(id))
    user = User.query.get(request_user())
    if not tweet or not user:
        return jsonify({"data": None})
    if likes:=TweetLikes.query.filter(TweetLikes.user_id==request_user(), TweetLikes.tweet_id==tweet.id).first():
        likes.isLike = not likes.isLike
        db.session.commit()
        return jsonify({"data": likes.to_object()})
    likes = TweetLikes(
        user_id = user.id,
        tweet_id = tweet.id,
        isLike = True
    )
    db.session.add(likes)
    db.session.commit()
    return jsonify({"data": likes.to_object()})

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
    """debug
    image = Image.query.filter(Image.path == path).first()
    if not image:
        return jsonify("image not found"), 404
    """
    return send_from_directory(uploads_file_path, path)

@app.route("/messages/user", methods=["GET"])
@cross_origin()
@jwt_required()
def route_messages_user_get():
    user = get_user_dm(User.query.get(request_user())).all()
    return jsonify({"data": to_objects(user, User.query.get(request_user()))})

@app.route("/messages/<user>", methods=["GET"])
@cross_origin()
@jwt_required()
def route_messages_get(user):
    user = int(user)
    me = request_user()
    messages = Message.query.filter(and_(Message.to == me,Message.send == user) | and_(Message.to == user,Message.send == me)).all()
    return jsonify({"data": to_objects(messages)})

@app.route("/user/<user>", methods=["GET"])
@cross_origin()
@jwt_required()
def route_user_get(user):
    user = User.query.filter(User.name == user).first()
    return jsonify({"data": user.to_object_user(User.query.get(request_user()))})

@app.route("/explore/trend", methods=["GET"])
@cross_origin()
@jwt_required()
def route_explore_trend_get():
    return jsonify({"data": get_trend()})

@app.route("/users/all" , methods=["GET"])
@cross_origin()
@jwt_required()
def route_user_all_get():
    return jsonify({"data": to_objects(User.query.all())})

@app.route("/users/update", methods=["POST"])
@cross_origin()
@jwt_required()
def route_user_update_post():
    user: User = User.query.get(request_user())
    if not user:
        return jsonify({"error": None}), 400
    data = {
        "name": request_data(request, "name") or user.name_display,
        "bio": request_data(request, "bio") or user.profile,
        "location": request_data(request, "location") or user.location,
        "website": request_data(request, "website") or user.website,
        "icon": request_data(request, "icon") or user.icon,
        "header": request_data(request, "header") or user.header
    }
    user.name_display = data["name"]
    user.profile = data["bio"]
    user.location = data["location"]
    user.website = data["website"]
    user.icon = data["icon"]
    user.header = data["header"]
    db.session.commit()
    return jsonify({"data": user.to_object_user(user)})

@app.route("/users/follow/<user_id>", methods=["POST"])
@cross_origin()
@jwt_required()
def route_user_follow(user_id):
    user = User.query.get(int(user_id))
    me = User.query.get(request_user())
    if not user or not me:
        return jsonify({"error": None})
    isf = me.is_following(user)
    if not isf:
        me.follow(user)
        db.session.commit()
        return jsonify({"user": user.to_object_user(me)})
    me.unfollow(user)
    db.session.commit()
    return jsonify({"user": user.to_object_user(me)})

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
def get_trend():
    tweet = TweetTag.query.limit(1000).all()
    tags = {}
    for t in tweet:
        if t.data in tags:
            tags[t.data] += 1
        else:
            tags[t.data] = 1
    tagss = sorted(tags.items(), key=lambda n: n[0], reverse=False)
    """object->sort->list->object
    tags = {}
    for t in tagss:
        tags[t[0]] = t[1]
    """
    return tagss

def get_user_dm(user: User):
    return get_user_dm_from(user).union(get_user_dm_to(user))
def get_user_dm_from(user: User):
    return User.query.join(Message, (User.id == Message.send)).filter(Message.to == user.id)
def get_user_dm_to(user: User):
    return User.query.join(Message, (User.id == Message.to)).filter(Message.send == user.id)

def tag_add(text: str, tweet: Tweet):
    tag = tag_parse(text)
    if len(tag) < 1:
        return
    for t in tag:
        tt = TweetTag(
            user_id = tweet.user_id,
            tweet_id = tweet.id,
            data = t
        )
        db.session.add(tt)
    db.session.commit()
    return

def get_tweets_helper(
    user_id = None,
    user_name = None,
    replay = False,
    tweet_id = None,
    media = None,
):
    if user_name:
        u = User.query.filter(User.name == user_name).first()
        if u:
            user_id = u.id
    tweets = Tweet.query.order_by(desc(Tweet.timestamp)) \
        .filter(Tweet.user_id == user_id if user_id else True) \
        .filter(Tweet.tweet_id == None if not replay else True) \
        .filter(Tweet.tweet_id == tweet_id if tweet_id else True) \
        .filter(Tweet.content_type == "image" if media else True)
    return tweets

def get_tweets_helper_like(
    user,
    like,
    query,
):
    if not query or not like or not user:
        return query
    return query.join(TweetLikes, (TweetLikes.tweet_id == Tweet.id)).filter(and_(TweetLikes.isLike == True, TweetLikes.user_id == user.id) if like and user else True)

def get_tweets_helper_tag(
    tag = None,
    query = Tweet.query,
):
    if not query or not tag:
        return query
    q = query.join(TweetTag, (TweetTag.tweet_id == Tweet.id)).filter(TweetTag.data == tag)
    return q

def get_tweets_helper_search(
    query,
    word
):
    if not query or not word:
        return query
    word_wakati = wakati(word)
    for w in word_wakati:
        query = query.filter(Tweet.text.contains(w))
    return query

def page(
    query,
    page,
    per_page,
):
    if not query or not page:
        return query.all()
    return query.paginate(page=page, per_page=per_page or 15, error_out=False).items

def get_tweets( # Alternative syntax for unions requires Python 3.10 or newer
    user = None,
    user_id = None,
    user_name = None,
    replay = False,
    tweet_id = None,
    media = None,
    like = None,
    tag = None,
    search = None,
):
    return get_tweets_helper_tag(
        query = get_tweets_helper_like(
            query = get_tweets_helper_search(
                query = get_tweets_helper(
                    user_id = user_id,
                    user_name = user_name,
                    replay = replay,
                    tweet_id = tweet_id,
                    media = media
                ),
                word = search
            ),
            user=user,
            like=like,
        ),
        tag = tag
    )

def to_objects(data: list, user = None):
    if not len(data):
        return []
    result = []
    for d in data:
        try:
            result.append(d.to_object_user(user)) if user else result.append(d.to_object())
        except:
            pass
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

def request_arg_bool(request: Request, name: str):
    try:
        r = request.args.get(name)
        if r:
            return True
    except:
        return False
    return False

def request_data(request: Request, name: str):
    try:
        data = json.loads(json.loads(request.get_data().decode('utf-8'))["body"])[name]
        if data:
            return data
    except :
        return None
    return None
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
    claims = user.to_claims()
    access_token = create_access_token(identity=username, additional_claims=claims)
    refresh_token = create_refresh_token(identity=username, additional_claims=claims)
    return jsonify(access_token=access_token, refresh_token=refresh_token)

@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
@cross_origin()
def refresh():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    claims = user.to_claims()
    access_token = create_access_token(identity=identity, additional_claims=claims)
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

    app.run(debug=True, host='0.0.0.0', port=6500)