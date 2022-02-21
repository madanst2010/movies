from operator import mod
from django.db import models
# Create your models here.
from django.contrib.auth.models import AbstractUser
class User(AbstractUser):
    is_active = models.BooleanField(default=True)
    pass 
class PlayList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    public = models.BooleanField(default=True)
class ImdIds(models.Model):
    imdbID = models.CharField(max_length=100)
    playlist = models.ForeignKey(PlayList, on_delete=models.CASCADE)
    # user = models.ForeignKey(User, on_delete=models.CASCADE)


    
