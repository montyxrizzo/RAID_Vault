import{j as a}from"./tanstack-DR812mCo.js";import{b as ce,u as de,B as ue,d as me,C as he,P as z,T as fe,e as ge,K as xe}from"./solanaWeb3-DueJrBLx.js";import{r as j,b as N}from"./jotai-BfEc3ju9.js";import{k as ve,a as V,Q as M}from"./react-toastify.esm-DK5EKzzP.js";import{u as be,a as ye,T as pe,b as je,g as G,c as ke}from"./associatedTokenAccount-BJMHBaT0.js";import{E as Ae}from"./solanaWalletAdapters-BkS1YMsu.js";import"./index-BAMY2Nnw.js";import"./react-Cgq1nV1S.js";const J=ce([de("instruction"),be("amount")]);function we(t,e,n,s,r=[],o=je){const i=ye([{pubkey:t,isSigner:!1,isWritable:!0},{pubkey:e,isSigner:!1,isWritable:!0}],n,r),d=ue.alloc(J.span);return J.encode({instruction:pe.Transfer,amount:BigInt(s)},d),new me({keys:i,programId:o,data:d})}function B(t){return t*Math.PI/180}function Y(t,e,n){return t>n?n:t<e?e:t}function _(t,e){return e/100*t}function Z(t,e){return t+e/2}function ee(t,e){var n=B(t);return{dx:e*Math.cos(n),dy:e*Math.sin(n)}}function te(t){return typeof t=="number"}function F(t,e){return typeof t=="function"?t(e):t}function Se(t){for(var e=0,n=0;n<t.length;n++)e+=t[n].value;return e}function Pe(t){for(var e=t.data,n=t.lengthAngle,s=t.totalValue,r=t.paddingAngle,o=t.startAngle,i=s||Se(e),d=Y(n,-360,360),f=Math.abs(d)===360?e.length:e.length-1,x=Math.abs(r)*Math.sign(n),m=x*f,u=d-m,h=0,k=[],y=0;y<e.length;y++){var D=e[y],S=i===0?0:D.value/i*100,b=_(u,S),P=h+o;h=h+b+x,k.push(Object.assign({percentage:S,startAngle:P,degrees:b},D))}return k}function ae(t,e){if(t==null)return{};var n={};for(var s in t)if({}.hasOwnProperty.call(t,s)){if(e.includes(s))continue;n[s]=t[s]}return n}var Ne=["dataEntry","dataIndex"];function De(t){var e=t.renderLabel,n=t.labelProps,s=e(n);if(typeof s=="string"||typeof s=="number"){n.dataEntry,n.dataIndex;var r=ae(n,Ne);return N.createElement("text",Object.assign({dominantBaseline:"central"},r),s)}return N.isValidElement(s)?s:null}function Ie(t){var e=1e14;return Math.round((t+Number.EPSILON)*e)/e}function Ee(t){var e=t.labelPosition,n=t.lineWidth,s=t.labelHorizontalShift,r=Ie(s);if(r===0)return"middle";if(e>100)return r>0?"start":"end";var o=100-n;return e<o?r>0?"end":"start":"middle"}function Re(t,e){return t.map(function(n,s){var r,o=(r=F(e.segmentsShift,s))!=null?r:0,i=_(e.radius,e.labelPosition)+o,d=ee(Z(n.startAngle,n.degrees),i),f=d.dx,x=d.dy,m={x:e.center[0],y:e.center[1],dx:f,dy:x,textAnchor:Ee({labelPosition:e.labelPosition,lineWidth:e.lineWidth,labelHorizontalShift:f}),dataEntry:n,dataIndex:s,style:F(e.labelStyle,s)};return m})}function Te(t,e){var n=e.label;if(n)return Re(t,e).map(function(s,r){return N.createElement(De,{key:"label-"+(s.dataEntry.key||r),renderLabel:n,labelProps:s})})}function Me(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var $,Q;function Le(){if(Q)return $;Q=1;var t=function(n,s,r,o,i){var d=i-o;if(d===0)return[];var f=r*Math.cos(o)+n,x=r*Math.sin(o)+s,m=r*Math.cos(i)+n,u=r*Math.sin(i)+s,h=Math.abs(d)<=Math.PI?"0":"1",k=d<0?"0":"1";return[["M",f,x],["A",r,r,0,h,k,m,u]]};return $=t,$}var Ce=Le(),Oe=Me(Ce),We=["cx","cy","lengthAngle","lineWidth","radius","shift","reveal","rounded","startAngle","title"];function Be(t,e,n,s,r){var o=Y(s,-359.999,359.999);return Oe(t,e,r,B(n),B(n+o)).map(function(i){return i.join(" ")}).join(" ")}function X(t){var e=t.cx,n=t.cy,s=t.lengthAngle,r=t.lineWidth,o=t.radius,i=t.shift,d=i===void 0?0:i,f=t.reveal,x=t.rounded,m=t.startAngle,u=t.title,h=ae(t,We),k=o-r/2,y=ee(Z(m,s),d),D=y.dx,S=y.dy,b=Be(e+D,n+S,m,s,k),P,L;if(te(f)){var K=B(k)*s;P=Math.abs(K),L=P-_(P,f)}return N.createElement("path",Object.assign({d:b,fill:"none",strokeWidth:r,strokeDasharray:P,strokeDashoffset:L,strokeLinecap:x?"round":void 0},h),u&&N.createElement("title",null,u))}function Fe(t,e,n){var s="stroke-dashoffset "+t+"ms "+e;return n&&n.transition&&(s=s+","+n.transition),{transition:s}}function _e(t){var e=t.reveal,n=t.animate;return n&&!te(e)?100:e}function E(t,e){return t&&function(n){t(n,e)}}function Ke(t,e,n){var s=n??_e(e),r=e.radius,o=e.center,i=o[0],d=o[1],f=_(r,e.lineWidth),x=t.map(function(m,u){var h=F(e.segmentsStyle,u);return N.createElement(X,{cx:i,cy:d,key:m.key||u,lengthAngle:m.degrees,lineWidth:f,radius:r,rounded:e.rounded,reveal:s,shift:F(e.segmentsShift,u),startAngle:m.startAngle,title:m.title,style:Object.assign({},h,e.animate&&Fe(e.animationDuration,e.animationEasing,h)),stroke:m.color,tabIndex:e.segmentsTabIndex,onBlur:E(e.onBlur,u),onClick:E(e.onClick,u),onFocus:E(e.onFocus,u),onKeyDown:E(e.onKeyDown,u),onMouseOver:E(e.onMouseOver,u),onMouseOut:E(e.onMouseOut,u)})});return e.background&&x.unshift(N.createElement(X,{cx:i,cy:d,key:"bg",lengthAngle:e.lengthAngle,lineWidth:f,radius:r,rounded:e.rounded,startAngle:e.startAngle,stroke:e.background})),x}var H={animationDuration:500,animationEasing:"ease-out",center:[50,50],data:[],labelPosition:50,lengthAngle:360,lineWidth:100,paddingAngle:0,radius:50,startAngle:0,viewBoxSize:[100,100]};function ze(t){var e=Object.assign({},H,t),n;for(n in H)t[n]===void 0&&(e[n]=H[n]);return e}function Ve(t){var e=ze(t),n=j.useState(e.animate?0:null),s=n[0],r=n[1];j.useEffect(function(){e.animate&&r(null)},[]);var o=Pe(e);return N.createElement("svg",{viewBox:"0 0 "+e.viewBoxSize[0]+" "+e.viewBoxSize[1],width:"100%",height:"100%",className:e.className,style:e.style},Ke(o,e,s),Te(o,e),e.children)}const O="https://mcnv3hcykt.us-east-2.awsapprunner.com",q=25e4,W=new he("https://prettiest-flashy-wind.solana-mainnet.quiknode.pro/45fee519abbd5d4cac5f5c12044119d868ae84cb/","processed");function Ye(){const[t,e]=j.useState(0),[n,s]=j.useState(0),[r,o]=j.useState(0),[i,d]=j.useState(0),[f,x]=j.useState(0),[m,u]=j.useState(!1),{publicKey:h,sendTransaction:k}=Ae(),[y,D]=j.useState(null),S=[{title:"Presale",value:10,color:"#4caf50"},{title:"Liquidity",value:40,color:"#2196f3"},{title:"Staking",value:25,color:"#FF69B4"},{title:"DAO Rewards",value:5,color:"#A020F0"},{title:"Development",value:10,color:"#ff9800"},{title:"Marketing",value:10,color:"#f44336"}],b=l=>new Intl.NumberFormat("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}).format(l);async function P(){try{const l=await V.get(`${O}/secrets/payer`),{key:g}=l.data;if(!g)throw new Error("Secret key is not defined in the backend response");const p=JSON.parse(g),v=Uint8Array.from(p);return xe.fromSecretKey(v)}catch(l){throw l}}const L=async(l,g,p)=>{try{const v={wallet_address:l,tokens_purchased:g*q,sol_received:g,transactionId:p},c=await V.post(`${O}/presale/transaction`,v,{headers:{"Content-Type":"application/json"}});if(c.status===200)return console.log("Contribution Successful:",c.data),c.data;throw new Error(c.data.detail||"Failed to contribute")}catch(v){throw v}};if(j.useEffect(()=>{const l=async()=>{try{const A=(await V.get(`${O}/api/presale/progress`)).data;e(A.progress_percentage||0),s(A.total_tokens_sold||0),o(A.total_sol_received||0)}catch{M.error("Failed to load presale progress.")}},g=async()=>{try{const A=await(await fetch(`${O}/api/presale/countdown`)).json();D(A)}catch(c){console.error("Failed to fetch countdown data:",c)}};l(),g();const p=setInterval(g,1e3),v=new Date;return v.setDate(v.getDate()+60),()=>{clearInterval(p)}},[]),!y)return a.jsx("p",{children:"Loading..."});const{days:K,hours:ne,minutes:se,seconds:re}=y.remaining_time,ie=l=>{d(l),x(l*q)},le=async()=>{if(i<=0){M.error("Please enter a valid SOL amount.");return}if(!h){M.error("Wallet not connected.");return}u(!0);try{const l=new z("H1SkWxyCZ1tAtSQ3xHaPrW5cs4N1EvJhpc7LCNtDN2sB"),g=new z("HNEgW597ZQwZAVL8iEaAc3aKv735pFTspVLqrJESpoth"),p=new z("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),v=9,c=await P(),A=await G(g,c.publicKey,!1,p),R=await G(g,h,!1,p),w=new fe;w.add(ge.transfer({fromPubkey:h,toPubkey:l,lamports:i*1e9})),await W.getAccountInfo(R)||w.add(ke(h,R,h,g,p));const T=f*10**v;w.add(we(A,R,c.publicKey,T,[],p)),w.feePayer=h;const C=await W.getLatestBlockhash();w.recentBlockhash=C.blockhash,w.partialSign(c);const I=await k(w,W);await W.confirmTransaction(I,"processed"),console.log(`Transaction successful: ${I}`),M.success(a.jsxs("div",{children:[a.jsx("strong",{children:"Transaction Successful!"}),a.jsx("br",{}),"You swapped ",b(i)," SOL for ",b(f)," RAID tokens.",a.jsx("br",{}),a.jsx("a",{href:`https://solscan.io/tx/${I}?cluster=mainnet-beta`,target:"_blank",rel:"noopener noreferrer",className:"text-indigo-400 underline",children:"View on Solscan"})]})),await L(h.toBase58(),i,I)}catch(l){console.error("Error during presale transaction:",l),M.error("Transaction failed. Please try again.")}finally{u(!1)}};return a.jsxs("div",{className:"relative bg-gradient-to-b from-gray-700 via-black to-gray-500 text-white min-h-screen py-16",style:{backgroundImage:"url('/presale_bg.png')",backgroundSize:"100% auto",backgroundPosition:"center"},children:[a.jsx(ve,{}),a.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-25"}),a.jsxs("div",{className:"relative max-w-3xl mx-auto px-6 z-10",children:[a.jsxs("h1",{className:"text-5xl font-extrabold text-center mb-8 relative",style:{fontFamily:"'Poppins', sans-serif",color:"#6C63FF"},children:[a.jsx("span",{children:"Presale is "}),a.jsx("span",{className:"animate-pulse",style:{color:"#FF0000",fontWeight:"bold"},children:"LIVE!"}),"🚀"]}),a.jsx("center",{children:a.jsx("h2",{className:"text-xl font-semibold text-red-300 mb-4"})}),a.jsxs("div",{className:"text-center",children:[a.jsx("h2",{className:"text-lg font-semibold text-red-300 mb-2 md:mb-4",children:"Ends in..."}),y.status==="expired"?a.jsx("p",{className:"text-sm",children:y.message}):a.jsxs("div",{className:"flex justify-center flex-wrap space-x-2 md:space-x-4",children:[a.jsxs("div",{className:"flip-clock-unit text-xs md:text-sm",children:[a.jsx("div",{className:"flip-clock-label",children:"Days"}),a.jsx("div",{className:"flip-clock-digit text-lg md:text-xl",children:K})]}),a.jsxs("div",{className:"flip-clock-unit text-xs md:text-sm",children:[a.jsx("div",{className:"flip-clock-label",children:"Hours"}),a.jsx("div",{className:"flip-clock-digit text-lg md:text-xl",children:ne})]}),a.jsxs("div",{className:"flip-clock-unit text-xs md:text-sm",children:[a.jsx("div",{className:"flip-clock-label",children:"Minutes"}),a.jsx("div",{className:"flip-clock-digit text-lg md:text-xl",children:se})]}),a.jsxs("div",{className:"flip-clock-unit text-xs md:text-sm",children:[a.jsx("div",{className:"flip-clock-label",children:"Seconds"}),a.jsx("div",{className:"flip-clock-digit text-lg md:text-xl",children:re})]})]})]}),a.jsx("p",{className:"text-center text-gray-300 mb-8 text-lg",children:"Swap your SOL for RAID tokens to be the first to join the decentralized GPU revolution!"}),a.jsxs("div",{className:"mb-8",children:[a.jsx("h2",{className:"text-2xl font-semibold text-indigo-300 mb-4",children:"Goal Progress"}),a.jsx("div",{className:"relative w-full bg-gray-700 h-6 rounded-lg overflow-hidden",children:a.jsx("div",{className:"absolute top-0 left-0 h-full bg-green-500",style:{width:`${b(t)}%`}})}),a.jsxs("div",{className:"flex justify-between mt-2 text-gray-300 text-sm",children:[a.jsxs("span",{children:[b(t),"% Complete"]}),a.jsxs("span",{children:["RAID Sold: ",b(n)]})]}),a.jsxs("div",{className:"text-right text-gray-300 text-sm",children:["SOL Received: ",b(r)]})]}),a.jsxs("div",{className:"bg-gray-800 p-6 rounded-lg shadow-lg bg-opacity-85",children:[a.jsx("h3",{className:"text-lg font-semibold text-white-300 mb-4 text-center",children:"Swap SOL for RAID"}),a.jsxs("div",{className:"flex flex-col gap-6",children:[a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx("img",{src:"/solana.jpg",alt:"SOL",className:"w-10 h-10"}),a.jsx("input",{type:"number",value:i,onChange:l=>ie(Number(l.target.value)),placeholder:"Enter SOL amount",className:"flex-grow px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx("img",{src:"/raid_token_close.png",alt:"RAID",className:"w-10 h-10"}),a.jsx("input",{type:"text",value:f,readOnly:!0,className:"flex-grow px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white"})]}),a.jsxs("p",{className:"text-center text-sm text-gray-400",children:["1 SOL = ",b(q)," RAID"]})]}),a.jsx("button",{onClick:le,disabled:m,className:`mt-4 w-full py-2 px-4 rounded-lg font-semibold text-white transition ${m?"bg-gray-500 cursor-not-allowed":"bg-indigo-500 hover:bg-indigo-600"}`,children:m?"Processing...":"Swap SOL for RAID"})]}),a.jsx("br",{}),a.jsxs("div",{className:"text-center mb-8",children:[a.jsx("h2",{className:"text-2xl font-bold text-indigo-400 mb-4",children:"RAID Tokenomics"}),a.jsx("div",{className:"flex justify-center relative",children:a.jsxs("svg",{width:"500",height:"500",viewBox:"0 0 500 500",className:"animate-fade-in",children:[a.jsx(Ve,{data:S,lineWidth:30,radius:30,animate:!0,segmentsStyle:{cursor:"pointer",transition:"stroke 0.3s ease-out"}}),a.jsx("text",{x:"250",y:"250",textAnchor:"middle",dominantBaseline:"middle",style:{fontSize:"24px",fontWeight:"bold",fill:"#fff"},children:"1 Billion Tokens"}),a.jsx("style",{children:`
                .animate-fade-in {
                  animation: fadeIn 5s ease-in-out;
                }

                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: scale(0.8);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}),S.map((l,g)=>{const v=(S.slice(0,g).reduce((I,oe)=>I+oe.value,0)+l.value/2)*(360/100)+90,c=(v-90)*Math.PI/180,A=250+120*Math.cos(c),R=250+120*Math.sin(c),w=250+160*Math.cos(c),U=250+160*Math.sin(c),T=250+190*Math.cos(c),C=250+190*Math.sin(c);return a.jsxs("g",{children:[a.jsx("line",{x1:A,y1:R,x2:w,y2:U,stroke:l.color,strokeWidth:"1"}),a.jsxs("text",{x:T,y:C,transform:`rotate(${v}, ${T}, ${C})`,textAnchor:T>250?"start":"end",dominantBaseline:"middle",style:{fontSize:"12px",fontWeight:"bold",fill:"#fff"},children:[l.title,": ",l.value,"%"]})]},l.title)})]})})]}),a.jsxs("div",{className:"text-center text-gray-300 mb-8",children:[a.jsx("h3",{className:"text-xl font-bold text-indigo-300 mb-4",children:"Additional Information"}),a.jsx("p",{className:"mb-4",children:"The RAID Token Presale is your opportunity to join the decentralized GPU revolution. Here’s how the tokens are distributed and the key presale details:"}),a.jsxs("ul",{className:"list-disc list-inside text-left mx-auto max-w-md",children:[a.jsxs("li",{children:[a.jsx("span",{className:"font-semibold",children:"I.C.O Price will periodically increase until release."})," "]}),a.jsxs("li",{children:[a.jsx("span",{className:"font-semibold",children:"Total Token Supply:"})," 1 Billion RAID"]}),a.jsxs("li",{children:[a.jsx("span",{className:"font-semibold",children:"Presale Allocation:"})," 10% (100 Million RAID)"]}),a.jsxs("li",{children:[a.jsx("span",{className:"font-semibold",children:"Presale Price:"})," 1 SOL = 250,000 RAID"]}),a.jsxs("li",{children:[a.jsx("span",{className:"font-semibold",children:"Liquidity Allocation:"})," 40% of total tokens"]}),a.jsxs("li",{children:[a.jsx("span",{className:"font-semibold",children:"Staking Allocation:"})," 25% reserved for staking rewards"]}),a.jsxs("li",{children:[a.jsx("span",{className:"font-semibold",children:"Presale End Date:"}),"  1/25/25"]})]}),a.jsx("p",{className:"mt-4",children:"Join the community today and secure your place in the future of GPU-driven decentralization."})]})]})]})}export{Ye as default};