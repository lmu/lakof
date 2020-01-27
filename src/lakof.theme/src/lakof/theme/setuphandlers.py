# -*- coding: utf-8 -*-
from lakof.theme.config import PROJECTNAME
from Products.CMFPlone.interfaces import INonInstallable
from zope.interface import implementer


@implementer(INonInstallable)
class HiddenProfiles(object):
    def getNonInstallableProfiles(self):
        """
        Prevents all profiles but 'plone-content' from showing up in the
        profile list when creating a Plone site.
        """
        return [
            u'lakof.theme:uninstall',
        ]


def post_install(context):
    """Post install script"""


def uninstall(context):
    """Post uninstall script"""
