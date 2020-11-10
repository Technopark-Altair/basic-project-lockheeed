from django.urls import path

from .views import *

urlpatterns = [
    path('get_last_posts/', getLastPosts),
    path('get_article/', getArticle),
]
