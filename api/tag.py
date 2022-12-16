import re

def tag_parse(text: str):
    for i in (p:=re.split(" |　|\\n", text or ""), r:=[])[0]: r+=i.split("#") if len(i) and i[0] == "#" else []
    if ("" in r and (r:=list(filter(lambda a: a != "", r)))) or True: return [*set(r)]

if __name__ == '__main__':
    # result -> ['test', 'lol']
    print(tag_parse("test#test #test#lol lol\n#test#lol #lol #aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))