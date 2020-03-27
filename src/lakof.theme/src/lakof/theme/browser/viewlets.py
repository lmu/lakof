# -*- coding: utf-8 -*-
from Acquisition import aq_inner
from plone.app.contenttypes.behaviors.leadimage import ILeadImage
from plone.app.layout.viewlets.common import ViewletBase
from plone.memoize.view import memoize
from Products.CMFPlone.interfaces import IPloneSiteRoot
from zope.component import getMultiAdapter


BLACKLIST = [
    'News Item',
]


class LeadImageViewlet(ViewletBase):
    """ A simple viewlet which renders leadimage """

    @memoize
    def body_tag(self):
        """ returns img tag """
        inherit_images = False

        width = 1420
        height = 300
        context = aq_inner(self.context)

        # maybe a smaller banner on mosaic frontpage
        if context.getLayout() == 'layout_view':
            # height = 100
            pass

        # do we want inheritance?
        if inherit_images:
            chain = context.aq_chain
        else:
            chain = [context]

        for obj in chain:
            if IPloneSiteRoot.providedBy(obj):
                break
            if getattr(
                obj, 'portal_type', ''
            ) in BLACKLIST or not ILeadImage.providedBy(obj):
                continue
            if getattr(obj, 'image', None) and obj.image.getSize():
                scales = getMultiAdapter((obj, self.request), name='images')
                scale = scales.scale(
                    'image', width=width, height=height, direction='down'
                )
                tag = scale.tag() if scale else ''
                if tag:
                    return tag
        # a alternative would be a fallback-image
        return None
