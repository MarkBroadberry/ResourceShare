from django.urls import path
from .views import *

urlpatterns = [
    path('',index),
    path('register', index),
    path('home', index),
    path('login', index),
    path('ModuleResources', index),
    path('ResourceRatings', index),
    path('Saved', index), 
    path('TrustGraph', index),
]