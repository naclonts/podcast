from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views import generic

from .models import Episode

def index(request):
    return render(request, 'blog/index.html')

def episode_list(request):
    episodes = Episode.objects.all()
    context = { 'episodes': episodes }
    return render(request, 'podcast/episode_list.html', context=context)

class EpisodeView(generic.DetailView):
    model = Episode
