from django.urls import path
from .views import RegisterView, LoginView, LogoutView, get_csrf_token, get_user

urlpatterns = [
    path("csrf/", get_csrf_token, name="csrf"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path('getUser/',get_user,name='getUser')

]
