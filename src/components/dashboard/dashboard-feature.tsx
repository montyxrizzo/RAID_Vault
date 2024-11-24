// DashboardFeature.tsx
// import React from 'react';
import { AppHero } from '../ui/ui-layout';
import ParticleVisualization from './ParticleVisualization';
import { Link } from 'react-router-dom';

const links = [
    { label: 'Presale', to: '/get-raid', className: "text-green-400 font-semibold", isInternal: true },  

    { label: 'Staking', to: '/account', className: "text-white-400 font-semibold", isInternal: true },  
      { label: 'R-DAO', href: '/', disable :true },
    { label: 'Compute Client Portal', href: '/', disable :true },
    { label: 'GPU Provider Program', href: 'https://github.com/montyxrizzo/GPU_Provider_Program',rel:"noopener noreferrer",
        className:"text-green-400 font-semibold",  disable :true },

];


export default function DashboardFeature() {
    return (
        <div className="bg-gradient-to-b from-purple-900 to-indigo-900 text-white min-h-screen relative overflow-hidden">
            {/* Hero section with particle background */}
            <div className="relative flex justify-center items-center h-96">
                {/* Particle background positioned absolutely */}
                <div className="absolute inset-0 z-0">
                    <ParticleVisualization />
                </div> 

                {/* AppHero content positioned above particles */}
                <div className="relative z-10">
                    <AppHero
                        title={
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
                                R<span className="text-indigo-400">A</span>
                                <span className="text-indigo-400">I</span>D Network
                            </h1>
                        }
                        subtitle={
                            <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-indigo-200 mt-4 max-w-2xl mx-auto leading-snug">
                                Powering AI with Distributed Efficiency—Rewarding You, Lowering Costs, Driving Innovation
                            </p>
                        }
                    />
                </div>
            </div>

            <div className="max-w-3xl mx-auto py-12 px-6 sm:px-8 lg:px-10 text-center space-y-6">
                <p className="text-lg md:text-xl font-light leading-relaxed">
                    <strong className="text-indigo-300">Remote AI Infrastructure Deployment (RAID)</strong> is an
                    incentivized distributed GPU resource provisioning platform, built on{' '}
                    <strong className="text-indigo-300">Solana</strong>.
                </p>
                <p>
                    RAID brings together a community of GPU contributors, investors, scientists, and engineers who are
                    fueling the future of artificial intelligence. By contributing your GPU’s computing power, you’re
                    not only advancing the capabilities of AI but also earning rewards in RAID tokens. Every
                    contribution counts toward creating a more decentralized, accessible, and efficient AI
                    infrastructure.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                {links.map((link, index) => 
                    link.isInternal ? (
                    <Link
                        key={index}
                        to={link.disable ? "#" : link.to}  // If disabled, set `to` to '#' (non-functional link)
                        className={`transition transform hover:-translate-y-1 hover:scale-105 hover:bg-indigo-700 text-center p-4 rounded-lg shadow-lg bg-indigo-800 ${
                        link.className || "text-white font-semibold"
                        } ${link.disable ? "pointer-events-none opacity-50" : ""}`} // Disable link interaction and add opacity
                    >
                        <p>{link.label}</p>
                    </Link>
                    ) : (
                    <a
                        key={index}
                        href={link.disable ? "#" : link.href}  // If disabled, set `href` to '#' (non-functional link)
                        target={link.disable ? "" : "_blank"}  // If disabled, don't open in new tab
                        rel={link.disable ? "" : link.rel || "noopener noreferrer"}  // If disabled, no rel
                        className={`transition transform hover:-translate-y-1 hover:scale-105 hover:bg-indigo-700 text-center p-4 rounded-lg shadow-lg bg-indigo-800 ${
                        link.className || "text-white font-semibold"
                        } ${link.disable ? "pointer-events-none opacity-50" : ""}`} // Disable link interaction and add opacity
                    >
                        <p>{link.label}</p>
                    </a>
                    )
                )}
                </div>

            </div>

            {/* Footer with Social Links */}
            <footer className="bg-indigo-800 text-white py-6 mt-12">
                <div className="flex justify-center space-x-8">
                    <a
                        href="https://discord.gg/GqcXHf3H"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-teal-400 transition"
                    >
                        <img
                            src="/icons8-discord.svg"
                            alt="Discord"
                            className="w-6 h-6"
                        />
                        <span className="font-small">Join us on Discord</span>
                    </a>
                    <a
                        href="https://x.com/raidnetfinance?s=11"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-teal-400 transition"
                    >
                        <img
                            src="/icons8-x.svg"
                            alt="X"
                            className="w-6 h-6"
                        />
                        <span className="font-small">Follow us on X</span>
                    </a>
                </div>
            </footer>
        </div>
    );
}
