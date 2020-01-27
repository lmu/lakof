# -*- coding: utf-8 -*-

import os

PROJECTNAME = "lakof.theme"    

base_path = os.path.split(__file__)[0]

onegov_styles = {
    "img.favicon": "", 
    "img.logo": "%PORTAL_URL%/++resource++lakof.theme/lakof_logo.png", 
    "img.startup": "%PORTAL_URL%/++resource++lakof.theme/lakof_logo.png", 
    "img.touch_iphone": "%PORTAL_URL%/++resource++lakof.theme/lakof_logo.png", 
    "img.touch_iphone_76": "%PORTAL_URL%/++resource++lakof.theme/lakof_logo_76x76.png",
    "img.touch_iphone_120": "%PORTAL_URL%/++resource++lakof.theme/lakof_logo_120x120.png", 
    "img.touch_iphone_152": "%PORTAL_URL%/++resource++lakof.theme/lakof_logo_152x152.png", 


    "css.heading-font-size": "", 
    "css.heading-line-height": "", 
    "css.heading-font-family": "", 

    "css.global-navigation-color": "#8A0000", 
    "css.global-navigation-color-hover": "#F36525", 
    "css.global-navigation-color-selected": "#F36525", 
    "css.global-navigation-border-color": "#8A0000", 

    "css.highlight-color-light": "", 

    "css.body-background": "", 
    "css.footer-background": "#f4f4f1", #E5E3DF",
    "css.link-color": "#8A0000", 
    "css.link-color-hover": "#F36525", 

    "custom_scss": open(os.path.join(base_path, 'lakof.scss'),'r').read(),
    }
