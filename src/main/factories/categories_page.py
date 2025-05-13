from .base_page import BasePageFactory
from ..pages import CategoriesPage


class CategoriesPageFactory(BasePageFactory):
    class Meta:
        model = CategoriesPage
