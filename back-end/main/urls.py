from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .views import *

urlpatterns = [
    path('get_top/', getTop),
    path('get_last_articles/', getLastArticles),
    path('get_article/', getArticle),
    path('get_last_posts/', getLastPosts),
    path('get_post/', getArticle),
    path('auth/', csrf_exempt(autharization)),
    path('reg/', csrf_exempt(registration)),
    path('get_profile_picture/', getProfileAvatar),
    path('get_profile/', getProfileInfo),
    path('exit/', csrf_exempt(exit)),
    path('rate_up/', csrf_exempt(rateUp)),
    path('rate_down/', csrf_exempt(rateDown))
]
