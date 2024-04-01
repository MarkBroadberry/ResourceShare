from ResourceShare.models import *
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
import uuid

class UniversityTest(TestCase):
    def create_university(self, name = "University of Birmingham"):
        return University.objects.create(name = name)
    def test_create_university(self):
        university = self.create_university()
        self.assertTrue(isinstance(university, University))
        self.assertEqual(university.__str__(), university.name)

class UserTest(TestCase):
    def create_user(self, email, first_name = "John", 
                    last_name = "Smith", trust_rating = 4.5, download_count = 0):
        email = "testUser" + str(uuid.uuid4()) + "@testdomain.com"
        newUniversityTest = UniversityTest()
        university = newUniversityTest.create_university()
        user, created = CustomUser.objects.get_or_create(email = email, first_name = first_name, 
                                         last_name = last_name, university = university, 
                                         trust_rating = trust_rating,download_count = download_count )
        return user
    def test_create_user(self):
        user = self.create_user(email = "testUser@gmail.com")
        self.assertTrue(isinstance(user, CustomUser))
        self.assertEqual(user.__str__(), user.email)


class ModuleTest(TestCase):
    def create_module(self, name = "Test Module"):
        newUniversityTest = UniversityTest()
        university = newUniversityTest.create_university()
        newUserTest = UserTest()
        test_user_1 = newUserTest.create_user(email = "ModuleUserTest@gmail.com")
        test_user_2 = newUserTest.create_user(email = "ModuleUserTwoTest@gmail.com")
        module = Module.objects.create(name = name, university = university)
        module.students.set([test_user_1, test_user_2])
        return module

    def test_create_module(self):
        module = self.create_module()
        self.assertTrue(isinstance(module, Module))
        self.assertEqual(module.__str__(), module.name)
        

class ResourceTest(TestCase):
    def create_resource(self, module, name="Test Lecture Notes",
                             description = "Test Description for a Lecture Notes Resource", 
                            type = "LectureNotes"):
        if(module is None):
            newModuleTest = ModuleTest()
            module = newModuleTest.create_module()

        newUserTest = UserTest()
        author = newUserTest.create_user(email = "authorTest@gmail.com")
        test_resource = SimpleUploadedFile("Test Lecture Notes.docx", b"This is the content of the file")

        return Resource.objects.create(name = name, description = description, 
                                       resource =test_resource, author = author, module = module, type = type )
    def test_create_resource(self):
        resource = self.create_resource(None)
        self.assertTrue(isinstance(resource, Resource)) 
        self.assertEqual(resource.__str__(), resource.name)




class ResourcesForModuleIntegrationTest(TestCase):
    def setUp(self):
        #Set Up Test Module and Resources
        self.client = APIClient()
        moduleTest = ModuleTest()
        self.module = moduleTest.create_module()
        resourceTest = ResourceTest()
        self.resource1 = resourceTest.create_resource(self.module, name = "Integration Test Resource 1")
        self.resource2 = resourceTest.create_resource(self.module, name = "Integration Test Resource 2")

    def test_get_resources_for_module(self):
        #Get the response from the ResourceForModuleView by matching the endpoint name from urls.py
        response = self.client.get(reverse('resources_for_module', kwargs={'moduleId': self.module.id}))
        #test that the response returns the correct status
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        #test that the response returns the correct number of resources
        self.assertEqual(len(response.data), 2)
        #test that the response returns the correct Resources
        self.assertEqual(response.data[0]['name'], 'Integration Test Resource 1')
        self.assertEqual(response.data[1]['name'], 'Integration Test Resource 2')

    def test_get_resources_for_invalid_module(self):
        #define a invalid module id
        invalidModuleId = 9999
        #send request to the API endpoint 
        response = self.client.get(reverse('resources_for_module', kwargs={'moduleId': invalidModuleId}))
        #test that the status is correct
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    

'''
    def test_get_resources_view(self):
        url = reverse("resources_for_module")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertIn(w.title, resp.content)
'''
'''
    class Rating(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    rating = models.FloatField()
    comment = models.TextField(max_length=512, default = 'No  Comment Provided')
'''

