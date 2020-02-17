(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["layouts-editor"],{

/***/ "./.plone/++plone++mosaic/js/layouts-editor.js":
/*!*****************************************************!*\
  !*** ./.plone/++plone++mosaic/js/layouts-editor.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_0__;// Copyright (C) 2010 Plone Foundation\n//\n// This program is free software; you can redistribute it and/or modify it\n// under the terms of the GNU General Public License as published by the Free\n// Software Foundation; either version 2 of the License.\n//\n// This program is distributed in the hope that it will be useful, but WITHOUT\n// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or\n// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for\n// more details.\n//\n// You should have received a copy of the GNU General Public License along with\n// this program; if not, write to the Free Software Foundation, Inc., 51\n// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.\n//\n\nif (window.jQuery) {\n  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_LOCAL_MODULE_0__ = ((function () {\n    'use strict';\n    return window.jQuery;\n  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));\n}\n\nPromise.all(/*! AMD require */[__webpack_require__.e(4), __webpack_require__.e(0), __webpack_require__.e(1), __webpack_require__.e(6)]).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [\n  __WEBPACK_LOCAL_MODULE_0__,\n  __webpack_require__(/*! mockup-utils */ \"./.plone/++resource++mockupjs/utils.js\"),\n  __webpack_require__(/*! underscore */ \"./.plone/++plone++static/components/underscore/underscore.js\"),\n  __webpack_require__(/*! mockup-patterns-filemanager */ \"./.plone/++resource++mockup/filemanager/pattern.js\")\n]; (function($, utils, _) {\n  'use strict';\n  $(document).ready(function(){\n\n    var EditorTemplate = _.template(\n'<table class=\"table listing\">' +\n  '<thead>' +\n    '<th>Title</th>' +\n    '<th>Path</th>' +\n    '<th>Types</th>' +\n    '<th>Actions</th>' +\n  '</thead>' +\n  '<tbody>' +\n    '<% _.each(items, function(item){ %>' +\n      '<tr data-layout-key=\"<%- item.key %>\">' +\n        '<td><%- item.title %></td>' +\n        '<td><%- item.key %></td>' +\n        '<td><%- item._for || \"all\" %></td>' +\n        '<td>' +\n          '<% if(item.hidden){ %>' +\n            '<a href=\"#\" class=\"showit\">Show</a>' +\n          '<% }else{ %>' +\n            '<a href=\"#\" class=\"hideit\">Hide</a>' +\n          '<% } %>' +\n        '</td>' +\n      '</tr>' +\n    '<% }); %>' +\n  '</tbody' +\n'</table>');\n\n    var loadEditor = function(){\n      var baseUrl = window.location.origin + window.location.pathname;\n      var url = baseUrl + '?list-contentlayouts=true';\n      utils.loading.show();\n      $.ajax({\n        url: url,\n        dataType: 'JSON'\n      }).done(function(data){\n        var $el = $('#show-hide-editor');\n        if($el.size() === 0){\n          $el = $('<div id=\"show-hide-editor\" />');\n          $('.show-hide-layouts').append($el);\n        }\n        $el.empty();\n        $el.html(EditorTemplate({\n          items: data\n        }));\n        $('.showit,.hideit', $el).click(function(e){\n          utils.loading.show();\n          e.preventDefault();\n          $.ajax({\n            url: baseUrl,\n            data: {\n              'action': $(this).hasClass('showit') && 'show' || 'hide',\n              'layout': $(this).parents('tr').attr('data-layout-key'),\n              '_authenticator': utils.getAuthenticator()\n            }\n          }).done(function(){\n            loadEditor();\n          });\n        });\n      }).always(function(){\n        utils.loading.hide();\n      });\n    }\n\n    $('#content-core').on('clicked', '#autotoc-item-autotoc-2', function(e){\n      e.preventDefault();\n      loadEditor();      \n    });\n\n  });\n}).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}).catch(__webpack_require__.oe);\n\n\n//# sourceURL=webpack:///./.plone/++plone++mosaic/js/layouts-editor.js?");

/***/ })

}]);