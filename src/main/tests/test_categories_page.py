from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories.base_page import BasePageFactory
from ..factories._page import CategoriesPageFactory
from ..pages import CategoriesPageSerializer


class CategoriesPageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = CategoriesPageFactory.create(title="Categories", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), CategoriesPageSerializer)

    def test_json_representation(self):
        page = CategoriesPageFactory.create(title="Categories", parent=self.root_page)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("Categories", data["component_props"]["title"])
