// DashboardFeature.tsx
import React from 'react';
import { AppHero } from '../ui/ui-layout';
import ParticleVisualization from './ParticleVisualization';

const links = [
    { label: 'Community', href: 'https://solanacookbook.com/' },
    { label: 'Whitepaper', href: 'https://github.com/solana-developers/' },
    { label: 'Roadmap', href: 'https://faucet.solana.com/' },
    { label: 'Mining Documentation', href: 'https://docs.solana.com/' },
    { label: 'Client Documentation', href: 'https://faucet.solana.com/' },
    { label: 'Contact Us', href: 'https://solana.stackexchange.com/' },

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
                <span className="text-indigo-400">I</span>D
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
                    <strong className="text-indigo-300">Remote AI Infrastructure Deployment (RAID) </strong> 
                    is an incentivized distributed GPU resource provisioning platform, built on <strong className="text-indigo-300">Solana</strong>.
                </p>
                <p>
                    RAID brings together a community of GPU contributors, investors, scientists, and engineers
                    who are fueling the future of artificial intelligence. By contributing your GPU’s computing power, 
                    you’re not only advancing the capabilities of AI but also earning rewards in RAID tokens. Every 
                    contribution counts toward creating a more decentralized, accessible, and efficient AI infrastructure.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition transform hover:-translate-y-1 hover:scale-105 hover:bg-indigo-700 text-center p-4 rounded-lg shadow-lg bg-indigo-800"
                        >
                            <p className="text-white font-semibold">{link.label}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
