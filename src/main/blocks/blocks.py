# src/main/blocks/blocks.py
from django import forms
from wagtail import blocks
from wagtail.rich_text import expand_db_html

from main.pages.base import BasePage

from wagtail.images.api.fields import ImageRenditionField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.snippets.blocks import SnippetChooserBlock
from wagtail.fields import RichTextField
###test block for blog page
from wagtail.blocks import (
    BooleanBlock,
    CharBlock,
    ChoiceBlock,
    DateTimeBlock,
    FieldBlock,
    IntegerBlock,
    ListBlock,
    PageChooserBlock,
    RawHTMLBlock,
    RichTextBlock,
    StreamBlock,
    StructBlock,
    StructValue,
    TextBlock,
    URLBlock,
)
from wagtailmedia.blocks import VideoChooserBlock
from wagtail.embeds.blocks import EmbedBlock
from django.utils.safestring import mark_safe

from markdown import markdown
from pygments import highlight
from pygments.formatters import get_formatter_by_name
from pygments.lexers import get_lexer_by_name
# to extend richtextblock
import wagtail.admin.rich_text.editors.draftail.features as draftail_features
from wagtail.admin.rich_text.converters.html_to_contentstate import InlineStyleElementHandler
from wagtail import hooks

from wagtail_footnotes.blocks import RichTextBlockWithFootnotes
#from wagtail_footnotes.blocks import FootnoteBlock

# 1. Use the register_rich_text_features hook.

class CustomRichTextBlock(RichTextBlock):
    """
    A custom RichTextBlock that can be further extended.
    Currently behaves like the default RichTextBlock but provides flexibility for future features.
    """
    def get_api_representation(self, value, context=None):
        # Ensure the value is returned as expanded HTML for serialization
        return expand_db_html(value.source)

    class Meta:
        icon = "doc-full"  # Use an icon that represents rich text
        label = "Custom Rich Text"

"""class CustomRichTextBlock(blocks.RichTextBlock):
    def get_api_representation(self, value, context=None):
        return expand_db_html(value.source)"""

class CustomImageChooserBlock(ImageChooserBlock):
    def get_api_representation(self, value, context=None):
        if value:
            return {
                "id": value.id,
                "title": value.title,
                "full_url": value.get_rendition("original").full_url,  # Use full URL for original
                "original": {**value.get_rendition("original").attrs_dict, "full_url": value.get_rendition("original").full_url},  # Added full_url to original
                "thumbnail": {**value.get_rendition("fill-120x120").attrs_dict, "full_url": value.get_rendition("fill-120x120").full_url},  # Added full_url to thumbnail
                "srcset": {
                    "small": {**value.get_rendition("width-480").attrs_dict, "full_url": value.get_rendition("width-480").full_url},  # Added full_url to small
                    "medium": {**value.get_rendition("width-768").attrs_dict, "full_url": value.get_rendition("width-768").full_url},  # Added full_url to medium
                    "large": {**value.get_rendition("width-1024").attrs_dict, "full_url": value.get_rendition("width-1024").full_url},  # Added full_url to large
                    "extra_large": {**value.get_rendition("width-1200").attrs_dict, "full_url": value.get_rendition("width-1200").full_url},  # Added full_url to extra_large
                },
                "srcset_webp": {
                    "small": {**value.get_rendition("width-480|format-webp").attrs_dict, "full_url": value.get_rendition("width-480|format-webp").full_url},  # Added full_url to webp small
                    "medium": {**value.get_rendition("width-768|format-webp").attrs_dict, "full_url": value.get_rendition("width-768|format-webp").full_url},  # Added full_url to webp medium
                    "large": {**value.get_rendition("width-1024|format-webp").attrs_dict, "full_url": value.get_rendition("width-1024|format-webp").full_url},  # Added full_url to webp large
                    "extra_large": {**value.get_rendition("width-1200|format-webp").attrs_dict, "full_url": value.get_rendition("width-1200|format-webp").full_url},  # Added full_url to webp extra_large
                },
                "focal_point": {
                    "x": value.focal_point_x,
                    "y": value.focal_point_y,
                    "width": value.focal_point_width,
                    "height": value.focal_point_height,
                } if value.has_focal_point() else None
            }


##Blocks
class CTALinkStructValue(blocks.StructValue):
    def url(self):
        if cta_url := self.get("cta_url"):
            return cta_url

        if cta_page := self.get("cta_page"):
            return cta_page.url

        return ""


class CTALinkMixin(blocks.StructBlock):
    class Meta:
        value_class = CTALinkStructValue

    def clean(self, value):
        struct_value = super().clean(value)

        errors = {}
        url = value.get("cta_url")
        page = value.get("cta_page")
        if self.required and not page and not url:
            error = ErrorList(
                [ValidationError("You must specify CTA page or CTA URL.")]
            )
            errors["cta_url"] = errors["cta_page"] = error

        if page and url:
            error = ErrorList(
                [
                    ValidationError(
                        "You must specify CTA page or CTA URL. You can't use both."
                    )
                ]
            )
            errors["cta_url"] = errors["cta_page"] = error

        if not value.get("text") and (page or url):
            error = ErrorList([ValidationError("You must specify CTA text.")])
            errors["text"] = error

        if errors:
            raise StructBlockValidationError(errors)
        return struct_value

    def get_context(self, value, parent_context=None):
        context = super().get_context(value, parent_context=parent_context)
        if value["cta_url"]:
            context["value"]["url"] = value["cta_url"]
        if value["cta_page"]:
            context["value"]["url"] = value["cta_page"].get_url
        return context


class CTABlock(CTALinkMixin):
    text = blocks.CharBlock(label="CTA text", max_length=255, required=False)
    cta_page = blocks.PageChooserBlock(label="CTA page", required=False)
    cta_url = blocks.URLBlock(label="CTA URL", required=False)

    @property
    def required(self):
        return True

    class Meta:
        icon = "bullhorn"
        label = "CTA"


class OptionalCTABlock(CTABlock):
    @property
    def required(self):
        return False

class IconBlock(blocks.StructBlock):
    """Block to store icon data for frontend rendering."""
    icon_name = blocks.CharBlock(required=True, help_text="Enter icon name (e.g., rocket, home, star)")
    library = blocks.ChoiceBlock(
        choices=[
            ("fa", "FontAwesome"),
            ("hero", "Heroicons"),
            ("material", "Material Icons"),
        ],
        required=True,
        help_text="Select the icon library"
    )

SPEECH_TYPES = (
        ('verb', 'Verb'),
        ('noun', 'Noun'),
        ('adjective', 'Adjective'),
        ('adverb', 'Adverb'),
        ('pronoun', 'Pronoun'),
        ('preposition', 'Preposition'),
        ('conjunction', 'Conjunction'),
        ('interjection', 'Interjection'),
        ('determiner', 'Determiner'),
    )

class CardBlock(blocks.StructBlock):
    """Basic game block that contains exactly 4 cards"""
    image = CustomImageChooserBlock(required=False, null=True, blank=True, label="image")
    card_title = blocks.CharBlock(label="Card Title", required=True)
    card_hint = blocks.CharBlock(label="Card Hint", required=False, help_text="another text string can be used as hint, En translation, etc'")

    class Meta:
        min_num = 4
        max_num = 4

class ImageText(StructBlock):
    reverse = BooleanBlock(required=False)
    text = RichTextBlock()
    image = CustomImageChooserBlock()

class HeadlineBlock(blocks.StructBlock):
    heading = blocks.CharBlock(max_length=255)
    sub_heading = blocks.TextBlock(required=False)
    intro = blocks.TextBlock(required=False)
    cta = OptionalCTABlock()
    icon = IconBlock(required=False)
    dark_background = blocks.BooleanBlock(required=False, default=False)

    class Meta:
        icon = "title"
        label = "Headline"

class HighlightBlock(blocks.StructBlock):
    """Block for highlighted sections with a heading and description."""
    heading = blocks.CharBlock(required=True, help_text="Heading of the highlighted section")
    description = blocks.TextBlock(required=True, help_text="Short descriptive text")
    image = CustomImageChooserBlock(required=False, help_text="Optional teaser image")
    image_on_right = blocks.BooleanBlock(required=False, default=False)
    cta = OptionalCTABlock(required=False)

    def get_context(self, value, parent_context=None):
        context = super().get_context(value, parent_context=parent_context)
        if value["image_on_right"]:
            context["image_on_right"] = value["image_on_right"]
        return context

    class Meta:
        icon = "newspaper"
        label = "Highlight"

class TeaserBlock(blocks.StructBlock):
    """Block for teaser content with a title, subtitle, and optional image."""
    title = blocks.CharBlock(required=True, help_text="Teaser title")
    subtitle = blocks.CharBlock(required=False, help_text="Teaser subtitle")
    image = CustomImageChooserBlock(required=False, help_text="Optional teaser image")
    link = blocks.URLBlock(required=False, help_text="Optional link for more details")

    class Meta:
        icon = "placeholder"
        label = "Teaser"

class HeroBlock(blocks.StructBlock):
    heading = blocks.CharBlock(verbose_name="Heading", required=False)
    sub_heading = blocks.CharBlock(verbose_name="Sub heading", required=False)
    intro = RichTextBlock(
        verbose_name="Intro",
        required=False,
        features=["bold", "italic", "link"],
    )
    icon = IconBlock(verbose_name="Icon", required=False)

class StandaloneCTABlock(blocks.StructBlock):
    cta = CTABlock()
    description = blocks.TextBlock(
        label="Short description", required=False, max_length=100
    )
    button_style = blocks.ChoiceBlock(
        choices=[
            ("primary", "Primary Button"),
            ("secondary", "Secondary Button"),
            ("outline", "Outline Button"),
        ],
        default="primary",
        required=False,
        help_text="Style of the CTA button")

    class Meta:
        icon = "bullhorn"
        label = "Standalone CTA"


class CodeBlock(StructBlock):
    """
    Code Highlighting Block
    """

    LANGUAGE_CHOICES = (
        ("bash", "Bash/Shell"),
        ("css", "CSS"),
        ("django", "Django templating language"),
        ("html", "HTML"),
        ("javascript", "Javascript"),
        ("python", "Python"),
        ("scss", "SCSS"),
    )

    language = ChoiceBlock(choices=LANGUAGE_CHOICES)
    code = TextBlock()

    class Meta:
        icon = "code"
        template = None

    def render_markup(self, value, context=None):
        src = value["code"].strip("\n")
        lang = value["language"]

        lexer = get_lexer_by_name(lang)
        formatter = get_formatter_by_name(
            "html",
            linenos=None,
            cssclass="codehilite",
            style="default",
            noclasses=False,
        )
        return mark_safe(highlight(src, lexer, formatter))  # noqa: S308

    def get_context(self, value, parent_context=None):
        context = super().get_context(value, parent_context=parent_context)
        context["code"] = self.render_markup(context["value"])
        return context


class MarkDown(TextBlock):
    """MarkDown Block"""

    class Meta:
        icon = "code"

    def render_markup(self, value, context=None):
        md = markdown(
            value, extensions=["markdown.extensions.fenced_code", "codehilite"]
        )
        return mark_safe(md)  # noqa: S308

    def get_context(self, value, parent_context=None):
        context = super().get_context(value, parent_context=parent_context)
        context["code"] = self.render_markup(context["value"])
        return context

class VideoBlock(blocks.StructBlock):
    # setting autoplay to True adds 'autoplay', 'loop' & 'muted' attrs to video element
    heading = blocks.CharBlock(required=False)
    video = VideoChooserBlock(required=False)
    embed = EmbedBlock(required=False)

    def clean(self, value):
        errors = {}
        struct_value = super().clean(value)

        if not value.get("video") and not value.get("embed"):
            error = ErrorList(
                [ValidationError("You must specify a video or embedded video.")]
            )
            errors["video"] = errors["embed"] = error

        if value.get("embed") and value.get("video"):
            error = ErrorList(
                [
                    ValidationError(
                        "You must specify a self-hosted video or embedded video. You can't use both."
                    )
                ]
            )
            errors["video"] = errors["embed"] = error

        if errors:
            raise StructBlockValidationError(errors)

        return struct_value

    class Meta:
        icon = "media"


class LogoBlock(blocks.StructBlock):
    heading = blocks.CharBlock(required=False)
    logos = blocks.ListBlock(
        ImageChooserBlock(),
    )

    class Meta:
        icon = "images"
    

class LogoBlock(blocks.StructBlock):
    """Block to display logos in a grid layout."""
    logos = blocks.ListBlock(
        CustomImageChooserBlock(),
        help_text="List of logos to display"
    )

    class Meta:
        icon = "image"
        label = "Logo Block"

    class Meta:
        icon = "pick"
        label = "Icon Block"

class IconBulletBlock(blocks.StructBlock):
    icon = IconBlock()
    heading = blocks.CharBlock(max_length=255)
    description = blocks.RichTextBlock(
        required=False,
        features=["bold", "italic", "link"],
    )
    cta = OptionalCTABlock()

    class Meta:
        icon = "tick-inverse"
        label = "Icon bullet"

class IconBulletsBlock(blocks.StructBlock):
    icon_bullets = blocks.ListBlock(IconBulletBlock())

    class Meta:
        label = "Icon bullets"

class MultipleQuoteBlock(blocks.StructBlock):
    """Block to display multiple testimonials or quotes."""
    quotes = blocks.ListBlock(
        blocks.StructBlock([
            ("quote", blocks.TextBlock(required=True, help_text="The quote text")),
            ("author", blocks.CharBlock(required=False, help_text="Author of the quote")),
            ("image", CustomImageChooserBlock(required=False, help_text="Optional author image")),
        ])
    )

    class Meta:
        icon = "openquote"
        label = "Multiple Quotes"

class FeatureBlock(StructBlock):
    title = CharBlock(required=True, help_text="Title of the feature section")
    description = TextBlock(required=False, help_text="Short description")
    image = CustomImageChooserBlock(required=False, help_text="Feature image")
    
    # Button settings
    button_text = CharBlock(required=False, help_text="Text for the button")
    button_url = URLBlock(required=False, help_text="Link for the button")

    # Design customization options
    background_color = ChoiceBlock(
        choices=[
            ("white", "White"),
            ("gray", "Gray"),
            ("blue", "Blue"),
            ("custom", "Custom"),
        ],
        default="white",
        help_text="Choose a background color",
        required=False,
    )
    custom_bg_color = CharBlock(
        required=False, 
        help_text="Enter a custom hex color (e.g., #ff5733) if 'Custom' is selected"
    )
    
    text_alignment = ChoiceBlock(
        choices=[
            ("left", "Left"),
            ("center", "Center"),
            ("right", "Right"),
        ],
        default="left",
        required=False,
        help_text="Choose text alignment"
    )

    button_position = ChoiceBlock(
        choices=[
            ("inline", "Inline with text"),
            ("below", "Below text"),
        ],
        default="inline",
        required=False,
        help_text="Choose button placement"
    )

    class Meta:
        template = "blocks/feature_block.html"
        icon = "placeholder"
        label = "Feature Block"


class BodyBlock(StreamBlock):
    h1 = CharBlock()
    h2 = CharBlock()
    paragraph = RichTextBlockWithFootnotes(features=['h1', 'h2', 'h3', 'h4', 'bold', 'underscore', 'italic', 'link', 'footnotes'])
    image_text = ImageText()
    image_carousel = ListBlock(CustomImageChooserBlock())
    thumbnail_gallery = ListBlock(CustomImageChooserBlock())
    feature_block = FeatureBlock()

class ContentStoryBlock(blocks.StreamBlock):
    rich_text = RichTextBlock()
    #text_and_media = TextAndMediaBlock()
    headline = HeadlineBlock()
    highlight = HighlightBlock()
    teaser = TeaserBlock()
    icon_bullets = IconBulletsBlock(icon="rectangle-list")
    #cards = CardsBlock(icon="table-list", group="Cards")
    #logo_cards = LogoCardsBlock(icon="images", group="Cards")
    cta = CTABlock(group="Call to action")
    standalone_cta = StandaloneCTABlock(group="Call to action")
    #standalone_quote = StandaloneQuoteBlock(group="Quotes")
    #multiple_quotes = MultipleQuoteBlock(group="Quotes")
    video = VideoBlock()
    """get_started_block = SnippetChooserBlock(
        "core.GetStartedSnippet",
        icon="table-list",
        template="patterns/components/streamfields/get_started_block/get_started_block.html",
    )
    sign_up_form = SnippetChooserBlock(
        "core.SignupFormSnippet",
        icon="envelope-open-text",
        template="patterns/components/streamfields/sign_up_form_block/sign_up_form_block.html",
    )"""
    #comparison_table = ComparisonTableBlock()
    #logos = LogoBlock(group="Logos")

# ✅ Special HomePage StreamBlock (Includes Wagtail.io Blocks)
class HomePageStoryBlock(StreamBlock):
    """StreamBlock for the homepage, including various featured sections."""
    hero = HeroBlock()
    headline = HeadlineBlock(required=False)
    highlight = HighlightBlock(required=False)
    teaser = TeaserBlock(required=False)
    standalone_cta = StandaloneCTABlock(required=False)
    icon_bullets = IconBulletsBlock(icon="rectangle-list")
    logos = LogoBlock(required=False)
    video = VideoBlock(required=False)
    # MultipleQuoteBlock is included but commented out for later use
    # multiple_quotes = MultipleQuoteBlock()

    class Meta:
        block_counts={
            'hero': {'max_num': 1},
            'teaser': {'max_num': 3},
        },