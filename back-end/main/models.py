from django.db import models
import uuid

from .core import *

class User(models.Model):
    name = models.CharField(max_length=24, null=False, verbose_name="Имя")
    username = models.CharField(max_length=24, null=False, unique=True, verbose_name="Логин", primary_key=True)
    email = models.EmailField(max_length=256, unique=True, null=False, default="", verbose_name="Почта")
    avatar = models.ImageField(upload_to="avatars/")
    experience = models.IntegerField(default=0)
    id = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name="UUID")
    hash_pasword = models.CharField(max_length=32, null=False, verbose_name="Hash пароль")
    registered_at = models.DateTimeField(auto_now_add=True, verbose_name="Зарегистрирован")
    banned = models.BooleanField(default=False)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ["registered_at"]

class Article(models.Model):
    title = models.CharField(max_length=62, unique=True, null=False, verbose_name="Заголовок")
    slug = models.SlugField(max_length=124, unique=True, null=False, default="")
    type = models.CharField(default="article", max_length=7)
    raiting = models.IntegerField(default=0)
    author = models.CharField(max_length=24, null=False, verbose_name="Автор")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    views = models.PositiveIntegerField(default=0)
    hidden = models.BooleanField(default=False)
    content = models.TextField(blank=True, verbose_name="Контент")
    rated = models.JSONField(default=dict, blank=True, verbose_name="Поставленные оценки")
    comments = models.JSONField(default=dict, blank=False, verbose_name="Комментарии")


    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"
        ordering = ["-created_at"]

class Post(models.Model):
    title = models.CharField(max_length=126, null=False, verbose_name="Заголовок")
    slug = models.SlugField(max_length=126, unique=True, null=False, default="")
    type = models.CharField(max_length=20, null=False, verbose_name="Тип") # question, discussion
    raiting = models.IntegerField(default=0)
    author = models.CharField(max_length=24, null=False, verbose_name="Автор")
    updated_at = models.DateTimeField(auto_now_add=True, verbose_name="Обновлено")
    created_at = models.DateTimeField(auto_now=True, verbose_name="Создано")
    views = models.PositiveIntegerField(default=0)
    hidden = models.BooleanField(default=False)
    answers = models.JSONField(default=dict, blank=True, verbose_name="Ответы")
    comments = models.JSONField(default=dict, blank=False, verbose_name="Комментарии")


    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Пост"
        verbose_name_plural = "Посты"
        ordering = ["-created_at"]
