(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "./.plone/++resource++mockup/textareamimetypeselector/pattern.js":
/*!***********************************************************************!*\
  !*** ./.plone/++resource++mockup/textareamimetypeselector/pattern.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* TextareaMimetypeSelector pattern.\n *\n *\n * Options:\n *    textareaName(string): Value of name attribute of the textarea ('')\n *    widgets(object): MimeType/PatternConfig pairs ({'text/html': {pattern: 'tinymce', patternOptions: {}}})\n *\n *\n * Documentation:\n *   # General\n *\n *   This pattern displays a mimetype selection widget for textareas. It\n *   switches the widget according to the selected mimetype.\n *\n *   ## widgets option Structure\n *\n *   Complex Object/JSON structure with MimeType/PatternConfig pairs. The\n *   MimeType is a string like \"text/html\". The PatternConfig is a object with\n *   a \"pattern\" and an optional \"patternOptions\" attribute. The \"pattern\"\n *   attribute's value is a string with the patterns name and the\n *   \"patternOptions\" attribute is a object with whatever options the pattern\n *   needs. For example, to use the TinyMCE pattern for the HTML mimetype, use\n *   \"text/html\": {\"pattern\": \"tinymce\"}\n *\n *   # Mimetype selection on textarea including text/html mimetype with TinyMCE editor.\n *\n *   {{ example-1 }}\n *\n *   # Mimetype selection on textarea with inline TinyMCE editor.\n *\n *   {{ example-2 }}\n *\n  * Example: example-1\n *    <textarea name=\"text\">\n *      <h1>hello world</h1>\n *    </textarea>\n *    <select\n *        name=\"text.mimeType\"\n *        class=\"pat-textareamimetypeselector\"\n *        data-pat-textareamimetypeselector='{\n *          \"textareaName\": \"text\",\n *          \"widgets\": {\n *            \"text/html\": {\n *              \"pattern\": \"tinymce\",\n *              \"patternOptions\": {\n *                \"tiny\": {\n *                  \"plugins\": [],\n *                  \"menubar\": \"edit format tools\",\n *                  \"toolbar\": \" \"\n *                }\n *              }\n *            }\n *          }\n *        }'\n *      >\n *      <option value=\"text/html\">text/html</option>\n *      <option value=\"text/plain\" selected=\"selected\">text/plain</option>\n *    </select>\n *\n * Example: example-2\n *    <textarea name=\"text2\">\n *      <h1>hello world</h1>\n *    </textarea>\n *    <select\n *        name=\"text.mimeType\"\n *        class=\"pat-textareamimetypeselector\"\n *        data-pat-textareamimetypeselector='{\n *          \"textareaName\": \"text2\",\n *          \"widgets\": {\n *            \"text/html\": {\n *              \"pattern\": \"tinymce\",\n *              \"patternOptions\": {\n *                \"inline\": true,\n *                \"tiny\": {\n *                  \"plugins\": [],\n *                  \"menubar\": \"edit format tools\",\n *                  \"toolbar\": \" \"\n *                }\n *              }\n *            }\n *          }\n *        }'\n *      >\n *      <option value=\"text/html\">text/html</option>\n *      <option value=\"text/plain\" selected=\"selected\">text/plain</option>\n *    </select>\n *\n */\n\n!(__WEBPACK_AMD_DEFINE_ARRAY__ = [\n  __webpack_require__(/*! jquery */ \"./.plone/++plone++static/components/jquery/dist/jquery.min.js\"),\n  __webpack_require__(/*! pat-base */ \"./.plone/++plone++static/components/patternslib/src/core/base.js\"),\n  __webpack_require__(/*! pat-registry */ \"./.plone/++plone++static/components/patternslib/src/core/registry.js\"),\n  __webpack_require__(/*! mockup-patterns-tinymce */ \"./.plone/++resource++mockup/tinymce/pattern.js\")\n], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, Base, registry) {\n  'use strict';\n\n  var TextareaMimetypeSelector = Base.extend({\n    name: 'textareamimetypeselector',\n    trigger: '.pat-textareamimetypeselector',\n    parser: 'mockup',\n    textarea: undefined,\n    currentWidget: undefined,\n    defaults: {\n      textareaName: '',\n      widgets: {'text/html': {pattern: 'tinymce', patternOptions: {}}}\n    },\n    init: function () {\n      var self = this,\n          $el = self.$el,\n          current;\n      self.textarea = $('[name=\"' + self.options.textareaName + '\"]');\n      $el.change(function (e) {\n        self.initTextarea(e.target.value);\n      });\n      self.initTextarea($el.val());\n\n    },\n    initTextarea: function (mimetype) {\n      var self = this,\n          patternConfig = self.options.widgets[mimetype],\n          pattern;\n      // First, destroy current\n      if (self.currentWidget) {\n        // The pattern must implement the destroy method.\n        self.currentWidget.destroy();\n      }\n      // Then, setup new\n      if (patternConfig) {\n          pattern = new registry.patterns[patternConfig.pattern](\n            self.textarea,\n            patternConfig.patternOptions || {}\n          );\n          self.currentWidget = pattern;\n      }\n    }\n\n  });\n\n  return TextareaMimetypeSelector;\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./.plone/++resource++mockup/textareamimetypeselector/pattern.js?");

/***/ })

}]);