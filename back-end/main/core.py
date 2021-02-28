import random, json, os.path
from transliterate import translit

from django.conf import settings

TOKENS_FILE = os.path.join(settings.BASE_DIR, "session_tokens.json")


def createSessionToken():
    return "".join([str(hex(random.randint(0, 16))[2:]) for i in range(64)])


def readSessionTokens():
    if os.path.isfile(TOKENS_FILE):
        return json.load(open(TOKENS_FILE, "r"))
    else:
        json.dump({}, open(TOKENS_FILE, "w"))
        return {}


def addSessionToken(session_token, uid):
    session_tokens = readSessionTokens()
    session_tokens[session_token] = uid
    json.dump(session_tokens, open(TOKENS_FILE, "w"))


def getIDByToken(uid):
    return readSessionTokens()[uid]


def removeToken(token):
    session_tokens = readSessionTokens()

    try:
        del session_tokens[token]
        json.dump(session_tokens, open(TOKENS_FILE, "w"))
    except KeyError:
        return False
    else:
        return True


def removeTokenByID(uid):
    session_tokens = readSessionTokens()
    for t, l in session_tokens.copy().items():
        if l == uid:
            del session_tokens[t]

    json.dump(session_tokens, open(TOKENS_FILE, "w"))


def getTokensCountByID(uid):
    count = 0
    session_tokens = readSessionTokens()
    for t, l in session_tokens.copy().items():
        if l == uid:
            count += 1
    return count


def parseImage(image_body):
    format = image_body.split(b'data:image/')[1].split(b';')[0].decode('utf-8')
    body = image_body.split(b';base64,')[1]
    return format, body


def createSlug(title):
    char_map = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_"
    return "".join([symbol for symbol in translit(title.replace(" ", "_"), "ru", reversed=True) if symbol in char_map])
