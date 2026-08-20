from django.urls import path

from .views import TestCreateView

urlpatterns = [
    path("create/", TestCreateView.as_view(), name="test-create"),
]