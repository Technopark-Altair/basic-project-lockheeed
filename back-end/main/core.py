import random, json, os.path
from django.conf import settings

TOKENS_FILE = 'C:\\Users\\mrart\\Desktop\\cybersafe\\back-end\\session_tokens.json'

def createSessionToken():
    return "".join([str(hex(random.randint(0, 16))[2:]) for i in range(64)])

def readSessionTokens():
    if os.path.isfile(TOKENS_FILE):
        return json.load(open(TOKENS_FILE, "r"))
    else:
        json.dump({}, open(TOKENS_FILE, "w"))
        return {}

def addSessionToken(session_token, login):
    session_tokens = readSessionTokens()
    session_tokens[session_token] = login
    json.dump(session_tokens, open(TOKENS_FILE, "w"))

def getLoginByToken(token):
    return readSessionTokens()[token]

def removeToken(token):
    session_tokens = readSessionTokens()

    try:
        del session_tokens[token]
    except KeyError:
        return False
    else:
        return True

    json.dump(session_tokens, open(TOKENS_FILE, "w"))

def removeTokenByLogin(login):
    session_tokens = readSessionTokens()
    for t, l in session_tokens.copy().items():
        if l == login:
            del session_tokens[t]

    json.dump(session_tokens, open(TOKENS_FILE, "w"))

def parseImage(image_body):
    format = image_body.split(b'data:image/')[1].split(b';')[0].decode('utf-8')
    print(format)
    body = image_body.split(b';base64,')[1]
    return format, body
