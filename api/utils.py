from app import *
if __name__ == '__main__':
    db.drop_all()
    db.create_all()
    apple = User(
        name="apple",
        name_display="apple is OP",
        icon="icon.jpg",
        header="header.jpg",
        profile="Hello, world!",
        location="japan",
        website="https://example.org"
        )
    apple.set_password(password="apple")
    mango = User(name="mango")
    mango.set_password(password="mango")
    db.session.add(apple)
    db.session.add(mango)
    db.session.commit()

    mango.follow(apple)
    db.session.commit()