/*! For license information please see collective.tiles.sliders.responsiveslides.vendor.bundle.a03f14f.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{81:function(n,t){!function(n,t,a){n.fn.responsiveSlides=function(e){var s=n.extend({auto:!0,speed:500,timeout:4e3,pager:!1,nav:!1,random:!1,pause:!1,pauseControls:!0,prevText:"Previous",nextText:"Next",maxwidth:"",navContainer:"",manualControls:"",namespace:"rslides",before:n.noop,after:n.noop},e);return this.each((function(){a++;var o,i,r,l,u,c,d=n(this),f=0,p=d.children(),h=p.length,v=parseFloat(s.speed),m=parseFloat(s.timeout),C=parseFloat(s.maxwidth),x=s.namespace,b=x+a,w=x+"_nav "+b+"_nav",y=x+"_here",g=b+"_on",_=b+"_s",I=n("<ul class='"+x+"_tabs "+b+"_tabs' />"),q={float:"left",position:"relative",opacity:1,zIndex:2},k={float:"none",position:"absolute",opacity:0,zIndex:1},z=function(){var n,t=(document.body||document.documentElement).style,a="transition";if("string"==typeof t[a])return!0;for(o=["Moz","Webkit","Khtml","O","ms"],a=a.charAt(0).toUpperCase()+a.substr(1),n=0;n<o.length;n++)if("string"==typeof t[o[n]+a])return!0;return!1}(),T=function(t){s.before(t),z?(p.removeClass(g).css(k).eq(t).addClass(g).css(q),f=t,setTimeout((function(){s.after(t)}),v)):p.stop().fadeOut(v,(function(){n(this).removeClass(g).css(k).css("opacity",1)})).eq(t).fadeIn(v,(function(){n(this).addClass(g).css(q),s.after(t),f=t}))};if(s.random&&(p.sort((function(){return Math.round(Math.random())-.5})),d.empty().append(p)),p.each((function(n){this.id=_+n})),d.addClass(x+" "+b),e&&e.maxwidth&&d.css("max-width",C),p.hide().css(k).eq(0).addClass(g).css(q).show(),z&&p.show().css({"-webkit-transition":"opacity "+v+"ms ease-in-out","-moz-transition":"opacity "+v+"ms ease-in-out","-o-transition":"opacity "+v+"ms ease-in-out",transition:"opacity "+v+"ms ease-in-out"}),p.length>1){if(m<v+100)return;if(s.pager&&!s.manualControls){var F=[];p.each((function(n){var t=n+1;F+="<li><a href='#' class='"+_+t+"'>"+t+"</a></li>"})),I.append(F),e.navContainer?n(s.navContainer).append(I):d.after(I)}if(s.manualControls&&(I=n(s.manualControls)).addClass(x+"_tabs "+b+"_tabs"),(s.pager||s.manualControls)&&I.find("li").each((function(t){n(this).addClass(_+(t+1))})),(s.pager||s.manualControls)&&(c=I.find("a"),i=function(n){c.closest("li").removeClass(y).eq(n).addClass(y)}),s.auto&&(r=function(){u=setInterval((function(){p.stop(!0,!0);var n=f+1<h?f+1:0;(s.pager||s.manualControls)&&i(n),T(n)}),m)})(),l=function(){s.auto&&(clearInterval(u),r())},s.pause&&d.hover((function(){clearInterval(u)}),(function(){l()})),(s.pager||s.manualControls)&&(c.bind("click",(function(t){t.preventDefault(),s.pauseControls||l();var a=c.index(this);f===a||n("."+g).queue("fx").length||(i(a),T(a))})).eq(0).closest("li").addClass(y),s.pauseControls&&c.hover((function(){clearInterval(u)}),(function(){l()}))),s.nav){var M="<a href='#' class='"+w+" prev'>"+s.prevText+"</a><a href='#' class='"+w+" next'>"+s.nextText+"</a>";e.navContainer?n(s.navContainer).append(M):d.after(M);var D=n("."+b+"_nav"),J=D.filter(".prev");D.bind("click",(function(t){t.preventDefault();var a=n("."+g);if(!a.queue("fx").length){var e=p.index(a),o=e-1,r=e+1<h?f+1:0;T(n(this)[0]===J[0]?o:r),(s.pager||s.manualControls)&&i(n(this)[0]===J[0]?o:r),s.pauseControls||l()}})),s.pauseControls&&D.hover((function(){clearInterval(u)}),(function(){l()}))}}if(void 0===document.body.style.maxWidth&&e.maxwidth){var O=function(){d.css("width","100%"),d.width()>C&&d.css("width",C)};O(),n(t).bind("resize",(function(){O()}))}}))}}(jQuery,this,0)}}]);