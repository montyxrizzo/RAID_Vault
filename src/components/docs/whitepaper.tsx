// WhitepaperPage.tsx
import React from "react";

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
          {/* Introduction */}
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

            {/* Problem Statement */}
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

          {/* Tokenomics */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 p-6 bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-300 mb-2">4. Tokenomics</h3>
              <p className="text-gray-300 leading-relaxed">
                The RAID token is the native utility token for the platform, designed to power the decentralized GPU
                marketplace and incentivize network participation. It is an interest-bearing token with an annual
                percentage yield (APY) of 10%, leveraging the Solana Token Extension Program to provide seamless yield
                generation without the need for rebase or manual staking.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>
                  <strong className="text-indigo-400">Interest-Bearing:</strong> RAID tokens automatically accrue 10%
                  APY through Solana’s Token Extension Program, enabling consistent rewards for token holders while
                  maintaining a fixed supply model.
                </li>
                <li>
                  <strong className="text-indigo-400">Capped Supply:</strong> The total supply of RAID tokens is fixed
                  at <span className="text-indigo-300 font-semibold">1 billion tokens</span>, ensuring scarcity and
                  sustainable tokenomics.
                </li>
                <li>
                  <strong className="text-indigo-400">Earning RAID:</strong>
                  <ul className="list-disc ml-4">
                    <li>GPU Rewards: Earn tokens based on uptime and performance benchmarks.</li>
                    <li>Staking Rewards: Stake RAID tokens to secure the network and earn proportional rewards.</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-indigo-400">Utility:</strong> Use RAID tokens for payments, governance, and
                  staking.
                </li>
                <li>
                  <strong className="text-indigo-400">Deflationary Mechanisms:</strong> A portion of transaction fees
                  and marketplace payments are burned, enhancing long-term token value.
                </li>
              </ul>
            </div>

            {/* Governance */}
           {/* Governance */}
<div className="w-full md:w-2/3 p-6 bg-indigo-800 rounded-lg shadow-lg">
  <h3 className="text-2xl font-semibold text-indigo-300 mb-2">5. Governance</h3>
  <p className="text-gray-300 leading-relaxed">
    RAID employs a decentralized autonomous organization (DAO) for governance, allowing token holders to
    actively shape the platform’s future. By holding RAID tokens, users gain voting rights and the ability
    to propose or decide on changes to the platform, ensuring that RAID evolves as a community-driven
    platform.
  </p>
  
  <h4 className="text-xl font-semibold text-indigo-400 mt-4">Key Governance Features:</h4>
  <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
    <li>
      <strong className="text-indigo-400">Platform Upgrades:</strong> Proposals for introducing new features,
      optimizing task allocation mechanisms, or integrating advanced AI frameworks.
    </li>
    <li>
      <strong className="text-indigo-400">Fee Structures:</strong> Voting on adjustments to transaction or staking
      fees to balance ecosystem incentivization and long-term sustainability.
    </li>
    <li>
      <strong className="text-indigo-400">Partnerships:</strong> Approving strategic collaborations with enterprises,
      research institutions, or other DeFi projects to enhance RAID’s ecosystem.
    </li>
    <li>
      <strong className="text-indigo-400">Tokenomics Adjustments:</strong> Governance decisions on mechanisms such as
      deflationary token burns, staking reward rates, or APY optimization.
    </li>
  </ul>
  
  <h4 className="text-xl font-semibold text-indigo-400 mt-4">DAO Voting Mechanisms:</h4>
  <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
    <li>
      <strong className="text-indigo-400">Proposals:</strong> Any RAID token holder can submit a proposal after
      staking a minimum number of tokens. This ensures that only serious, well-considered proposals reach the
      voting stage.
    </li>
    <li>
      <strong className="text-indigo-400">Quadratic Voting:</strong> A system designed to give more balanced
      representation, allowing smaller stakeholders to have meaningful input alongside larger holders.
    </li>
    <li>
      <strong className="text-indigo-400">Transparency:</strong> All proposals, votes, and governance decisions are
      immutably recorded on the Solana blockchain for full transparency and auditability.
    </li>
  </ul>

  <h4 className="text-xl font-semibold text-indigo-400 mt-4">Benefits of Community Governance:</h4>
  <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
    <li>
      <strong className="text-indigo-400">Aligned Incentives:</strong> Token holders have a direct stake in RAID’s
      success, fostering decision-making that prioritizes long-term growth and sustainability.
    </li>
    <li>
      <strong className="text-indigo-400">Decentralization:</strong> Governance is distributed among the community,
      preventing centralization of power and ensuring diverse perspectives.
    </li>
    <li>
      <strong className="text-indigo-400">Adaptability:</strong> The DAO can quickly adapt to industry changes or
      community needs through consensus-driven decision-making.
    </li>
    <li>
      <strong className="text-indigo-400">Inclusivity:</strong> With mechanisms like quadratic voting, RAID ensures
      that smaller stakeholders have meaningful input, enhancing fairness and community trust.
    </li>
  </ul>

  <p className="text-gray-300 mt-4">
    With RAID’s DAO governance model, stakeholders can actively guide the platform’s evolution, ensuring that
    RAID remains transparent, adaptable, and community-focused in an ever-changing AI and blockchain
    landscape.
  </p>
</div>
</div>
{/* Financial Strategy and Incentives */}
<div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 mt-12">
  <h3 className="text-3xl font-semibold text-indigo-400 mb-4 text-center">6. Financial Strategy and Incentives</h3>

  <p className="text-gray-300 leading-relaxed mb-6">
    RAID is uniquely positioned to disrupt the cloud computing industry by offering GPU services at a fraction of the 
    cost of centralized providers like Microsoft Azure and AWS. This competitive pricing is enabled by RAID's decentralized 
    network of contributors who offer surplus GPU resources, reducing overhead while maintaining world-class performance.
  </p>

  <h4 className="text-2xl font-semibold text-indigo-300 mb-2">Key Advantages:</h4>
  <ul className="list-disc list-inside text-gray-300 space-y-3 mb-6">
    <li>
      <strong className="text-indigo-400">Radically Lower Costs:</strong> RAID’s decentralized model eliminates traditional 
      overhead costs, allowing us to price GPU resources at <span className="text-indigo-300 font-bold">30%-70% lower</span> 
      than major cloud providers.
    </li>
    <li>
      <strong className="text-indigo-400">Token-Based Payments:</strong> Clients pay for compute services using RAID tokens, 
      creating continuous demand for the token while circulating rewards back to the ecosystem.
    </li>
    <li>
      <strong className="text-indigo-400">Transparent Pricing:</strong> Unlike opaque pricing models in traditional cloud 
      services, RAID offers fixed, predictable pricing tiers based on GPU benchmarks and workload intensity.
    </li>
    <li>
      <strong className="text-indigo-400">No Subscription Overheads:</strong> Unlike traditional providers requiring expensive 
      monthly subscriptions, RAID users only pay for the compute resources they consume, ensuring fairness and flexibility.
    </li>
  </ul>

  <h4 className="text-2xl font-semibold text-indigo-300 mb-2">Payment Flow with RAID Tokens:</h4>
  <div className="bg-indigo-900 p-4 rounded-lg shadow-inner">
    <ol className="list-decimal list-inside text-gray-300 space-y-2">
      <li>
        <strong className="text-indigo-400">GPU Consumers:</strong> AI researchers, developers, and organizations purchase RAID 
        tokens through decentralized exchanges or partnerships to fund their workloads.
      </li>
      <li>
        <strong className="text-indigo-400">Direct Payment:</strong> Consumers allocate RAID tokens directly to GPU contributors 
        for completed tasks, ensuring instantaneous, trustless payment without intermediaries.
      </li>
      <li>
        <strong className="text-indigo-400">Ecosystem Growth:</strong> Tokens earned by contributors can be:
        <ul className="list-disc ml-6 mt-1">
          <li>Re-staked for additional rewards.</li>
          <li>Traded on the open market for liquidity.</li>
          <li>Used for governance voting within the RAID DAO.</li>
        </ul>
      </li>
    </ol>
  </div>

  <h4 className="text-2xl font-semibold text-indigo-300 mt-6 mb-2">Investor Appeal:</h4>
  <p className="text-gray-300 leading-relaxed mb-6">
    The RAID platform not only provides immediate cost savings to GPU consumers but also ensures a deflationary tokenomics 
    model that drives long-term value for investors. With an increasing demand for decentralized compute, RAID tokens 
    serve as the backbone of a rapidly expanding market, offering tangible utility, continuous demand, and significant 
    potential for price appreciation.
  </p>

  <h4 className="text-2xl font-semibold text-indigo-300 mb-2">Competitive Differentiators:</h4>
  <ul className="list-disc list-inside text-gray-300 space-y-3">
    <li>
      <strong className="text-indigo-400">Elastic Pricing:</strong> RAID dynamically adjusts its pricing based on GPU supply 
      and demand, ensuring market-driven competitiveness while avoiding the rigid structures of centralized providers.
    </li>
    <li>
      <strong className="text-indigo-400">Decentralized Efficiency:</strong> By leveraging idle GPU resources globally, RAID 
      unlocks computational potential without investing in costly data center infrastructure.
    </li>
    <li>
      <strong className="text-indigo-400">Token Utility Integration:</strong> All ecosystem activities—staking, governance, 
      and GPU payments—drive intrinsic value to RAID tokens, creating an economy that grows with platform adoption.
    </li>
  </ul>

  <h4 className="text-2xl font-semibold text-indigo-300 mt-6 mb-2">Future Financial Enhancements:</h4>
  <ul className="list-disc list-inside text-gray-300 space-y-3">
    <li>
      <strong className="text-indigo-400">Enterprise Integration:</strong> Partnerships with enterprise clients to 
      onboard RAID as an alternative to traditional cloud contracts, starting with AI-focused industries.
    </li>
    <li>
      <strong className="text-indigo-400">Subscription Discounts:</strong> Introduce subscription models for bulk GPU usage 
      where RAID tokens offer exclusive discounts for long-term contracts.
    </li>
    <li>
      <strong className="text-indigo-400">Tiered Rewards:</strong> Advanced contributors providing high-performance GPUs 
      earn additional rewards, ensuring a balance between cost efficiency and performance incentives.
    </li>
  </ul>
</div>

        </section>
      </div>
    </div>
  );
}
