import{j as t}from"./tanstack-DR812mCo.js";import{N as L}from"./reactRouter-BD6g50n5.js";import{W as I}from"./index-BFVe3ivS.js";import{r as s}from"./jotai-BfEc3ju9.js";import{u as T,a as k}from"./react-spring_web.modern-4WN5RAKD.js";import{k as O,a as D,Q as u}from"./react-toastify.esm-DK5EKzzP.js";import{C as U,P as C}from"./solanaWeb3-DueJrBLx.js";import{E as $}from"./solanaWalletAdapters-BkS1YMsu.js";import"./react-Cgq1nV1S.js";import"./reactHotToast-Cdds-pcr.js";import"./tabler-D-SEmZVT.js";import"./index-BAMY2Nnw.js";function z(){const{publicKey:l}=$(),x=new U("https://prettiest-flashy-wind.solana-mainnet.quiknode.pro/45fee519abbd5d4cac5f5c12044119d868ae84cb/","processed"),i="https://mcnv3hcykt.us-east-2.awsapprunner.com",[h,p]=s.useState(0),[n,f]=s.useState(0),[g,b]=s.useState(0),[w,j]=T(()=>({number:0,config:{tension:120,friction:14}})),[N,S]=s.useState(0),y=e=>new Intl.NumberFormat("en-US").format(Math.round(e)),m=e=>new Intl.NumberFormat("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}).format(e),P=e=>new Intl.NumberFormat("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}).format(e),v=async()=>{try{const e=await D.get(`${i}/staking-data/reward-rate`);S(e.data.apy)}catch(e){console.error("Error fetching APY:",e),u.error("Failed to fetch APY.")}},A=async()=>{const e=Date.now(),r=30*60*1e3;if(e-g<r&&n>0)return console.log("Using cached SOL price"),n;try{const o=await fetch(`${i}/staking-data/sol-price`);if(!o.ok)throw new Error(`Failed to fetch SOL price. Status: ${o.status}`);const c=(await o.json()).price;return f(c),b(e),console.log("Fetched new SOL price from backend:",c),c}catch(o){return console.error("Error fetching SOL price:",o),n}},F=new C("8KNDibG6RAc1tE2i3UKboiQ1tdf7JuwLWjCTnVNChcP9"),E=async()=>{var e;try{const r=await x.getParsedAccountInfo(F);if(!r||!((e=r.value)!=null&&e.lamports))throw new Error("Stake pool account not found or contains no data");const o=r.value.lamports||0;try{const a=Number(o)/1e9;return p(a),console.log("Total SOL in Pool:",a),a}catch(a){throw console.error("Error parsing stake pool account data:",a),new Error("Unable to parse raw buffer data")}}catch(r){return console.error("Error fetching total SOL in pool:",r),u.error("Failed to fetch total SOL in pool."),0}},d=async()=>{const e=await E(),r=await A(),o=e*r;j({number:o})};return s.useEffect(()=>{d(),v();const e=setInterval(d,3e4);return()=>clearInterval(e)},[]),l?t.jsx(L,{to:`/account/${l.toString()}`,replace:!0}):t.jsxs("div",{className:"bg-gradient-to-b from-purple-900 to-indigo-900 min-h-screen p-6 flex flex-col items-center text-gray-200",children:[t.jsx(O,{}),t.jsxs("div",{className:"max-w-3xl w-full text-center mb-8",children:[t.jsxs("h1",{className:"text-4xl font-bold text-teal-400 mb-4",children:["Earn ",t.jsx("span",{className:"text-white",children:"RAID"})," by Staking! 🚀"]}),t.jsxs("p",{className:"text-gray-300 text-lg",children:["Stake your SOL to help secure the network, earn rewards, and receive"," ",t.jsx("span",{className:"text-teal-400 font-semibold",children:"RADEON"})," to earn"," ",t.jsx("span",{className:"text-teal-400 font-semibold",children:"RAID"})," tokens — your gateway to affordable high-performance GPU resources; an investment in the futures of both AI & Crypto."]})]}),t.jsxs("div",{className:"max-w-xl w-full bg-indigo-800 shadow-lg rounded-lg p-6 mb-6",children:[t.jsx("h2",{className:"text-3xl font-bold text-teal-400 mb-4 text-center",children:"Vault Metrics"}),t.jsxs("p",{className:"text-gray-300 text-center text-lg",children:[t.jsx("strong",{children:"Total SOL in Pools:"})," ",t.jsxs("span",{className:"text-white",children:[m(h)," SOL"]})]}),t.jsxs("p",{className:"text-gray-300 text-center text-lg",children:[t.jsx("strong",{children:"SOL Price:"})," ",t.jsxs("span",{className:"text-white",children:["$",m(n)," USD"]})]}),t.jsx("p",{className:"text-center text-2xl font-bold text-teal-300 mt-6",children:"Total Value Locked (TVL):"}),t.jsx("div",{className:"flex justify-center mt-4",children:t.jsx("div",{className:"bg-gray-900 text-teal-400 font-mono font-extrabold text-5xl p-6 rounded-lg shadow-lg",children:t.jsx(k.div,{children:w.number.to(e=>`$${P(e)}`)})})})]}),t.jsx("div",{className:"text-center mt-6",children:t.jsxs("span",{className:"text-gray-400 text-lg font-medium",children:["You could be earning up to",t.jsxs("span",{className:"text-[#9945FF] font-bold",children:[" ",y(N*100),"% "]}),"APY right now..."]})}),t.jsx("br",{}),t.jsxs("p",{className:"text-white text-sm",children:["Select your ",t.jsx("span",{className:"text-[#9945FF]",children:"Solana"})," wallet to continue!"]}),t.jsx("br",{}),t.jsx(I,{})]})}export{z as default};