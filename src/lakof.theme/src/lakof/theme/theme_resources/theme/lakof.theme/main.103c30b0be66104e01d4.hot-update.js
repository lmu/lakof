webpackHotUpdate("main",{

/***/ "./.plone/++resource++plone.js":
/*!*************************************!*\
  !*** ./.plone/++resource++plone.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*** IMPORTS FROM imports-loader ***/\nvar __WEBPACK_LOCAL_MODULE_0__ = __webpack_require__(/*! jquery */ \"./.plone/++plone++static/components/jquery/dist/jquery.min.js\");\n\n// Copyright (C) 2010 Plone Foundation\n//\n// This program is free software; you can redistribute it and/or modify it\n// under the terms of the GNU General Public License as published by the Free\n// Software Foundation; either version 2 of the License.\n//\n// This program is distributed in the hope that it will be useful, but WITHOUT\n// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or\n// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for\n// more details.\n//\n// You should have received a copy of the GNU General Public License along with\n// this program; if not, write to the Free Software Foundation, Inc., 51\n// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.\n//\n\nPromise.all(/*! AMD require */[__webpack_require__.e(0), __webpack_require__.e(2), __webpack_require__.e(10)]).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [\n  __webpack_require__(/*! mockup-patterns-autotoc */ \"./.plone/++resource++mockup/autotoc/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-contentloader */ \"./.plone/++resource++mockup/contentloader/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-cookietrigger */ \"./.plone/++resource++mockup/cookietrigger/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-formautofocus */ \"./.plone/++resource++mockup/formautofocus/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-formunloadalert */ \"./.plone/++resource++mockup/formunloadalert/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-livesearch */ \"./.plone/++resource++mockup/livesearch/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-markspeciallinks */ \"./.plone/++resource++mockup/markspeciallinks/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-modal */ \"./.plone/++resource++mockup/modal/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-navigationmarker */ \"./.plone/++resource++mockup/navigationmarker/pattern.js\"),\n  __webpack_require__(/*! mockup-patterns-preventdoublesubmit */ \"./.plone/++resource++mockup/preventdoublesubmit/pattern.js\"),\n  __webpack_require__(/*! bootstrap-collapse */ \"./.plone/++plone++static/components/bootstrap/js/collapse.js\"),\n  __webpack_require__(/*! bootstrap-dropdown */ \"./.plone/++plone++static/components/bootstrap/js/dropdown.js\"),\n  __webpack_require__(/*! bootstrap-tooltip */ \"./.plone/++plone++static/components/bootstrap/js/tooltip.js\"),\n]; (function () {\n  'use strict';\n}).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}).catch(__webpack_require__.oe);\n\n\n\n//# sourceURL=webpack:///./.plone/++resource++plone.js?");

/***/ }),

/***/ "./src/lakof.theme/default.js":
/*!************************************!*\
  !*** ./src/lakof.theme/default.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var plone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! plone */ \"./.plone/++resource++plone.js\");\n/* harmony import */ var plone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(plone__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _default_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./default.less */ \"./src/lakof.theme/default.less\");\n/* harmony import */ var _default_less__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_default_less__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _theme_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./theme.less */ \"./src/lakof.theme/theme.less\");\n/* harmony import */ var _theme_less__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_theme_less__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jquery */ \"./.plone/++plone++static/components/jquery/dist/jquery.min.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var pat_registry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pat-registry */ \"./.plone/++plone++static/components/patternslib/src/core/registry.js\");\n/* harmony import */ var pat_registry__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(pat_registry__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var exports_loader_requirejs_script_loader_requirejs_require_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! exports-loader?requirejs!script-loader!requirejs/require.js */ \"./node_modules/exports-loader/index.js?requirejs!./node_modules/script-loader/index.js!./node_modules/requirejs/require.js\");\n/* harmony import */ var exports_loader_requirejs_script_loader_requirejs_require_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(exports_loader_requirejs_script_loader_requirejs_require_js__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nif (jquery__WEBPACK_IMPORTED_MODULE_3___default()('body.userrole-anonymous').length === 0) {\n  Promise.all(/*! import() | logged-in */[__webpack_require__.e(8), __webpack_require__.e(0), __webpack_require__.e(6), __webpack_require__.e(2), __webpack_require__.e(7), __webpack_require__.e(\"logged-in\")]).then(__webpack_require__.bind(null, /*! ./logged-in */ \"./src/lakof.theme/logged-in.js\")).then(function () {\n    return jquery__WEBPACK_IMPORTED_MODULE_3___default()(function ($) {\n      return setTimeout(function () {\n        return pat_registry__WEBPACK_IMPORTED_MODULE_4___default.a.scan(document.body);\n      });\n    });\n  });\n  __webpack_require__.e(/*! import() | mosaic */ \"mosaic\").then(__webpack_require__.t.bind(null, /*! mosaic */ \"./.plone/++plone++mosaic/js/mosaic.pattern.js\", 7));\n  __webpack_require__.e(/*! import() | layouts-editor */ \"layouts-editor\").then(__webpack_require__.t.bind(null, /*! layouts-editor */ \"./.plone/++plone++mosaic/js/layouts-editor.js\", 7));\n}\n\nif (jquery__WEBPACK_IMPORTED_MODULE_3___default()('body.userrole-anonymous').length > 0) {\n  jquery__WEBPACK_IMPORTED_MODULE_3___default()(function ($) {\n    return setTimeout(function () {\n      return pat_registry__WEBPACK_IMPORTED_MODULE_4___default.a.scan(document.body);\n    });\n  });\n}\n/* Expose jQuery when needed */\n// window.jQuery = jQuery;\n\n\n\nexports_loader_requirejs_script_loader_requirejs_require_js__WEBPACK_IMPORTED_MODULE_5___default.a.config({}); // the real configuration is loaded in webpack.xml\n\n//# sourceURL=webpack:///./src/lakof.theme/default.js?");

/***/ })

})