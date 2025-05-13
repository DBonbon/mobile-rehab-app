from .base_page import BasePageFactory
from ..pages import AuthorPage


class AuthorPageFactory(BasePageFactory):
    class Meta:
        model = AuthorPage
