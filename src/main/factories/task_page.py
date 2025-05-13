from .base_page import BasePageFactory
from ..pages. import TaskPage


class TaskPageFactory(BasePageFactory):
    class Meta:
        model = TaskPage
