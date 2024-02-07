
from django.urls import path
from . import views
from rest_framework_simplejwt import views as JWTviews
from django.views.generic import TemplateView

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name ='JWTtoken_obtain_pair'),
    path('token/refresh/',JWTviews.TokenRefreshView.as_view(), name ='JWTtoken_refresh'),
    path('logout/', views.LogoutBlacklistView.as_view(), name = 'logoutBlacklist'),
    #path('home/', views.HomeView.as_view(), name ='home')
    path('createUser/', views.CreateUserView.as_view(), name = 'createUser'),
    path('loginUser/', views.CreateUserView.as_view(), name = 'loginUser'),
    path('getUniversity/', views.GetUniversityView.as_view(), name = 'getUniversity'),
    path('getUserDetail/', views.GetUserDetailView.as_view(), name = 'getUserDetail'),
    path('createModule/', views.CreateModuleView.as_view(), name = 'createModule'),
    path('listModules/', views.ModuleView.as_view(), name = 'ModuleList'),
    path('listModules/currentUser/', views.CurrentUserModuleView.as_view(), name = 'current_user_modules'),
    path('resourceUpload/', views.ResourceUploadView.as_view(), name = 'resourceUpload'),
    path('getResources/module/<int:moduleId>/', views.ResourcesForModuleView.as_view(), name = "resources_for_module"),
    #path('getUserDetail/user/<int:userId>/', views..as_view(), name = "specified user"),
    path('enrollCurrentUser/module/<int:moduleId>/', views.EnrollUserView.as_view(), name = "enroll_user_to_module"),

    #path('download/<str:fileName>/', views.DownloadPDFView.as_view(), name = "download_pdf"),
   
]