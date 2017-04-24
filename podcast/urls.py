from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.episode_list, name='episode_list'),
    url(r'^episode/(?P<slug>[\w\-]+)$', views.EpisodeView.as_view(), name='episode'),
]
