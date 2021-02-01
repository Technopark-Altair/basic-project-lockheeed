from django.db.models import Q
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.conf import settings

from .core import *

from .models import Article
from .models import Post
from .models import User

import base64, operator, os, uuid, time

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

        try:
            id = getIDByToken(request.GET['token'])
            rated = article.rated[id]

        except KeyError:
            rated = None

        try:
            id = getIDByToken(request.GET['token'])
            if article.hidden and User.objects.get(id=uuid.UUID(id)).access <= 0:
                print(User.objects.get(id=uuid.UUID(id)).access)
                raise Article.DoesNotExist

        except KeyError:
            if article.hidden:
                raise Article.DoesNotExist

        article.views += 1
        article.save()

        comments = []
        avatars = {}

        for comment in article.comments['comments']:
            user = User.objects.get(id=uuid.UUID(comment['author_id']))
            username = user.username
            imageName = user.avatar.name
            imageFormat = imageName.split('.')[1]

            if username not in avatars:
                try:
                    avatar = open(settings.MEDIA_ROOT + f"\\avatars\\{imageName}", "rb").read()

                except FileNotFoundError:
                    avatar = ""

                else:
                    avatar = b"data:image/" + imageFormat.encode('utf-8') + b";base64," + base64.b64encode(avatar)
                    avatars[username] = avatar.decode("utf-8")

            comments.append({
                "author":user.username,
                "content":comment['content']
            })

    except Article.DoesNotExist:
        response = {"status":"FAILED", "msg":"Статья не найдена!"}

    else:
        body = {"title":article.title,
                "slug":article.slug,
                "author":article.author,
                "updated_at":timezone.localtime(article.updated_at).strftime("%d-%m-%Y %H:%M"),
                "content":article.content,
                "raiting":article.raiting,
                "rated":rated,
                "views":article.views,
                "hidden":article.hidden,
                "comments":{"data":comments,"avatars":avatars},
                "commentsCount":len(article.comments['comments']),
                "type":article.type}

        response = {"status":"OK", "article":body}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def autharization(request):
    try:
        login = request.GET['login']
        password = request.GET['password']
        start = time.time()
        user = User.objects.get(username=login)
        print(time.time() - start)
        id = str(user.id)
    except KeyError:
        response = {"status":"FAILED", "msg":"Плохой запрос!"}

    except User.DoesNotExist:
        response = {"status":"FAILED", "msg":"Неверный логин или пароль!"}

    else:
        if user.hash_pasword == password:
            if getTokensCountByID(id) >= 2:
                removeTokenByID(id)

            token = createSessionToken()
            addSessionToken(token, id)
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
            profile = User.objects.create(
                name = name,
                username = login,
                email = email,
                hash_pasword = hash_pasword,
            )
            id = str(profile.id)

            request_body = request.body
            if request_body:
                id = str(profile.id)
                imgFormat, image = parseImage(request.body)
                open(settings.MEDIA_ROOT + f"\\avatars\\{id}.{imgFormat}", "wb").write(base64.b64decode(image))
                avatar = id + '.' + imgFormat

            else:
                avatar = None

            profile.avatar = avatar
            profile.save()

            token = createSessionToken()
            addSessionToken(token, id)
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
        id = getIDByToken(request.GET['token'])
        imageName = User.objects.get(id=uuid.UUID(id)).avatar.name
        imageFormat = imageName.split('.')[1]

        try:
            image = open(settings.MEDIA_ROOT + f"\\avatars\\{imageName}", "rb").read()

        except FileNotFoundError:
            response = {"status":"OK", "image":''}

        else:
            image = b"data:image/" + imageFormat.encode('utf-8') + b";base64," + base64.b64encode(image)
            response = {"status":"OK", "image":image.decode("utf-8")}

    except KeyError:
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def getProfileInfo(request):
    try:
        id = getIDByToken(request.GET['token'])
        profile = User.objects.get(id=uuid.UUID(id))
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
            "access":profile.access,
            "banned":profile.banned,
            "avatar":image
        }}

    except KeyError:
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

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
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def rate(request):
    try:
        profile_id = getIDByToken(request.GET['token'])

        if request.GET['mark'] in ['up', 'down']:

            if request.GET['type'] == 'article':
                try:
                    article = Article.objects.get(slug=request.GET['slug'])

                    if profile_id not in article.rated:
                        if request.GET['mark'] == 'up':
                            article.raiting += 1
                        else:
                            article.raiting -= 1

                        article.rated[profile_id] = request.GET['mark']
                        article.save()

                        profile = User.objects.get(id=uuid.UUID(profile_id))
                        profile.experience += 1
                        profile.save()

                        response = {"status":"OK"}

                    elif article.rated[profile_id] != request.GET['mark']:
                        if request.GET['mark'] == 'up':
                            article.raiting += 2
                        else:
                            article.raiting -= 2

                        article.rated[profile_id] = request.GET['mark']
                        article.save()

                        profile = User.objects.get(id=uuid.UUID(profile_id))
                        profile.experience += 1
                        profile.save()

                        response = {"status":"OK"}

                    elif article.rated[profile_id] == request.GET['mark']:
                        response = {"status":"FAILED", "msg":"Голос уже засчитан!"}


                except Article.DoesNotExist:
                    response = {"status":"FAILED", "msg":"Такой статьи не существует!"}

        else:
            response = {"status":"FAILED", "msg":"Неверный запрос!"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def sendComment(request):
    try:
        profile_id = getIDByToken(request.GET['token'])

        if request.GET['comment'] and request.GET['comment'] != 'undefined':
            if request.GET['type'] == 'article':
                try:
                    article = Article.objects.get(slug=request.GET['slug'])
                    article.comments['comments'] = [{
                        "author_id": profile_id,
                        "content": request.GET['comment']
                    }] + article.comments['comments']

                    article.save()

                    start = time.time()
                    profile = User.objects.get(id=uuid.UUID(profile_id))
                    profile.experience += 2
                    profile.save()
                    print("Completed in: ", time.time() - start)

                    response = {"status":"OK"}

                except Article.DoesNotExist:
                    response = {"status":"FAILED", "msg":"Такой статьи не существует!"}
        else:
            response = {"status":"FAILED", "msg":"Комментарий не может быть пустым!"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response


def updateAvatar(request):
    try:
        id = getIDByToken(request.GET['token'])
        profile = User.objects.get(id=uuid.UUID(id))
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
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

    except User.DoesNotExist:
        response = {"status":"FAILED", "msg":"Упс... Что-то пошло не так."}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def deleteAvatar(request):
    try:
        id = getIDByToken(request.GET['token'])
        profile = User.objects.get(id=uuid.UUID(id))
        imageName = profile.avatar.name

        try:
            os.remove(settings.MEDIA_ROOT + "\\avatars\\" + imageName)
        except FileNotFoundError:
            pass

        response = {"status":"OK"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

    except User.DoesNotExist:
        response = {"status":"FAILED", "msg":"Упс... Что-то пошло не так."}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response


def updatePassword(request):
    try:
        id = getIDByToken(request.GET['token'])
        profile = User.objects.get(id=uuid.UUID(id))

        if profile.hash_pasword == request.GET['current']:
            profile.hash_pasword = request.GET['new']
            profile.save()
            response = {"status":"OK"}

        else:
            response = {"status":"FAILED", "msg":"Неверный пароль!"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

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

def publicateArticle(request):
    try:
        id = getIDByToken(request.GET['token'])
        profile = User.objects.get(id=uuid.UUID(id))
        username = profile.username
        title = request.GET['title']
        content = request.body.decode("utf-8")

        if title and content:
            try:
                Article.objects.create(
                            slug=createSlug(title),
                            title=title,
                            author=username,
                            content=content,
                            comments={"comments":[]},
                            hidden=True
                            )

                profile.experience += 15
                profile.save()

                response = {"status":"OK"}

            except django.db.utils.IntegrityError:
                response = {"status":"FAILED", "msg":"Статья с таким заголовком уже существует!"}

        else:
            response = {"status":"FAILED", "msg":"Поля не могут быть пустыми!"}

    except KeyError:
        response = {"status":"FAILED", "msg":"Необходимо авторизироваться!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def isAVaildToken(request):
    try:
        print(request.GET['token'])
        id = getIDByToken(request.GET['token'])
    except KeyError:
        response = {"status":"FAILED"}
    else:
        response = {"status":"OK"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response
