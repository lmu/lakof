import 'plone';

import './default.less';
import './theme.less';

import jQuery from 'jquery';
import registry from 'pat-registry';

import(/* webpackChunkName: "mosaic" */ 'mosaic').then(
    () => jQuery(($) => setTimeout(() => registry.scan(document.body)))
  );

if (jQuery('body.portaltype-easyform').length > 0) {
  import('./easyform.js');
}

import('./accordion.js');

if (jQuery('body.userrole-anonymous').length === 0) {
    import(/* webpackChunkName: "logged-in" */ './logged-in').then(
    () => jQuery(($) => setTimeout(() => registry.scan(document.body)))
  );
  import(/* webpackChunkName: "layouts-editor" */ 'layouts-editor');
}
if (jQuery('body.userrole-anonymous').length > 0) {
  jQuery(($) => setTimeout(() => registry.scan(document.body)));
}

/* Expose jQuery when needed */
window.jQuery = jQuery;

import requirejs from 'exports-loader?requirejs!script-loader!requirejs/require.js';
requirejs.config({});  // the real configuration is loaded in webpack.xml
