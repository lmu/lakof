(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{208:function(e,t,i){var n,s;n=[i(0),i(35),i(2),i(38),i(36),i(209),i(210),i(213),i(216),i(37)],void 0===(s=function(e,t,i,n,s,o,a,r,l,d){"use strict";var c=n.extend({tagName:"div",activeTab:"registry",template:i.template('<div class="autotabs"><ul class="main-tabs autotoc-nav" role="tablist"><li class="registry-btn"><a href="#"><%- _t("Registry") %></a></li><li class="overrides-btn"><a href="#"><%- _t("Overrides") %></a></li><li class="lessvariables-btn"><a href="#"><%- _t("Less Variables") %></a></li><li class="patternoptions-btn"><a href="#"><%- _t("Pattern Options") %></a></li></ul></div><div class="tab-content" />'),events:{"click .registry-btn a":"hideShow","click .overrides-btn a":"hideShow","click .lessvariables-btn a":"hideShow","click .patternoptions-btn a":"hideShow"},hideShow:function(t){void 0!==t&&(t.preventDefault(),this.activeTab=e(t.target).parent()[0].className.replace("-btn","")),this.$(".main-tabs > li a").removeClass("active"),this.$content.find(".tab-pane").removeClass("active"),this.tabs[this.activeTab].btn.find("a").addClass("active"),this.tabs[this.activeTab].content.addClass("active")},initialize:function(e){n.prototype.initialize.apply(this,[e]),this.registryView=new r({data:e,tabView:this}),this.overridesView=new a({data:e,tabView:this}),this.lessvariablesView=new o({data:e,tabView:this}),this.patternoptionsView=new l({data:e,tabView:this}),this.tabs={}},render:function(){return this.$el.append(this.template({_t:d})),this.loading=new s.Loading,this.$tabs=this.$("ul.main-tabs"),this.$content=this.$(".tab-content"),this.$content.append(this.registryView.render().el),this.$content.append(this.overridesView.render().el),this.$content.append(this.lessvariablesView.render().el),this.$content.append(this.patternoptionsView.render().el),this.tabs={registry:{btn:this.$(".registry-btn"),content:this.registryView.$el},overrides:{btn:this.$(".overrides-btn"),content:this.overridesView.$el},lessvariables:{btn:this.$(".lessvariables-btn"),content:this.lessvariablesView.$el},patternoptions:{btn:this.$(".patternoptions-btn"),content:this.patternoptionsView.$el}},this.hideShow(),this},saveData:function(t,i,n,o){var a=this;a.loading.show(),i||(i={}),i=e.extend({},i,{action:t,_authenticator:s.getAuthenticator()}),e.ajax({url:a.options.manageUrl,type:"POST",dataType:"json",data:i}).done((function(e){n&&n(e),void 0!==e.success&&!e.success&&e.msg&&window.alert(e.msg)})).always((function(){a.loading.hide()})).fail((function(e){o?o(e):window.alert(d("Error processing ajax request for action: ")+t)}))}});return t.extend({name:"resourceregistry",trigger:".pat-resourceregistry",parser:"mockup",defaults:{bundles:{},resources:{},javascripts:{},css:{},overrides:[],manageUrl:null,baseUrl:null,rjsUrl:null,lessvariables:{},patternoptions:{}},init:function(){this.$el.empty(),this.tabs=new c(this.options),this.$el.append(this.tabs.render().el)}})}.apply(t,n))||(e.exports=s)},209:function(e,t,i){var n,s;n=[i(0),i(38),i(2),i(36),i(77)],void 0===(s=function(e,t,i,n,s){"use strict";return t.extend({tagName:"div",className:"tab-pane lessvariables",template:i.template('<div class="buttons-container"><div class="btn-group pull-right"><button class="plone-btn plone-btn-default add-variable"><%- _t("Add variable") %></button><button class="plone-btn plone-btn-primary save"><%- _t("Save") %></button></div></div><div class="row clearfix"><div class="form col-md-12"></div></div>'),events:{"click .plone-btn.save":"saveClicked","click .plone-btn.add-variable":"addVariable"},initialize:function(e){t.prototype.initialize.apply(this,[e]),this.loading=this.options.tabView.loading},saveClicked:function(e){e.preventDefault();this.options.tabView.saveData("save-less-variables",{data:JSON.stringify(this.options.data.lessvariables)})},addVariable:function(e){e.preventDefault();this.options.data.lessvariables[n.generateId("new-variable-")]="",this.render()},inputChanged:function(){var t={};this.$(".form-group").each((function(){t[e(this).find(".field-name").val()]=e(this).find(".field-value").val()})),this.options.data.lessvariables=t},afterRender:function(){var e=this,t=e.options.data.lessvariables,n=e.$(".form");i.each(i.keys(t),(function(i){n.append(new s.VariableFieldView({registryData:t,title:i,name:i,value:t[i],onChange:function(){e.inputChanged()}}).render().el)}))}})}.apply(t,n))||(e.exports=s)},210:function(e,t,i){var n,s;n=[i(0),i(2),i(38),i(78),i(36),i(44),i(37)],void 0===(s=function(e,t,i,n,s,o,a){"use strict";return i.extend({tagName:"div",className:"tab-pane overrides",editing:null,canSave:!1,newFile:!1,template:t.template('<div class="buttons-container"><div class="btn-group pull-right"><button class="plone-btn plone-btn-primary add-file"><%- _t("Add file") %></button> </div></div><form class="row"><div class="col-md-12"><p><%- _t("Only ++plone++ resources are available to override") %></p><input class="select" type="hidden" placeholder="<%- _t("Select resource to override...") %>" style="width: 100%" /></div></form><div class="row"><div class="col-md-12 edit-area"><% if(view.editing){ %><p class="resource-name text-primary"><%- view.editing %></p> <div class="plone-btn-group"><button class="plone-btn plone-btn-primary plone-btn-xs" disabled><%- _t("Save") %></button> <button class="plone-btn plone-btn-default plone-btn-xs" disabled><%- _t("Cancel") %></button><button class="plone-btn plone-btn-danger plone-btn-xs"><%- _t("Delete customizations") %></button></div><% } %><div class="editor" /></div></div>'),events:{"click .edit-area button.plone-btn-danger":"itemDeleted","click .edit-area button.plone-btn-primary":"itemSaved","click .edit-area button.plone-btn-default":"itemCancel","click .plone-btn.add-file":"addFile"},initialize:function(e){i.prototype.initialize.apply(this,[e]),this.tabView=e.tabView},serializedModel:function(){return e.extend({},{view:this},this.options)},addFile:function(){var e=window.prompt("Enter full path and filename","++plone++static/"+a("you-filename.js"));-1===e.indexOf("++plone++static/")?window.alert(a("Filename must start with ++plone++static/")):(-1===this.options.data.overrides.indexOf(e)&&this.options.data.overrides.push(e),this.newFile=!0,this.editing=e,this.render())},itemSaved:function(e){e.preventDefault();var t=this;t.tabView.saveData("save-file",{filepath:t.editing,data:t.editor.editor.getValue()},(function(){t.$el.find(".plone-btn-primary,.plone-btn-default").prop("disabled",!0)}))},itemDeleted:function(e){e.preventDefault();var t=this;window.confirm("Are you sure you want to delete this override?")&&(t.options.data.overrides.splice(t.options.data.overrides.indexOf(t.editing),1),t.tabView.saveData("delete-file",{filepath:t.editing},(function(){t.editing=null,t.render()})))},itemCancel:function(e){e.preventDefault(),this.editing=null,this.render()},customizeResource:function(e){-1===this.options.data.overrides.indexOf(e)&&this.options.data.overrides.push(e),this.editing=e,this.render()},afterRender:function(){var i=this,n=i.$el.find(".select"),r=t.map(i.options.data.overrides,(function(e){return{id:e,text:e,override:!0}})),l=t.flatten(t.map(i.options.data.resources,(function(e){var t=e.url||"";t&&(t+="/");var i,n=[];if(e.js&&e.js&&-1!==e.js.indexOf("++plone++")&&(i=t+e.js,-1===r.indexOf(i)&&n.push({id:i,text:i})),e.css)for(var s=0;s<e.css.length;s+=1)i=t+e.css[s],-1===r.indexOf(i)&&-1!==i.indexOf("++plone++")&&n.push({id:i,text:i});return n}))),d=function(e){return e.override?'<span class="customized">'+e.text+" - "+a("customized")+"</span>":e.text};if(i.select2=new o(n,{data:r.concat(t.sortBy(l,(function(e){return e.id}))),formatResult:d,formatSelection:d}),n.on("change",(function(){i.customizeResource(n.select2("val"))})),i.$editorContainer=i.$(".editor"),null!==i.editing){var c=i.options.data.baseUrl;"/"!==c[c.length-1]&&(c+="/"),i.newFile?(i.showEditor(""),i.newFile=!1):(i.tabView.loading.show(),e.ajax({url:c+i.editing+"?"+s.generateId(),dataType:"text"}).done((function(e){i.showEditor(e)})).fail((function(){window.alert(a("error loading resource for editing")),i.tabView.loading.hide()})))}},showEditor:function(t){var i=this,s=e('<pre class="pat-texteditor" />');s.text(t),i.$editorContainer.empty().append(s),i.editor=new n(s,{width:e(".editor").width(),height:500}),i.editor.setSyntax(i.editing),i.tabView.loading.hide(),i.editor.editor.on("change",(function(){i.$el.find(".plone-btn-primary,.plone-btn-default").prop("disabled",!1)}))}})}.apply(t,n))||(e.exports=s)},213:function(e,t,i){var n,s;n=[i(0),i(2),i(38),i(36),i(77),i(214),i(37)],void 0===(s=function(e,t,i,n,s,o,a){"use strict";var r=i.extend({tagName:"div",className:"resource-entry",template:t.template('<h3><%- name %></h3><div class="panel-body form-horizontal"></div>'),serializedModel:function(){return e.extend({},{name:this.name},this.options)},afterRender:function(){var i=this,n=i.$(".panel-body");i.$el.addClass(i.name+"-resource-entry"),t.each(i.fields,(function(t){var o=e.extend({},t,{value:i.options.data[t.name],registryData:i.options.data,containerData:i.options.containerData,resourceName:i.options.name,registryView:i.options.registryView,parent:i.options.parent,form:i});o.value||(o.value="");var a=t.view;a||(a=s.ResourceInputFieldView),n.append(new a(o).render().el)}))}}),l=r.extend({fields:[{name:"name",title:a("Name"),view:s.ResourceNameFieldView},{name:"url",title:a("URL"),description:a("Resources base URL")},{name:"js",title:a("JS"),description:a("Main JavaScript file")},{name:"css",title:a("CSS/LESS"),description:a("List of CSS/LESS files to use for resource"),view:s.ResourceSortableListFieldView},{name:"init",title:a("Init"),description:a("Init instruction for requirejs shim")},{name:"deps",title:a("Dependencies"),description:a("Comma-separated values of resources for requirejs shim")},{name:"export",title:a("Export"),description:a("Export vars for requirejs shim")},{name:"conf",title:a("Configuration"),description:a("Configuration in JSON for the widget"),view:s.ResourceTextAreaFieldView}]}),d=r.extend({fields:[{name:"name",title:a("Name"),view:s.ResourceNameFieldView},{name:"resources",title:a("Resources"),description:a("A main resource file to bootstrap bundle or a list of resources to load."),view:s.BundleResourcesFieldView},{name:"depends",title:a("Depends"),description:a("Bundle this depends on"),view:s.BundleDependsFieldView},{name:"expression",title:a("Expression"),description:a("Conditional expression to decide if this resource will run")},{name:"enabled",title:a("Enabled"),view:s.ResourceBoolFieldView},{name:"conditionalcomment",title:a("Conditional comment"),description:a("Internet Explorer conditional comment")},{name:"load_async",title:a("Load JavaScript asynchronously?"),view:s.ResourceBoolFieldView},{name:"load_defer",title:a("Load JavaScript deferred?"),view:s.ResourceBoolFieldView},{name:"compile",title:a("Does your bundle contain any RequireJS or LESS files?"),view:s.ResourceBoolFieldView},{name:"merge_with",title:a("Merge with"),description:a("In production, the bundle is merged together with others. Select which one here."),view:s.MergeWithFieldView},{name:"last_compilation",title:a("Last compilation"),description:a("Date/Time when your bundle was last compiled. Empty, if it was never compiled.")},{name:"jscompilation",title:a("Compiled JavaScript"),description:a("Automatically generated path to the compiled JavaScript.")},{name:"csscompilation",title:a("Compiled CSS"),description:a("Automatically generated path to the compiled CSS.")},{name:"stub_js_modules",title:a("Stub JS Modules"),description:a("Define list of modules that will be not be defined empty on RequireJS build steps to prevent loading modules multiple times."),view:s.ResourceSortableListFieldView}]}),c=i.extend({tagName:"li",type:"resource",className:"list-group-item",template:t.template('<a href="#"><%- name %></a> <button class="pull-right plone-btn plone-btn-danger delete plone-btn-xs"><%- _t("Delete") %></button>'),events:{"click a":"editResource","click button.delete":"deleteClicked"},defaults:{develop_javascript:!1,develop_css:!1,compile:!0},afterRender:function(){this.$el.attr("data-name",this.options.name),this.$el.addClass(this.type+"-list-item-"+this.options.name)},serializedModel:function(){return e.extend({},this.defaults,{name:this.options.name,view:this.options.registryView},this.options.data)},editResource:function(t){t&&t.preventDefault();var i=e.extend({},this.options,{containerData:this.options.registryView.options.data.resources,parent:this}),n=new l(i);this.registryView.showResourceEditor(n,this,"resource"),e("html, body").animate({scrollTop:n.$el.offset().top},1e3)},deleteClicked:function(e){e.preventDefault(),window.confirm(a("Are you sure you want to delete the ${name} resource?",{name:this.options.name}))&&(delete this.options.registryView.options.data.resources[this.options.name],this.options.registryView.dirty=!0,this.options.registryView.activeResource&&this.options.registryView.activeResource.resource.name===this.options.name&&(this.options.registryView.activeResource=null),this.options.registryView.render())}}),u=c.extend({type:"bundle",active:!1,template:t.template('<a href="#"><%- name %></a> <div class="actions"><div class="plone-btn-group"><% if(view.options.data.development) { %><% if(develop_javascript){ %><button class="plone-btn plone-btn-warning on develop-js plone-btn-xs"><%- _t("Stop Developing JavaScript") %></button><% } else { %><button class="plone-btn plone-btn-default develop-js plone-btn-xs"><%- _t("Develop JavaScript") %></button><% } %><% if(develop_css){ %><button class="plone-btn plone-btn-warning on develop-css plone-btn-xs"><%- _t("Stop Developing CSS") %></button><% } else { %><button class="plone-btn plone-btn-default develop-css plone-btn-xs"><%- _t("Develop CSS") %></button><% } %><% } %><% if(compile){ %><button class="plone-btn plone-btn-default build plone-btn-xs"><%- _t("Build") %></button><% } %><button class="plone-btn plone-btn-danger delete plone-btn-xs"><%- _t("Delete") %></button></div></div>'),events:e.extend({},c.prototype.events,{"click button.build":"buildClicked","click button.develop-js":"developJavaScriptClicked","click button.develop-css":"developCSSClicked"}),developJavaScriptClicked:function(e){e.preventDefault(),this.options.data.develop_javascript=!this.options.data.develop_javascript,this.options.registryView.dirty=!0,this.options.registryView.render(),this.render()},developCSSClicked:function(e){e.preventDefault(),this.options.data.develop_css=!this.options.data.develop_css,this.options.registryView.dirty=!0,this.options.registryView.render(),this.render()},afterRender:function(){c.prototype.afterRender.apply(this),this.active&&this.editResource()},editResource:function(i){i&&i.preventDefault();var n=e.extend({},this.options,{containerData:this.options.registryView.options.data.bundles}),s=new d(n);this.registryView.showResourceEditor(s,this,"bundle"),t.each(this.options.registryView.items.bundles,(function(e){e.active=!1})),this.active=!0,this.$el.parent().find(".list-group-item").removeClass("active"),this.$el.addClass("active")},deleteClicked:function(e){e.preventDefault(),window.confirm(a("Are you sure you want to delete the ${name} bundle?",{name:this.options.name}))&&(delete this.options.registryView.options.data.bundles[this.options.name],this.options.registryView.dirty=!0,this.options.registryView.activeResource&&this.options.registryView.activeResource.resource.name===this.options.name&&(this.options.registryView.activeResource=null),this.options.registryView.render())},buildClicked:function(e){e.preventDefault();this.options.registryView.dirty?window.alert(a("You have unsaved changes. Save or discard before building.")):new o(this.options.name,this).run()}}),p=i.extend({tagName:"div",className:"tab-pane",$form:null,activeResource:null,initialize:function(e){i.prototype.initialize.apply(this,[e]),this.previousData=this._copyData()},showResourceEditor:function(e,t,i){this.activeResource={resource:e,item:t,type:i},this.$form.empty().append(e.render().el)},_copyData:function(){return e.extend(!0,{},this.options.data)},_revertData:function(t){this.options.data=e.extend(!0,{},t)},revertChanges:function(e){e&&e.preventDefault(),window.confirm(a("Are you sure you want to cancel? You will lose all changes."))&&(this._revertData(this.previousData),this.activeResource=null,this.render())},afterRender:function(){this.$form=this.$(".form"),this.loading=this.options.tabView.loading}});return p.extend({template:t.template('<div class="row buttons-container"><div class="plone-btn-group pull-right"><button class="plone-btn plone-btn-primary save"><%- _t("Save") %></button><button class="plone-btn plone-btn-default cancel"><%- _t("Cancel") %></button></div><div class="plone-btn-group pull-right"><button class="plone-btn plone-btn-default add-bundle"><%- _t("Add bundle") %></button><button class="plone-btn plone-btn-default add-resource"><%- _t("Add resource") %></button></div></div><div class="row"><div class="checkbox development-mode"><label><input type="checkbox" <% if(data.development){ %> checked="checked" <% } %> > <%- _t("Development Mode(only logged in users)") %></label></div></div><div class="row"><div class="items col-md-5"><ul class="bundles list-group"><li class="list-group-item list-group-item-warning"><%- _t("Bundles") %></li></ul><ul class="resources-header list-group"><li class="list-group-item list-group-item-warning"><%- _t("Resources") %> <input class="float-right form-control input-xs" placeholder="<%- _t("Filter...") %>" /></li></ul><ul class="resources list-group"></ul></div><div class="form col-md-7"></div></div>'),events:{"click button.save":"saveClicked","click button.add-resource":"addResourceClicked","click button.add-bundle":"addBundleClicked","click button.cancel":"revertChanges","keyup .resources-header input":"filterResources","change .development-mode input":"developmentModeChanged"},filterTimeout:0,dirty:!1,initialize:function(t){var i=this;p.prototype.initialize.apply(i,[t]),e(document).on("resource-data-changed",(function(){i.dirty=!0,i.showHideButtons()}))},showHideButtons:function(){var e=!0;this.dirty&&(e=!1),this.$("button.save").prop("disabled",e),this.$("button.cancel").prop("disabled",e)},filterResources:function(){var t=this;t.filterTimeout&&clearTimeout(t.filterTimeout),t.filterTimeout=setTimeout((function(){var i=t.$(".resources-header input").val().toLowerCase(),n=t.$(".resources .list-group-item");!i||i.length<3?n.removeClass("hidden"):n.each((function(){var t=e(this);-1!==t.find("a").html().toLowerCase().indexOf(i)?t.removeClass("hidden"):t.addClass("hidden")}))}),200)},_copyData:function(){return e.extend(!0,{},{bundles:this.options.data.bundles,resources:this.options.data.resources})},_revertData:function(t){this.options.data.bundles=e.extend(!0,{},t.bundles),this.options.data.resources=e.extend(!0,{},t.resources),this.dirty=!1},afterRender:function(){var e=this;e.showHideButtons(),e.$bundles=e.$("ul.bundles"),e.$resources=e.$("ul.resources");var i=e.options.data,n=t.sortBy(t.keys(i.bundles),(function(e){return e.toLowerCase()}));e.items={bundles:{},resources:{}},t.each(n,(function(t){var n;n=e.activeResource&&"bundle"===e.activeResource.type&&e.activeResource.item.options.name===t?new u({data:e.activeResource.item.data,name:t,registryView:e}):new u({data:i.bundles[t],name:t,registryView:e}),e.items.bundles[t]=n,e.$bundles.append(n.render().el)}));var s=t.sortBy(t.keys(i.resources),(function(e){return e.toLowerCase()}));return t.each(s,(function(t){var n;n=e.activeResource&&"resource"===e.activeResource.type&&e.activeResource.item.options.name===t?new c({data:e.activeResource.item.data,name:t,registryView:e}):new c({data:i.resources[t],name:t,registryView:e}),e.items.resources[t]=n,e.$resources.append(n.render().el)})),p.prototype.afterRender.apply(e),e.activeResource&&e.showResourceEditor(e.activeResource.resource,e.activeResource.item,e.activeResource.type),e},addResourceClicked:function(e){e.preventDefault();var t=n.generateId("new-resource-");this.options.data.resources[t]={enabled:!0},this.dirty=!0,this.render(),this.items.resources[t].editResource()},addBundleClicked:function(e){e.preventDefault();var t=n.generateId("new-bundle-");this.options.data.bundles[t]={enabled:!0},this.dirty=!0,this.render(),this.items.bundles[t].editResource()},saveClicked:function(e){var t=this;e.preventDefault(),t.options.tabView.saveData("save-registry",{resources:JSON.stringify(t.options.data.resources),bundles:JSON.stringify(t.options.data.bundles),development:t.options.data.development?"true":"false"},(function(){t.dirty=!1;var e=t.activeResource;if(t.activeResource=null,t.previousData=t._copyData(),t.render(),e){var i=e.resource.name;t.options.data.resources[i]={enabled:!0},"bundle"===e.type?t.items.bundles[i].editResource():t.items.resources[i].editResource()}}))},developmentModeChanged:function(){this.$(".development-mode input")[0].checked?this.options.data.development=!0:this.options.data.development=!1,this.dirty=!0,this.render()}})}.apply(t,n))||(e.exports=s)},214:function(e,t,i){var n,s;n=[i(0),i(18),i(2),i(36),i(215),i(37)],void 0===(s=function(e,t,i,n,s,o){"use strict";return function(a,r){var l=this;return l.bundleName=a,l.bundleListItem=r,l.rview=r.options.registryView,l.$results=null,l.$btnClose=null,l.rview.loading.show(),l.modal=new t(e("<div/>").appendTo(l.rview.$el),{html:i.template('<div id="content"><h1>Bundle Builder</h1><div class="start-info"><p>You are about to build the <span class="label label-primary"><%= name %></span> pattern. </p><p>This may take some a bit of time so we will try to keep you updated on the progress.</p><p> Press the "Build it" button to proceed.</p></div><ul class="list-group hidden"></ul><button class="plone-btn plone-btn-default cancel hidden cancel-build"><%- _t("Close") %></button><button class="plone-btn plone-btn-primary build"><%- _t("Build it") %></button></div>')(e.extend({_t:o},r.options)),content:null,width:500,buttons:".plone-btn"}),l.modal.on("shown",(function(){var e=l.modal.$modal,t=e.find(".start-info");l.$btnClose=e.find("button.cancel-build");var i=e.find("button.build");i.off("click").on("click",(function(n){n.preventDefault(),t.addClass("hidden"),i.prop("disabled",!0),l.$results=e.find(".list-group").removeClass("hidden"),l.buildJS(),l.rview.loading.show()})),l.$btnClose.off("click").on("click",(function(){l.modal.hide()}))})),l.addResult=function(e,t){t||(t=""),l.$results.append('<li class="list-group-item '+t+'">'+e+"</li>")},l.run=function(){l.modal.show()},l.finished=function(e){var t=o("Finished!");e&&(t=o("Error in build process")),l.addResult(t,"list-group-item-warning"),l.$btnClose.removeClass("hidden"),l.rview.loading.hide()},l.buildJS=function(){l.addResult(o("building javascripts")),e.ajax({url:l.rview.options.data.manageUrl,type:"POST",dataType:"json",data:{action:"js-build-config",bundle:l.bundleName,_authenticator:n.getAuthenticator()},success:function(e){l._buildJSBundle(e)},error:function(){l.addResult(o("Error building resources")),l.finished(!0)}})},l._buildCSSBundle=function(t){var i=new s({name:"lessc",resources:t.less.concat([l.rview.options.data.lessConfigUrl,l.rview.options.data.lessUrl]),configure:function(e){e.window.lessErrorReporting=function(e,t,i){"remove"!==e&&l.addResult(o("less compilation error on file ")+i+": "+t)}}});l.addResult(t.less.length+o(" css files to build"));var a=Boolean(null===l.rview.options.data.lessModifyUrl||void 0===l.rview.options.data.lessModifyUrl),r=function(){for(var s=e('style[type="text/css"][id]',i.document),d=0;d<s.length;d+=1){if("less:error-message"===s.eq(d).attr("id"))return l.addResult(o("Error compiling less")),l.finished(!0)}if(s.length===t.less.length&&!0===a){var c={};s.each((function(){var t=e(this);c["data-"+t.attr("id")]=t.html()})),i.destroy(),e.ajax({url:l.rview.options.data.manageUrl,type:"POST",dataType:"json",data:e.extend(c,{action:"save-less-build",bundle:l.bundleName,_authenticator:n.getAuthenticator()}),success:function(e){l.rview.options.data.overrides.push(e.filepath),l.rview.tabView.overridesView.render(),l.addResult(o("finished saving css bundles")),l.finished()},error:function(){l.addResult(o("Error saving css bundle")),l.finished(!0)}})}else s.length===t.less.length?(s.each((function(){e(this).remove()})),script=document.createElement("script"),script.setAttribute("type","text/javascript"),script.setAttribute("src",l.rview.options.data.lessModifyUrl),head.appendChild(script),a=!0,setTimeout(r,300)):setTimeout(r,300)};r()},l.buildCSSBundle=function(){l.addResult(o("building CSS bundle")),e.ajax({url:l.rview.options.data.manageUrl,type:"POST",dataType:"json",data:{action:"less-build-config",bundle:l.bundleName,_authenticator:n.getAuthenticator()},success:function(e){l._buildCSSBundle(e)},error:function(){l.addResult(o("Error building css bundle")),l.finished(!0)}})},l._buildJSBundle=function(t){if(0===t.include.length)return l.addResult(o("No javascripts to build, skipping")),l.buildCSSBundle();t.out=function(t){e.ajax({url:l.rview.options.data.manageUrl,type:"POST",dataType:"json",data:{action:"save-js-build",bundle:l.bundleName,data:t,_authenticator:n.getAuthenticator()},success:function(e){l.rview.options.data.overrides.push(e.filepath),l.rview.tabView.overridesView.render()},error:function(){l.addResult(o("Error building bundle")),l.finished(!0)}})},new s({name:"rjs",resources:[l.rview.options.data.rjsUrl],onLoad:function(e){e.window.requirejs.optimize(t,(function(t){l.addResult(o("Saved javascript bundle, Build results")+": <pre>"+t+"</pre>"),l.buildCSSBundle(),e.destroy()}))}})},l}}.apply(t,n))||(e.exports=s)},215:function(e,t,i){var n,s;n=[i(0)],void 0===(s=function(e){"use strict";return window.IFrame=function(e){this.init(e)},window.IFrame.prototype={defaults:{doctype:"<!doctype html>",title:"",name:"",resources:[],callback:function(){},configure:function(){},onLoad:function(){}},init:function(t){this.options=e.extend({},this.defaults,t),window.iframe||(window.iframe={}),window.iframe[this.options.name]=this,this.loaded=!1;var i=window.document.createElement("iframe");i.setAttribute("id",this.options.name),i.setAttribute("name",this.options.name),i.setAttribute("style","display:none;"),i.setAttribute("src","javascript:false"),window.document.body.appendChild(i),this.el=i,this.window=i.contentWindow,this.document=this.window.document,this.options.configure(this);for(var n="",s=0;s<this.options.resources.length;s+=1){var o,a=this.options.resources[s];".js"===a.slice(-3)?((o=window.document.createElement("script")).src=a,o.type="text/javascript",o.async=!1):".css"===a.slice(-4)?((o=window.document.createElement("link")).href=a,o.type="text/css",o.rel="stylesheet"):".less"===a.slice(-5)&&((o=window.document.createElement("link")).href=a,o.type="text/css",o.rel="stylesheet/less"),n+="\n"+o.outerHTML}this.document.open(),this.document.write(this.options.doctype+"<html><head><title>"+this.options.title+'</title><meta http-equiv="X-UA-Compatible" content="IE=edge"></head><body onload="parent.window.iframe[\''+this.options.name+"'].load()\">"+n+"</body></html>"),this.document.close()},load:function(){!0!==this.loaded&&(this.loaded=!0,this.options.onLoad(this))},destroy:function(){delete window.iframe[this.options.name],window.document.body.removeChild(this.el)}},window.IFrame}.apply(t,n))||(e.exports=s)},216:function(e,t,i){var n,s;n=[i(0),i(38),i(2),i(36),i(77)],void 0===(s=function(e,t,i,n,s){"use strict";return t.extend({tagName:"div",className:"tab-pane patternoptions",template:i.template('<div class="buttons-container"><div class="btn-group pull-right"><button class="plone-btn plone-btn-default add-pattern"><%- _t("Add pattern") %></button><button class="plone-btn plone-btn-primary save"><%- _t("Save") %></button></div></div><div class="row clearfix"><div class="form col-md-12"></div></div>'),events:{"click .plone-btn.save":"saveClicked","click .plone-btn.add-pattern":"addPattern"},initialize:function(e){t.prototype.initialize.apply(this,[e]),this.loading=this.options.tabView.loading},saveClicked:function(e){e.preventDefault();this.options.tabView.saveData("save-pattern-options",{data:JSON.stringify(this.options.data.patternoptions)})},addPattern:function(e){e.preventDefault();this.options.data.patternoptions[n.generateId("new-pattern-")]="",this.render()},inputChanged:function(){var t={};this.$(".form-group").each((function(){t[e(this).find(".field-name").val()]=e(this).find(".field-value").val()})),this.options.data.patternoptions=t},afterRender:function(){var t=this,n=t.options.data.patternoptions,o=t.$(".form");i.each(i.keys(n),(function(i){o.append(new s.PatternFieldView({registryData:n,title:i,name:i,value:n[i],onChange:function(i,n){try{e.parseJSON(n.$el.find(".field-value").val()),n.$el.removeClass("has-error").removeClass("has-feedback"),n.$(".form-control-feedback").addClass("hidden")}catch(e){n.$el.addClass("has-error").addClass("has-feedback"),n.$(".form-control-feedback").removeClass("hidden")}t.inputChanged()}}).render().el)}))}})}.apply(t,n))||(e.exports=s)},77:function(e,t,i){var n,s;n=[i(0),i(2),i(38),i(66),i(44),i(37)],void 0===(s=function(e,t,i,n,s,o){"use strict";var a=i.extend({tagName:"div",className:"form-group",template:t.template('<label class="col-sm-3 control-label"><%- title %></label><div class="col-sm-9"><strong><%- value %></strong><br/><%= description %></div>'),initialize:function(e){for(var i in this.options=e,this.options)this[i]=this.options[i];this.value||(this.template=t.template(""))},serializedModel:function(){},afterRender:function(){this.$el.addClass("field-"+this.options.name)}}),r=i.extend({tagName:"div",className:"form-group",events:{"change input":"inputChanged","keyup input":"textChanged"},template:t.template('<label class="col-sm-3 control-label"><%- title %></label><div class="col-sm-9"><input class="form-control input-sm" name="name" value="<%- value %>" /><%= description %></div>'),timeout:-1,serializedModel:function(){return e.extend({},{description:""},this.options)},textChanged:function(){var e=this;e.timeout&&clearTimeout(e.timeout),e.timeout=setTimeout((function(){e.inputChanged()}),200)},inputChanged:function(){this.options.registryData[this.options.name]=this.$("input").val(),e(document).trigger("resource-data-changed")},afterRender:function(){this.$el.addClass("field-"+this.options.name)}}),l=r.extend({template:t.template('<div class="col-sm-4"><input class="form-control input-sm field-name" value="<%- name %>" /></div><div class="col-sm-7"><input class="form-control input-sm field-value" value="<%- value %>" /></div><div class="col-sm-1"><button class="plone-btn plone-btn-danger plone-btn-xs">Remove</button></div>'),events:{"change input":"inputChanged","keyup input":"textChanged","click .plone-btn-danger":"removeClicked"},removeClicked:function(e){e.preventDefault(),this.$el.remove(),this.inputChanged()},inputChanged:function(e){this.options.onChange&&this.options.onChange(e,this)}}),d=l.extend({events:{"change input":"inputChanged","keyup input":"textChanged","change textarea":"inputChanged","keyup textarea":"textChanged","click .plone-btn-danger":"removeClicked"},template:t.template('<div class="col-sm-4"><input class="form-control input-sm field-name" value="<%- name %>" /></div><div class="col-sm-7"><textarea class="form-control field-value"><%- value %></textarea><span class="hidden glyphicon glyphicon-remove form-control-feedback"></span></div><div class="col-sm-1"><button class="plone-btn plone-btn-danger plone-btn-xs"><%- _t("Remove") %></button></div>')}),c=r.extend({className:"col-sm-offset-3 col-sm-9",template:t.template('<div class="checkbox"><label><input type="checkbox"> <%- title %></label></div>'),inputChanged:function(){this.$("input")[0].checked?this.options.registryData[this.options.name]=!0:this.options.registryData[this.options.name]=!1,e(document).trigger("resource-data-changed")},afterRender:function(){r.prototype.afterRender.apply(this),this.options.value&&(this.$("input")[0].checked=!0)}}),u=r.extend({sortable:!1,template:t.template('<label class="col-sm-3 control-label"><%- title %></label><ul class="col-sm-9 fields list-group" /><button class="plone-btn plone-btn-default add pull-right"><%- _t("Add") %></button>'),events:{"click button.add":"addRowClicked","change input":"inputChanged","keyup input":"textChanged","click button.remove":"removeItem"},initialize:function(e){r.prototype.initialize.apply(this,[e]),this.options.value||(this.options.value=[])},inputChanged:function(){var t=[];this.$("input").each((function(){t.push(e(this).val())})),this.options.registryData[this.options.name]=this.options.value=t,e(document).trigger("resource-data-changed")},addRowClicked:function(e){e.preventDefault(),this.options.value.push(""),this.render(),this.inputChanged()},removeItem:function(t){t.preventDefault();var i=e(t.target).parents("li"),n=i.index();this.options.value.splice(n,1),i.remove(),this.inputChanged()},afterRender:function(){r.prototype.afterRender.apply(this);var e=this,i=e.$(".fields");t.each(e.options.value,(function(e){i.append('<li class="list-group-item"><div class="input-group"><input class="form-control input-sm" value="'+e+'" /><span class="input-group-btn"><button class="plone-btn plone-btn-default remove plone-btn-sm">'+o("Remove")+"</button></div></li>")})),e.sortable&&(i.addClass("pat-sortable"),e.dd=new n(i,{selector:"li",dragClass:"dragging",drop:function(t,i){0!==i&&e.inputChanged()}}))}}).extend({sortable:!0}),p=r.extend({inputChanged:function(){this.options.registryData[this.options.name]=this.options.value=this.$("textarea").val()},template:t.template('<label class="col-sm-3 control-label"><%- title %></label><div class="col-sm-9"><textarea class="form-control input-sm" name="name"><%- value %></textarea></div>')}),h=r.extend({events:{"change select":"inputChanged"},inputChanged:function(){this.options.registryData[this.options.name]=this.options.value=this.$(".select").select2("val"),e(document).trigger("resource-data-changed")},getSelectOptions:function(){return[]},serializedModel:function(){return e.extend({},{options:this.getSelectOptions(),description:""},this.options)},afterRender:function(){r.prototype.afterRender.apply(this);var e=this,i=e.options.value,n=e.$(".select");e.select2=new s(n,{orderable:e.multiple,multiple:e.multiple,data:t.map(e.getSelectOptions(),(function(e){return{id:e,text:e}}))}),n.select2("val",i),n.on("change",(function(){e.inputChanged()}))},template:t.template('<label class="col-sm-3 control-label"><%- title %></label><div class="col-sm-9"><input name="name" class="select" type="hidden" style="width: 100%" /><%= description %></div>')}),v=h.extend({getSelectOptions:function(){var e=this;return["","*"].concat(t.filter(t.keys(e.options.containerData),(function(t){return t!==e.options.name})))}}),m=h.extend({multiple:!0,getSelectOptions:function(){var e=this;return t.sortBy(t.filter(t.keys(e.options.registryView.options.data.resources),(function(t){return t!==e.options.name})),(function(e){return e.toLowerCase()}))}}),f=r.extend({afterRender:function(){r.prototype.afterRender.apply(this),this.$el.append('<span class="hidden glyphicon glyphicon-remove form-control-feedback"></span>')},handleError:function(e){e?(this.$el.addClass("has-error").addClass("has-feedback"),this.$(".form-control-feedback").removeClass("hidden")):(this.$el.removeClass("has-error").removeClass("has-feedback"),this.$(".form-control-feedback").addClass("hidden"))},inputChanged:function(){e(document).trigger("resource-data-changed");var t=this.$("input").val();if(t===this.resourceName)return this.handleError(!1);if(this.options.containerData[t]||!t)return this.handleError(!0);var i=this.options.containerData[this.resourceName];return this.options.containerData[t]=i,this.resourceName!==t&&delete this.options.containerData[this.resourceName],this.resourceName=this.options.value=this.options.form.options.name=this.options.form.name=t,this.options.parent&&(this.options.parent.options.name=t,this.options.parent.render()),this.options.form&&this.options.form.$("h3").html(t),this.handleError(!1)},serializedModel:function(){var t=e.extend({},{description:""},this.options);return t.value=this.options.resourceName,t}}),b=h.extend({multiple:!1,getSelectOptions:function(){return["","default","logged-in"]}});return{ResourceDisplayFieldView:a,VariableFieldView:l,ResourceInputFieldView:r,ResourceNameFieldView:f,ResourceSortableListFieldView:u,ResourceTextAreaFieldView:p,BundleResourcesFieldView:m,BundleDependsFieldView:v,ResourceBoolFieldView:c,PatternFieldView:d,MergeWithFieldView:b}}.apply(t,n))||(e.exports=s)},78:function(e,t,i){var n,s;i(56),i(96),i(98),i(99),i(101),i(57),i(102),i(103),i(57),i(104),i(105);n=[i(0),i(35),i(36),i(56)],void 0===(s=function(e,t,i){"use strict";return t.extend({name:"texteditor",trigger:".pat-texteditor",parser:"mockup",defaults:{theme:null,mode:"text",width:500,height:200,tabSize:4,softTabs:!0,wrapMode:!1,showGutter:!0,showPrintMargin:!1,readOnly:!1},init:function(){var t=this;if(window.ace){var n=window.ace;n.config.set("packaged",!0),n.config.set("basePath","++plone++static/components/ace-builds/src/");var s=i.setId(t.$el);t.$wrapper=e('<div class="editorWrapper" />').css({height:parseInt(t.options.height)+25,width:t.options.width,position:"relative"}),t.$el.parent().hasClass("editorWrapper")||t.$el.wrap(t.$wrapper),t.$el.css({width:t.options.width,height:t.options.height,position:"absolute"}),t.editor=n.edit(s),t.options.theme&&t.setTheme(t.options.theme),t.editor.getSession().setMode("ace/mode/"+t.options.mode),t.editor.getSession().setTabSize(parseInt(t.options.tabSize,10)),t.editor.getSession().setUseSoftTabs(i.bool(t.options.softTabs)),t.editor.getSession().setUseWrapMode(i.bool(t.options.wrapMode)),t.editor.renderer.setShowGutter(i.bool(t.options.showGutter)),t.editor.setShowPrintMargin(i.bool(t.options.showPrintMargin)),t.editor.setReadOnly(i.bool(t.options.readOnly))}else setTimeout((function(){t.init()}),200)},setSyntax:function(e){var t={js:"javascript",txt:"text",css:"css",html:"html",xml:"xml",less:"less",py:"python",pt:"xml",cfg:"ini"}[e.substr(e.lastIndexOf(".")+1)];if(void 0!==t)return this.editor.getSession().setMode("ace/mode/"+t),!0},setTheme:function(e){this.editor.setTheme("ace/theme/"+e)},setText:function(e){this.editor&&this.editor.setValue(e)}})}.apply(t,n))||(e.exports=s)}}]);