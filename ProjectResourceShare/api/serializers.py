#transforms python model into a JSON response. -> key value using variable and definition
import logging
from rest_framework import serializers
from ResourceShare import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

logger = logging.getLogger(__name__)

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Module
        fields = '__all__'
        depth = 1
    def create(self, validated_data):
        user_id_list = validated_data.pop('students', [])
        module = models.Module.objects.create(**validated_data)
        module.students.set(user_id_list)
        return module

class UniversitySerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.University
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    #university field is handled by the university serializer
    university = UniversitySerializer(write_only=True, required=False)
   
    class Meta: 
        model = models.CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }
        #kwargs - arbitrary no. key word arguments. 
    
    #makes sure that the password goes into the database hashed
    def create(self, validated_data):
        logger.info("start of create method")
      
        university_data = validated_data.pop('university', None)
        logger.info("university data %s", university_data)
        password = validated_data.pop('password', None)
        user_instance = self.Meta.model(**validated_data)
        if password is not None:
            user_instance.set_password(password)
            logger.info("user_instance %s", user_instance)
            #django method to sha256 hash the password.

        logger.info("saved pw ")
        if university_data and 'name' in university_data:  
            logger.info("before university instance")
            university_instance, created = models.University.objects.get_or_create(name=university_data['name'])
            logger.info("university instance %s", university_instance)
            user_instance.university = university_instance
            
        user_instance.save()
        return user_instance 
        
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attr):
        '''validates the username and password with the validate method built
          into the TokenObtainPairSerializer class that we inherit from '''
        data = super().validate(attr)
        tokenPair = self.get_token(self.user)
        data['refresh'] = str(tokenPair)
        data['access'] = str(tokenPair.access_token)
        data['user'] = str(self.user)
        #add other fields here that will be put into local storage and accessed from client. 
        return data
    
#using two different serializers, so we can store just the ids for the foreign key relationship and then
#when we are fetching, we use nested serializers to get the author and module objects, not just their ids. 
class ResourceFetchSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    module = ModuleSerializer()
    class Meta:
        depth = 2
        model = models.Resource
        fields = ['id','name', 'description', 'resource', 'author', 'module']


class ResourceCreateSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=models.CustomUser.objects.all())
    module = serializers.PrimaryKeyRelatedField(queryset=models.Module.objects.all())
    
    class Meta:
        model = models.Resource
        fields = ['name', 'description', 'resource', 'author', 'module']
        #include related models up to one level deep - in this case include author.(customuser)
        depth = 1
        
    def create(self, validated_data):
        resource_instance = models.Resource.objects.create(**validated_data)

        return resource_instance
    
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rating
        fields = ['resource', 'author', 'rating', 'comment']
        depth = 1
    def create(self, validated_data):
        rating_instance = models.Rating.objects.create(**validated_data)
        return rating_instance
    
class RatingCreateSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=models.CustomUser.objects.all())
    resource = serializers.PrimaryKeyRelatedField(queryset=models.Resource.objects.all())

    class Meta:
        model = models.Rating
        fields = ['resource', 'author', 'rating', 'comment']
        #include related models up to one level deep - in this case include author.(customuser)
        depth = 1
        
    def create(self, validated_data):
        rating_instance = models.Rating.objects.create(**validated_data)

        return rating_instance
    
