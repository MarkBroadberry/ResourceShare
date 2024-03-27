
from django.urls import path
from . import views
from rest_framework_simplejwt import views as JWTviews
from django.views.generic import TemplateView

urlpatterns = [
    #creates JWT access token for authentication
    path('token/', views.MyTokenObtainPairView.as_view(), name ='JWT_token_obtain_pair'),
    #creates JWT refresh token for authenication
    path('token/refresh/',JWTviews.TokenRefreshView.as_view(), name ='JWT_token_refresh'),
    #blacklists the JWT token to log the user out
    path('logout/', views.LogoutBlacklistView.as_view(), name = 'logout_blacklist'),
    #creates new user
    path('createUser/', views.CreateUserView.as_view(), name = 'create_user'),
    #logs in new user
    path('loginUser/', views.CreateUserView.as_view(), name = 'login_user'),
    #returns the currently authorized user's university
    path('getUniversity/', views.GetUniversityView.as_view(), name = 'get_university'),
    #returns the currently authorized user's profile information
    path('getUserDetail/', views.GetUserDetailView.as_view(), name = 'get_user_detail'),
    #creates a new module
    path('createModule/', views.CreateModuleView.as_view(), name = 'createModule'),
    #returns all modules
    path('listModules/', views.ModuleView.as_view(), name = 'ModuleList'),
    #returns the currently authorized user's modules
    path('listModules/currentUser/', views.CurrentUserModuleView.as_view(), name = 'current_user_modules'),
    #uploads a resource to the database
    path('resourceUpload/', views.ResourceUploadView.as_view(), name = 'resourceUpload'),
    #returns resources for a specified module
    path('getResources/module/<int:moduleId>/', views.ResourcesForModuleView.as_view(), name = "resources_for_module"),
    #enrolls the currently authorized user in a specified module
    path('enrollCurrentUser/module/<int:moduleId>/', views.EnrollUserView.as_view(), name = "enroll_user_to_module"),
    #downloads a specified resource
    path('download/<str:fileName>/', views.DownloadPDFView.as_view(), name = "download_pdf"),
    #returns all ratings for a specified resource
    path('getRatings/<int:resourceId>/', views.RatingView.as_view(), name = "get_ratings"),
    #adds a rating to a specified resource
    path('createRating/', views.RatingView.as_view(), name = "create_rating"),
    #returns all ratings
    path('getRatingList/', views.RatingListView.as_view(), name = "get_rating_list"),
    #returns all saved resources for a specified user
    path('SavedResources/<str:userId>/', views.SavedResourceView.as_view(), name = "get_saved_resource"),
    #saves a resource for the currently authorized user
    path('createSavedResource/', views.SavedResourceView.as_view(), name = "create_saved_resource"),
    #removes a saved resource for the currently authorized user
    path('unsaveResource/', views.UnsaveResourceView.as_view(), name = "unsave_resource"),
    #creates a trust relationship
    path('createTrustRelationship/', views.TrustRelationshipView.as_view(), name = "create_trust_relationship"),
    #returns all trust relationships
    path('getTrustRelationshipList/', views.TrustRelationshipView.as_view(), name = "get_trust_relationshipList"),
    #deletes a trust relationship
    path('deleteTrustRelationship/', views.RemoveTrustRelationshipView.as_view(), name = "remove_trust_relationshipList"),
]