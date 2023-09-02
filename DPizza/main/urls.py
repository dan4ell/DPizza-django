from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='index'),
    path('success/<int:price>', views.success, name='success'),
    path('test', views.test, name='test')
]