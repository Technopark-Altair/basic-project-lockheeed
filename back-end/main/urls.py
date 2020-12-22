from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .views import *

urlpatterns = [
    path('get_last_posts/', getLastPosts),
    path('get_article/', getArticle),
    path('auth/', csrf_exempt(autharization)),
    path('reg/', csrf_exempt(registration)),
    path('get_profile_picture/', getProfileAvatar),
    path('get_profile/', getProfileInfo)
]
