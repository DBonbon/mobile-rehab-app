# main/customuser/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django_countries.serializer_fields import CountryField

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model - suitable for profile viewing/updates"""
    country = CountryField(required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'display_name',
            'date_of_birth', 'address1', 'address2', 'zip_code', 'city', 'country',
            'mobile_phone', 'role', 'additional_information', 'photo'
        ]
        read_only_fields = ['id', 'username', 'email']

        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'display_name': {'required': False},
            'date_of_birth': {'required': False},
            'address1': {'required': False},
            'address2': {'required': False},
            'zip_code': {'required': False},
            'city': {'required': False},
            'country': {'required': False},
            'mobile_phone': {'required': False},
            'role': {'required': False},
            'additional_information': {'required': False},
            'photo': {'required': False},
        }

class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new user"""
    password1 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    country = CountryField(required=False)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password1', 'password2', 'first_name', 'last_name', 
            'display_name', 'date_of_birth', 'address1', 'address2', 'zip_code', 
            'city', 'country', 'mobile_phone', 'role', 'additional_information'
        ]
    
    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        
        validate_password(data['password1'])
        return data
    
    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')  # Remove password2 as we don't need it
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user

class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True, style={'input_type': 'password'})
    new_password1 = serializers.CharField(required=True, style={'input_type': 'password'})
    new_password2 = serializers.CharField(required=True, style={'input_type': 'password'})

    def validate(self, data):
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({"new_password2": "Password fields didn't match."})
        
        validate_password(data['new_password1'])
        return data

class LoginSerializer(serializers.Serializer):
    """Serializer for login"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})

class PasswordResetSerializer(serializers.Serializer):
    """Serializer for requesting a password reset"""
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming a password reset"""
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password1 = serializers.CharField(style={'input_type': 'password'})
    new_password2 = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, data):
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({"new_password2": "Password fields didn't match."})
        return data

class EmailVerifySerializer(serializers.Serializer):
    """Serializer for email verification"""
    key = serializers.CharField()