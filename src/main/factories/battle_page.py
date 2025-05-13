from .base_page import BasePageFactory
from ..pages. import BattlePage


class BattlePageFactory(BasePageFactory):
    class Meta:
        model = BattlePage
