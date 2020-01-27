# -*- coding: utf-8 -*-
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
