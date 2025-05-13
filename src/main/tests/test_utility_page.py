from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories.base_page import BasePageFactory
from ..factories._page import UtilityPageFactory
from ..pages import UtilityPageSerializer


class UtilityPageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = UtilityPageFactory.create(title="Utility", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), UtilityPageSerializer)

    def test_json_representation(self):
        page = UtilityPageFactory.create(title="Utility", parent=self.root_page)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("Utility", data["component_props"]["title"])
