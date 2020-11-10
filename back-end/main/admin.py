from django.contrib import admin

from .models import User
from .models import Article
# Register your models here.

class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'author', 'content', 'updated_at', 'created_at', 'hidden')

class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'username', 'email', 'id', 'registered_at', 'banned')

admin.site.register(Article, ArticleAdmin)
admin.site.register(User, UserAdmin)
