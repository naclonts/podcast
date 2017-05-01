from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views import generic

from podcast import models

# Returns 5 most recent episodes for context
def home_page(request):
    episodes = get_episode_list()
    context = { 'episodes': episodes[0:5] }
    return render(request, 'home.html', context=context)


def get_episode_list():
    episodes = models.Episode.objects.all()
    return episodes
