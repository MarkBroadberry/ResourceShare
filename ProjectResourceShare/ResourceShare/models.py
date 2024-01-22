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
    

    


'''
class File(models.Model):
    fileName = models.CharField(max_length=256, default= "No file name specified")
    filePath = models.CharField(max_length=1024, default = "No file path specified")
    fileType = models.CharField(max_length=64, default = "No file type specified")
    module = models.ForeignKey(Module, on_delete=models.CASCADE)

    def __str__(self):
        return self.fileName
    
'''









 