from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories.base_page import BasePageFactory
from ..factories._page import TaskPageFactory
from ..pages import TaskPageSerializer


class TaskPageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = TaskPageFactory.create(title="Task", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), TaskPageSerializer)

    def test_json_representation(self):
        page = TaskPageFactory.create(title="Task", parent=self.root_page)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("Task", data["component_props"]["title"])
