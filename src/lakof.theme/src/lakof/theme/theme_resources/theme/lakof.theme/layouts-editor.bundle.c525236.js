(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{24:function(t,e,i){var a;window.jQuery&&(a=function(){"use strict";return window.jQuery}.apply(e,[])),Promise.all([i.e(4),i.e(0),i.e(1),i.e(11)]).then((function(){var t=[a,i(37),i(2),i(223)];(function(t,e,i){"use strict";t(document).ready((function(){var a=i.template('<table class="table listing"><thead><th>Title</th><th>Path</th><th>Types</th><th>Actions</th></thead><tbody><% _.each(items, function(item){ %><tr data-layout-key="<%- item.key %>"><td><%- item.title %></td><td><%- item.key %></td><td><%- item._for || "all" %></td><td><% if(item.hidden){ %><a href="#" class="showit">Show</a><% }else{ %><a href="#" class="hideit">Hide</a><% } %></td></tr><% }); %></tbody</table>'),o=function(){var i=window.location.origin+window.location.pathname,n=i+"?list-contentlayouts=true";e.loading.show(),t.ajax({url:n,dataType:"JSON"}).done((function(n){var d=t("#show-hide-editor");0===d.size()&&(d=t('<div id="show-hide-editor" />'),t(".show-hide-layouts").append(d)),d.empty(),d.html(a({items:n})),t(".showit,.hideit",d).click((function(a){e.loading.show(),a.preventDefault(),t.ajax({url:i,data:{action:t(this).hasClass("showit")?"show":"hide",layout:t(this).parents("tr").attr("data-layout-key"),_authenticator:e.getAuthenticator()}}).done((function(){o()}))}))})).always((function(){e.loading.hide()}))};t("#content-core").on("clicked","#autotoc-item-autotoc-2",(function(t){t.preventDefault(),o()}))}))}).apply(null,t)})).catch(i.oe)}}]);