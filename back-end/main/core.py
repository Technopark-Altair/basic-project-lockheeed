import random

def createSessionToken():
    return "".join([str(hex(random.randint(0, 16))[2:]) for i in range(64)])
