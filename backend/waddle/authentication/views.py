from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.middleware.csrf import get_token
from .serializers import RegisterSerializer, LoginSerializer, UserDetailSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework.decorators import api_view
from notes.models import Folder

@ensure_csrf_cookie  
def get_csrf_token(request):
    return JsonResponse({"status": "CSRF cookie set"})


@api_view(["GET"])  
def get_user(request):
    user = request.user

    if not user.is_authenticated:  
        return Response({"message": "Not logged in"}, status=401)  

    return Response({  
        "id": user.id,
        "username": user.username,
        "email": user.email
    })


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("Endpoint hit")
        
        csrf_token = get_token(request)  
        print(f"CSRF Token: {csrf_token}")

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            Folder.objects.create(user=user, name="My first folder")
            
            
            login(request, user)

            response = Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

            response.set_cookie(
                'sessionid', request.session.session_key,  
                httponly=False,  
                secure=False,  
                samesite='Strict',  
                max_age=60*60*24*30  
            )

            response.set_cookie(
                'csrftoken', get_token(request),  
                httponly=False,  
                secure=False,  
                samesite='Strict',  
                max_age=60*60*24*30
            )

            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("Login request received")
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)

                if user.check_password(password):
                    login(request, user)  

                    request.session.create()

                    response = Response({'message': 'Login successful'}, status=status.HTTP_200_OK)

                    response.set_cookie(
                        'sessionid', request.session.session_key,  
                        httponly=False,  
                        secure=False,  
                        samesite='Strict',  
                        max_age=60*60*24*30  
                    )

                    response.set_cookie(
                        'csrftoken', get_token(request),  
                        httponly=False,  
                        secure=False,  
                        samesite='Strict',  
                        max_age=60*60*24*30
                    )

                    print("Session started, Cookies set:", response.cookies)  
                    return response

                return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
            except User.DoesNotExist:
                return Response({"detail": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        print("Invalid data:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)

        response = Response({"message": "User logged out successfully"})
        response.delete_cookie("sessionid")  
        return response
