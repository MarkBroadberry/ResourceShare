
from django.urls import path
from .views import ModuleView
from . import views
from rest_framework_simplejwt import views as JWTviews
from django.views.generic import TemplateView

urlpatterns = [
    path('listModules/', ModuleView.as_view(), name = 'ModuleList'),
    path('token/', views.MyTokenObtainPairView.as_view(), name ='JWTtoken_obtain_pair'),
    path('token/refresh/',JWTviews.TokenRefreshView.as_view(), name ='JWTtoken_refresh'),
    path('logout/', views.LogoutBlacklistView.as_view(), name = 'logoutBlacklist'),
    #path('home/', views.HomeView.as_view(), name ='home')
    path('createUser/', views.CreateUserView.as_view(), name = 'createUser'),
    path('loginUser/', views.CreateUserView.as_view(), name = 'loginUser'),
    path('getUniversity/', views.GetUniversityView.as_view(), name = 'getUniversity'),
    path('getUserDetail/', views.GetUserDetailView.as_view(), name = 'getUserDetail'),
    path('createModule/', views.CreateModuleView.as_view(), name = 'createModule'),
    path('resourceUpload/', views.ResourceUploadView.as_view(), name = 'resourceUpload'),
]