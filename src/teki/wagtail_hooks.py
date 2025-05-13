from django.templatetags.static import static
from django.utils.html import format_html
from wagtail import hooks
from wagtail.admin.rich_text.editors.draftail import features as draftail_features
from wagtail.admin.rich_text.converters.html_to_contentstate import InlineStyleElementHandler
from wagtail.rich_text import LinkHandler

@hooks.register("insert_global_admin_css")
def insert_global_admin_css():
    return format_html(
        '<link rel="stylesheet" type="text/css" href="{}">',
        static("teki/admin-overrides.css"),
    )

@hooks.register('register_rich_text_features')
def register_underscore_feature(features):
    """
    Register the `underscore` feature in Draftail.
    """
    feature_name = 'underscore'
    type_ = 'UNDERLINE'  # This corresponds to the Draft.js style for underline
    tag = 'u'  # HTML tag for underline

    # Add control for the Draftail editor
    control = {
        'type': type_,
        'label': '_',
        'description': 'Underscore',
        'style': {'textDecoration': 'underline'},  # CSS for underline
    }

    # Register the feature in Draftail
    features.register_editor_plugin(
        'draftail', feature_name, draftail_features.InlineStyleFeature(control)
    )

    # Map the feature to the HTML <u> tag
    features.register_converter_rule('contentstate', feature_name, {
        'from_database_format': {
            tag: InlineStyleElementHandler(type_),  # Correctly map to InlineStyleElementHandler
        },
        'to_database_format': {
            'style_map': {type_: tag},  # Ensure mapping back to <u> tag
        },
    })

    # Add the feature to the default set of rich text features
    if feature_name not in features.default_features:
        features.default_features.append(feature_name)
