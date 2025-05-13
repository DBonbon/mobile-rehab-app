# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthtokenToken(models.Model):
    key = models.CharField(primary_key=True, max_length=40)
    created = models.DateTimeField()
    user = models.OneToOneField('CustomuserUser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'authtoken_token'


class CustomdocumentCustomdocument(models.Model):
    title = models.CharField(max_length=255)
    file = models.CharField(max_length=100)
    created_at = models.DateTimeField()
    file_size = models.IntegerField(blank=True, null=True)
    file_hash = models.CharField(max_length=40)
    collection = models.ForeignKey('WagtailcoreCollection', models.DO_NOTHING)
    uploaded_by_user = models.ForeignKey('CustomuserUser', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'customdocument_customdocument'


class CustomimageCustomimage(models.Model):
    title = models.CharField(max_length=255)
    file = models.CharField(max_length=100)
    width = models.IntegerField()
    height = models.IntegerField()
    created_at = models.DateTimeField()
    focal_point_x = models.IntegerField(blank=True, null=True)
    focal_point_y = models.IntegerField(blank=True, null=True)
    focal_point_width = models.IntegerField(blank=True, null=True)
    focal_point_height = models.IntegerField(blank=True, null=True)
    file_size = models.IntegerField(blank=True, null=True)
    file_hash = models.CharField(max_length=40)
    collection = models.ForeignKey('WagtailcoreCollection', models.DO_NOTHING)
    uploaded_by_user = models.ForeignKey('CustomuserUser', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'customimage_customimage'


class CustomimageCustomrendition(models.Model):
    filter_spec = models.CharField(max_length=255)
    file = models.CharField(max_length=100)
    width = models.IntegerField()
    height = models.IntegerField()
    focal_point_key = models.CharField(max_length=16)
    image = models.ForeignKey(CustomimageCustomimage, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'customimage_customrendition'
        unique_together = (('image', 'filter_spec', 'focal_point_key'),)


class CustomuserUser(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    additional_information = models.CharField(max_length=4096, blank=True, null=True)
    address1 = models.CharField(max_length=1024, blank=True, null=True)
    address2 = models.CharField(max_length=1024, blank=True, null=True)
    city = models.CharField(max_length=1024, blank=True, null=True)
    country = models.CharField(max_length=2, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    display_name = models.CharField(max_length=30, blank=True, null=True)
    mobile_phone = models.CharField(max_length=17, blank=True, null=True)
    photo = models.CharField(max_length=100)
    role = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=12, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'customuser_user'


class CustomuserUserGroups(models.Model):
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'customuser_user_groups'
        unique_together = (('user', 'group'),)


class CustomuserUserUserPermissions(models.Model):
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'customuser_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class MainAchievement(models.Model):
    total_points = models.IntegerField()
    milestone = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'main_achievement'


class MainArticleindexpage(models.Model):
    basepage_ptr = models.OneToOneField('MainBasepage', models.DO_NOTHING, primary_key=True)

    class Meta:
        managed = False
        db_table = 'main_articleindexpage'


class MainArticlepage(models.Model):
    basepage_ptr = models.OneToOneField('MainBasepage', models.DO_NOTHING, primary_key=True)
    intro = models.TextField(blank=True, null=True)
    body = models.JSONField()
    language = models.CharField(max_length=10)
    post_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'main_articlepage'


class MainArticlepagecategory(models.Model):
    category = models.ForeignKey('MainCategory', models.DO_NOTHING)
    page = models.ForeignKey(MainArticlepage, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'main_articlepagecategory'
        unique_together = (('page', 'category'),)


class MainArticlepagetag(models.Model):
    tag = models.ForeignKey('TaggitTag', models.DO_NOTHING)
    content_object = models.ForeignKey(MainArticlepage, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'main_articlepagetag'


class MainAuthorpage(models.Model):
    basepage_ptr = models.OneToOneField('MainBasepage', models.DO_NOTHING, primary_key=True)

    class Meta:
        managed = False
        db_table = 'main_authorpage'


class MainAuthorspage(models.Model):
    basepage_ptr = models.OneToOneField('MainBasepage', models.DO_NOTHING, primary_key=True)

    class Meta:
        managed = False
        db_table = 'main_authorspage'


class MainBasepage(models.Model):
    page_ptr = models.OneToOneField('WagtailcorePage', models.DO_NOTHING, primary_key=True)
    og_title = models.CharField(max_length=40, blank=True, null=True)
    og_description = models.CharField(max_length=300, blank=True, null=True)
    twitter_title = models.CharField(max_length=40, blank=True, null=True)
    twitter_description = models.CharField(max_length=300, blank=True, null=True)
    robot_noindex = models.BooleanField()
    robot_nofollow = models.BooleanField()
    canonical_link = models.CharField(max_length=200, blank=True, null=True)
    og_image = models.ForeignKey(CustomimageCustomimage, models.DO_NOTHING, blank=True, null=True)
    twitter_image = models.ForeignKey(CustomimageCustomimage, models.DO_NOTHING, related_name='mainbasepage_twitter_image_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'main_basepage'


class MainCategoriespage(models.Model):
    basepage_ptr = models.OneToOneField(MainBasepage, models.DO_NOTHING, primary_key=True)
    intro = models.TextField()
    post_date = models.DateTimeField()
    sidebar_title = models.TextField()
    sidebar_extend_btn = models.TextField()
    sidebar_collapse_btn = models.TextField()

    class Meta:
        managed = False
        db_table = 'main_categoriespage'


class MainCategory(models.Model):
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'main_category'


class MainExercisepage(models.Model):
    basepage_ptr = models.OneToOneField(MainBasepage, models.DO_NOTHING, primary_key=True)
    description = models.TextField()
    point_value = models.IntegerField()
    recommended_frequency = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'main_exercisepage'


class MainExercisepageachievement(models.Model):
    sort_order = models.IntegerField(blank=True, null=True)
    achievement = models.ForeignKey(MainAchievement, models.DO_NOTHING)
    page = models.ForeignKey(MainExercisepage, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'main_exercisepageachievement'


class MainExercisepageprogress(models.Model):
    sort_order = models.IntegerField(blank=True, null=True)
    page = models.ForeignKey(MainExercisepage, models.DO_NOTHING)
    progress = models.ForeignKey('MainProgress', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'main_exercisepageprogress'


class MainExercisepagesupportmessage(models.Model):
    sort_order = models.IntegerField(blank=True, null=True)
    page = models.ForeignKey(MainExercisepage, models.DO_NOTHING)
    support_message = models.ForeignKey('MainSupportmessage', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'main_exercisepagesupportmessage'


class MainExercisepagetask(models.Model):
    sort_order = models.IntegerField(blank=True, null=True)
    page = models.ForeignKey(MainExercisepage, models.DO_NOTHING)
    task = models.ForeignKey('MainTask', models.DO_NOTHING)
    assigned_date = models.DateTimeField()
    assigned_user = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'main_exercisepagetask'


class MainHomepage(models.Model):
    basepage_ptr = models.OneToOneField(MainBasepage, models.DO_NOTHING, primary_key=True)
    intro = models.TextField(blank=True, null=True)
    body = models.JSONField()

    class Meta:
        managed = False
        db_table = 'main_homepage'


class MainProgress(models.Model):
    date = models.DateField()
    times_completed = models.IntegerField()
    is_completed = models.BooleanField()
    exercise_page = models.ForeignKey(MainExercisepage, models.DO_NOTHING)
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'main_progress'


class MainSupportmessage(models.Model):
    message = models.TextField()
    timestamp = models.DateTimeField()
    recipient = models.ForeignKey(CustomuserUser, models.DO_NOTHING)
    sender = models.ForeignKey(CustomuserUser, models.DO_NOTHING, related_name='mainsupportmessage_sender_set')

    class Meta:
        managed = False
        db_table = 'main_supportmessage'


class MainTask(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    point_value = models.IntegerField()
    recommended_frequency = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'main_task'


class MainTaskcompletion(models.Model):
    completed_date = models.DateTimeField()
    exercise_task = models.ForeignKey(MainExercisepagetask, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'main_taskcompletion'


class SitesettingsSitesetting(models.Model):
    gtm_id = models.CharField(max_length=50)
    google_site_verification = models.CharField(max_length=255)
    cookie_content = models.TextField(blank=True, null=True)
    site = models.OneToOneField('WagtailcoreSite', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'sitesettings_sitesetting'


class TaggitTag(models.Model):
    name = models.CharField(unique=True, max_length=100)
    slug = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = False
        db_table = 'taggit_tag'


class TaggitTaggeditem(models.Model):
    object_id = models.IntegerField()
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)
    tag = models.ForeignKey(TaggitTag, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'taggit_taggeditem'
        unique_together = (('content_type', 'object_id', 'tag'),)


class WagtailFootnotesFootnote(models.Model):
    uuid = models.UUIDField()
    text = models.TextField()
    page = models.ForeignKey('WagtailcorePage', models.DO_NOTHING)
    locale = models.ForeignKey('WagtailcoreLocale', models.DO_NOTHING)
    translation_key = models.UUIDField()
    sort_order = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wagtail_footnotes_footnote'
        unique_together = (('page', 'uuid'), ('translation_key', 'locale'),)


class WagtailHeadlessPreviewPagepreview(models.Model):
    token = models.CharField(unique=True, max_length=255)
    content_json = models.TextField()
    created_at = models.DateField()
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_headless_preview_pagepreview'


class WagtailLocalizeLocalesynchronization(models.Model):
    locale = models.OneToOneField('WagtailcoreLocale', models.DO_NOTHING)
    sync_from = models.ForeignKey('WagtailcoreLocale', models.DO_NOTHING, related_name='wagtaillocalizelocalesynchronization_sync_from_set')

    class Meta:
        managed = False
        db_table = 'wagtail_localize_localesynchronization'


class WagtailLocalizeOverridablesegment(models.Model):
    order = models.IntegerField()
    data_json = models.TextField()
    context = models.ForeignKey('WagtailLocalizeTranslationcontext', models.DO_NOTHING)
    source = models.ForeignKey('WagtailLocalizeTranslationsource', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_overridablesegment'


class WagtailLocalizeRelatedobjectsegment(models.Model):
    order = models.IntegerField()
    context = models.ForeignKey('WagtailLocalizeTranslationcontext', models.DO_NOTHING)
    object = models.ForeignKey('WagtailLocalizeTranslatableobject', models.DO_NOTHING)
    source = models.ForeignKey('WagtailLocalizeTranslationsource', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_relatedobjectsegment'


class WagtailLocalizeSegmentoverride(models.Model):
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    data_json = models.TextField()
    has_error = models.BooleanField()
    field_error = models.TextField()
    context = models.ForeignKey('WagtailLocalizeTranslationcontext', models.DO_NOTHING, blank=True, null=True)
    last_translated_by = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    locale = models.ForeignKey('WagtailcoreLocale', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_segmentoverride'


class WagtailLocalizeString(models.Model):
    data_hash = models.UUIDField()
    data = models.TextField()
    locale = models.ForeignKey('WagtailcoreLocale', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_string'
        unique_together = (('locale', 'data_hash'),)


class WagtailLocalizeStringsegment(models.Model):
    order = models.IntegerField()
    attrs = models.TextField()
    context = models.ForeignKey('WagtailLocalizeTranslationcontext', models.DO_NOTHING)
    source = models.ForeignKey('WagtailLocalizeTranslationsource', models.DO_NOTHING)
    string = models.ForeignKey(WagtailLocalizeString, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_stringsegment'


class WagtailLocalizeStringtranslation(models.Model):
    data = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    context = models.ForeignKey('WagtailLocalizeTranslationcontext', models.DO_NOTHING, blank=True, null=True)
    locale = models.ForeignKey('WagtailcoreLocale', models.DO_NOTHING)
    translation_of = models.ForeignKey(WagtailLocalizeString, models.DO_NOTHING)
    tool_name = models.CharField(max_length=255)
    translation_type = models.CharField(max_length=20)
    last_translated_by = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    field_error = models.TextField()
    has_error = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'wagtail_localize_stringtranslation'
        unique_together = (('locale', 'translation_of', 'context'),)


class WagtailLocalizeTemplate(models.Model):
    uuid = models.UUIDField(unique=True)
    template = models.TextField()
    template_format = models.CharField(max_length=100)
    string_count = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'wagtail_localize_template'


class WagtailLocalizeTemplatesegment(models.Model):
    order = models.IntegerField()
    context = models.ForeignKey('WagtailLocalizeTranslationcontext', models.DO_NOTHING)
    source = models.ForeignKey('WagtailLocalizeTranslationsource', models.DO_NOTHING)
    template = models.ForeignKey(WagtailLocalizeTemplate, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_templatesegment'


class WagtailLocalizeTranslatableobject(models.Model):
    translation_key = models.UUIDField(primary_key=True)
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_translatableobject'
        unique_together = (('content_type', 'translation_key'),)


class WagtailLocalizeTranslation(models.Model):
    uuid = models.UUIDField(unique=True)
    created_at = models.DateTimeField()
    translations_last_updated_at = models.DateTimeField(blank=True, null=True)
    destination_last_updated_at = models.DateTimeField(blank=True, null=True)
    enabled = models.BooleanField()
    source = models.ForeignKey('WagtailLocalizeTranslationsource', models.DO_NOTHING)
    target_locale = models.ForeignKey('WagtailcoreLocale', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_translation'
        unique_together = (('source', 'target_locale'),)


class WagtailLocalizeTranslationcontext(models.Model):
    path_id = models.UUIDField()
    path = models.TextField()
    object = models.ForeignKey(WagtailLocalizeTranslatableobject, models.DO_NOTHING)
    field_path = models.TextField()

    class Meta:
        managed = False
        db_table = 'wagtail_localize_translationcontext'
        unique_together = (('object', 'path_id'),)


class WagtailLocalizeTranslationlog(models.Model):
    created_at = models.DateTimeField()
    locale = models.ForeignKey('WagtailcoreLocale', models.DO_NOTHING)
    revision = models.ForeignKey('WagtailcoreRevision', models.DO_NOTHING, blank=True, null=True)
    source = models.ForeignKey('WagtailLocalizeTranslationsource', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_translationlog'


class WagtailLocalizeTranslationsource(models.Model):
    object_repr = models.TextField()
    content_json = models.TextField()
    created_at = models.DateTimeField()
    locale = models.ForeignKey('WagtailcoreLocale', models.DO_NOTHING)
    object = models.ForeignKey(WagtailLocalizeTranslatableobject, models.DO_NOTHING)
    specific_content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)
    last_updated_at = models.DateTimeField()
    schema_version = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'wagtail_localize_translationsource'
        unique_together = (('object', 'locale'),)


class WagtailadminAdmin(models.Model):

    class Meta:
        managed = False
        db_table = 'wagtailadmin_admin'


class WagtailcoreCollection(models.Model):
    path = models.CharField(unique=True, max_length=255, db_collation='C')
    depth = models.IntegerField()
    numchild = models.IntegerField()
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'wagtailcore_collection'


class WagtailcoreCollectionviewrestriction(models.Model):
    restriction_type = models.CharField(max_length=20)
    password = models.CharField(max_length=255)
    collection = models.ForeignKey(WagtailcoreCollection, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_collectionviewrestriction'


class WagtailcoreCollectionviewrestrictionGroups(models.Model):
    collectionviewrestriction = models.ForeignKey(WagtailcoreCollectionviewrestriction, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_collectionviewrestriction_groups'
        unique_together = (('collectionviewrestriction', 'group'),)


class WagtailcoreComment(models.Model):
    text = models.TextField()
    contentpath = models.TextField()
    position = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    resolved_at = models.DateTimeField(blank=True, null=True)
    page = models.ForeignKey('WagtailcorePage', models.DO_NOTHING)
    resolved_by = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    revision_created = models.ForeignKey('WagtailcoreRevision', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING, related_name='wagtailcorecomment_user_set')

    class Meta:
        managed = False
        db_table = 'wagtailcore_comment'


class WagtailcoreCommentreply(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    comment = models.ForeignKey(WagtailcoreComment, models.DO_NOTHING)
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_commentreply'


class WagtailcoreGroupapprovaltask(models.Model):
    task_ptr = models.OneToOneField('WagtailcoreTask', models.DO_NOTHING, primary_key=True)

    class Meta:
        managed = False
        db_table = 'wagtailcore_groupapprovaltask'


class WagtailcoreGroupapprovaltaskGroups(models.Model):
    groupapprovaltask = models.ForeignKey(WagtailcoreGroupapprovaltask, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_groupapprovaltask_groups'
        unique_together = (('groupapprovaltask', 'group'),)


class WagtailcoreGroupcollectionpermission(models.Model):
    collection = models.ForeignKey(WagtailcoreCollection, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_groupcollectionpermission'
        unique_together = (('group', 'collection', 'permission'),)


class WagtailcoreGrouppagepermission(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    page = models.ForeignKey('WagtailcorePage', models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_grouppagepermission'
        unique_together = (('group', 'page', 'permission'),)


class WagtailcoreLocale(models.Model):
    language_code = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = False
        db_table = 'wagtailcore_locale'


class WagtailcoreModellogentry(models.Model):
    label = models.TextField()
    action = models.CharField(max_length=255)
    data = models.JSONField()
    timestamp = models.DateTimeField()
    content_changed = models.BooleanField()
    deleted = models.BooleanField()
    object_id = models.CharField(max_length=255)
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING, blank=True, null=True)
    user_id = models.BigIntegerField(blank=True, null=True)
    uuid = models.UUIDField(blank=True, null=True)
    revision_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wagtailcore_modellogentry'


class WagtailcorePage(models.Model):
    path = models.CharField(unique=True, max_length=255, db_collation='C')
    depth = models.IntegerField()
    numchild = models.IntegerField()
    title = models.CharField(max_length=255)
    slug = models.CharField(max_length=255)
    live = models.BooleanField()
    has_unpublished_changes = models.BooleanField()
    url_path = models.TextField()
    seo_title = models.CharField(max_length=255)
    show_in_menus = models.BooleanField()
    search_description = models.TextField()
    go_live_at = models.DateTimeField(blank=True, null=True)
    expire_at = models.DateTimeField(blank=True, null=True)
    expired = models.BooleanField()
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)
    owner = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    locked = models.BooleanField()
    latest_revision_created_at = models.DateTimeField(blank=True, null=True)
    first_published_at = models.DateTimeField(blank=True, null=True)
    live_revision = models.ForeignKey('WagtailcoreRevision', models.DO_NOTHING, blank=True, null=True)
    last_published_at = models.DateTimeField(blank=True, null=True)
    draft_title = models.CharField(max_length=255)
    locked_at = models.DateTimeField(blank=True, null=True)
    locked_by = models.ForeignKey(CustomuserUser, models.DO_NOTHING, related_name='wagtailcorepage_locked_by_set', blank=True, null=True)
    translation_key = models.UUIDField()
    locale = models.ForeignKey(WagtailcoreLocale, models.DO_NOTHING)
    alias_of = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    latest_revision = models.ForeignKey('WagtailcoreRevision', models.DO_NOTHING, related_name='wagtailcorepage_latest_revision_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wagtailcore_page'
        unique_together = (('translation_key', 'locale'),)


class WagtailcorePagelogentry(models.Model):
    label = models.TextField()
    action = models.CharField(max_length=255)
    data = models.JSONField()
    timestamp = models.DateTimeField()
    content_changed = models.BooleanField()
    deleted = models.BooleanField()
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING, blank=True, null=True)
    page_id = models.IntegerField()
    revision_id = models.IntegerField(blank=True, null=True)
    user_id = models.BigIntegerField(blank=True, null=True)
    uuid = models.UUIDField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wagtailcore_pagelogentry'


class WagtailcorePagesubscription(models.Model):
    comment_notifications = models.BooleanField()
    page = models.ForeignKey(WagtailcorePage, models.DO_NOTHING)
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_pagesubscription'
        unique_together = (('page', 'user'),)


class WagtailcorePageviewrestriction(models.Model):
    password = models.CharField(max_length=255)
    page = models.ForeignKey(WagtailcorePage, models.DO_NOTHING)
    restriction_type = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'wagtailcore_pageviewrestriction'


class WagtailcorePageviewrestrictionGroups(models.Model):
    pageviewrestriction = models.ForeignKey(WagtailcorePageviewrestriction, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_pageviewrestriction_groups'
        unique_together = (('pageviewrestriction', 'group'),)


class WagtailcoreReferenceindex(models.Model):
    object_id = models.CharField(max_length=255)
    to_object_id = models.CharField(max_length=255)
    model_path = models.TextField()
    content_path = models.TextField()
    content_path_hash = models.UUIDField()
    base_content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING, related_name='wagtailcorereferenceindex_content_type_set')
    to_content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING, related_name='wagtailcorereferenceindex_to_content_type_set')

    class Meta:
        managed = False
        db_table = 'wagtailcore_referenceindex'
        unique_together = (('base_content_type', 'object_id', 'to_content_type', 'to_object_id', 'content_path_hash'),)


class WagtailcoreRevision(models.Model):
    created_at = models.DateTimeField()
    content = models.JSONField()
    approved_go_live_at = models.DateTimeField(blank=True, null=True)
    object_id = models.CharField(max_length=255)
    user = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)
    base_content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING, related_name='wagtailcorerevision_base_content_type_set')
    object_str = models.TextField()

    class Meta:
        managed = False
        db_table = 'wagtailcore_revision'


class WagtailcoreSite(models.Model):
    hostname = models.CharField(max_length=255)
    port = models.IntegerField()
    is_default_site = models.BooleanField()
    root_page = models.ForeignKey(WagtailcorePage, models.DO_NOTHING)
    site_name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'wagtailcore_site'
        unique_together = (('hostname', 'port'),)


class WagtailcoreTask(models.Model):
    name = models.CharField(max_length=255)
    active = models.BooleanField()
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_task'


class WagtailcoreTaskstate(models.Model):
    status = models.CharField(max_length=50)
    started_at = models.DateTimeField()
    finished_at = models.DateTimeField(blank=True, null=True)
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)
    revision = models.ForeignKey(WagtailcoreRevision, models.DO_NOTHING)
    task = models.ForeignKey(WagtailcoreTask, models.DO_NOTHING)
    workflow_state = models.ForeignKey('WagtailcoreWorkflowstate', models.DO_NOTHING)
    finished_by = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    comment = models.TextField()

    class Meta:
        managed = False
        db_table = 'wagtailcore_taskstate'


class WagtailcoreUploadedfile(models.Model):
    file = models.CharField(max_length=200)
    for_content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING, blank=True, null=True)
    uploaded_by_user = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wagtailcore_uploadedfile'


class WagtailcoreWorkflow(models.Model):
    name = models.CharField(max_length=255)
    active = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'wagtailcore_workflow'


class WagtailcoreWorkflowcontenttype(models.Model):
    content_type = models.OneToOneField(DjangoContentType, models.DO_NOTHING, primary_key=True)
    workflow = models.ForeignKey(WagtailcoreWorkflow, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_workflowcontenttype'


class WagtailcoreWorkflowpage(models.Model):
    page = models.OneToOneField(WagtailcorePage, models.DO_NOTHING, primary_key=True)
    workflow = models.ForeignKey(WagtailcoreWorkflow, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_workflowpage'


class WagtailcoreWorkflowstate(models.Model):
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField()
    current_task_state = models.OneToOneField(WagtailcoreTaskstate, models.DO_NOTHING, blank=True, null=True)
    object_id = models.CharField(max_length=255)
    requested_by = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    workflow = models.ForeignKey(WagtailcoreWorkflow, models.DO_NOTHING)
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)
    base_content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING, related_name='wagtailcoreworkflowstate_base_content_type_set')

    class Meta:
        managed = False
        db_table = 'wagtailcore_workflowstate'
        unique_together = (('base_content_type', 'object_id'),)


class WagtailcoreWorkflowtask(models.Model):
    sort_order = models.IntegerField(blank=True, null=True)
    task = models.ForeignKey(WagtailcoreTask, models.DO_NOTHING)
    workflow = models.ForeignKey(WagtailcoreWorkflow, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailcore_workflowtask'
        unique_together = (('workflow', 'task'),)


class WagtaildocsDocument(models.Model):
    title = models.CharField(max_length=255)
    file = models.CharField(max_length=100)
    created_at = models.DateTimeField()
    uploaded_by_user = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    collection = models.ForeignKey(WagtailcoreCollection, models.DO_NOTHING)
    file_size = models.IntegerField(blank=True, null=True)
    file_hash = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'wagtaildocs_document'


class WagtailembedsEmbed(models.Model):
    url = models.TextField()
    max_width = models.SmallIntegerField(blank=True, null=True)
    type = models.CharField(max_length=10)
    html = models.TextField()
    title = models.TextField()
    author_name = models.TextField()
    provider_name = models.TextField()
    thumbnail_url = models.TextField()
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)
    last_updated = models.DateTimeField()
    hash = models.CharField(unique=True, max_length=32)
    cache_until = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wagtailembeds_embed'


class WagtailformsFormsubmission(models.Model):
    form_data = models.JSONField()
    submit_time = models.DateTimeField()
    page = models.ForeignKey(WagtailcorePage, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailforms_formsubmission'


class WagtailimagesImage(models.Model):
    title = models.CharField(max_length=255)
    file = models.CharField(max_length=100)
    width = models.IntegerField()
    height = models.IntegerField()
    created_at = models.DateTimeField()
    focal_point_x = models.IntegerField(blank=True, null=True)
    focal_point_y = models.IntegerField(blank=True, null=True)
    focal_point_width = models.IntegerField(blank=True, null=True)
    focal_point_height = models.IntegerField(blank=True, null=True)
    uploaded_by_user = models.ForeignKey(CustomuserUser, models.DO_NOTHING, blank=True, null=True)
    file_size = models.IntegerField(blank=True, null=True)
    collection = models.ForeignKey(WagtailcoreCollection, models.DO_NOTHING)
    file_hash = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'wagtailimages_image'


class WagtailimagesRendition(models.Model):
    file = models.CharField(max_length=100)
    width = models.IntegerField()
    height = models.IntegerField()
    focal_point_key = models.CharField(max_length=16)
    filter_spec = models.CharField(max_length=255)
    image = models.ForeignKey(WagtailimagesImage, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'wagtailimages_rendition'
        unique_together = (('image', 'filter_spec', 'focal_point_key'),)


class WagtailredirectsRedirect(models.Model):
    old_path = models.CharField(max_length=255)
    is_permanent = models.BooleanField()
    redirect_link = models.CharField(max_length=255)
    redirect_page = models.ForeignKey(WagtailcorePage, models.DO_NOTHING, blank=True, null=True)
    site = models.ForeignKey(WagtailcoreSite, models.DO_NOTHING, blank=True, null=True)
    automatically_created = models.BooleanField()
    created_at = models.DateTimeField(blank=True, null=True)
    redirect_page_route_path = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'wagtailredirects_redirect'
        unique_together = (('old_path', 'site'),)


class WagtailsearchIndexentry(models.Model):
    object_id = models.CharField(max_length=50)
    title_norm = models.FloatField()
    content_type = models.ForeignKey(DjangoContentType, models.DO_NOTHING)
    autocomplete = models.TextField()  # This field type is a guess.
    title = models.TextField()  # This field type is a guess.
    body = models.TextField()  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'wagtailsearch_indexentry'
        unique_together = (('content_type', 'object_id'),)


class WagtailusersUserprofile(models.Model):
    submitted_notifications = models.BooleanField()
    approved_notifications = models.BooleanField()
    rejected_notifications = models.BooleanField()
    user = models.OneToOneField(CustomuserUser, models.DO_NOTHING)
    preferred_language = models.CharField(max_length=10)
    current_time_zone = models.CharField(max_length=40)
    avatar = models.CharField(max_length=100)
    updated_comments_notifications = models.BooleanField()
    dismissibles = models.JSONField()
    theme = models.CharField(max_length=40)
    density = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'wagtailusers_userprofile'
