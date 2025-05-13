from .base_page import BasePageFactory
from ..pages import AuthorsPage


class AuthorsPageFactory(BasePageFactory):
    class Meta:
        model = AuthorsPage
