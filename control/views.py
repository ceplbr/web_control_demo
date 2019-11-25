from django.shortcuts import render
from django.http import HttpResponse
#from django.views.decorators.http import require_POST



def index(request):
    return render(request, "index.html")
