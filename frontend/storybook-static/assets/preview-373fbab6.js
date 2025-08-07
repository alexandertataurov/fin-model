import{globalThis as B}from"@storybook/globalThis";import{d as H}from"./storybook-addons-651a2e40.js";const{useEffect:h,useMemo:E}=__STORYBOOK_MODULE_PREVIEW_API__,{logger:Y}=__STORYBOOK_MODULE_CLIENT_LOGGER__;var p="backgrounds",C={light:{name:"light",value:"#F8F8F8"},dark:{name:"dark",value:"#333"}},{document:u,window:P}=B,I=()=>!!P?.matchMedia("(prefers-reduced-motion: reduce)")?.matches,A=a=>{(Array.isArray(a)?a:[a]).forEach(j)},j=a=>{let e=u.getElementById(a);e&&e.parentElement?.removeChild(e)},z=(a,e)=>{let t=u.getElementById(a);if(t)t.innerHTML!==e&&(t.innerHTML=e);else{let d=u.createElement("style");d.setAttribute("id",a),d.innerHTML=e,u.head.appendChild(d)}},F=(a,e,t)=>{let d=u.getElementById(a);if(d)d.innerHTML!==e&&(d.innerHTML=e);else{let r=u.createElement("style");r.setAttribute("id",a),r.innerHTML=e;let o=`addon-backgrounds-grid${t?`-docs-${t}`:""}`,n=u.getElementById(o);n?n.parentElement?.insertBefore(r,n):u.head.appendChild(r)}},K={cellSize:100,cellAmount:10,opacity:.8},L="addon-backgrounds",R="addon-backgrounds-grid",X=I()?"":"transition: background-color 0.3s;",N=(a,e)=>{let{globals:t,parameters:d,viewMode:r,id:o}=e,{options:n=C,disable:i,grid:l=K}=d[p]||{},g=t[p]||{},c=g.value,$=c?n[c]:void 0,b=$?.value||"transparent",f=g.grid||!1,m=!!$&&!i,S=r==="docs"?`#anchor--${o} .docs-story`:".sb-show-main",T=r==="docs"?`#anchor--${o} .docs-story`:".sb-show-main",U=d.layout===void 0||d.layout==="padded",G=r==="docs"?20:U?16:0,{cellAmount:y,cellSize:s,opacity:k,offsetX:x=G,offsetY:v=G}=l,_=r==="docs"?`${L}-docs-${o}`:`${L}-color`,O=r==="docs"?o:null;h(()=>{let M=`
    ${S} {
      background: ${b} !important;
      ${X}
      }`;if(!m){A(_);return}F(_,M,O)},[S,_,O,m,b]);let w=r==="docs"?`${R}-docs-${o}`:`${R}`;return h(()=>{if(!f){A(w);return}let M=[`${s*y}px ${s*y}px`,`${s*y}px ${s*y}px`,`${s}px ${s}px`,`${s}px ${s}px`].join(", "),D=`
        ${T} {
          background-size: ${M} !important;
          background-position: ${x}px ${v}px, ${x}px ${v}px, ${x}px ${v}px, ${x}px ${v}px !important;
          background-blend-mode: difference !important;
          background-image: linear-gradient(rgba(130, 130, 130, ${k}) 1px, transparent 1px),
           linear-gradient(90deg, rgba(130, 130, 130, ${k}) 1px, transparent 1px),
           linear-gradient(rgba(130, 130, 130, ${k/2}) 1px, transparent 1px),
           linear-gradient(90deg, rgba(130, 130, 130, ${k/2}) 1px, transparent 1px) !important;
        }
      `;z(w,D)},[y,s,T,w,f,x,v,k]),a()},W=(a,e=[],t)=>{if(a==="transparent")return"transparent";if(e.find(r=>r.value===a)||a)return a;let d=e.find(r=>r.name===t);if(d)return d.value;if(t){let r=e.map(o=>o.name).join(", ");Y.warn(H`
        Backgrounds Addon: could not find the default color "${t}".
        These are the available colors for your story based on your configuration:
        ${r}.
      `)}return"transparent"},q=(a,e)=>{let{globals:t,parameters:d}=e,r=t[p]?.value,o=d[p],n=E(()=>o.disable?"transparent":W(r,o.values,o.default),[o,r]),i=E(()=>n&&n!=="transparent",[n]),l=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",g=E(()=>`
      ${l} {
        background: ${n} !important;
        ${I()?"":"transition: background-color 0.3s;"}
      }
    `,[n,l]);return h(()=>{let c=e.viewMode==="docs"?`addon-backgrounds-docs-${e.id}`:"addon-backgrounds-color";if(!i){A(c);return}F(c,g,e.viewMode==="docs"?e.id:null)},[i,g,e]),a()},J=(a,e)=>{let{globals:t,parameters:d}=e,r=d[p].grid,o=t[p]?.grid===!0&&r.disable!==!0,{cellAmount:n,cellSize:i,opacity:l}=r,g=e.viewMode==="docs",c=d.layout===void 0||d.layout==="padded"?16:0,$=r.offsetX??(g?20:c),b=r.offsetY??(g?20:c),f=E(()=>{let m=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",S=[`${i*n}px ${i*n}px`,`${i*n}px ${i*n}px`,`${i}px ${i}px`,`${i}px ${i}px`].join(", ");return`
      ${m} {
        background-size: ${S} !important;
        background-position: ${$}px ${b}px, ${$}px ${b}px, ${$}px ${b}px, ${$}px ${b}px !important;
        background-blend-mode: difference !important;
        background-image: linear-gradient(rgba(130, 130, 130, ${l}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${l}) 1px, transparent 1px),
         linear-gradient(rgba(130, 130, 130, ${l/2}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${l/2}) 1px, transparent 1px) !important;
      }
    `},[i]);return h(()=>{let m=e.viewMode==="docs"?`addon-backgrounds-grid-docs-${e.id}`:"addon-backgrounds-grid";if(!o){A(m);return}z(m,f)},[o,f,e]),a()},ee=B.FEATURES?.backgroundsStoryGlobals?[N]:[J,q],re={[p]:{grid:{cellSize:20,opacity:.5,cellAmount:5},disable:!1,...!B.FEATURES?.backgroundsStoryGlobals&&{values:Object.values(C)}}},Q={[p]:{value:void 0,grid:!1}},ae=B.FEATURES?.backgroundsStoryGlobals?Q:{[p]:null};export{ee as decorators,ae as initialGlobals,re as parameters};
