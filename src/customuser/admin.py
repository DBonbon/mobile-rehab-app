# main/customuser/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User

class CustomUserAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    
    list_display = ['pk', 'email', 'username', 'display_name', 'first_name', 'last_name']
    
    # Add custom fields to the add form
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('email', 'first_name', 'last_name', 'display_name', 'date_of_birth', 
                         'address1', 'address2', 'zip_code', 'city', 'country', 
                         'mobile_phone', 'role', 'additional_information', 'photo',)}),
    )
    
    # Add custom fields to the edit form
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('display_name', 'date_of_birth', 'address1', 'address2', 
                         'zip_code', 'city', 'country', 'mobile_phone', 'role',
                         'additional_information', 'photo',)}),
    )

admin.site.register(User, CustomUserAdmin)