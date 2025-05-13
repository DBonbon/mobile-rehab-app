# main/customuser/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import authenticate, login, logout, get_user_model
from .serializers import PasswordResetSerializer, PasswordResetConfirmSerializer, EmailVerifySerializer, UserSerializer, UserCreateSerializer, LoginSerializer, ChangePasswordSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
# At the top of your views.py file
from django.conf import settings

User = get_user_model()

class UserDetailView(generics.RetrieveAPIView):
    """API view to retrieve user details"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    """API view to update user details"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserDeleteView(generics.DestroyAPIView):
    """API view to delete user account"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        self.perform_destroy(user)
        return Response({"detail": "User successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

class UserRegistrationView(generics.CreateAPIView):
    """API view for user registration"""
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        self.token = token

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"token": self.token.key, "user": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class LoginView(APIView):
    """API view for user login"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": UserSerializer(user).data
            })
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

class LogoutView(APIView):
    """API view for user logout"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Delete the token to logout
        request.user.auth_token.delete()
        logout(request)
        return Response({"detail": "Successfully logged out."})

class ChangePasswordView(generics.UpdateAPIView):
    """API view for changing password"""
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {"old_password": ["Wrong password."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(serializer.validated_data['new_password1'])
        user.save()
        
        # Update token
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        
        return Response({
            "detail": "Password updated successfully.",
            "token": token.key
        })

# customuser/views.py
class PasswordResetView(APIView):
    """API view for requesting a password reset"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            print("Password reset request received with data:", request.data)
            serializer = PasswordResetSerializer(data=request.data)
            
            if not serializer.is_valid():
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            email = serializer.validated_data['email']
            print(f"Looking for user with email: {email}")
            user = User.objects.filter(email=email).first()
            
            if user:
                print(f"User found with id: {user.id}")
                
                # Generate reset token
                try:
                    uid = urlsafe_base64_encode(force_bytes(user.pk))
                    token = default_token_generator.make_token(user)
                    print(f"Generated token: uid={uid}, token={token}")
                except Exception as e:
                    print(f"ERROR generating token: {str(e)}")
                    return Response({"detail": "Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                # Build reset URL
                try:
                    print(f"FRONTEND_URL from settings: {settings.FRONTEND_URL}")
                    reset_url = f"{settings.FRONTEND_URL}/password-reset/{uid}/{token}/"
                    print(f"Reset URL generated: {reset_url}")
                except Exception as e:
                    print(f"ERROR building reset URL: {str(e)}")
                    return Response({"detail": "Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                # Send email
                try:
                    # Explicitly check template existence
                    from django.template.loader import get_template
                    template_name = 'email/password-reset-email.html'
                    
                    try:
                        template = get_template(template_name)
                        print(f"Found template: {template_name}")
                    except Exception as template_error:
                        print(f"ERROR: Template not found: {template_name}, error: {str(template_error)}")
                        return Response({"detail": "Template error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
                    context = {
                        'user': user,
                        'reset_url': reset_url,
                    }
                    
                    message = template.render(context)
                    print("Template rendered successfully")
                    
                    subject = "Password Reset Request"
                    print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
                    
                    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
                    print(f"Email sent to: {user.email}")
                except Exception as e:
                    print(f"ERROR sending email: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    # Just log the error but still return success to prevent email enumeration
            else:
                print(f"No user found with email: {email}")
            
            # Always return success to prevent email enumeration
            return Response({"detail": "Password reset email has been sent."})
        
        except Exception as e:
            print(f"Unexpected error in password reset: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({"detail": "Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PasswordResetConfirmView(APIView):
    """API view for confirming a password reset"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data['uid']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid user ID."}, status=status.HTTP_400_BAD_REQUEST)
        
        if default_token_generator.check_token(user, serializer.validated_data['token']):
            user.set_password(serializer.validated_data['new_password1'])
            user.save()
            return Response({"detail": "Password has been reset successfully."})
        
        return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

class EmailVerifyView(APIView):
    """API view for verifying email"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = EmailVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Implement verification logic here
        # This will depend on how you're storing verification tokens/keys
        key = serializer.validated_data['key']
        
        # Example implementation - modify as needed
        try:
            # Decode the key to get user ID and verification token
            parts = key.split('-')
            if len(parts) != 2:
                raise ValueError("Invalid verification key")
                
            uid = force_str(urlsafe_base64_decode(parts[0]))
            token = parts[1]
            
            user = User.objects.get(pk=uid)
            
            # Verify token (implementation depends on your token system)
            # For example, if storing tokens in a model:
            # verification = EmailVerification.objects.get(user=user, token=token, is_used=False)
            
            # Mark as verified
            user.is_active = True  # Or a custom email_verified field
            user.save()
            
            return Response({"detail": "Email successfully verified."})
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid verification link."}, status=status.HTTP_400_BAD_REQUEST)

class EmailVerifyStatusView(APIView):
    """API view to check email verification status"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        # Return verification status
        # This depends on how you track verification (is_active or custom field)
        return Response({
            "email": user.email,
            "is_verified": user.is_active  # Or your custom field
        })
    

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    """API view for getting a CSRF token"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({"detail": "CSRF cookie set"})