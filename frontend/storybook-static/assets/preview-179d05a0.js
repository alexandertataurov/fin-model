import{globalThis as a}from"@storybook/globalThis";const{STORY_CHANGED:s}=__STORYBOOK_MODULE_CORE_EVENTS__,{addons:g}=__STORYBOOK_MODULE_PREVIEW_API__;var i="storybook/highlight",_="storybookHighlight",E=`${i}/add`,H=`${i}/reset`,{document:l}=a,T=(e="#FF4785",t="dashed")=>`
  outline: 2px ${t} ${e};
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(255,255,255,0.6);
`,h=g.getChannel(),m=e=>{let t=_;n();let d=Array.from(new Set(e.elements)),o=l.createElement("style");o.setAttribute("id",t),o.innerHTML=d.map(r=>`${r}{
          ${T(e.color,e.style)}
         }`).join(" "),l.head.appendChild(o)},n=()=>{let e=_,t=l.getElementById(e);t&&t.parentNode?.removeChild(t)};h.on(s,n);h.on(H,n);h.on(E,m);
