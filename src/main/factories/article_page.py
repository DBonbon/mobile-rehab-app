from .base_page import BasePageFactory
from ..pages import ArticlePage


class ArticlePageFactory(BasePageFactory):
    class Meta:
        model = ArticlePage
