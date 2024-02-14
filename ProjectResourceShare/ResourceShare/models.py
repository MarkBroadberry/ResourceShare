from django.db import models
import random
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager

# Create your models here.

class University(models.Model):
    name = models.CharField(max_length=256, default = None)
    def __str__(self):
        return self.name
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique= True)
    first_name = models.CharField(max_length=255, default = 'no name provided')
    last_name = models.CharField(max_length=255, default = 'no last name provided')
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name = 'students', default = None)
    trust_rating = models.FloatField(default = 0)
    download_count = models.IntegerField(default = 0)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = BaseUserManager()
    def __str__(self):
        return self.email
    

    
class Module(models.Model):
    name = models.CharField(max_length=256, default = "No Module Specified")
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name = 'modules')
    students = models.ManyToManyField(CustomUser)
    def __str__(self):
        return self.name
    

class Resource(models.Model):
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=512)
    resource = models.FileField(upload_to="uploads/")
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

class Rating(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    rating = models.FloatField()
    comment = models.TextField(max_length=512, default = 'No  Comment Provided')


'''
class TrustRating(models.Model):
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    rating = models.FloatField()
    '''









 