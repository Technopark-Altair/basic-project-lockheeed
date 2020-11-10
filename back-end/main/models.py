from django.db import models
import uuid

class User(models.Model):
    name = models.CharField(max_length=24, null=False, verbose_name="Имя", primary_key=True)
    username = models.CharField(max_length=24, null=False, unique=True, verbose_name="Логин")
    email = models.EmailField(max_length=256, unique=True, null=False, default="", verbose_name="Почта")
    raiting = models.IntegerField(default=0)
    id = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name="UUID")
    hash_pasword = models.CharField(max_length=32, null=False, verbose_name="Hash пароль")
    registered_at = models.DateTimeField(auto_now=True, verbose_name="Зарегистрирован")
    banned = models.BooleanField(default=False)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ["registered_at"]

class Article(models.Model):
    title = models.CharField(max_length=126, null=False, verbose_name="Заголовок")
    slug = models.SlugField(max_length=126, unique=True, null=False, default="")
    raiting = models.IntegerField(default=0)
    rate_count = models.IntegerField(default=0)
    author = models.CharField(max_length=24, null=False, verbose_name="Автор")
    content = models.TextField(blank=True, verbose_name="Контент")
    updated_at = models.DateTimeField(auto_now_add=True, verbose_name="Обновлено")
    created_at = models.DateTimeField(auto_now=True, verbose_name="Создано")
    hidden = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"
        ordering = ["-created_at"]
