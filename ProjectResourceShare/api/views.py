from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ModuleSerializer, UserSerializer, MyTokenObtainPairSerializer, UniversitySerializer
from ResourceShare.models import Module, CustomUser, University
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.serializers import ValidationError
# Create your views here.
import logging

logger = logging.getLogger(__name__)



# Authentication Views for JWT Auth
class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = MyTokenObtainPairSerializer
            
class LogoutBlacklistView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refreshToken = request.data["refresh_token"]
            token = RefreshToken(refreshToken)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT) 
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

#API view to return all Modules. 
class ModuleView(generics.ListAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

#API view to create user, and instantiate university / associate with existing university. 
class CreateUserView(APIView):
    def post(self, request):
        try:
            print(request.data)
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            print(f"An error occurred: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class CreateModuleView(APIView):
    def post(self, request):
        try:
            serializer = ModuleSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            print(f"An error occurred: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        


class GetUniversityView(APIView):
    serializer_class = UniversitySerializer

    def get(self, request):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        try:
            user = self.request.user
            logger.info(user.email)
            university = user.university
            serializer = self.serializer_class(university)
            return Response(serializer.data, status = status.HTTP_200_OK) 
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetUserDetailView(APIView):
    serializer_class = UserSerializer

    def get(self, request):
        try:
            user = self.request.user
            serializer = self.serializer_class(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except user.DoesNotExist:
            return Response({"error": "user not found"}, status = status.HTTP_404_NOT_FOUND)
        
class CreateModuleView(APIView):
    def post(self, request):
        try:
            logger.info(request.data)
            serializer = ModuleSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.error(f"An error occurred: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        #TODO: pop university and user out of the serializer and handle them in the same way as creating a user.
