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
    def create(self, validated_data):
        user_id_list = validated_data.pop('students', [])
        module = models.Module.objects.create(**validated_data)
        module.students.set(user_id_list)
        return module
        '''
        students_data = validated_data.pop('students', None)
        university_data = validated_data.pop('university', None)
        module_instance = self.Meta.model(**validated_data)
        if university_data and 'name' in university_data:  
            logger.info("before university instance")
            university_instance, created = models.University.objects.get(name=university_data['name'])
            logger.info("university instance %s", university_instance)
            module_instance.university = university_instance
        if students_data:  
            logger.info("before students instance")
            students_instance, created = models.CustomUser.objects.get(email=students_data['email'])
            logger.info("students instance %s", students_instance)
            module_instance.students = students_instance
        module_instance.save()
        return module_instance'''




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
        '''try:
            user_instance.save()
        except Exception as e:
            logger.debug(e)'''

        logger.info("saved pw ")
        if university_data and 'name' in university_data:  
            logger.info("before university instance")
            university_instance, created = models.University.objects.get_or_create(name=university_data['name'])
            logger.info("university instance %s", university_instance)
            user_instance.university = university_instance
            
        user_instance.save()
        return user_instance

        #return userInstance
        '''
        if university_data:
            serialized_university = UniversitySerializer(data=university_data)
            #print("uni serializer: ", serialized_university)
            if serialized_university.is_valid():
                university_instance, created = models.University.objects.get_or_create(**university_data)
                userInstance.university = university_instance
                userInstance.save()
            else:
                print("serialized university errors", serialized_university.errors)
        else:
            print("university_data errors: ")'''
        
         #get_or_create returns tuple, the instance and a boolean if the instance was created.
            #logger.info("university data %s", university_data)
            ##logger.info("university instance name: %s", university_data['name'])
               #logger.info("university data %s", university_instance)
            #logger.info("university instance name: %s", university_instance['name'])
          #print("university_data: ", university_data)
    
        
        
        
    
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
    

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Resource
        fields = '__all__'
        #include related models up to one level deep - in this case includ author.(customuser)
        depth = 1
        
    def create(self, validated_data):
        resource = models.Resource.objects.create(**validated_data)
        return resource
