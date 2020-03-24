# -*- coding: utf-8 -*-
from plone import api
from plone.autoform import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from z3c.form.browser.radio import RadioFieldWidget
from zope import schema
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IFormFieldProvider)
class IRegister(model.Schema):

    directives.widget(register=RadioFieldWidget)
    register = schema.Choice(
        title=u'Anmeldeformular', vocabulary='lakof.registrationforms', required=False,
    )


@provider(IVocabularyFactory)
def registrationforms(context):
    brains = api.content.find(portal_type='EasyForm', sort_on='sortable_title')
    terms = [SimpleTerm(value='', token='', title='Kein Anmeldeformular verlinken')]
    for brain in brains:
        terms.append(SimpleTerm(value=brain.UID, token=brain.UID, title=brain.Title))
    return SimpleVocabulary(terms)
