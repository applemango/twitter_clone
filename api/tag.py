import re

def tag_parse(text: str):
    for i in (p:=re.split(" |　|\\n", text), r:=[])[0]: r+=i.split("#") if i[0] == "#" else []
    if ("" in r and (r:=list(filter(lambda a: a != "" and len(a)<30, r)))) or True: return [*set(r)]

if __name__ == '__main__':
    # result -> ['test', 'lol']
    print(tag_parse("test#test #test#lol lol\n#test#lol #lol #aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))