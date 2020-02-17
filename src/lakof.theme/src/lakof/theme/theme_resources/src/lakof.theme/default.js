import 'plone';

import './default.less';
import './theme.less';

import jQuery from 'jquery';
import registry from 'pat-registry';

if (jQuery('body.userrole-anonymous').length === 0) {
    import(/* webpackChunkName: "logged-in" */ './logged-in').then(
    () => jQuery(($) => setTimeout(() => registry.scan(document.body)))
  );
  
  /* Add extra bundles when needed */
  // import(/* webpackChunkName: "pfgquickedit" */ 'pfgquickedit');
  // import(/* webpackChunkName: "pfgquickedit" */ 'mosaic');
  // import(/* webpackChunkName: "pfgquickedit" */ 'layouts-editor');
}
if (jQuery('body.userrole-anonymous').length > 0) {
  jQuery(($) => setTimeout(() => registry.scan(document.body)));
}

/* Expose jQuery when needed */
// window.jQuery = jQuery;

import requirejs from 'exports-loader?requirejs!script-loader!requirejs/require.js';
requirejs.config({});  // the real configuration is loaded in webpack.xml