from django.test import TestCase, override_settings
# Add this temporarily at the top of test_page_not_found.py
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@override_settings(DEBUG=False)
class PageNotFoundTest(TestCase):
    def setUp(self):
        logger.info(f"INSTALLED_APPS: {settings.INSTALLED_APPS}")
        logger.info(f"MIDDLEWARE: {settings.MIDDLEWARE}")

    # rest of your tests...
@override_settings(DEBUG=False)  # This is the only addition needed
class PageNotFoundTest(TestCase):
    def test_that_404_contains_no_errors(self):
        response = self.client.get("/a-404-url/")
        self.assertEqual(response.status_code, 404)

    def test_that_404_view_uses_proper_serializer(self):
        response = self.client.get("/a-404-url/")
        response_json = response.json()
        self.assertTrue(response_json["component_name"], "NotFoundPage")