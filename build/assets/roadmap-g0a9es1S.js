import{j as e}from"./tanstack-5zV8nv3g.js";import"./jotai-DjeRa5Ps.js";const r=[{quarter:"Q1 2025",title:"Launch RAID Token",description:"Initial token launch on Solana blockchain with foundational infrastructure for GPU contributions.",achieved:!0},{quarter:"Q2 2025",title:"GPU Contributor Program",description:"Onboarding initial contributors and launching staking rewards for GPU providers.",achieved:!1},{quarter:"Q3 2025",title:"Marketplace for AI Jobs",description:"Introduce a decentralized marketplace for AI training jobs leveraging GPU resources.",achieved:!1},{quarter:"Q4 2025",title:"Global Expansion",description:"Expand the RAID network to support more contributors, AI jobs, and enterprise partners globally.",achieved:!1}];function n(){return e.jsx("div",{className:"bg-gradient-to-b from-indigo-900 to-gray-900 text-white py-16",children:e.jsxs("div",{className:"max-w-5xl mx-auto px-6",children:[e.jsxs("h2",{className:"text-4xl font-bold text-center mb-12",children:[e.jsx("span",{className:"text-indigo-400",children:"RAID"})," Project Roadmap"]}),e.jsxs("div",{className:"relative flex items-center",children:[e.jsx("div",{className:"absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-600"}),r.map((t,a)=>e.jsxs("div",{className:"relative flex flex-col items-center w-1/4 px-4",children:[e.jsx("div",{className:`w-12 h-12 flex items-center justify-center text-lg font-bold rounded-full mb-4 z-10 ${t.achieved?"bg-green-500 text-white":"bg-gray-500"}`,children:t.achieved?"✓":a+1}),a<r.length-1&&e.jsx("div",{className:`absolute top-1/2 transform -translate-y-1/2 w-full h-1 z-0 ${t.achieved?"bg-green-500":"bg-gray-500"}`}),e.jsxs("div",{className:`relative flex flex-col items-center p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${t.achieved?"bg-indigo-800":"bg-gray-800"}`,children:[e.jsx("h3",{className:"text-xl font-semibold mb-2",children:t.quarter}),e.jsx("h4",{className:"text-lg font-medium text-indigo-300 mb-4",children:t.title}),e.jsx("p",{className:"text-sm text-gray-300 text-center",children:t.description})]})]},a))]})]})})}export{n as default};