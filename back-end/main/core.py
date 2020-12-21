import random, json, os.path
from django.conf import settings

TOKENS_FILE = settings.MEDIA_ROOT + "\\session_tokens.json"

def createSessionToken():
    return "".join([str(hex(random.randint(0, 16))[2:]) for i in range(64)])

def updateSessionToken(session_token, login):
    if os.path.isfile(TOKENS_FILE):
        try:
            session_tokens = json.load(open(TOKENS_FILE, "r"))
        except:
            session_tokens = {}
    else:
        session_tokens = {}

    session_tokens[session_token] = login

    json.dump(session_tokens, open(TOKENS_FILE, "w"))

def readSessionTokens():
    if os.path.isfile(TOKENS_FILE):
        return json.load(open(TOKENS_FILE, "r"))
    else:
        return {}

def getLoginByToken(token):
    return readSessionTokens()[token]
