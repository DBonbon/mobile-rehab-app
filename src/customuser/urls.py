# main/customuser/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Existing paths
    path('user/', views.UserDetailView.as_view(), name='user-detail'),
    path('user/update/', views.UserUpdateView.as_view(), name='user-update'),
    path('user/delete/', views.UserDeleteView.as_view(), name='user-delete'),
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.LoginView.as_view(), name='user-login'),
    path('logout/', views.LogoutView.as_view(), name='user-logout'),
    path('password/change/', views.ChangePasswordView.as_view(), name='user-password-change'),
    
    # New password reset endpoints
    path('password/reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('email/verify/', views.EmailVerifyView.as_view(), name='email-verify'),
    path('email/verify/status/', views.EmailVerifyStatusView.as_view(), name='email-verify-status'),
    path('get-csrf-token/', views.GetCSRFToken.as_view(), name='get-csrf-token'),    
]