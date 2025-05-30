from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories.base_page import BasePageFactory
from ..factories._page import ContactPageFactory
from ..pages import ContactPageSerializer


class ContactPageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = ContactPageFactory.create(title="Contact", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), ContactPageSerializer)

    def test_json_representation(self):
        page = ContactPageFactory.create(title="Contact", parent=self.root_page)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("Contact", data["component_props"]["title"])
