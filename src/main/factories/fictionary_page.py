from .base_page import BasePageFactory
from ..pages import FictionaryPage


class FictionaryPageFactory(BasePageFactory):
    class Meta:
        model = FictionaryPage
