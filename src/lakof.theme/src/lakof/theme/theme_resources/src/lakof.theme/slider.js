import(/* webpackChunkName: "collective.tiles.sliders.responsiveslides.vendor" */ 'collective.tiles.sliders.responsiveslides.vendor').then(
    () => jQuery(($) => setTimeout(() => registry.scan(document.body)))
  );

import(/* webpackChunkName: "collective.tiles.sliders.responsiveslides" */ 'collective.tiles.sliders.responsiveslides').then(
    () => jQuery(($) => setTimeout(() => registry.scan(document.body)))
  );

import "++plone++collective.tiles.sliders.responsiveslides/responsiveslides.css";
import "++plone++collective.tiles.sliders.responsiveslides/responsiveslides.custom.css";
