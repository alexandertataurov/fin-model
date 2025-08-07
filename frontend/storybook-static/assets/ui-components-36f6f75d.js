import{r as F}from"./storybook-vendor-bdd8b375.js";function Me(e){var r,o,t="";if(typeof e=="string"||typeof e=="number")t+=e;else if(typeof e=="object")if(Array.isArray(e)){var n=e.length;for(r=0;r<n;r++)e[r]&&(o=Me(e[r]))&&(t&&(t+=" "),t+=o)}else for(o in e)e[o]&&(t&&(t+=" "),t+=o);return t}function Le(){for(var e,r,o=0,t="",n=arguments.length;o<n;o++)(e=arguments[o])&&(r=Me(e))&&(t&&(t+=" "),t+=r);return t}const ye=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,ge=Le,kt=(e,r)=>o=>{var t;if(r?.variants==null)return ge(e,o?.class,o?.className);const{variants:n,defaultVariants:l}=r,d=Object.keys(n).map(f=>{const y=o?.[f],x=l?.[f];if(y===null)return null;const _=ye(y)||ye(x);return n[f][_]}),u=o&&Object.entries(o).reduce((f,y)=>{let[x,_]=y;return _===void 0||(f[x]=_),f},{}),p=r==null||(t=r.compoundVariants)===null||t===void 0?void 0:t.reduce((f,y)=>{let{class:x,className:_,...S}=y;return Object.entries(S).every(v=>{let[w,z]=v;return Array.isArray(z)?z.includes({...l,...u}[w]):{...l,...u}[w]===z})?[...f,x,_]:f},[]);return ge(e,d,p,o?.class,o?.className)},ie="-",je=e=>{const r=Ee(e),{conflictingClassGroups:o,conflictingClassGroupModifiers:t}=e;return{getClassGroupId:d=>{const u=d.split(ie);return u[0]===""&&u.length!==1&&u.shift(),_e(u,r)||Ge(d)},getConflictingClassGroupIds:(d,u)=>{const p=o[d]||[];return u&&t[d]?[...p,...t[d]]:p}}},_e=(e,r)=>{if(e.length===0)return r.classGroupId;const o=e[0],t=r.nextPart.get(o),n=t?_e(e.slice(1),t):void 0;if(n)return n;if(r.validators.length===0)return;const l=e.join(ie);return r.validators.find(({validator:d})=>d(l))?.classGroupId},be=/^\[(.+)\]$/,Ge=e=>{if(be.test(e)){const r=be.exec(e)[1],o=r?.substring(0,r.indexOf(":"));if(o)return"arbitrary.."+o}},Ee=e=>{const{theme:r,classGroups:o}=e,t={nextPart:new Map,validators:[]};for(const n in o)ae(o[n],t,n,r);return t},ae=(e,r,o,t)=>{e.forEach(n=>{if(typeof n=="string"){const l=n===""?r:ke(r,n);l.classGroupId=o;return}if(typeof n=="function"){if(Te(n)){ae(n(t),r,o,t);return}r.validators.push({validator:n,classGroupId:o});return}Object.entries(n).forEach(([l,d])=>{ae(d,ke(r,l),o,t)})})},ke=(e,r)=>{let o=e;return r.split(ie).forEach(t=>{o.nextPart.has(t)||o.nextPart.set(t,{nextPart:new Map,validators:[]}),o=o.nextPart.get(t)}),o},Te=e=>e.isThemeGetter,qe=e=>{if(e<1)return{get:()=>{},set:()=>{}};let r=0,o=new Map,t=new Map;const n=(l,d)=>{o.set(l,d),r++,r>e&&(r=0,t=o,o=new Map)};return{get(l){let d=o.get(l);if(d!==void 0)return d;if((d=t.get(l))!==void 0)return n(l,d),d},set(l,d){o.has(l)?o.set(l,d):n(l,d)}}},se="!",ne=":",He=ne.length,Oe=e=>{const{prefix:r,experimentalParseClassName:o}=e;let t=n=>{const l=[];let d=0,u=0,p=0,f;for(let v=0;v<n.length;v++){let w=n[v];if(d===0&&u===0){if(w===ne){l.push(n.slice(p,v)),p=v+He;continue}if(w==="/"){f=v;continue}}w==="["?d++:w==="]"?d--:w==="("?u++:w===")"&&u--}const y=l.length===0?n:n.substring(p),x=Be(y),_=x!==y,S=f&&f>p?f-p:void 0;return{modifiers:l,hasImportantModifier:_,baseClassName:x,maybePostfixModifierPosition:S}};if(r){const n=r+ne,l=t;t=d=>d.startsWith(n)?l(d.substring(n.length)):{isExternal:!0,modifiers:[],hasImportantModifier:!1,baseClassName:d,maybePostfixModifierPosition:void 0}}if(o){const n=t;t=l=>o({className:l,parseClassName:n})}return t},Be=e=>e.endsWith(se)?e.substring(0,e.length-1):e.startsWith(se)?e.substring(1):e,Fe=e=>{const r=Object.fromEntries(e.orderSensitiveModifiers.map(t=>[t,!0]));return t=>{if(t.length<=1)return t;const n=[];let l=[];return t.forEach(d=>{d[0]==="["||r[d]?(n.push(...l.sort(),d),l=[]):l.push(d)}),n.push(...l.sort()),n}},Ue=e=>({cache:qe(e.cacheSize),parseClassName:Oe(e),sortModifiers:Fe(e),...je(e)}),We=/\s+/,De=(e,r)=>{const{parseClassName:o,getClassGroupId:t,getConflictingClassGroupIds:n,sortModifiers:l}=r,d=[],u=e.trim().split(We);let p="";for(let f=u.length-1;f>=0;f-=1){const y=u[f],{isExternal:x,modifiers:_,hasImportantModifier:S,baseClassName:v,maybePostfixModifierPosition:w}=o(y);if(x){p=y+(p.length>0?" "+p:p);continue}let z=!!w,P=t(z?v.substring(0,w):v);if(!P){if(!z){p=y+(p.length>0?" "+p:p);continue}if(P=t(v),!P){p=y+(p.length>0?" "+p:p);continue}z=!1}const U=l(_).join(":"),H=S?U+se:U,L=H+P;if(d.includes(L))continue;d.push(L);const j=n(P,z);for(let I=0;I<j.length;++I){const O=j[I];d.push(H+O)}p=y+(p.length>0?" "+p:p)}return p};function Ze(){let e=0,r,o,t="";for(;e<arguments.length;)(r=arguments[e++])&&(o=ze(r))&&(t&&(t+=" "),t+=o);return t}const ze=e=>{if(typeof e=="string")return e;let r,o="";for(let t=0;t<e.length;t++)e[t]&&(r=ze(e[t]))&&(o&&(o+=" "),o+=r);return o};function Ke(e,...r){let o,t,n,l=d;function d(p){const f=r.reduce((y,x)=>x(y),e());return o=Ue(f),t=o.cache.get,n=o.cache.set,l=u,u(p)}function u(p){const f=t(p);if(f)return f;const y=De(p,o);return n(p,y),y}return function(){return l(Ze.apply(null,arguments))}}const g=e=>{const r=o=>o[e]||[];return r.isThemeGetter=!0,r},Ce=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Ne=/^\((?:(\w[\w-]*):)?(.+)\)$/i,Je=/^\d+\/\d+$/,Xe=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,Qe=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,Ye=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,eo=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,oo=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,E=e=>Je.test(e),h=e=>!!e&&!Number.isNaN(Number(e)),$=e=>!!e&&Number.isInteger(Number(e)),te=e=>e.endsWith("%")&&h(e.slice(0,-1)),A=e=>Xe.test(e),to=()=>!0,ro=e=>Qe.test(e)&&!Ye.test(e),Ae=()=>!1,ao=e=>eo.test(e),so=e=>oo.test(e),no=e=>!a(e)&&!s(e),io=e=>T(e,Pe,Ae),a=e=>Ce.test(e),V=e=>T(e,Ie,ro),re=e=>T(e,ho,h),xe=e=>T(e,$e,Ae),lo=e=>T(e,Se,so),X=e=>T(e,Re,ao),s=e=>Ne.test(e),B=e=>q(e,Ie),co=e=>q(e,uo),ve=e=>q(e,$e),mo=e=>q(e,Pe),po=e=>q(e,Se),Q=e=>q(e,Re,!0),T=(e,r,o)=>{const t=Ce.exec(e);return t?t[1]?r(t[1]):o(t[2]):!1},q=(e,r,o=!1)=>{const t=Ne.exec(e);return t?t[1]?r(t[1]):o:!1},$e=e=>e==="position"||e==="percentage",Se=e=>e==="image"||e==="url",Pe=e=>e==="length"||e==="size"||e==="bg-size",Ie=e=>e==="length",ho=e=>e==="number",uo=e=>e==="family-name",Re=e=>e==="shadow",fo=()=>{const e=g("color"),r=g("font"),o=g("text"),t=g("font-weight"),n=g("tracking"),l=g("leading"),d=g("breakpoint"),u=g("container"),p=g("spacing"),f=g("radius"),y=g("shadow"),x=g("inset-shadow"),_=g("text-shadow"),S=g("drop-shadow"),v=g("blur"),w=g("perspective"),z=g("aspect"),P=g("ease"),U=g("animate"),H=()=>["auto","avoid","all","avoid-page","page","left","right","column"],L=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],j=()=>[...L(),s,a],I=()=>["auto","hidden","clip","visible","scroll"],O=()=>["auto","contain","none"],m=()=>[s,a,p],C=()=>[E,"full","auto",...m()],le=()=>[$,"none","subgrid",s,a],ce=()=>["auto",{span:["full",$,s,a]},$,s,a],W=()=>[$,"auto",s,a],de=()=>["auto","min","max","fr",s,a],Y=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],G=()=>["start","end","center","stretch","center-safe","end-safe"],N=()=>["auto",...m()],R=()=>[E,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...m()],c=()=>[e,s,a],me=()=>[...L(),ve,xe,{position:[s,a]}],pe=()=>["no-repeat",{repeat:["","x","y","space","round"]}],he=()=>["auto","cover","contain",mo,io,{size:[s,a]}],ee=()=>[te,B,V],k=()=>["","none","full",f,s,a],M=()=>["",h,B,V],D=()=>["solid","dashed","dotted","double"],ue=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],b=()=>[h,te,ve,xe],fe=()=>["","none",v,s,a],Z=()=>["none",h,s,a],K=()=>["none",h,s,a],oe=()=>[h,s,a],J=()=>[E,"full",...m()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[A],breakpoint:[A],color:[to],container:[A],"drop-shadow":[A],ease:["in","out","in-out"],font:[no],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[A],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[A],shadow:[A],spacing:["px",h],text:[A],"text-shadow":[A],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",E,a,s,z]}],container:["container"],columns:[{columns:[h,a,s,u]}],"break-after":[{"break-after":H()}],"break-before":[{"break-before":H()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:j()}],overflow:[{overflow:I()}],"overflow-x":[{"overflow-x":I()}],"overflow-y":[{"overflow-y":I()}],overscroll:[{overscroll:O()}],"overscroll-x":[{"overscroll-x":O()}],"overscroll-y":[{"overscroll-y":O()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:C()}],"inset-x":[{"inset-x":C()}],"inset-y":[{"inset-y":C()}],start:[{start:C()}],end:[{end:C()}],top:[{top:C()}],right:[{right:C()}],bottom:[{bottom:C()}],left:[{left:C()}],visibility:["visible","invisible","collapse"],z:[{z:[$,"auto",s,a]}],basis:[{basis:[E,"full","auto",u,...m()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[h,E,"auto","initial","none",a]}],grow:[{grow:["",h,s,a]}],shrink:[{shrink:["",h,s,a]}],order:[{order:[$,"first","last","none",s,a]}],"grid-cols":[{"grid-cols":le()}],"col-start-end":[{col:ce()}],"col-start":[{"col-start":W()}],"col-end":[{"col-end":W()}],"grid-rows":[{"grid-rows":le()}],"row-start-end":[{row:ce()}],"row-start":[{"row-start":W()}],"row-end":[{"row-end":W()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":de()}],"auto-rows":[{"auto-rows":de()}],gap:[{gap:m()}],"gap-x":[{"gap-x":m()}],"gap-y":[{"gap-y":m()}],"justify-content":[{justify:[...Y(),"normal"]}],"justify-items":[{"justify-items":[...G(),"normal"]}],"justify-self":[{"justify-self":["auto",...G()]}],"align-content":[{content:["normal",...Y()]}],"align-items":[{items:[...G(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...G(),{baseline:["","last"]}]}],"place-content":[{"place-content":Y()}],"place-items":[{"place-items":[...G(),"baseline"]}],"place-self":[{"place-self":["auto",...G()]}],p:[{p:m()}],px:[{px:m()}],py:[{py:m()}],ps:[{ps:m()}],pe:[{pe:m()}],pt:[{pt:m()}],pr:[{pr:m()}],pb:[{pb:m()}],pl:[{pl:m()}],m:[{m:N()}],mx:[{mx:N()}],my:[{my:N()}],ms:[{ms:N()}],me:[{me:N()}],mt:[{mt:N()}],mr:[{mr:N()}],mb:[{mb:N()}],ml:[{ml:N()}],"space-x":[{"space-x":m()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":m()}],"space-y-reverse":["space-y-reverse"],size:[{size:R()}],w:[{w:[u,"screen",...R()]}],"min-w":[{"min-w":[u,"screen","none",...R()]}],"max-w":[{"max-w":[u,"screen","none","prose",{screen:[d]},...R()]}],h:[{h:["screen","lh",...R()]}],"min-h":[{"min-h":["screen","lh","none",...R()]}],"max-h":[{"max-h":["screen","lh",...R()]}],"font-size":[{text:["base",o,B,V]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[t,s,re]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",te,a]}],"font-family":[{font:[co,a,r]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[n,s,a]}],"line-clamp":[{"line-clamp":[h,"none",s,re]}],leading:[{leading:[l,...m()]}],"list-image":[{"list-image":["none",s,a]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",s,a]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:c()}],"text-color":[{text:c()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...D(),"wavy"]}],"text-decoration-thickness":[{decoration:[h,"from-font","auto",s,V]}],"text-decoration-color":[{decoration:c()}],"underline-offset":[{"underline-offset":[h,"auto",s,a]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:m()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",s,a]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",s,a]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:me()}],"bg-repeat":[{bg:pe()}],"bg-size":[{bg:he()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},$,s,a],radial:["",s,a],conic:[$,s,a]},po,lo]}],"bg-color":[{bg:c()}],"gradient-from-pos":[{from:ee()}],"gradient-via-pos":[{via:ee()}],"gradient-to-pos":[{to:ee()}],"gradient-from":[{from:c()}],"gradient-via":[{via:c()}],"gradient-to":[{to:c()}],rounded:[{rounded:k()}],"rounded-s":[{"rounded-s":k()}],"rounded-e":[{"rounded-e":k()}],"rounded-t":[{"rounded-t":k()}],"rounded-r":[{"rounded-r":k()}],"rounded-b":[{"rounded-b":k()}],"rounded-l":[{"rounded-l":k()}],"rounded-ss":[{"rounded-ss":k()}],"rounded-se":[{"rounded-se":k()}],"rounded-ee":[{"rounded-ee":k()}],"rounded-es":[{"rounded-es":k()}],"rounded-tl":[{"rounded-tl":k()}],"rounded-tr":[{"rounded-tr":k()}],"rounded-br":[{"rounded-br":k()}],"rounded-bl":[{"rounded-bl":k()}],"border-w":[{border:M()}],"border-w-x":[{"border-x":M()}],"border-w-y":[{"border-y":M()}],"border-w-s":[{"border-s":M()}],"border-w-e":[{"border-e":M()}],"border-w-t":[{"border-t":M()}],"border-w-r":[{"border-r":M()}],"border-w-b":[{"border-b":M()}],"border-w-l":[{"border-l":M()}],"divide-x":[{"divide-x":M()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":M()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...D(),"hidden","none"]}],"divide-style":[{divide:[...D(),"hidden","none"]}],"border-color":[{border:c()}],"border-color-x":[{"border-x":c()}],"border-color-y":[{"border-y":c()}],"border-color-s":[{"border-s":c()}],"border-color-e":[{"border-e":c()}],"border-color-t":[{"border-t":c()}],"border-color-r":[{"border-r":c()}],"border-color-b":[{"border-b":c()}],"border-color-l":[{"border-l":c()}],"divide-color":[{divide:c()}],"outline-style":[{outline:[...D(),"none","hidden"]}],"outline-offset":[{"outline-offset":[h,s,a]}],"outline-w":[{outline:["",h,B,V]}],"outline-color":[{outline:c()}],shadow:[{shadow:["","none",y,Q,X]}],"shadow-color":[{shadow:c()}],"inset-shadow":[{"inset-shadow":["none",x,Q,X]}],"inset-shadow-color":[{"inset-shadow":c()}],"ring-w":[{ring:M()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:c()}],"ring-offset-w":[{"ring-offset":[h,V]}],"ring-offset-color":[{"ring-offset":c()}],"inset-ring-w":[{"inset-ring":M()}],"inset-ring-color":[{"inset-ring":c()}],"text-shadow":[{"text-shadow":["none",_,Q,X]}],"text-shadow-color":[{"text-shadow":c()}],opacity:[{opacity:[h,s,a]}],"mix-blend":[{"mix-blend":[...ue(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":ue()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[h]}],"mask-image-linear-from-pos":[{"mask-linear-from":b()}],"mask-image-linear-to-pos":[{"mask-linear-to":b()}],"mask-image-linear-from-color":[{"mask-linear-from":c()}],"mask-image-linear-to-color":[{"mask-linear-to":c()}],"mask-image-t-from-pos":[{"mask-t-from":b()}],"mask-image-t-to-pos":[{"mask-t-to":b()}],"mask-image-t-from-color":[{"mask-t-from":c()}],"mask-image-t-to-color":[{"mask-t-to":c()}],"mask-image-r-from-pos":[{"mask-r-from":b()}],"mask-image-r-to-pos":[{"mask-r-to":b()}],"mask-image-r-from-color":[{"mask-r-from":c()}],"mask-image-r-to-color":[{"mask-r-to":c()}],"mask-image-b-from-pos":[{"mask-b-from":b()}],"mask-image-b-to-pos":[{"mask-b-to":b()}],"mask-image-b-from-color":[{"mask-b-from":c()}],"mask-image-b-to-color":[{"mask-b-to":c()}],"mask-image-l-from-pos":[{"mask-l-from":b()}],"mask-image-l-to-pos":[{"mask-l-to":b()}],"mask-image-l-from-color":[{"mask-l-from":c()}],"mask-image-l-to-color":[{"mask-l-to":c()}],"mask-image-x-from-pos":[{"mask-x-from":b()}],"mask-image-x-to-pos":[{"mask-x-to":b()}],"mask-image-x-from-color":[{"mask-x-from":c()}],"mask-image-x-to-color":[{"mask-x-to":c()}],"mask-image-y-from-pos":[{"mask-y-from":b()}],"mask-image-y-to-pos":[{"mask-y-to":b()}],"mask-image-y-from-color":[{"mask-y-from":c()}],"mask-image-y-to-color":[{"mask-y-to":c()}],"mask-image-radial":[{"mask-radial":[s,a]}],"mask-image-radial-from-pos":[{"mask-radial-from":b()}],"mask-image-radial-to-pos":[{"mask-radial-to":b()}],"mask-image-radial-from-color":[{"mask-radial-from":c()}],"mask-image-radial-to-color":[{"mask-radial-to":c()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":L()}],"mask-image-conic-pos":[{"mask-conic":[h]}],"mask-image-conic-from-pos":[{"mask-conic-from":b()}],"mask-image-conic-to-pos":[{"mask-conic-to":b()}],"mask-image-conic-from-color":[{"mask-conic-from":c()}],"mask-image-conic-to-color":[{"mask-conic-to":c()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:me()}],"mask-repeat":[{mask:pe()}],"mask-size":[{mask:he()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",s,a]}],filter:[{filter:["","none",s,a]}],blur:[{blur:fe()}],brightness:[{brightness:[h,s,a]}],contrast:[{contrast:[h,s,a]}],"drop-shadow":[{"drop-shadow":["","none",S,Q,X]}],"drop-shadow-color":[{"drop-shadow":c()}],grayscale:[{grayscale:["",h,s,a]}],"hue-rotate":[{"hue-rotate":[h,s,a]}],invert:[{invert:["",h,s,a]}],saturate:[{saturate:[h,s,a]}],sepia:[{sepia:["",h,s,a]}],"backdrop-filter":[{"backdrop-filter":["","none",s,a]}],"backdrop-blur":[{"backdrop-blur":fe()}],"backdrop-brightness":[{"backdrop-brightness":[h,s,a]}],"backdrop-contrast":[{"backdrop-contrast":[h,s,a]}],"backdrop-grayscale":[{"backdrop-grayscale":["",h,s,a]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[h,s,a]}],"backdrop-invert":[{"backdrop-invert":["",h,s,a]}],"backdrop-opacity":[{"backdrop-opacity":[h,s,a]}],"backdrop-saturate":[{"backdrop-saturate":[h,s,a]}],"backdrop-sepia":[{"backdrop-sepia":["",h,s,a]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":m()}],"border-spacing-x":[{"border-spacing-x":m()}],"border-spacing-y":[{"border-spacing-y":m()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",s,a]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[h,"initial",s,a]}],ease:[{ease:["linear","initial",P,s,a]}],delay:[{delay:[h,s,a]}],animate:[{animate:["none",U,s,a]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[w,s,a]}],"perspective-origin":[{"perspective-origin":j()}],rotate:[{rotate:Z()}],"rotate-x":[{"rotate-x":Z()}],"rotate-y":[{"rotate-y":Z()}],"rotate-z":[{"rotate-z":Z()}],scale:[{scale:K()}],"scale-x":[{"scale-x":K()}],"scale-y":[{"scale-y":K()}],"scale-z":[{"scale-z":K()}],"scale-3d":["scale-3d"],skew:[{skew:oe()}],"skew-x":[{"skew-x":oe()}],"skew-y":[{"skew-y":oe()}],transform:[{transform:[s,a,"","none","gpu","cpu"]}],"transform-origin":[{origin:j()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:J()}],"translate-x":[{"translate-x":J()}],"translate-y":[{"translate-y":J()}],"translate-z":[{"translate-z":J()}],"translate-none":["translate-none"],accent:[{accent:c()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:c()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",s,a]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":m()}],"scroll-mx":[{"scroll-mx":m()}],"scroll-my":[{"scroll-my":m()}],"scroll-ms":[{"scroll-ms":m()}],"scroll-me":[{"scroll-me":m()}],"scroll-mt":[{"scroll-mt":m()}],"scroll-mr":[{"scroll-mr":m()}],"scroll-mb":[{"scroll-mb":m()}],"scroll-ml":[{"scroll-ml":m()}],"scroll-p":[{"scroll-p":m()}],"scroll-px":[{"scroll-px":m()}],"scroll-py":[{"scroll-py":m()}],"scroll-ps":[{"scroll-ps":m()}],"scroll-pe":[{"scroll-pe":m()}],"scroll-pt":[{"scroll-pt":m()}],"scroll-pr":[{"scroll-pr":m()}],"scroll-pb":[{"scroll-pb":m()}],"scroll-pl":[{"scroll-pl":m()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",s,a]}],fill:[{fill:["none",...c()]}],"stroke-w":[{stroke:[h,B,V,re]}],stroke:[{stroke:["none",...c()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}},xt=Ke(fo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yo=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),go=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,o,t)=>t?t.toUpperCase():o.toLowerCase()),we=e=>{const r=go(e);return r.charAt(0).toUpperCase()+r.slice(1)},Ve=(...e)=>e.filter((r,o,t)=>!!r&&r.trim()!==""&&t.indexOf(r)===o).join(" ").trim(),bo=e=>{for(const r in e)if(r.startsWith("aria-")||r==="role"||r==="title")return!0};/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ko={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xo=F.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:o=2,absoluteStrokeWidth:t,className:n="",children:l,iconNode:d,...u},p)=>F.createElement("svg",{ref:p,...ko,width:r,height:r,stroke:e,strokeWidth:t?Number(o)*24/Number(r):o,className:Ve("lucide",n),...!l&&!bo(u)&&{"aria-hidden":"true"},...u},[...d.map(([f,y])=>F.createElement(f,y)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=(e,r)=>{const o=F.forwardRef(({className:t,...n},l)=>F.createElement(xo,{ref:l,iconNode:r,className:Ve(`lucide-${yo(we(e))}`,`lucide-${e}`,t),...n}));return o.displayName=we(e),o};/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vo=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],vt=i("arrow-left",vo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wo=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],wt=i("bell",wo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mo=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]],Mt=i("calculator",Mo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _o=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],_t=i("calendar",_o);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zo=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],zt=i("chart-column",zo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Co=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],Ct=i("check",Co);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const No=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],Nt=i("chevron-down",No);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ao=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],At=i("chevron-right",Ao);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $o=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],$t=i("chevron-up",$o);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const So=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],St=i("circle-alert",So);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Po=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],Pt=i("circle-check-big",Po);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Io=[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],It=i("circle-play",Io);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ro=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],Rt=i("circle-question-mark",Ro);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vo=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],Vt=i("circle-x",Vo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lo=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Lt=i("circle",Lo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jo=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],jt=i("clock",jo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Go=[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]],Gt=i("code",Go);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eo=[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]],Et=i("dollar-sign",Eo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const To=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],Tt=i("download",To);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qo=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]],qt=i("ellipsis",qo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ho=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],Ht=i("external-link",Ho);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oo=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],Ot=i("eye-off",Oo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bo=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Bt=i("eye",Bo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fo=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],Ft=i("file-text",Fo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uo=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],Ut=i("funnel",Uo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wo=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]],Wt=i("house",Wo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Do=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],Dt=i("info",Do);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zo=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],Zt=i("layout-dashboard",Zo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ko=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],Kt=i("loader-circle",Ko);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jo=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],Jt=i("lock",Jo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xo=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],Xt=i("mail",Xo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qo=[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]],Qt=i("maximize",Qo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yo=[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]],Yt=i("message-square",Yo);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",key:"e79jfc"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}]],er=i("palette",et);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],or=i("plus",ot);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],tr=i("refresh-cw",tt);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],rr=i("save",rt);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],ar=i("search",at);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],sr=i("settings",st);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],nr=i("shield",nt);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],ir=i("square-pen",it);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],lr=i("target",lt);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],cr=i("trash-2",ct);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],dr=i("trending-down",dt);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],mr=i("trending-up",mt);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],pr=i("triangle-alert",pt);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],hr=i("upload",ht);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],ur=i("user",ut);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],fr=i("users",ft);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],yr=i("x",yt);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],gr=i("zap",gt);export{Wt as $,vt as A,wt as B,Gt as C,Et as D,Ot as E,Ft as F,Lt as G,Qt as H,Dt as I,Kt as J,St as K,Zt as L,Xt as M,rr as N,Ut as O,er as P,lr as Q,Rt as R,nr as S,mr as T,hr as U,It as V,Ht as W,yr as X,Yt as Y,gr as Z,tr as _,zt as a,sr as b,fr as c,_t as d,Mt as e,ar as f,ir as g,Jt as h,Bt as i,Pt as j,pr as k,Vt as l,jt as m,dr as n,or as o,Tt as p,cr as q,qt as r,ur as s,kt as t,xt as u,Le as v,Ct as w,Nt as x,$t as y,At as z};
