# -*- coding: utf-8 -*-
from ComputedAttribute import ComputedAttribute
from plone import api
from plone.app.upgrade.utils import cleanUpSkinsTool
from plone.app.upgrade.utils import loadMigrationProfile
from plone.portlets.interfaces import IPortletAssignmentMapping
from plone.portlets.interfaces import IPortletManager
from zope.component import queryMultiAdapter
from zope.component import queryUtility

import logging


log = logging.getLogger(__name__)


def prepare_plone5_upgrade(context=None):
    remove_overrides()
    release_all_webdav_locks()
    remove_all_revisions()
    disable_theme()
    catalog = api.portal.get_tool('portal_catalog')
    qi = api.portal.get_tool('portal_quickinstaller')
    portal_setup = api.portal.get_tool('portal_setup')

    to_delete = []
    for path in to_delete:
        try:
            obj = api.content.get(path=path)
            if obj is not None:
                api.content.delete(obj, check_linkintegrity=False)
            log.info('Deleted %s' % path)
        except:  # noqa: F401
            continue

    # Remove ftw.slider
    if qi.isProductInstalled('ftw.slider'):
        qi.uninstallProducts(['ftw.slider'])

    # Remove ftw.footer
    if qi.isProductInstalled('ftw.footer'):
        qi.uninstallProducts(['ftw.footer'])

    # ftw.mobilenavigation
    log.info('removing ftw.mobilenavigation')
    if qi.isProductInstalled('ftw.mobilenavigation'):
        qi.uninstallProducts(['ftw.mobilenavigation'])

    # collective.quickupload
    log.info('removing collective.quickupload')
    if qi.isProductInstalled('collective.quickupload'):
        qi.uninstallProducts(['collective.quickupload'])

    #  collective.mtrsetup
    log.info('removing collective.mtrsetup')
    if qi.isProductInstalled('collective.mtrsetup'):
        qi.uninstallProducts(['collective.mtrsetup'])

    #  wildcard.foldercontents
    log.info('removing wildcard.foldercontents')
    if qi.isProductInstalled('wildcard.foldercontents'):
        qi.uninstallProducts(['wildcard.foldercontents'])

    #  plonetheme.classic
    log.info('removing plonetheme.classic')
    if qi.isProductInstalled('plonetheme.classic'):
        qi.uninstallProducts(['plonetheme.classic'])

    log.info('rebuilding catalog')
    catalog.clearFindAndRebuild()

    log.info('run uninstall self')
    portal_setup.runAllImportStepsFromProfile(
        'profile-lakof.theme:uninstall', purge_old=False
    )


def remove_overrides(context=None):
    log.info('removing portal_skins overrides')
    portal_skins = api.portal.get_tool('portal_skins')
    custom = portal_skins['custom']
    for name in custom.keys():
        custom.manage_delObjects([name])
        log.info(u'Removed skin item {}'.format(name))

    log.info('removing portal_view_customizations')
    view_customizations = api.portal.get_tool('portal_view_customizations')
    for name in view_customizations.keys():
        view_customizations.manage_delObjects([name])
        log.info(u'Removed portal_view_customizations item {}'.format(name))


def release_all_webdav_locks(context=None):
    from Products.CMFPlone.utils import base_hasattr

    portal = api.portal.get()

    def unlock(obj, path):
        if base_hasattr(obj, 'wl_isLocked') and obj.wl_isLocked():
            obj.wl_clearLocks()
            log.info(u'Unlocked {}'.format(path))

    portal.ZopeFindAndApply(portal, search_sub=True, apply_func=unlock)


def remove_all_revisions(context=None):
    """Remove all revisions.
    After packing the DB this could significantly shrink its size.
    """
    hs = api.portal.get_tool('portal_historiesstorage')
    zvcr = hs.zvc_repo
    zvcr._histories.clear()
    storage = hs._shadowStorage
    storage._storage.clear()


def disable_theme(context=None):
    """Disable a custom diazo theme and enable sunburst.
    Useful for cleaning up a site in Plone 4
    """
    theme_name = 'plonetheme.onegov'
    from plone.app.theming.utils import applyTheme

    portal_skins = api.portal.get_tool('portal_skins')
    qi = api.portal.get_tool('portal_quickinstaller')
    if qi.isProductInstalled(theme_name):
        log.info('Uninstalling {}'.format(theme_name))
        qi.uninstallProducts([theme_name])
    log.info('Disabling all diazo themes')
    applyTheme(None)
    log.info('Enabled Sunburst Theme')
    portal_skins.default_skin = 'Sunburst Theme'
    if theme_name in portal_skins.getSkinSelections():
        portal_skins.manage_skinLayers([theme_name], del_skin=True)


def cleanup_in_plone52(context=None):
    uninstall_archetypes()
    remove_archetypes_traces()
    portal = api.portal.get()
    cleanUpSkinsTool(portal)
    api.content.rename(portal['index_html'], 'startseite')
    portal.setDefaultPage('startseite')
    portal_properties = api.portal.get_tool('portal_properties')
    portal_properties.manage_delObjects(['quickupload_properties'])
    portal_properties.manage_delObjects(['imaging_properties'])
    pack_database()


def uninstall_archetypes(context=None):
    portal_setup = api.portal.get_tool('portal_setup')
    loadMigrationProfile(portal_setup, 'profile-Products.ATContentTypes:uninstall')
    qi = api.portal.get_tool('portal_quickinstaller')
    addons = [
        'Archtypes',
        'ATContentTypes',
        'plone.app.referenceablebehavior',
        'plone.app.blob',
        'plone.app.imaging',
    ]
    for addon in addons:
        if qi.isProductInstalled(addon):
            qi.uninstallProducts([addon])


def remove_archetypes_traces(context=None):
    portal = api.portal.get()

    # remove obsolete AT tools
    tools = [
        'portal_languages',
        'portal_tinymce',
        'kupu_library_tool',
        'portal_factory',
        'portal_atct',
        'uid_catalog',
        'archetype_tool',
        'reference_catalog',
        'portal_metadata',
    ]
    for tool in tools:
        if tool not in portal.keys():
            log.info('Tool {} not found'.format(tool))
            continue
        try:
            portal.manage_delObjects([tool])
            log.info('Deleted {}'.format(tool))
        except Exception as e:
            log.info(u'Problem removing {}: {}'.format(tool, e))
            try:
                log.info(u'Fallback to remove without permission_checks')
                portal._delObject(tool)
                log.info('Deleted {}'.format(tool))
            except Exception as e:
                log.info(u'Another problem removing {}: {}'.format(tool, e))


def pack_database(context=None):
    """Pack the database"""
    portal = api.portal.get()
    app = portal.__parent__
    db = app._p_jar.db()
    db.pack(days=0)


def cleanup_afterpy3_migration(context=None):
    portal_setup = api.portal.get_tool('portal_setup')
    portal_setup.runAllImportStepsFromProfile('profile-lakof.theme:default')

    catalog = api.portal.get_tool('portal_catalog')
    catalog.clearFindAndRebuild()


def fix_portlets(context=None):
    """Fix navigation_portlet (has ComputedValue for portal instead of a UUID)
    """
    catalog = api.portal.get_tool('portal_catalog')
    portal = api.portal.get()
    fix_portlets_for(portal)
    for brain in catalog.getAllBrains():
        try:
            obj = brain.getObject()
        except KeyError:
            log.info('Broken brain for {}'.format(brain.getPath()))
            continue
        fix_portlets_for(obj)


def fix_portlets_for(obj):
    attrs_to_fix = [
        'root_uid',
        'search_base_uid',
        'uid',
    ]
    for manager_name in [
        'plone.leftcolumn',
        'plone.rightcolumn',
        'plone.footerportlets',
    ]:
        manager = queryUtility(IPortletManager, name=manager_name, context=obj)
        if not manager:
            continue
        mappings = queryMultiAdapter((obj, manager), IPortletAssignmentMapping)
        if not mappings:
            continue
        for key, assignment in mappings.items():
            for attr in attrs_to_fix:
                if getattr(assignment, attr, None) is not None and isinstance(
                    getattr(assignment, attr), ComputedAttribute
                ):
                    setattr(assignment, attr, None)
                    log.info(
                        'Reset {} for portlet {} assigned at {} in {}'.format(
                            attr, key, obj.absolute_url(), manager_name
                        )
                    )  # noqa: E501
                    log.info(
                        'You may need to configure it manually at {}/@@manage-portlets'.format(
                            obj.absolute_url()
                        )
                    )  # noqa: E501
