from django.shortcuts import render
from django.http import HttpResponse  
#from myapp.functions.functions import handle_uploaded_file  
#from models import StudentForm  

# Create your views here.
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')
