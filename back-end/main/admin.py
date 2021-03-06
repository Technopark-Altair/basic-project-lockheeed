from django.contrib import admin

from .models import User
from .models import Article
from .models import Post
# Register your models here.

class ArticlesAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'author', 'updated_at', 'created_at', 'hidden')

class PostsAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'type', 'author', 'answers', 'updated_at', 'created_at', 'hidden')

class UsersAdmin(admin.ModelAdmin):
    list_display = ('username', 'name', 'email', 'id', 'registered_at', 'banned')

admin.site.register(Article, ArticlesAdmin)
admin.site.register(Post, PostsAdmin)
admin.site.register(User, UsersAdmin)
