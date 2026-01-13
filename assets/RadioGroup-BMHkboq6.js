import{i as ve,y as Q,o as Z,s as E,a as ge,l as ee,u as oe,U as pe,W as me}from"./_plugin-vue_export-helper-Bw40c_nT.js";import{ai as we,n as te,r as k,o as xe,p as Re,a as I,R as g,e as s,a2 as O,d as x,c as Ce,g as ke,O as j,ab as L,u as N,f as re,h as B,k as T,aB as ne,j as V,m as D,X as ye}from"./index-DwCDJex0.js";const G=k(!1);function M(){G.value=!0}function W(){G.value=!1}let F=0;function De(){return ve&&(we(()=>{F||(window.addEventListener("compositionstart",M),window.addEventListener("compositionend",W)),F++}),te(()=>{F<=1?(window.removeEventListener("compositionstart",M),window.removeEventListener("compositionend",W),F=0):F--})),G}let $=0,X="",Y="",K="",q="";const J=k("0px");function Te(o){if(typeof document>"u")return;const e=document.documentElement;let t,n=!1;const r=()=>{e.style.marginRight=X,e.style.overflow=Y,e.style.overflowX=K,e.style.overflowY=q,J.value="0px"};xe(()=>{t=Re(o,l=>{if(l){if(!$){const i=window.innerWidth-e.offsetWidth;i>0&&(X=e.style.marginRight,e.style.marginRight=`${i}px`,J.value=`${i}px`),Y=e.style.overflow,K=e.style.overflowX,q=e.style.overflowY,e.style.overflow="hidden",e.style.overflowX="hidden",e.style.overflowY="hidden"}n=!0,$++}else $--,$||r(),n=!1},{immediate:!0})}),te(()=>{t==null||t(),n&&($--,$||r(),n=!1)})}const ze=I("radio",`
 line-height: var(--n-label-line-height);
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 align-items: flex-start;
 flex-wrap: nowrap;
 font-size: var(--n-font-size);
 word-break: break-word;
`,[g("checked",[s("dot",`
 background-color: var(--n-color-active);
 `)]),s("dot-wrapper",`
 position: relative;
 flex-shrink: 0;
 flex-grow: 0;
 width: var(--n-radio-size);
 `),I("radio-input",`
 position: absolute;
 border: 0;
 width: 0;
 height: 0;
 opacity: 0;
 margin: 0;
 `),s("dot",`
 position: absolute;
 top: 50%;
 left: 0;
 transform: translateY(-50%);
 height: var(--n-radio-size);
 width: var(--n-radio-size);
 background: var(--n-color);
 box-shadow: var(--n-box-shadow);
 border-radius: 50%;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `,[x("&::before",`
 content: "";
 opacity: 0;
 position: absolute;
 left: 4px;
 top: 4px;
 height: calc(100% - 8px);
 width: calc(100% - 8px);
 border-radius: 50%;
 transform: scale(.8);
 background: var(--n-dot-color-active);
 transition: 
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),g("checked",{boxShadow:"var(--n-box-shadow-active)"},[x("&::before",`
 opacity: 1;
 transform: scale(1);
 `)])]),s("label",`
 color: var(--n-text-color);
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 display: inline-block;
 transition: color .3s var(--n-bezier);
 `),O("disabled",`
 cursor: pointer;
 `,[x("&:hover",[s("dot",{boxShadow:"var(--n-box-shadow-hover)"})]),g("focus",[x("&:not(:active)",[s("dot",{boxShadow:"var(--n-box-shadow-focus)"})])])]),g("disabled",`
 cursor: not-allowed;
 `,[s("dot",{boxShadow:"var(--n-box-shadow-disabled)",backgroundColor:"var(--n-color-disabled)"},[x("&::before",{backgroundColor:"var(--n-dot-color-disabled)"}),g("checked",`
 opacity: 1;
 `)]),s("label",{color:"var(--n-text-color-disabled)"}),I("radio-input",`
 cursor: not-allowed;
 `)])]),Se={name:String,value:{type:[String,Number,Boolean],default:"on"},checked:{type:Boolean,default:void 0},defaultChecked:Boolean,disabled:{type:Boolean,default:void 0},label:String,size:String,onUpdateChecked:[Function,Array],"onUpdate:checked":[Function,Array],checkedValue:{type:Boolean,default:void 0}},ae=Ce("n-radio-group");function Be(o){const e=ke(ae,null),t=Q(o,{mergedSize(a){const{size:c}=o;if(c!==void 0)return c;if(e){const{mergedSizeRef:{value:b}}=e;if(b!==void 0)return b}return a?a.mergedSize.value:"medium"},mergedDisabled(a){return!!(o.disabled||e!=null&&e.disabledRef.value||a!=null&&a.disabled.value)}}),{mergedSizeRef:n,mergedDisabledRef:r}=t,l=k(null),i=k(null),h=k(o.defaultChecked),d=j(o,"checked"),p=Z(d,h),m=L(()=>e?e.valueRef.value===o.value:p.value),R=L(()=>{const{name:a}=o;if(a!==void 0)return a;if(e)return e.nameRef.value}),v=k(!1);function C(){if(e){const{doUpdateValue:a}=e,{value:c}=o;E(a,c)}else{const{onUpdateChecked:a,"onUpdate:checked":c}=o,{nTriggerFormInput:b,nTriggerFormChange:u}=t;a&&E(a,!0),c&&E(c,!0),b(),u(),h.value=!0}}function w(){r.value||m.value||C()}function y(){w(),l.value&&(l.value.checked=m.value)}function z(){v.value=!1}function S(){v.value=!0}return{mergedClsPrefix:e?e.mergedClsPrefixRef:N(o).mergedClsPrefixRef,inputRef:l,labelRef:i,mergedName:R,mergedDisabled:r,renderSafeChecked:m,focus:v,mergedSize:n,handleRadioInputChange:y,handleRadioInputBlur:z,handleRadioInputFocus:S}}const Ie=Object.assign(Object.assign({},T.props),Se),Ue=re({name:"Radio",props:Ie,setup(o){const e=Be(o),t=T("Radio","-radio",ze,ne,o,e.mergedClsPrefix),n=V(()=>{const{mergedSize:{value:p}}=e,{common:{cubicBezierEaseInOut:m},self:{boxShadow:R,boxShadowActive:v,boxShadowDisabled:C,boxShadowFocus:w,boxShadowHover:y,color:z,colorDisabled:S,colorActive:a,textColor:c,textColorDisabled:b,dotColorActive:u,dotColorDisabled:f,labelPadding:_,labelLineHeight:U,labelFontWeight:H,[D("fontSize",p)]:P,[D("radioSize",p)]:A}}=t.value;return{"--n-bezier":m,"--n-label-line-height":U,"--n-label-font-weight":H,"--n-box-shadow":R,"--n-box-shadow-active":v,"--n-box-shadow-disabled":C,"--n-box-shadow-focus":w,"--n-box-shadow-hover":y,"--n-color":z,"--n-color-active":a,"--n-color-disabled":S,"--n-dot-color-active":u,"--n-dot-color-disabled":f,"--n-font-size":P,"--n-radio-size":A,"--n-text-color":c,"--n-text-color-disabled":b,"--n-label-padding":_}}),{inlineThemeDisabled:r,mergedClsPrefixRef:l,mergedRtlRef:i}=N(o),h=ee("Radio",i,l),d=r?oe("radio",V(()=>e.mergedSize.value[0]),n,o):void 0;return Object.assign(e,{rtlEnabled:h,cssVars:r?void 0:n,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender})},render(){const{$slots:o,mergedClsPrefix:e,onRender:t,label:n}=this;return t==null||t(),B("label",{class:[`${e}-radio`,this.themeClass,this.rtlEnabled&&`${e}-radio--rtl`,this.mergedDisabled&&`${e}-radio--disabled`,this.renderSafeChecked&&`${e}-radio--checked`,this.focus&&`${e}-radio--focus`],style:this.cssVars},B("div",{class:`${e}-radio__dot-wrapper`}," ",B("div",{class:[`${e}-radio__dot`,this.renderSafeChecked&&`${e}-radio__dot--checked`]}),B("input",{ref:"inputRef",type:"radio",class:`${e}-radio-input`,value:this.value,name:this.mergedName,checked:this.renderSafeChecked,disabled:this.mergedDisabled,onChange:this.handleRadioInputChange,onFocus:this.handleRadioInputFocus,onBlur:this.handleRadioInputBlur})),ge(o.default,r=>!r&&!n?null:B("div",{ref:"labelRef",class:`${e}-radio__label`},r||n)))}}),_e=I("radio-group",`
 display: inline-block;
 font-size: var(--n-font-size);
`,[s("splitor",`
 display: inline-block;
 vertical-align: bottom;
 width: 1px;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 background: var(--n-button-border-color);
 `,[g("checked",{backgroundColor:"var(--n-button-border-color-active)"}),g("disabled",{opacity:"var(--n-opacity-disabled)"})]),g("button-group",`
 white-space: nowrap;
 height: var(--n-height);
 line-height: var(--n-height);
 `,[I("radio-button",{height:"var(--n-height)",lineHeight:"var(--n-height)"}),s("splitor",{height:"var(--n-height)"})]),I("radio-button",`
 vertical-align: bottom;
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-block;
 box-sizing: border-box;
 padding-left: 14px;
 padding-right: 14px;
 white-space: nowrap;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background: var(--n-button-color);
 color: var(--n-button-text-color);
 border-top: 1px solid var(--n-button-border-color);
 border-bottom: 1px solid var(--n-button-border-color);
 `,[I("radio-input",`
 pointer-events: none;
 position: absolute;
 border: 0;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 opacity: 0;
 z-index: 1;
 `),s("state-border",`
 z-index: 1;
 pointer-events: none;
 position: absolute;
 box-shadow: var(--n-button-box-shadow);
 transition: box-shadow .3s var(--n-bezier);
 left: -1px;
 bottom: -1px;
 right: -1px;
 top: -1px;
 `),x("&:first-child",`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 border-left: 1px solid var(--n-button-border-color);
 `,[s("state-border",`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 `)]),x("&:last-child",`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 border-right: 1px solid var(--n-button-border-color);
 `,[s("state-border",`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 `)]),O("disabled",`
 cursor: pointer;
 `,[x("&:hover",[s("state-border",`
 transition: box-shadow .3s var(--n-bezier);
 box-shadow: var(--n-button-box-shadow-hover);
 `),O("checked",{color:"var(--n-button-text-color-hover)"})]),g("focus",[x("&:not(:active)",[s("state-border",{boxShadow:"var(--n-button-box-shadow-focus)"})])])]),g("checked",`
 background: var(--n-button-color-active);
 color: var(--n-button-text-color-active);
 border-color: var(--n-button-border-color-active);
 `),g("disabled",`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `)])]);function $e(o,e,t){var n;const r=[];let l=!1;for(let i=0;i<o.length;++i){const h=o[i],d=(n=h.type)===null||n===void 0?void 0:n.name;d==="RadioButton"&&(l=!0);const p=h.props;if(d!=="RadioButton"){r.push(h);continue}if(i===0)r.push(h);else{const m=r[r.length-1].props,R=e===m.value,v=m.disabled,C=e===p.value,w=p.disabled,y=(R?2:0)+(v?0:1),z=(C?2:0)+(w?0:1),S={[`${t}-radio-group__splitor--disabled`]:v,[`${t}-radio-group__splitor--checked`]:R},a={[`${t}-radio-group__splitor--disabled`]:w,[`${t}-radio-group__splitor--checked`]:C},c=y<z?a:S;r.push(B("div",{class:[`${t}-radio-group__splitor`,c]}),h)}}return{children:r,isButtonGroup:l}}const Fe=Object.assign(Object.assign({},T.props),{name:String,value:[String,Number,Boolean],defaultValue:{type:[String,Number,Boolean],default:null},size:String,disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),He=re({name:"RadioGroup",props:Fe,setup(o){const e=k(null),{mergedSizeRef:t,mergedDisabledRef:n,nTriggerFormChange:r,nTriggerFormInput:l,nTriggerFormBlur:i,nTriggerFormFocus:h}=Q(o),{mergedClsPrefixRef:d,inlineThemeDisabled:p,mergedRtlRef:m}=N(o),R=T("Radio","-radio-group",_e,ne,o,d),v=k(o.defaultValue),C=j(o,"value"),w=Z(C,v);function y(u){const{onUpdateValue:f,"onUpdate:value":_}=o;f&&E(f,u),_&&E(_,u),v.value=u,r(),l()}function z(u){const{value:f}=e;f&&(f.contains(u.relatedTarget)||h())}function S(u){const{value:f}=e;f&&(f.contains(u.relatedTarget)||i())}ye(ae,{mergedClsPrefixRef:d,nameRef:j(o,"name"),valueRef:w,disabledRef:n,mergedSizeRef:t,doUpdateValue:y});const a=ee("Radio",m,d),c=V(()=>{const{value:u}=t,{common:{cubicBezierEaseInOut:f},self:{buttonBorderColor:_,buttonBorderColorActive:U,buttonBorderRadius:H,buttonBoxShadow:P,buttonBoxShadowFocus:A,buttonBoxShadowHover:ie,buttonColor:de,buttonColorActive:se,buttonTextColor:le,buttonTextColorActive:ce,buttonTextColorHover:ue,opacityDisabled:be,[D("buttonHeight",u)]:he,[D("fontSize",u)]:fe}}=R.value;return{"--n-font-size":fe,"--n-bezier":f,"--n-button-border-color":_,"--n-button-border-color-active":U,"--n-button-border-radius":H,"--n-button-box-shadow":P,"--n-button-box-shadow-focus":A,"--n-button-box-shadow-hover":ie,"--n-button-color":de,"--n-button-color-active":se,"--n-button-text-color":le,"--n-button-text-color-hover":ue,"--n-button-text-color-active":ce,"--n-height":he,"--n-opacity-disabled":be}}),b=p?oe("radio-group",V(()=>t.value[0]),c,o):void 0;return{selfElRef:e,rtlEnabled:a,mergedClsPrefix:d,mergedValue:w,handleFocusout:S,handleFocusin:z,cssVars:p?void 0:c,themeClass:b==null?void 0:b.themeClass,onRender:b==null?void 0:b.onRender}},render(){var o;const{mergedValue:e,mergedClsPrefix:t,handleFocusin:n,handleFocusout:r}=this,{children:l,isButtonGroup:i}=$e(pe(me(this)),e,t);return(o=this.onRender)===null||o===void 0||o.call(this),B("div",{onFocusin:n,onFocusout:r,ref:"selfElRef",class:[`${t}-radio-group`,this.rtlEnabled&&`${t}-radio-group--rtl`,this.themeClass,i&&`${t}-radio-group--button-group`],style:this.cssVars},l)}});export{He as N,De as a,Ue as b,Te as u};
