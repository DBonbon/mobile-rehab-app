from .base_page import BasePageFactory
from ..pages import AboutPage


class AboutPageFactory(BasePageFactory):
    class Meta:
        model = AboutPage
