from .base_page import BasePageFactory
from ..pages import ArticleIndexPage


class ArticleIndexPageFactory(BasePageFactory):
    class Meta:
        model = ArticleIndexPage
