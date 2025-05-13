from .base_page import BasePageFactory
from ..pages import ContactPage


class ContactPageFactory(BasePageFactory):
    class Meta:
        model = ContactPage
