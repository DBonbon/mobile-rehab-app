from .base_page import BasePageFactory
from ..pages. import DashboardPage


class DashboardPageFactory(BasePageFactory):
    class Meta:
        model = DashboardPage
