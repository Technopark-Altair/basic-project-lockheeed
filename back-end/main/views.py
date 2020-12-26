from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings

from .core import *

from .models import Article
from .models import Post
from .models import User

import base64, operator

# Create your views here.

def index(request):
    response = {"status":"OK"}
    return JsonResponse(response)

def getTop(request):
    articles = Article.objects.order_by('-raiting', '-created_at')[:5]
    posts = Post.objects.order_by('-raiting', '-created_at')[:5]

    top = sorted(list(articles) + list(posts), key=operator.attrgetter('raiting'))
    top.reverse()
    body = []

    for element in top:
        body.append({"title":element.title,
                     "slug":element.slug,
                     "author":element.author,
                     "updated_at":timezone.localtime(element.updated_at).strftime("%d-%m-%Y %H:%M"),
                     "raiting":element.raiting,
                     "type":element.type})

    response = {"articles_previews":body}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getLastArticles(request):
    articles = Article.objects.all()
    body = []

    for article in articles:
        body.append({"title":article.title,
                     "slug":article.slug,
                     "author":article.author,
                     "updated_at":timezone.localtime(article.updated_at).strftime("%d-%m-%Y %H:%M"),
                     "raiting":article.raiting,
                     "type":article.type})

    response = {"articles_previews":body}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getLastPosts(request):
    posts = Post.objects.all()
    body = []

    for post in posts:
        body.append({"title":post.title,
                     "slug":post.slug,
                     "author":post.author,
                     "updated_at":timezone.localtime(post.updated_at).strftime("%d-%m-%Y %H:%M"),
                     "raiting":post.raiting,
                     "type":post.type})

    response = {"posts_previews":body}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getArticle(request):
    body = {}

    try:
        slug = request.GET['slug']
        article = Article.objects.get(slug=slug)
    except Article.DoesNotExist:
        response = JsonResponse(response)
    else:
        body["title"] = article.title
        body["author"] = article.author
        body["updated_at"] = timezone.localtime(article.updated_at).strftime("%d-%m-%Y %H:%M")
        body["content"] = article.content
        body["raiting"] = article.raiting
        body["type"] = "article"

    response = {"article":body}
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
            addSessionToken(token, login)
            print(readSessionTokens())
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
            addSessionToken(token, login)
            response = {"status":"OK", "session_token":token}

        else:
            response = {"status":"FAILED", "error":"Эта почта уже зарегистрирована!"}

    else:
        response = {"status":"FAILED", "error":"Этот логин уже занят!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getProfileAvatar(request):
    print(readSessionTokens())
    try:
        login = getLoginByToken(request.GET['token'])
        print(readSessionTokens())
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

def getProfileInfo(request):
    try:
        login = getLoginByToken(request.GET['token'])
        profile = User.objects.get(username=login)

        try:
            image = open(settings.MEDIA_ROOT + f"\\avatars\\{login}.png", "rb").read()
        except FileNotFoundError:
            image = ''
        else:
            image = (b'data:image/png;base64,' + base64.b64encode(image)).decode("utf-8")

        response = {"status":"OK", "data":{
            "username":profile.username,
            "name":profile.name,
            "email":profile.email,
            "registered_at":profile.registered_at,
            "experience":profile.experience,
            "banned":profile.banned,
            "avatar":image
        }}

    except KeyError:
        response = {"status":"FAILED", "error":"Неверный токен!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def exit(request):
    try:
        token = request.GET['token']
        if removeToken( token ):
            response = {"status":"OK"}
        else:
            response = {"status":"FAILED"}

    except KeyError:
        response = {"status":"FAILED"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response
