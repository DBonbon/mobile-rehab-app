from .base_page import BasePageFactory
from ..pages import UtilityPage


class UtilityPageFactory(BasePageFactory):
    class Meta:
        model = UtilityPage
