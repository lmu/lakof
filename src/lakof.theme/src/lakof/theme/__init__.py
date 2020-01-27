# -*- coding: utf-8 -*-

# Patch missing or broken interfaces and classes
# This code belongs in a __init__.py
# For more inspiration look at
# https://github.com/plone/plone.app.upgrade/blob/master/plone/app/upgrade/__init__.py

from datetime import timedelta
from datetime import tzinfo
from OFS.SimpleItem import SimpleItem
from plone.app.upgrade.utils import alias_module
from zope.interface import Interface


class IBBB(Interface):
    pass


try:
    from wildcard.foldercontents.interfaces import ILayer
    ILayer  # noqa
except ImportError:
    alias_module('wildcard.foldercontents.interfaces.ILayer', IBBB)


try:
    from ftw.footer.interfaces import IFtwFooterLayer
    IFtwFooterLayer  # noqa
except ImportError:
    alias_module('ftw.footer.interfaces.IFtwFooterLayer', IBBB)


# try:
#     from Products.ATContentTypes.interfaces.interfaces import IATCTTool
#     IATCTTool  # noqa
# except ImportError:
#     alias_module('Products.ATContentTypes.interfaces.interfaces.IATCTTool', IBBB)
