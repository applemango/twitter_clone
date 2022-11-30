from app import db
from app import User
if __name__ == '__main__':
    db.drop_all()
    db.create_all()
    apple = User(name="apple")
    apple.set_password(password="apple")
    mango = User(name="mango")
    mango.set_password(password="mango")
    db.session.add(apple)
    db.session.add(mango)
    db.session.commit()