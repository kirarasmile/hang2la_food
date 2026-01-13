import{e as U,a as w,an as k,a3 as L,g as z,h as A,a$ as P,a8 as _,u as j,n as x,m as I,B as $,p as O,q as T,k as E,w as B,b0 as R}from"./index-ChtlSxlN.js";import{u as N}from"./index-BI6IjMO1.js";const W=U([U("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),w("spin-container",`
 position: relative;
 `,[w("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[k()])]),w("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),w("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[L("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),w("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),w("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[L("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),V={small:20,medium:18,large:16},J=Object.assign(Object.assign({},x.props),{contentClass:String,contentStyle:[Object,String],description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0},delay:Number}),G=z({name:"Spin",props:J,slots:Object,setup(l){const{mergedClsPrefixRef:h,inlineThemeDisabled:p}=j(l),c=x("Spin","-spin",W,R,l,h),M=I(()=>{const{size:u}=l,{common:{cubicBezierEaseInOut:m},self:b}=c.value,{opacitySpinning:e,color:d,textColor:o}=b,s=typeof u=="number"?$(u):b[O("size",u)];return{"--n-bezier":m,"--n-opacity-spinning":e,"--n-size":s,"--n-color":d,"--n-text-color":o}}),n=p?T("spin",I(()=>{const{size:u}=l;return typeof u=="number"?String(u):u[0]}),M,l):void 0,i=N(l,["spinning","show"]),t=E(!1);return B(u=>{let m;if(i.value){const{delay:b}=l;if(b){m=window.setTimeout(()=>{t.value=!0},b),u(()=>{clearTimeout(m)});return}}t.value=i.value}),{mergedClsPrefix:h,active:t,mergedStrokeWidth:I(()=>{const{strokeWidth:u}=l;if(u!==void 0)return u;const{size:m}=l;return V[typeof m=="number"?"medium":m]}),cssVars:p?void 0:M,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var l,h;const{$slots:p,mergedClsPrefix:c,description:M}=this,n=p.icon&&this.rotate,i=(M||p.description)&&A("div",{class:`${c}-spin-description`},M||((l=p.description)===null||l===void 0?void 0:l.call(p))),t=p.icon?A("div",{class:[`${c}-spin-body`,this.themeClass]},A("div",{class:[`${c}-spin`,n&&`${c}-spin--rotate`],style:p.default?"":this.cssVars},p.icon()),i):A("div",{class:[`${c}-spin-body`,this.themeClass]},A(P,{clsPrefix:c,style:p.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${c}-spin`}),i);return(h=this.onRender)===null||h===void 0||h.call(this),p.default?A("div",{class:[`${c}-spin-container`,this.themeClass],style:this.cssVars},A("div",{class:[`${c}-spin-content`,this.active&&`${c}-spin-content--spinning`,this.contentClass],style:this.contentStyle},p),A(_,{name:"fade-in-transition"},{default:()=>this.active?t:null})):t}});var D=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function q(l){return l&&l.__esModule&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l}var S={exports:{}};(function(l,h){(function(p,c){l.exports=c()})(D,function(){function p(e){var d=[];return e.AMapUI&&d.push(c(e.AMapUI)),e.Loca&&d.push(M(e.Loca)),Promise.all(d)}function c(e){return new Promise(function(d,o){var s=[];if(e.plugins)for(var a=0;a<e.plugins.length;a+=1)i.AMapUI.plugins.indexOf(e.plugins[a])==-1&&s.push(e.plugins[a]);if(t.AMapUI===n.failed)o("前次请求 AMapUI 失败");else if(t.AMapUI===n.notload){t.AMapUI=n.loading,i.AMapUI.version=e.version||i.AMapUI.version,a=i.AMapUI.version;var v=document.body||document.head,f=document.createElement("script");f.type="text/javascript",f.src="https://webapi.amap.com/ui/"+a+"/main.js",f.onerror=function(r){t.AMapUI=n.failed,o("请求 AMapUI 失败")},f.onload=function(){if(t.AMapUI=n.loaded,s.length)window.AMapUI.loadUI(s,function(){for(var r=0,g=s.length;r<g;r++){var y=s[r].split("/").slice(-1)[0];window.AMapUI[y]=arguments[r]}for(d();u.AMapUI.length;)u.AMapUI.splice(0,1)[0]()});else for(d();u.AMapUI.length;)u.AMapUI.splice(0,1)[0]()},v.appendChild(f)}else t.AMapUI===n.loaded?e.version&&e.version!==i.AMapUI.version?o("不允许多个版本 AMapUI 混用"):s.length?window.AMapUI.loadUI(s,function(){for(var r=0,g=s.length;r<g;r++){var y=s[r].split("/").slice(-1)[0];window.AMapUI[y]=arguments[r]}d()}):d():e.version&&e.version!==i.AMapUI.version?o("不允许多个版本 AMapUI 混用"):u.AMapUI.push(function(r){r?o(r):s.length?window.AMapUI.loadUI(s,function(){for(var g=0,y=s.length;g<y;g++){var C=s[g].split("/").slice(-1)[0];window.AMapUI[C]=arguments[g]}d()}):d()})})}function M(e){return new Promise(function(d,o){if(t.Loca===n.failed)o("前次请求 Loca 失败");else if(t.Loca===n.notload){t.Loca=n.loading,i.Loca.version=e.version||i.Loca.version;var s=i.Loca.version,a=i.AMap.version.startsWith("2"),v=s.startsWith("2");if(a&&!v||!a&&v)o("JSAPI 与 Loca 版本不对应！！");else{a=i.key,v=document.body||document.head;var f=document.createElement("script");f.type="text/javascript",f.src="https://webapi.amap.com/loca?v="+s+"&key="+a,f.onerror=function(r){t.Loca=n.failed,o("请求 AMapUI 失败")},f.onload=function(){for(t.Loca=n.loaded,d();u.Loca.length;)u.Loca.splice(0,1)[0]()},v.appendChild(f)}}else t.Loca===n.loaded?e.version&&e.version!==i.Loca.version?o("不允许多个版本 Loca 混用"):d():e.version&&e.version!==i.Loca.version?o("不允许多个版本 Loca 混用"):u.Loca.push(function(r){r?o(r):o()})})}if(!window)throw Error("AMap JSAPI can only be used in Browser.");var n;(function(e){e.notload="notload",e.loading="loading",e.loaded="loaded",e.failed="failed"})(n||(n={}));var i={key:"",AMap:{version:"1.4.15",plugins:[]},AMapUI:{version:"1.1",plugins:[]},Loca:{version:"1.3.2"}},t={AMap:n.notload,AMapUI:n.notload,Loca:n.notload},u={AMapUI:[],Loca:[]},m=[],b=function(e){typeof e=="function"&&(t.AMap===n.loaded?e(window.AMap):m.push(e))};return{load:function(e){return new Promise(function(d,o){if(t.AMap==n.failed)o("");else if(t.AMap==n.notload){var s=e.key,a=e.version,v=e.plugins;s?(window.AMap&&location.host!=="lbs.amap.com"&&o("禁止多种API加载方式混用"),i.key=s,i.AMap.version=a||i.AMap.version,i.AMap.plugins=v||i.AMap.plugins,t.AMap=n.loading,a=document.body||document.head,window.___onAPILoaded=function(r){if(delete window.___onAPILoaded,r)t.AMap=n.failed,o(r);else for(t.AMap=n.loaded,p(e).then(function(){d(window.AMap)}).catch(o);m.length;)m.splice(0,1)[0]()},v=document.createElement("script"),v.type="text/javascript",v.src="https://webapi.amap.com/maps?callback=___onAPILoaded&v="+i.AMap.version+"&key="+s+"&plugin="+i.AMap.plugins.join(","),v.onerror=function(r){t.AMap=n.failed,o(r)},a.appendChild(v)):o("请填写key")}else if(t.AMap==n.loaded)if(e.key&&e.key!==i.key)o("多个不一致的 key");else if(e.version&&e.version!==i.AMap.version)o("不允许多个版本 JSAPI 混用");else{if(s=[],e.plugins)for(a=0;a<e.plugins.length;a+=1)i.AMap.plugins.indexOf(e.plugins[a])==-1&&s.push(e.plugins[a]);s.length?window.AMap.plugin(s,function(){p(e).then(function(){d(window.AMap)}).catch(o)}):p(e).then(function(){d(window.AMap)}).catch(o)}else if(e.key&&e.key!==i.key)o("多个不一致的 key");else if(e.version&&e.version!==i.AMap.version)o("不允许多个版本 JSAPI 混用");else{var f=[];if(e.plugins)for(a=0;a<e.plugins.length;a+=1)i.AMap.plugins.indexOf(e.plugins[a])==-1&&f.push(e.plugins[a]);b(function(){f.length?window.AMap.plugin(f,function(){p(e).then(function(){d(window.AMap)}).catch(o)}):p(e).then(function(){d(window.AMap)}).catch(o)})}})},reset:function(){delete window.AMap,delete window.AMapUI,delete window.Loca,i={key:"",AMap:{version:"1.4.15",plugins:[]},AMapUI:{version:"1.1",plugins:[]},Loca:{version:"1.3.2"}},t={AMap:n.notload,AMapUI:n.notload,Loca:n.notload},u={AMap:[],AMapUI:[],Loca:[]}}}})})(S);var H=S.exports;const X=q(H);export{X as A,G as N};
