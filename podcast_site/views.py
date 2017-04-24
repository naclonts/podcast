from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views import generic

from podcast import models

def home_page(request):
    episodes = get_episode_list()
    context = { 'episodes': episodes }
    return render(request, 'home.html', context=context)


def get_episode_list():
    episodes = models.Episode.objects.all()
    print(episodes)
    return episodes
