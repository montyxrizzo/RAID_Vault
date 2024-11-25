import{r as u}from"./jotai-BfEc3ju9.js";const w="modulepreload",g=function(l){return"/"+l},v={},C=function(d,s,f){let a=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),t=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));a=Promise.allSettled(s.map(r=>{if(r=g(r),r in v)return;v[r]=!0;const o=r.endsWith(".css"),i=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${i}`))return;const n=document.createElement("link");if(n.rel=o?"stylesheet":w,o||(n.as="script"),n.crossOrigin="",n.href=r,t&&n.setAttribute("nonce",t),document.head.appendChild(n),o)return new Promise((h,m)=>{n.addEventListener("load",h),n.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${r}`)))})}))}function c(e){const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return a.then(e=>{for(const t of e||[])t.status==="rejected"&&c(t.reason);return d().catch(c)})};/**
 * @license @tabler/icons-react v3.22.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var k={outline:{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},filled:{xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"currentColor",stroke:"none"}};/**
 * @license @tabler/icons-react v3.22.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(l,d,s,f)=>{const a=u.forwardRef(({color:c="currentColor",size:e=24,stroke:t=2,title:r,className:o,children:i,...n},h)=>u.createElement("svg",{ref:h,...k[l],width:e,height:e,className:["tabler-icon",`tabler-icon-${d}`,o].join(" "),strokeWidth:t,stroke:c,...n},[r&&u.createElement("title",{key:"svg-title"},r),...f.map(([m,p])=>u.createElement(m,p)),...Array.isArray(i)?i:[i]]));return a.displayName=`${s}`,a};/**
 * @license @tabler/icons-react v3.22.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */var b=y("outline","trash","IconTrash",[["path",{d:"M4 7l16 0",key:"svg-0"}],["path",{d:"M10 11l0 6",key:"svg-1"}],["path",{d:"M14 11l0 6",key:"svg-2"}],["path",{d:"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12",key:"svg-3"}],["path",{d:"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",key:"svg-4"}]]);export{b as I,C as _};
