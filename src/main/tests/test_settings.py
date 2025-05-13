# main/tests/test_settings.py
import os
import pytest
from django.conf import settings

def test_settings_module():
    """
    Verify that the correct settings module is being used during testing.
    """
    # Print out current settings for debugging
    print("\n--- Test Settings Verification ---")
    print(f"Current Settings Module: {settings.SETTINGS_MODULE}")
    print(f"DEBUG: {settings.DEBUG}")
    print(f"Environment DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    
    # Assert that the test settings are being used
    assert settings.SETTINGS_MODULE == 'teki.settings.test', \
        f"Expected test settings, but got {settings.SETTINGS_MODULE}"
    
    # Additional checks specific to test settings
    assert settings.DEBUG is False, "Test settings should have DEBUG set to False"