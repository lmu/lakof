/*! For license information please see 2.bundle.0a753c7.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{125:function(t,e,o){var a,n;a=[o(1),o(40)],void 0===(n=function(t,e){"use strict";var o=function(t){return t.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")};return new(e.Router.extend({actions:[],redirects:{},addRoute:function(e,a,n,i,r,s){void 0===t.findWhere(this.patterns,{patternName:e,id:a})&&this.actions.push({patternName:e,id:a,callback:n,context:i,pathExp:r,expReplace:s});var l=new RegExp("("+o(e)+":"+o(a)+")");this.route(l,"handleRoute")},addRedirect:function(t,e){this.redirects[t]=e},handleRoute:function(e){var o=e.split(":"),a=o[0],n=o[1],i=t.findWhere(this.actions,{patternName:a,id:n});i&&i.callback.call(i.context)},redirect:function(){var e,o,a,n=window.parent.location.pathname;if(t.some(this.actions,(function(t){if(t.pathExp&&(o=new RegExp(t.pathExp),n.match(o))){a="!/"+t.patternName+":"+t.id;var i="";return t.expReplace&&(i=t.expReplace),e=n.replace(o,i),!0}}),this),void 0===a)for(var i in this.redirects)if(o=new RegExp(i),n.match(o)){a="!/"+this.redirects[i],e=n.replace(o,"");break}void 0!==a&&this._changeLocation.apply(this,[e,a])},_changeLocation:function(t,e){window.parent.location.hash=e,window.parent.location.pathname=t},start:function(){e.history.start()},reset:function(){this.actions=[]}}))}.apply(e,a))||(t.exports=n)},18:function(t,e,o){var a,n;a=[o(0),o(1),o(35),o(50),o(2),o(125),o(36),o(37),o(85)],void 0===(n=function(t,e,o,a,n,i,r,s){"use strict";return o.extend({name:"plone-modal",trigger:".pat-plone-modal",parser:"mockup",createModal:null,$model:null,defaults:{width:"",height:"",margin:20,position:"center middle",triggers:[],zIndexSelector:".plone-modal-wrapper,.plone-modal-backdrop",backdrop:"body",backdropOptions:{zIndex:"1040",opacity:"0.85",className:"plone-modal-backdrop",classActiveName:"plone-backdrop-active",closeOnEsc:!0,closeOnClick:!0},title:null,titleSelector:"h1:first",buttons:'.formControls > input[type="submit"]',content:"#content",automaticallyAddButtonActions:!0,loadLinksWithinModal:!0,prependContent:".portalMessage",templateOptions:{className:"plone-modal fade",classDialog:"plone-modal-dialog",classModal:"plone-modal-content",classHeaderName:"plone-modal-header",classBodyName:"plone-modal-body",classFooterName:"plone-modal-footer",classWrapperName:"plone-modal-wrapper",classWrapperInnerName:"modal-wrapper-inner",classActiveName:"in",classPrependName:"",classContentName:"",template:'<div class="<%= options.className %>">  <div class="<%= options.classDialog %>">    <div class="<%= options.classModal %>">      <div class="<%= options.classHeaderName %>">        <a class="plone-modal-close">&times;</a>        <% if (title) { %><h2 class="plone-modal-title"><%= title %></h2><% } %>      </div>      <div class="<%= options.classBodyName %>">        <div class="<%= options.classPrependName %>"><%= prepend %></div>         <div class="<%= options.classContentName %>"><%= content %></div>      </div>      <div class="<%= options.classFooterName %>">         <% if (buttons) { %><%= buttons %><% } %>      </div>    </div>  </div></div>'},actions:{},actionOptions:{eventType:"click",disableAjaxFormSubmit:!1,target:null,ajaxUrl:null,modalFunction:null,isForm:!1,timeout:5e3,displayInModal:!0,reloadWindowOnClose:!0,error:".portalMessage.error",formFieldError:".field.error",onSuccess:null,onError:null,onFormError:null,onTimeout:null,redirectOnResponse:!1,redirectToUrl:function(t,e,o){var a;return(a=/<body.*data-view-url=[\"'](.*)[\"'].*/im.exec(e))&&a.length>1?a[1].split('"')[0]:(a=/<body.*data-base-url=[\"'](.*)[\"'].*/im.exec(e))&&a.length>1?a[1].split('"')[0]:(a=/<base.*href=[\"'](.*)[\"'].*/im.exec(e))&&a.length>1?a[1]:""}},routerOptions:{id:null,pathExp:null},form:function(o){var a=this,n=a.$modal;a.options.automaticallyAddButtonActions&&(o[a.options.buttons]={}),o.a={},t.each(o,(function(o,i){var r=e.union(e.keys(a.options.actionOptions),["templateOptions"]),s=t.extend(!0,{},a.options.actionOptions,e.pick(i,r));i.templateOptions=t.extend(!0,i.templateOptions,a.options.templateOptions);var l=e.union(e.keys(a.options.actionOptions),["actions","actionOptions"]),c=t.extend(!0,e.omit(i,l),a.options);t(o,t("."+i.templateOptions.classBodyName,n)).each((function(e){var o=t(this);o.on(s.eventType,(function(e){e.stopPropagation(),e.preventDefault(),a.loading.show(!1),null!==s.modalFunction?a[s.modalFunction]():t.nodeName(o[0],"input")||t.nodeName(o[0],"button")||!0===i.isForm?a.options.handleFormAction.apply(a,[o,s,c]):(null!==i.ajaxUrl||t.nodeName(o[0],"a"))&&a.options.handleLinkAction.apply(a,[o,s,c])}))}))}))},handleFormAction:function(e,o,a){var n,i,r=this,s={};if(s[e.attr("name")]=e.attr("value"),n=t.nodeName(e[0],"form")?e:e.parents("form:not(.disableAutoSubmit)"),i=null!==o.ajaxUrl?"function"==typeof o.ajaxUrl?o.ajaxUrl.apply(r,[e,o]):o.ajaxUrl:e.parents("form").attr("action"),o.disableAjaxFormSubmit)return e.attr("name")&&e.attr("value")&&n.append(t('<input type="hidden" name="'+e.attr("name")+'" value="'+e.attr("value")+'" />')),void n.trigger("submit");n.on("submit",(function(t){t.preventDefault()})),n.trigger("submit"),r.loading.show(!1),n.ajaxSubmit({timeout:o.timeout,data:s,url:i,error:function(t,e,a){r.loading.hide(),"timeout"===e&&o.onTimeout?o.onTimeout.apply(r,t,a):o.onError?o.onError(t,e,a):console.log("error happened do something"),r.emit("formActionError",[t,e,a])},success:function(n,i,s,l){r.loading.hide(),0===t(o.error,n).size()&&0===t(o.formFieldError,n).size()?!0!==o.redirectOnResponse?(o.onSuccess&&o.onSuccess(r,n,i,s,l),!0===o.displayInModal?r.redraw(n,a):(e.trigger("destroy.plone-modal.patterns"),o.reloadWindowOnClose&&r.reloadWindow()),r.emit("formActionSuccess",[n,i,s,l])):"function"==typeof o.redirectToUrl?window.parent.location.href=o.redirectToUrl.apply(r,[e,n,o]):window.parent.location.href=o.redirectToUrl:o.onFormError?o.onFormError(r,n,i,s,l):r.redraw(n,a)}})},handleLinkAction:function(e,o,a){var n,i=this;n=o.ajaxUrl?"function"==typeof o.ajaxUrl?o.ajaxUrl.apply(i,[e,o]):o.ajaxUrl:e.attr("href"),!1!==o.displayInModal?t.ajax({url:n}).fail((function(t,e,a){"timeout"===e&&o.onTimeout?o.onTimeout(i.$modal,t,a):o.onError?o.onError(t,e,a):window.alert(s("There was an error loading modal.")),i.emit("linkActionError",[t,e,a])})).done((function(t,e,n){i.redraw(t,a),o.onSuccess&&o.onSuccess(i,t,e,n),i.emit("linkActionSuccess",[t,e,n])})).always((function(){i.loading.hide()})):"_blank"===e.attr("target")?(window.open(n,"_blank"),i.loading.hide()):window.location=n},render:function(o){var a=this;if(a.emit("before-render"),a.$raw){var n=a.$raw.clone();t("input:checked",n).each((function(){this.setAttribute&&this.setAttribute("checked","checked")}));var i={title:"",prepend:"<div />",content:"",buttons:'<div class="pattern-modal-buttons"></div>',options:o.templateOptions};if(null===o.title){var r=t(o.titleSelector,n);i.title=r.html(),t(o.titleSelector,n).remove()}else i.title=o.title;o.prependContent&&(i.prepend=t("<div />").append(t(o.prependContent,n).clone()).html(),t(o.prependContent,n).remove()),o.content?i.content=t(o.content,n).html():i.content=n.html(),a.$modal=t(e.template(a.options.templateOptions.template)(i)),a.$modalDialog=t("> ."+a.options.templateOptions.classDialog,a.$modal),a.$modalContent=t("> ."+a.options.templateOptions.classModal,a.$modalDialog),t("form",a.$modal).on("keydown",(function(e){13===e.keyCode&&"TEXTAREA"!==e.target.nodeName&&(e.preventDefault(),t("input[type=submit], button[type=submit], button:not(type)",this).eq(0).trigger("click"))})),t(o.buttons,a.$modal).each((function(){var e=t(this);e.on("click",(function(t){t.stopPropagation(),t.preventDefault()})).clone().appendTo(t(".pattern-modal-buttons",a.$modal)).off("click").on("click",(function(t){t.stopPropagation(),t.preventDefault(),e.trigger("click")})),e.hide()})),a.emit("before-events-setup"),t(".plone-modal-header > a.plone-modal-close, .plone-modal-footer > a.plone-modal-close",a.$modal).off("click").on("click",(function(e){e.stopPropagation(),e.preventDefault(),t(e.target).trigger("destroy.plone-modal.patterns")})),o.form&&o.form.apply(a,[o.actions]),a.$modal.addClass(a.options.templateOptions.className).on("destroy.plone-modal.patterns",(function(t){t.stopPropagation(),a.hide()})).on("resize.plone-modal.patterns",(function(t){t.stopPropagation(),t.preventDefault(),a.positionModal()})).appendTo(a.$wrapperInner),a.options.loadLinksWithinModal&&a.$modal.on("click",(function(e){e.stopPropagation(),t.nodeName(e.target,"a")&&e.preventDefault(),a.$modal.trigger("modal-click")})),a.$modal.data("pattern-"+a.name,a),a.emit("after-render")}}},reloadWindow:function(){window.parent.location.reload()},init:function(){var e=this;e.options.loadLinksWithinModal=t.parseJSON(e.options.loadLinksWithinModal),null!==e.options.routerOptions.id&&i.addRoute("modal",e.options.routerOptions.id,(function(){this.show()}),e,e.options.routerOptions.pathExp,e.options.routerOptions.expReplace),!0===e.options.backdropOptions.closeOnEsc&&t(document).on("keydown",(function(t,o){e.$el.is("."+e.options.templateOptions.classActiveName)&&27===t.keyCode&&e.hide()})),t(window.parent).resize((function(){e.positionModal()})),e.options.triggers&&t.each(e.options.triggers,(function(o,a){var n=a.substring(0,a.indexOf(" ")),i=a.substring(a.indexOf(" "),a.length);t(i||e.$el).on(n,(function(t){t.stopPropagation(),t.preventDefault(),e.show()}))})),e.$el.is("a")&&(e.$el.attr("href")&&!e.options.image&&(e.options.target||"#"!==e.$el.attr("href").substr(0,1)||(e.options.target=e.$el.attr("href"),e.options.content=""),e.options.ajaxUrl||"#"===e.$el.attr("href").substr(0,1)||(e.options.ajaxUrl=function(){return e.$el.attr("href")})),e.$el.on("click",(function(t){t.stopPropagation(),t.preventDefault(),e.show()}))),e.initModal()},createAjaxModal:function(){var e=this;e.emit("before-ajax"),e.loading.show();var o=e.options.ajaxUrl;"function"==typeof o&&(o=o.apply(e,[e.options])),e.ajaxXHR=t.ajax({url:o,type:e.options.ajaxType}).done((function(o,a,n){e.ajaxXHR=void 0,e.$raw=t("<div />").append(t(r.parseBodyTag(o))),e.emit("after-ajax",e,a,n),e._show()})).fail((function(t,o,a){var n=e.options.actionOptions;"timeout"===o&&n.onTimeout?n.onTimeout(e.$modal,t,a):n.onError?n.onError(t,o,a):(window.alert(s("There was an error loading modal.")),e.hide()),e.emit("linkActionError",[t,o,a])})).always((function(){e.loading.hide()}))},createTargetModal:function(){this.$raw=t(this.options.target).clone(),this._show()},createBasicModal:function(){this.$raw=t("<div/>").html(this.$el.clone()),this._show()},createHtmlModal:function(){var e=t(this.options.html);this.$raw=e,this._show()},createImageModal:function(){this.$wrapper.addClass("image-modal");var e=this.$el.attr("href"),o=this.$el.attr("data-modal-srcset")||"",a=t.trim(this.$el.context.innerText)||"Image";this.$raw=t("<div><h1>"+a+'</h1><div id="content"><div class="modal-image"><img src="'+e+'" srcset="'+o+'" /></div></div></div>'),this._show()},initModal:function(){this.options.ajaxUrl?this.createModal=this.createAjaxModal:this.options.target?this.createModal=this.createTargetModal:this.options.html?this.createModal=this.createHtmlModal:this.options.image?this.createModal=this.createImageModal:this.createModal=this.createBasicModal},findPosition:function(t,e,o,a,n,i,r){var s,l,c,p,d={};return p=c=s=c="auto","left"===t?(c=o+"px",a>i&&(c="0px"),d.left=c):"right"===t?(p=o+"px",a>i&&(p="0px"),d.right=p,d.left="auto"):(c=i/2-a/2-o+"px",a>i&&(c="0px"),d.left=c),"top"===e?(s=o+"px",n>r&&(s="0px"),d.top=s):"bottom"===e?(l=o+"px",n>r&&(l="0px"),d.bottom=l,d.top="auto"):(s=r/2-n/2-o+"px",n>r&&(s="0px"),d.top=s),d},modalInitialized:function(){return null!==this.$modal&&void 0!==this.$modal},positionModal:function(){if(this.modalInitialized()){this.$modal.removeAttr("style"),this.$wrapper.parent().is("body")&&this.$wrapper.height(t(window.parent).height());var e="function"==typeof this.options.margin?this.options.margin():this.options.margin;this.$modal.css({position:"absolute",padding:e}),this.$modalDialog.css({margin:"0",padding:"0",width:this.options.width,height:this.options.height}),this.$modalContent.css({width:this.options.width});var o=this.options.position.split(" "),a=o[0],n=o[1],i=this.$modalDialog.outerWidth(!0),r=this.$modalDialog.outerHeight(!0),s=this.$wrapperInner.width(),l=this.$wrapperInner.height(),c=this.findPosition(a,n,e,i,r,s,l);for(var p in c)this.$modalDialog.css(p,c[p])}},render:function(t){this.emit("render"),this.options.render.apply(this,[t]),this.emit("rendered")},show:function(){this.backdrop=this.createBackdrop(),this.createModal()},createBackdrop:function(){var e=this,o=new a(e.$el.parents(e.options.backdrop),e.options.backdropOptions),n=1041;return t(e.options.zIndexSelector).each((function(){n=Math.max(n,parseInt(t(this).css("zIndex"))+1||1041)})),e.$wrapper=t("<div/>").hide().css({"z-index":n,"overflow-y":"auto",position:"fixed",height:"100%",width:"100%",bottom:"0",left:"0",right:"0",top:"0"}).addClass(e.options.templateOptions.classWrapperName).insertBefore(o.$backdrop).on("click",(function(t){e.options.backdropOptions.closeOnClick&&(t.stopPropagation(),t.preventDefault(),o.hide())})),o.on("hidden",(function(t){void 0!==e.$modal&&e.$modal.hasClass(e.options.templateOptions.classActiveName)&&e.hide()})),e.loading=new r.Loading({backdrop:o}),e.$wrapperInner=t("<div/>").addClass(e.options.classWrapperInnerName).css({position:"absolute",bottom:"0",left:"0",right:"0",top:"0"}).appendTo(e.$wrapper),o},_show:function(){var e=this;e.render.apply(e,[e.options]),e.emit("show"),e.backdrop.show(),e.$wrapper.show(),e.loading.hide(),e.$el.addClass(e.options.templateOptions.classActiveName),e.$modal.addClass(e.options.templateOptions.classActiveName),n.scan(e.$modal),e.positionModal(),t(window.parent).on("resize.plone-modal.patterns",(function(){e.positionModal()})),t("body").addClass("plone-modal-open"),e.emit("shown")},hide:function(){this.ajaxXHR&&this.ajaxXHR.abort(),this.emit("hide"),this._suppressHide&&!window.confirm(this._suppressHide)||(this.loading.hide(),this.$el.removeClass(this.options.templateOptions.classActiveName),void 0!==this.$modal&&(this.$modal.remove(),this.initModal()),this.$wrapper.remove(),t(".plone-modal",t("body")).size()<1&&(this._suppressHide=void 0,this.backdrop.hide(),t("body").removeClass("plone-modal-open"),t(window.parent).off("resize.plone-modal.patterns")),this.emit("hidden"))},redraw:function(e,o){this.emit("beforeDraw"),this.$modal.remove(),this.$raw=t("<div />").append(t(r.parseBodyTag(e))),this.render.apply(this,[o||this.options]),this.$modal.addClass(this.options.templateOptions.classActiveName),this.positionModal(),n.scan(this.$modal),this.emit("afterDraw")}})}.apply(e,a))||(t.exports=n)},20:function(t,e,o){var a,n;a=[o(0),o(35)],void 0===(n=function(t,e){"use strict";return e.extend({name:"autotoc",trigger:".pat-autotoc",parser:"mockup",defaults:{section:"section",levels:"h1,h2,h3",IDPrefix:"autotoc-item-",classTOCName:"autotoc-nav",classSectionName:"autotoc-section",classLevelPrefixName:"autotoc-level-",classActiveName:"active",scrollDuration:"slow",scrollEasing:"swing"},init:function(){var e=this;e.$toc=t("<nav/>").addClass(e.options.classTOCName),e.options.prependTo?e.$toc.prependTo(e.options.prependTo):e.options.appendTo?e.$toc.appendTo(e.options.appendTo):e.$toc.prependTo(e.$el),e.options.className&&e.$el.addClass(e.options.className),t(e.options.section,e.$el).addClass(e.options.classSectionName);var o=e.$el.hasClass("autotabs"),a=null;t(e.options.levels,e.$el).each((function(n){var i=t(this),r=i.prop("id")?i.prop("id"):i.parents(e.options.section).prop("id");(!r||t("#"+r).length>0)&&(r=e.options.IDPrefix+e.name+"-"+n),window.location.hash==="#"+r&&(a=r),null===a&&i.hasClass(e.options.classActiveName)&&(a=r),i.data("navref",r),t("<a/>").appendTo(e.$toc).text(i.text()).attr("id",r).attr("href","#"+r).addClass(e.options.classLevelPrefixName+e.getLevel(i)).on("click",(function(a,n){a.stopPropagation(),a.preventDefault(),n||(n={doScroll:!0,skipHash:!1});var r=t(this);e.$toc.children("."+e.options.classActiveName).removeClass(e.options.classActiveName),e.$el.children("."+e.options.classActiveName).removeClass(e.options.classActiveName),t(a.target).addClass(e.options.classActiveName),i.parents(e.options.section).addClass(e.options.classActiveName),!1!==n.doScroll&&e.options.scrollDuration&&i&&!o&&t("body,html").animate({scrollTop:i.offset().top},e.options.scrollDuration,e.options.scrollEasing),0!==e.$el.parents(".plone-modal").size()&&e.$el.trigger("resize.plone-modal.patterns"),t(this).trigger("clicked"),n.skipHash||window.history&&window.history.pushState&&window.history.pushState({},"","#"+r.attr("id"))})),i.data("autotoc-trigger-id",r)})),a?t("a#"+a).trigger("click",{doScroll:!0,skipHash:!0}):e.$toc.find("a").first().trigger("click",{doScroll:!1,skipHash:!0})},getLevel:function(e){var o=0;return t.each(this.options.levels.split(","),(function(t,a){if(1===e.filter(a).size())return o=t+1,!1})),o}})}.apply(e,a))||(t.exports=n)},85:function(t,e,o){var a,n,i;n=[o(0)],void 0===(i="function"==typeof(a=function(t){"use strict";var e=/\r?\n/g,o={};o.fileapi=void 0!==t('<input type="file">').get(0).files,o.formdata=void 0!==window.FormData;var a=!!t.fn.prop;function n(e){var o=e.data;e.isDefaultPrevented()||(e.preventDefault(),t(e.target).closest("form").ajaxSubmit(o))}function i(e){var o=e.target,a=t(o);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;o=n[0]}var i=o.form;if(i.clk=o,"image"===o.type)if(void 0!==e.offsetX)i.clk_x=e.offsetX,i.clk_y=e.offsetY;else if("function"==typeof t.fn.offset){var r=a.offset();i.clk_x=e.pageX-r.left,i.clk_y=e.pageY-r.top}else i.clk_x=e.pageX-o.offsetLeft,i.clk_y=e.pageY-o.offsetTop;setTimeout((function(){i.clk=i.clk_x=i.clk_y=null}),100)}function r(){if(t.fn.ajaxSubmit.debug){var e="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(e):window.opera&&window.opera.postError&&window.opera.postError(e)}}t.fn.attr2=function(){if(!a)return this.attr.apply(this,arguments);var t=this.prop.apply(this,arguments);return t&&t.jquery||"string"==typeof t?t:this.attr.apply(this,arguments)},t.fn.ajaxSubmit=function(e,n,i,s){if(!this.length)return r("ajaxSubmit: skipping submit process - no element selected"),this;var l,c,p,d=this;"function"==typeof e?e={success:e}:"string"==typeof e||!1===e&&arguments.length>0?(e={url:e,data:n,dataType:i},"function"==typeof s&&(e.success=s)):void 0===e&&(e={}),l=e.method||e.type||this.attr2("method"),(p=(p="string"==typeof(c=e.url||this.attr2("action"))?t.trim(c):"")||window.location.href||"")&&(p=(p.match(/^([^#]+)/)||[])[1]),e=t.extend(!0,{url:p,success:t.ajaxSettings.success,type:l||t.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},e);var u={};if(this.trigger("form-pre-serialize",[this,e,u]),u.veto)return r("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(e.beforeSerialize&&!1===e.beforeSerialize(this,e))return r("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var m=e.traditional;void 0===m&&(m=t.ajaxSettings.traditional);var f,h=[],v=this.formToArray(e.semantic,h,e.filtering);if(e.data){var g=t.isFunction(e.data)?e.data(v):e.data;e.extraData=g,f=t.param(g,m)}if(e.beforeSubmit&&!1===e.beforeSubmit(v,this,e))return r("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[v,this,e,u]),u.veto)return r("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var x=t.param(v,m);f&&(x=x?x+"&"+f:f),"GET"===e.type.toUpperCase()?(e.url+=(e.url.indexOf("?")>=0?"&":"?")+x,e.data=null):e.data=x;var b=[];if(e.resetForm&&b.push((function(){d.resetForm()})),e.clearForm&&b.push((function(){d.clearForm(e.includeHidden)})),!e.dataType&&e.target){var y=e.success||function(){};b.push((function(o,a,n){var i=arguments,r=e.replaceTarget?"replaceWith":"html";t(e.target)[r](o).each((function(){y.apply(this,i)}))}))}else e.success&&(t.isArray(e.success)?t.merge(b,e.success):b.push(e.success));if(e.success=function(t,o,a){for(var n=e.context||this,i=0,r=b.length;i<r;i++)b[i].apply(n,[t,o,a||d,d])},e.error){var w=e.error;e.error=function(t,o,a){var n=e.context||this;w.apply(n,[t,o,a,d])}}if(e.complete){var k=e.complete;e.complete=function(t,o){var a=e.context||this;k.apply(a,[t,o,d])}}var T=t("input[type=file]:enabled",this).filter((function(){return""!==t(this).val()})),$=T.length>0,j="multipart/form-data",S=d.attr("enctype")===j||d.attr("encoding")===j,D=o.fileapi&&o.formdata;r("fileAPI :"+D);var A,N=($||S)&&!D;!1!==e.iframe&&(e.iframe||N)?e.closeKeepAlive?t.get(e.closeKeepAlive,(function(){A=E(v)})):A=E(v):A=($||S)&&D?C(v):t.ajax(e),d.removeData("jqxhr").data("jqxhr",A);for(var O=0;O<h.length;O++)h[O]=null;return this.trigger("form-submit-notify",[this,e]),this;function M(o){var a,n,i=t.param(o,e.traditional).split("&"),r=i.length,s=[];for(a=0;a<r;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function C(o){for(var a=new FormData,n=0;n<o.length;n++)a.append(o[n].name,o[n].value);if(e.extraData){var i=M(e.extraData);for(n=0;n<i.length;n++)i[n]&&a.append(i[n][0],i[n][1])}e.data=null;var r=t.extend(!0,{},t.ajaxSettings,e,{contentType:!1,processData:!1,cache:!1,type:l||"POST"});e.uploadProgress&&(r.xhr=function(){var o=t.ajaxSettings.xhr();return o.upload&&o.upload.addEventListener("progress",(function(t){var o=0,a=t.loaded||t.position,n=t.total;t.lengthComputable&&(o=Math.ceil(a/n*100)),e.uploadProgress(t,a,n,o)}),!1),o}),r.data=null;var s=r.beforeSend;return r.beforeSend=function(t,o){e.formData?o.data=e.formData:o.data=a,s&&s.call(this,t,o)},t.ajax(r)}function E(o){var n,i,s,c,p,u,m,f,v,g,x,b,y=d[0],w=t.Deferred();if(w.abort=function(t){f.abort(t)},o)for(i=0;i<h.length;i++)n=t(h[i]),a?n.prop("disabled",!1):n.removeAttr("disabled");(s=t.extend(!0,{},t.ajaxSettings,e)).context=s.context||s,p="jqFormIO"+(new Date).getTime();var k=y.ownerDocument,T=d.closest("body");if(s.iframeTarget?(g=(u=t(s.iframeTarget,k)).attr2("name"))?p=g:u.attr2("name",p):(u=t('<iframe name="'+p+'" src="'+s.iframeSrc+'" />',k)).css({position:"absolute",top:"-1000px",left:"-1000px"}),m=u[0],f={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(e){var o="timeout"===e?"timeout":"aborted";r("aborting upload... "+o),this.aborted=1;try{m.contentWindow.document.execCommand&&m.contentWindow.document.execCommand("Stop")}catch(t){}u.attr("src",s.iframeSrc),f.error=o,s.error&&s.error.call(s.context,f,o,e),c&&t.event.trigger("ajaxError",[f,s,o]),s.complete&&s.complete.call(s.context,f,o)}},(c=s.global)&&0==t.active++&&t.event.trigger("ajaxStart"),c&&t.event.trigger("ajaxSend",[f,s]),s.beforeSend&&!1===s.beforeSend.call(s.context,f,s))return s.global&&t.active--,w.reject(),w;if(f.aborted)return w.reject(),w;function $(t){var e=null;try{t.contentWindow&&(e=t.contentWindow.document)}catch(t){r("cannot get iframe.contentWindow document: "+t)}if(e)return e;try{e=t.contentDocument?t.contentDocument:t.document}catch(o){r("cannot get iframe.contentDocument: "+o),e=t.document}return e}(v=y.clk)&&(g=v.name)&&!v.disabled&&(s.extraData=s.extraData||{},s.extraData[g]=v.value,"image"===v.type&&(s.extraData[g+".x"]=y.clk_x,s.extraData[g+".y"]=y.clk_y));var j=t("meta[name=csrf-token]").attr("content"),S=t("meta[name=csrf-param]").attr("content");function D(){var e=d.attr2("target"),o=d.attr2("action"),a=d.attr("enctype")||d.attr("encoding")||"multipart/form-data";y.setAttribute("target",p),l&&!/post/i.test(l)||y.setAttribute("method","POST"),o!==s.url&&y.setAttribute("action",s.url),s.skipEncodingOverride||l&&!/post/i.test(l)||d.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),s.timeout&&(b=setTimeout((function(){x=!0,C(1)}),s.timeout));var n=[];try{if(s.extraData)for(var i in s.extraData)s.extraData.hasOwnProperty(i)&&(t.isPlainObject(s.extraData[i])&&s.extraData[i].hasOwnProperty("name")&&s.extraData[i].hasOwnProperty("value")?n.push(t('<input type="hidden" name="'+s.extraData[i].name+'">',k).val(s.extraData[i].value).appendTo(y)[0]):n.push(t('<input type="hidden" name="'+i+'">',k).val(s.extraData[i]).appendTo(y)[0]));s.iframeTarget||u.appendTo(T),m.attachEvent?m.attachEvent("onload",C):m.addEventListener("load",C,!1),setTimeout((function t(){try{var e=$(m).readyState;r("state = "+e),e&&"uninitialized"===e.toLowerCase()&&setTimeout(t,50)}catch(t){r("Server abort: ",t," (",t.name,")"),C(2),b&&clearTimeout(b),b=void 0}}),15);try{y.submit()}catch(t){document.createElement("form").submit.apply(y)}}finally{y.setAttribute("action",o),y.setAttribute("enctype",a),e?y.setAttribute("target",e):d.removeAttr("target"),t(n).remove()}}S&&j&&(s.extraData=s.extraData||{},s.extraData[S]=j),s.forceSync?D():setTimeout(D,10);var A,N,O,M=50;function C(e){if(!f.aborted&&!O){if((N=$(m))||(r("cannot access response document"),e=2),1===e&&f)return f.abort("timeout"),void w.reject(f,"timeout");if(2===e&&f)return f.abort("server abort"),void w.reject(f,"error","server abort");if(N&&N.location.href!==s.iframeSrc||x){m.detachEvent?m.detachEvent("onload",C):m.removeEventListener("load",C,!1);var o,a="success";try{if(x)throw"timeout";var n="xml"===s.dataType||N.XMLDocument||t.isXMLDoc(N);if(r("isXml="+n),!n&&window.opera&&(null===N.body||!N.body.innerHTML)&&--M)return r("requeing onLoad callback, DOM not available"),void setTimeout(C,250);var i=N.body?N.body:N.documentElement;f.responseText=i?i.innerHTML:null,f.responseXML=N.XMLDocument?N.XMLDocument:N,n&&(s.dataType="xml"),f.getResponseHeader=function(t){return{"content-type":s.dataType}[t.toLowerCase()]},i&&(f.status=Number(i.getAttribute("status"))||f.status,f.statusText=i.getAttribute("statusText")||f.statusText);var l=(s.dataType||"").toLowerCase(),p=/(json|script|text)/.test(l);if(p||s.textarea){var d=N.getElementsByTagName("textarea")[0];if(d)f.responseText=d.value,f.status=Number(d.getAttribute("status"))||f.status,f.statusText=d.getAttribute("statusText")||f.statusText;else if(p){var h=N.getElementsByTagName("pre")[0],v=N.getElementsByTagName("body")[0];h?f.responseText=h.textContent?h.textContent:h.innerText:v&&(f.responseText=v.textContent?v.textContent:v.innerText)}}else"xml"===l&&!f.responseXML&&f.responseText&&(f.responseXML=E(f.responseText));try{A=L(f,l,s)}catch(t){a="parsererror",f.error=o=t||a}}catch(t){r("error caught: ",t),a="error",f.error=o=t||a}f.aborted&&(r("upload aborted"),a=null),f.status&&(a=f.status>=200&&f.status<300||304===f.status?"success":"error"),"success"===a?(s.success&&s.success.call(s.context,A,"success",f),w.resolve(f.responseText,"success",f),c&&t.event.trigger("ajaxSuccess",[f,s])):a&&(void 0===o&&(o=f.statusText),s.error&&s.error.call(s.context,f,a,o),w.reject(f,"error",o),c&&t.event.trigger("ajaxError",[f,s,o])),c&&t.event.trigger("ajaxComplete",[f,s]),c&&!--t.active&&t.event.trigger("ajaxStop"),s.complete&&s.complete.call(s.context,f,a),O=!0,s.timeout&&clearTimeout(b),setTimeout((function(){s.iframeTarget?u.attr("src",s.iframeSrc):u.remove(),f.responseXML=null}),100)}}}var E=t.parseXML||function(t,e){return window.ActiveXObject?((e=new ActiveXObject("Microsoft.XMLDOM")).async="false",e.loadXML(t)):e=(new DOMParser).parseFromString(t,"text/xml"),e&&e.documentElement&&"parsererror"!==e.documentElement.nodeName?e:null},F=t.parseJSON||function(t){return window.eval("("+t+")")},L=function(e,o,a){var n=e.getResponseHeader("content-type")||"",i=("xml"===o||!o)&&n.indexOf("xml")>=0,r=i?e.responseXML:e.responseText;return i&&"parsererror"===r.documentElement.nodeName&&t.error&&t.error("parsererror"),a&&a.dataFilter&&(r=a.dataFilter(r,o)),"string"==typeof r&&(("json"===o||!o)&&n.indexOf("json")>=0?r=F(r):("script"===o||!o)&&n.indexOf("javascript")>=0&&t.globalEval(r)),r};return w}},t.fn.ajaxForm=function(e,o,a,s){if(("string"==typeof e||!1===e&&arguments.length>0)&&(e={url:e,data:o,dataType:a},"function"==typeof s&&(e.success=s)),(e=e||{}).delegation=e.delegation&&t.isFunction(t.fn.on),!e.delegation&&0===this.length){var l={s:this.selector,c:this.context};return!t.isReady&&l.s?(r("DOM not ready, queuing ajaxForm"),t((function(){t(l.s,l.c).ajaxForm(e)})),this):(r("terminating; zero elements found by selector"+(t.isReady?"":" (DOM not ready)")),this)}return e.delegation?(t(document).off("submit.form-plugin",this.selector,n).off("click.form-plugin",this.selector,i).on("submit.form-plugin",this.selector,e,n).on("click.form-plugin",this.selector,e,i),this):this.ajaxFormUnbind().on("submit.form-plugin",e,n).on("click.form-plugin",e,i)},t.fn.ajaxFormUnbind=function(){return this.off("submit.form-plugin click.form-plugin")},t.fn.formToArray=function(e,a,n){var i=[];if(0===this.length)return i;var r,s,l,c,p,d,u,m,f=this[0],h=this.attr("id"),v=e||void 0===f.elements?f.getElementsByTagName("*"):f.elements;if(v&&(v=t.makeArray(v)),h&&(e||/(Edge|Trident)\//.test(navigator.userAgent))&&(r=t(':input[form="'+h+'"]').get()).length&&(v=(v||[]).concat(r)),!v||!v.length)return i;for(t.isFunction(n)&&(v=t.map(v,n)),s=0,u=v.length;s<u;s++)if((c=(d=v[s]).name)&&!d.disabled)if(e&&f.clk&&"image"===d.type)f.clk===d&&(i.push({name:c,value:t(d).val(),type:d.type}),i.push({name:c+".x",value:f.clk_x},{name:c+".y",value:f.clk_y}));else if((p=t.fieldValue(d,!0))&&p.constructor===Array)for(a&&a.push(d),l=0,m=p.length;l<m;l++)i.push({name:c,value:p[l]});else if(o.fileapi&&"file"===d.type){a&&a.push(d);var g=d.files;if(g.length)for(l=0;l<g.length;l++)i.push({name:c,value:g[l],type:d.type});else i.push({name:c,value:"",type:d.type})}else null!=p&&(a&&a.push(d),i.push({name:c,value:p,type:d.type,required:d.required}));if(!e&&f.clk){var x=t(f.clk),b=x[0];(c=b.name)&&!b.disabled&&"image"===b.type&&(i.push({name:c,value:x.val()}),i.push({name:c+".x",value:f.clk_x},{name:c+".y",value:f.clk_y}))}return i},t.fn.formSerialize=function(e){return t.param(this.formToArray(e))},t.fn.fieldSerialize=function(e){var o=[];return this.each((function(){var a=this.name;if(a){var n=t.fieldValue(this,e);if(n&&n.constructor===Array)for(var i=0,r=n.length;i<r;i++)o.push({name:a,value:n[i]});else null!=n&&o.push({name:this.name,value:n})}})),t.param(o)},t.fn.fieldValue=function(e){for(var o=[],a=0,n=this.length;a<n;a++){var i=this[a],r=t.fieldValue(i,e);null==r||r.constructor===Array&&!r.length||(r.constructor===Array?t.merge(o,r):o.push(r))}return o},t.fieldValue=function(o,a){var n=o.name,i=o.type,r=o.tagName.toLowerCase();if(void 0===a&&(a=!0),a&&(!n||o.disabled||"reset"===i||"button"===i||("checkbox"===i||"radio"===i)&&!o.checked||("submit"===i||"image"===i)&&o.form&&o.form.clk!==o||"select"===r&&-1===o.selectedIndex))return null;if("select"===r){var s=o.selectedIndex;if(s<0)return null;for(var l=[],c=o.options,p="select-one"===i,d=p?s+1:c.length,u=p?s:0;u<d;u++){var m=c[u];if(m.selected&&!m.disabled){var f=m.value;if(f||(f=m.attributes&&m.attributes.value&&!m.attributes.value.specified?m.text:m.value),p)return f;l.push(f)}}return l}return t(o).val().replace(e,"\r\n")},t.fn.clearForm=function(e){return this.each((function(){t("input,select,textarea",this).clearFields(e)}))},t.fn.clearFields=t.fn.clearInputs=function(e){var o=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each((function(){var a=this.type,n=this.tagName.toLowerCase();o.test(a)||"textarea"===n?this.value="":"checkbox"===a||"radio"===a?this.checked=!1:"select"===n?this.selectedIndex=-1:"file"===a?/MSIE/.test(navigator.userAgent)?t(this).replaceWith(t(this).clone(!0)):t(this).val(""):e&&(!0===e&&/hidden/.test(a)||"string"==typeof e&&t(this).is(e))&&(this.value="")}))},t.fn.resetForm=function(){return this.each((function(){var e=t(this),o=this.tagName.toLowerCase();switch(o){case"input":this.checked=this.defaultChecked;case"textarea":return this.value=this.defaultValue,!0;case"option":case"optgroup":var a=e.parents("select");return a.length&&a[0].multiple?"option"===o?this.selected=this.defaultSelected:e.find("option").resetForm():a.resetForm(),!0;case"select":return e.find("option").each((function(t){if(this.selected=this.defaultSelected,this.defaultSelected&&!e[0].multiple)return e[0].selectedIndex=t,!1})),!0;case"label":var n=t(e.attr("for")),i=e.find("input,select,textarea");return n[0]&&i.unshift(n[0]),i.resetForm(),!0;case"form":return("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset(),!0;default:return e.find("form,input,label,select,textarea").resetForm(),!0}}))},t.fn.enable=function(t){return void 0===t&&(t=!0),this.each((function(){this.disabled=!t}))},t.fn.selected=function(e){return void 0===e&&(e=!0),this.each((function(){var o=this.type;if("checkbox"===o||"radio"===o)this.checked=e;else if("option"===this.tagName.toLowerCase()){var a=t(this).parent("select");e&&a[0]&&"select-one"===a[0].type&&a.find("option").selected(!1),this.selected=e}}))},t.fn.ajaxSubmit.debug=!1})?a.apply(e,n):a)||(t.exports=i)}}]);