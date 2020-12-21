from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings

from .core import *

from .models import Article
from .models import User

import base64

# Create your views here.

def index(request):
    response = {"status":"OK"}
    return JsonResponse(response)

def getLastPosts(request):
    articles = Article.objects.all()
    response = {"articles_previews":[]}

    for article in articles:
        response["articles_previews"].append({"title":article.title,
                                  "slug":article.slug,
                                  "author":article.author,
                                  "updated_at":timezone.localtime(article.updated_at).strftime("%d-%m-%Y %H:%M")})

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getArticle(request):
    response = {"article":{}}

    try:
        slug = request.GET['slug']
        article = Article.objects.get(slug=slug)
    except Article.DoesNotExist:
        response = JsonResponse(response)
    else:
        response["article"]["title"] = article.title
        response["article"]["author"] = article.author
        response["article"]["updated_at"] = timezone.localtime(article.updated_at).strftime("%d-%m-%Y %H:%M")
        response["article"]["content"] = article.content

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def autharization(request):
    login = request.GET['login']
    password = request.GET['password']

    try:
        user = User.objects.get(username=login)
    except User.DoesNotExist:
        response = {"status":"FAILED", "error":"Неверный логин или пароль!"}
    else:
        if user.hash_pasword == password:
            token = createSessionToken()
            updateSessionToken(token, login)
            response = {"status":"OK", "session_token":token}
        else:
            response = {"status":"FAILED", "error":"Неверный логин или пароль!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

    # print(articles)

def registration(request):
    name = request.GET['name']
    login = request.GET['login']
    email = request.GET['email']
    hash_pasword = request.GET['password']
    avatar = login + ".png"

    try:
        User.objects.get(username=login)
    except User.DoesNotExist:
        try:
             User.objects.get(email=email)
        except User.DoesNotExist:
            request_body = request.body
            if request_body:
                image = request.body.split(b'data:image/png;base64,')[1]
                open(settings.MEDIA_ROOT + f"\\avatars\\{login}.png", "wb").write(base64.b64decode(image))
            else:
                avatar = None

            User.objects.create(
                name = name,
                username = login,
                email = email,
                hash_pasword = hash_pasword,
                avatar = avatar
            )

            token = createSessionToken()
            updateSessionToken(token, login)
            response = {"status":"OK", "session_token":token}

        else:
            response = {"status":"FAILED", "error":"Эта почта уже зарегистрирована!"}

    else:
        response = {"status":"FAILED", "error":"Этот логин уже занят!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getProfileAvatar(request):
    try:
        login = getLoginByToken(request.GET['token'])

        try:
            image = open(settings.MEDIA_ROOT + f"\\avatars\\{login}.png", "rb").read()
        except FileNotFoundError:
            response = {"status":"OK", "image":''}
        else:
            image = b'data:image/png;base64,' + base64.b64encode(image)
            response = {"status":"OK", "image":image.decode("utf-8")}

    except KeyError:
        response = {"status":"FAILED", "error":"Неверный токен!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response
