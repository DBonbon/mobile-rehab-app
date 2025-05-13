from .base_page import BasePageFactory
from ..pages import TextPage


class TextPageFactory(BasePageFactory):
    class Meta:
        model = TextPage
