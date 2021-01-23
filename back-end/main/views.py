from django.db.models import Q
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings

from .core import *

from .models import Article
from .models import Post
from .models import User

import base64, operator, os

# Create your views here.

def index(request):
    response = {"status":"OK"}
    return JsonResponse(response)

def getTop(request):
    articles = Article.objects.filter(hidden=False).order_by('-raiting', '-created_at')[:5]
    posts = Post.objects.filter(hidden=False).order_by('-raiting', '-created_at')[:5]

    body = {'articles':[], 'posts':[]}

    for element in articles:
        body['articles'].append({"title":element.title,
                     "slug":element.slug,
                     "author":element.author,
                     "updated_at":timezone.localtime(element.updated_at).strftime("%d-%m-%Y %H:%M"),
                     "raiting":element.raiting,
                     "views":element.views,
                     "type":element.type})

    for element in posts:
        body['posts'].append({"title":element.title,
                     "slug":element.slug,
                     "author":element.author,
                     "updated_at":timezone.localtime(element.updated_at).strftime("%d-%m-%Y %H:%M"),
                     "raiting":element.raiting,
                     "views":element.views,
                     "type":element.type})

    response = {"status":"OK", "top":body}
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
                     "views":article.views,
                     "type":article.type})

    response = {"status":"OK", "articles":body}
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
                     "views":post.views,
                     "type":post.type})

    response = {"status":"OK", "posts":body}
    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getArticle(request):
    try:
        slug = request.GET['slug']
        article = Article.objects.get(slug=slug)
        article.views += 1
        article.save()

    except Article.DoesNotExist:
        response = {"status":"FAILED", "msg":"Статья не найдена!"}

    else:
        body = {"title":article.title,
                "slug":article.slug,
                "author":article.author,
                "updated_at":timezone.localtime(article.updated_at).strftime("%d-%m-%Y %H:%M"),
                "content":article.content,
                "raiting":article.raiting,
                "views":article.views,
                "type":article.type}

        response = {"status":"OK", "article":body}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def autharization(request):
    try:
        login = request.GET['login']
        password = request.GET['password']

        user = User.objects.get(username=login)
    except KeyError:
        response = {"status":"FAILED", "msg":"Плохой запрос!"}

    except User.DoesNotExist:
        response = {"status":"FAILED", "msg":"Неверный логин или пароль!"}

    else:
        if user.hash_pasword == password:
            token = createSessionToken()
            addSessionToken(token, login)
            response = {"status":"OK", "session_token":token}
        else:
            response = {"status":"FAILED", "msg":"Неверный логин или пароль!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def registration(request):
    try:
        name = request.GET['name']
        login = request.GET['login']
        email = request.GET['email']
        hash_pasword = request.GET['password']
        avatar = login + ".png"

        User.objects.get(username=login)

    except KeyError:
        response = {"status":"FAILED", "msg":"Плохой запрос!"}

    except User.DoesNotExist:
        try:
             User.objects.get(email=email)
        except User.DoesNotExist:

            User.objects.create(
                name = name,
                username = login,
                email = email,
                hash_pasword = hash_pasword,
            )

            request_body = request.body
            if request_body:
                profile = User.objects.get(username=login)
                uid = str(profile.id)
                imgFormat, image = parseImage(request.body)
                open(settings.MEDIA_ROOT + f"\\avatars\\{uid}.{imgFormat}", "wb").write(base64.b64decode(image))
                avatar = uid + '.' + imgFormat
            else:
                avatar = None

            profile.avatar = avatar
            profile.save()

            token = createSessionToken()
            addSessionToken(token, login)
            response = {"status":"OK", "session_token":token}

        else:
            response = {"status":"FAILED", "msg":"Эта почта уже зарегистрирована!"}

    else:
        response = {"status":"FAILED", "msg":"Этот логин уже занят!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getProfileAvatar(request):
    try:
        login = getLoginByToken(request.GET['token'])
        imageName = User.objects.get(username=login).avatar.name
        imageFormat = imageName.split('.')[1]

        try:
            image = open(settings.MEDIA_ROOT + f"\\avatars\\{imageName}", "rb").read()

        except FileNotFoundError:
            response = {"status":"OK", "image":''}

        else:
            image = b"data:image/" + imageFormat.encode('utf-8') + b";base64," + base64.b64encode(image)
            response = {"status":"OK", "image":image.decode("utf-8")}

    except KeyError:
        response = {"status":"FAILED", "msg":"Неверный токен!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getProfileInfo(request):
    try:
        login = getLoginByToken(request.GET['token'])
        profile = User.objects.get(username=login)
        imageName = profile.avatar.name
        imageFormat = imageName.split('.')[1]

        try:
            image = open(settings.MEDIA_ROOT + f"\\avatars\\{imageName}", "rb").read()
        except FileNotFoundError:
            image = ''
        else:
            image = (b'data:image/' + imageFormat.encode('utf-8') + b';base64,' + base64.b64encode(image)).decode("utf-8")

        response = {"status":"OK", "data":{
            "username":profile.username,
            "name":profile.name,
            "email":profile.email,
            "registered_at":timezone.localtime(profile.registered_at).strftime("%d-%m-%Y %H:%M"),
            "exp":profile.experience,
            "banned":profile.banned,
            "avatar":image
        }}

    except KeyError:
        response = {"status":"FAILED", "msg":"Неверный токен!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def exit(request):
    try:
        token = request.GET['token']
        if removeToken( token ):
            response = {"status":"OK"}
        else:
            response = {"status":"FAILED", "msg":"Упс... Что-то пошло не так."}

    except KeyError:
        response = {"status":"FAILED", "msg":"Неверный токен!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def rateUp(request):
    try:
        login = getLoginByToken(request.GET['token'])
        if request.GET['type'] == 'article':
            try:
                article = Article.objects.get(slug=request.GET['slug'])
                article.raiting += 1
                article.save()
                response = {"status":"OK"}

            except Article.DoesNotExist:
                response = {"status":"FAILED", "msg":"Такой статьи не существует!"}

        elif request.GET['type'] == 'post':
            try:
                post = Post.objects.get(slug=request.GET['slug'])
                post.raiting += 1
                post.save()
                response = {"status":"OK"}

            except Article.DoesNotExist:
                response = {"status":"FAILED", "msg":"Такого поста не существует!"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Неверный токен!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def rateDown(request):
    try:
        login = getLoginByToken(request.GET['token'])
        if request.GET['type'] == 'article':
            try:
                article = Article.objects.get(slug=request.GET['slug'])
                article.raiting -= 1
                article.save()
                response = {"status":"OK"}

            except Article.DoesNotExist:
                response = {"status":"FAILED", "msg":"Такой статьи не существует!"}

        elif request.GET['type'] == 'post':
            try:
                post = Post.objects.get(slug=request.GET['slug'])
                post.raiting -= 1
                post.save()
                response = {"status":"OK"}

            except Article.DoesNotExist:
                response = {"status":"FAILED", "msg":"Такого поста не существует!"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Неверный токен!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def updateAvatar(request):
    try:
        login = getLoginByToken(request.GET['token'])
        profile = User.objects.get(username=login)
        imageName = profile.avatar.name

        try:
            os.remove(settings.MEDIA_ROOT + "\\avatars\\" + imageName)
        except FileNotFoundError:
            pass

        request_body = request.body
        if request_body:
            uid = str(profile.id)
            imgFormat, image = parseImage(request.body)
            open(settings.MEDIA_ROOT + f"\\avatars\\{uid}.{imgFormat}", "wb").write(base64.b64decode(image))
            avatar = uid + '.' + imgFormat
        else:
            avatar = None

        profile.avatar = avatar
        profile.save()

        response = {"status":"OK"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Неверный токен!"}

    except User.DoesNotExist:
        response = {"status":"FAILED", "msg":"Упс... Что-то пошло не так."}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def updatePassword(request):
    try:
        login = getLoginByToken(request.GET['token'])
        profile = User.objects.get(username=login)

        if profile.hash_pasword == request.GET['current']:
            profile.hash_pasword = request.GET['new']
            profile.save()
            response = {"status":"OK"}

        else:
            response = {"status":"FAILED", "msg":"Неверный пароль!"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Неверный токен!"}

    except User.DoesNotExist:
        response = {"status":"FAILED", "msg":"Упс... Что-то пошло не так."}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def search(request):
    topics = []
    topics += Article.objects.filter( Q(title__icontains=request.GET['query']) )
    topics += Post.objects.filter( Q(title__icontains=request.GET['query']) )

    body = []

    for element in topics:
        body.append({"title":element.title,
                     "slug":element.slug,
                     "author":element.author,
                     "updated_at":timezone.localtime(element.updated_at).strftime("%d-%m-%Y %H:%M"),
                     "raiting":element.raiting,
                     "views":element.views,
                     "type":element.type})

    response = {"status":"OK", "topics":body}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response
