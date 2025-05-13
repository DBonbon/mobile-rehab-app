from wagtail_factories import PageFactory
from ..pages.about import AboutPage
from ..pages.article import ArticlePage
from ..pages.article_index import ArticleIndexPage
from ..pages.author import AuthorPage
from ..pages.authors import AuthorsPage
from ..pages.categories import CategoriesPage
from ..pages.contact import ContactPage
from ..pages.fictionary import FictionaryPage
from ..pages.fictionary_index import FictionaryIndexPage
from ..pages.utility import UtilityPage
from .base_page import BasePageFactory

class AboutPageFactory(BasePageFactory):
    class Meta:
        model = AboutPage

class ArticlePageFactory(BasePageFactory):
    class Meta:
        model = ArticlePage

class ArticleIndexPageFactory(BasePageFactory):
    class Meta:
        model = ArticleIndexPage

class AuthorPageFactory(BasePageFactory):
    class Meta:
        model = AuthorPage

class AuthorsPageFactory(BasePageFactory):
    class Meta:
        model = AuthorsPage

class CategoriesPageFactory(BasePageFactory):
    class Meta:
        model = CategoriesPage

class ContactPageFactory(BasePageFactory):
    class Meta:
        model = ContactPage

class FictionaryPageFactory(BasePageFactory):
    class Meta:
        model = FictionaryPage

class FictionaryIndexPageFactory(BasePageFactory):
    class Meta:
        model = FictionaryIndexPage

class UtilityPageFactory(BasePageFactory):
    class Meta:
        model = UtilityPage