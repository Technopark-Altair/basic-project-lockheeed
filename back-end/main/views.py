from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from .core import *

from .models import Article
from .models import User

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

def auth(request):
    login = request.GET['login']
    password = request.GET['password']

    try:
        user = User.objects.get(username=login)
    except User.DoesNotExist:
        response = {"status":"FAILED", "error":"Invalid login or password!"}
    else:
        if user.hash_pasword == password:
            token = createSessionToken()
            response = {"status":"OK", "session_token":token}
        else:
            response = {"status":"FAILED", "error":"Invalid login or password!"}

    response = JsonResponse(response)
    response["Access-Control-Allow-Origin"] = "*"
    return response

    # print(articles)
