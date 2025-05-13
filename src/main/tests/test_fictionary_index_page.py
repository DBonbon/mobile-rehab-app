from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories.base_page import BasePageFactory
from ..factories._page import FictionaryIndexPageFactory
from ..pages import FictionaryIndexPageSerializer


class FictionaryIndexPageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = FictionaryIndexPageFactory.create(title="FictionaryIndex", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), FictionaryIndexPageSerializer)

    def test_json_representation(self):
        page = FictionaryIndexPageFactory.create(title="FictionaryIndex", parent=self.root_page)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("FictionaryIndex", data["component_props"]["title"])
