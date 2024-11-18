// import React from "react";

export default function WhitepaperPage() {
  return (
    <div className="bg-gradient-to-b from-indigo-900 to-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <h1 className="text-5xl font-bold text-center mb-12">
          <span className="text-indigo-400">RAID</span>: Powering AI with Distributed Efficiency
        </h1>

        {/* Abstract */}
        <section className="mb-12">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-indigo-400 mb-4">Abstract</h2>
            <p className="text-gray-300 leading-relaxed">
              RAID is a decentralized platform designed to bridge the gap between surplus GPU capacity and the growing
              computational demands of artificial intelligence (AI). By leveraging the Solana blockchain for secure
              and transparent transactions, RAID incentivizes users to contribute idle GPU resources and rewards them
              with RAID tokens. This white paper outlines the architecture, utility, and ecosystem of RAID, which aims
              to lower the costs of AI computation, enhance accessibility to high-performance infrastructure, and
              empower the global AI community.
            </p>
          </div>
        </section>

        {/* Sections */}
        <section className="space-y-12">
          {/* Section 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 p-6 bg-indigo-800 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-300 mb-2">1. Introduction</h3>
              <p className="text-gray-300 leading-relaxed">
                The exponential growth of AI and machine learning (ML) has led to unprecedented demands for
                computational resources. Centralized infrastructures are often expensive, underutilized, and
                inaccessible to smaller entities. RAID decentralizes GPU provisioning by creating an incentivized,
                trustless marketplace for GPU contributors and consumers.
              </p>
            </div>
            <div className="w-full md:w-2/3 p-6 bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-300 mb-2">2. Problem Statement</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  <strong className="text-indigo-400">Cost Inefficiencies:</strong> Centralized AI training platforms
                  incur high operational costs due to maintenance, overhead, and monopolistic pricing.
                </li>
                <li>
                  <strong className="text-indigo-400">Underutilized Resources:</strong> Millions of GPUs worldwide
                  remain idle, wasting computational potential.
                </li>
                <li>
                  <strong className="text-indigo-400">Access Inequality:</strong> Smaller enterprises and independent
                  researchers struggle to afford high-performance computing resources.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-2/3 p-6 bg-indigo-800 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-300 mb-2">3. RAID Platform Overview</h3>
              <p className="text-gray-300 leading-relaxed">
                RAID leverages the Solana blockchain for low-latency, high-throughput transactions. By combining a
                decentralized GPU marketplace with a transparent rewards system, RAID offers a scalable and
                cost-effective alternative to traditional cloud computing.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>
                  <strong className="text-indigo-400">Distributed GPU Resource Pooling:</strong> Users (providers) can
                  contribute unused GPU capacity to the RAID network.
                </li>
                <li>
                  <strong className="text-indigo-400">Incentivization:</strong> RAID tokens are distributed as rewards
                  for GPU contributions and staking activities.
                </li>
                <li>
                  <strong className="text-indigo-400">Blockchain Transparency:</strong> All transactions and resource
                  allocations are securely logged on the Solana blockchain.
                </li>
                <li>
                  <strong className="text-indigo-400">AI-Centric Ecosystem:</strong> RAID provides developers,
                  researchers, and organizations with access to cost-effective and distributed computational resources.
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3 p-6 bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-300 mb-2">4. Tokenomics</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  <strong className="text-indigo-400">Contributors:</strong> Earn tokens for providing GPU resources.
                </li>
                <li>
                  <strong className="text-indigo-400">Staking:</strong> Stake RAID tokens to earn rewards and secure
                  the ecosystem.
                </li>
                <li>
                  <strong className="text-indigo-400">Marketplace Payments:</strong> Use RAID tokens to pay for AI
                  training jobs.
                </li>
                <li>
                  <strong className="text-indigo-400">Governance:</strong> Participate in platform governance decisions.
                </li>
              </ul>
            </div>
          </div>
        </section>

    
       
      </div>
    </div>
  );
}
