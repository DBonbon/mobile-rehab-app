from .base_page import BasePageFactory
from ..pages import FictionaryIndexPage


class FictionaryIndexPageFactory(BasePageFactory):
    class Meta:
        model = FictionaryIndexPage
