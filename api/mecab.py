import MeCab

def wakati(text: str) -> list[str]:
    mecab = MeCab.Tagger("-Owakati")
    return mecab.parse(text).split()