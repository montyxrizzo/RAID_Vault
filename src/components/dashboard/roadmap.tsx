import  { useState, useEffect } from "react";

interface RoadmapMilestone {
  quarter: string;
  title: string;
  description: string;
  achieved: boolean;
}

const milestones: RoadmapMilestone[] = [
  {
    quarter: "Q4 2024",
    title: "Launch RAID Token",
    description:
      "Initial token launch on Solana blockchain with foundational infrastructure for GPU contributions.",
    achieved: true,
  },
  {
    quarter: "Q4 2024",
    title: "Staking Launch",
    description:
      "Enable users to earn RAID by staking SOL or LP tokens from the SOL/RAID liquidity pool, driving platform liquidity and incentivizing participation with competitive APY.",
    achieved: true,
  },
  
  
  {
    quarter: "Q1 2025",
    title: "DAO Launch",
    description:
      "Deploy a decentralized governance model empowering RAID holders to propose and vote on platform upgrades, fee structures, and strategic partnerships.",
    achieved: false,
  },
  
  
  {
    quarter: "Q2 2025",
    title: "GPU Contributor Program",
    description:
      "Onboarding initial contributors and launching staking rewards for GPU providers.",
    achieved: false,
  },
  {
    quarter: "Q3 2025",
    title: "Marketplace for GPU Intensive Jobs",
    description:
      "Introduce a decentralized marketplace for AI training jobs leveraging GPU resources.",
    achieved: false,
  },
  {
    quarter: "Q4 2025",
    title: "AI-Powered Resource Allocation",
    description:
      "Integrate AI-driven algorithms to optimize GPU resource allocation, maximizing efficiency and reducing costs for contributors and consumers.",
    achieved: false,
  },
  {
    quarter: "Q1 2026",
    title: "Enterprise Integration",
    description:
      "Partner with enterprise clients to onboard large-scale AI projects, offering competitive pricing and seamless integration with RAID’s marketplace.",
    achieved: false,
  },
  {
    quarter: "Q2 2026",
    title: "DeFi Integration",
    description:
      "Expand RAID’s utility by integrating it into Solana’s DeFi ecosystem for lending, borrowing, and liquidity mining with RAID tokens.",
    achieved: false,
  },
  {
    quarter: "Q3 2026",
    title: "Decentralized Storage for AI Models",
    description:
      "Launch decentralized storage for AI models and datasets, allowing developers to securely host and share resources within the RAID ecosystem.",
    achieved: false,
  },
  {
    quarter: "Q4 2026",
    title: "Global Expansion",
    description:
      "Expand the RAID network to support more contributors, AI jobs, and enterprise partners globally, solidifying RAID as a leader in decentralized AI infrastructure.",
    achieved: false,
  },
];

export default function RoadmapFeature() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const latestAchievedIndex = milestones.findIndex((m) => !m.achieved);


  return (
<div className="bg-gradient-to-b from-indigo-900 to-gray-900 text-white min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-indigo-400">RAID</span> Project Roadmap
        </h2>

        <div
          className={`relative flex ${
            isMobile ? "flex-col gap-y-12" : "flex-row gap-x-12"
          } items-center overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900`}
        >
          {/* Progress Line */}
          <div
            className={`absolute ${
              isMobile
                ? "h-full left-1/2 -translate-x-1/2 w-1"
                : "w-full h-1 top-1/2 -translate-y-1/2"
            } bg-gray-600`}
          ></div>

          <div
            className={`absolute ${
              isMobile
                ? "h-full left-1/2 -translate-x-1/2 w-1"
                : "w-full h-1 top-1/2 -translate-y-1/2"
            } bg-green-500`}
            style={{
              height: isMobile
                ? `${(latestAchievedIndex / (milestones.length - 1)) * 100}%`
                : "1px",
              width: isMobile
                ? "1px"
                : `${((latestAchievedIndex + 1) / milestones.length) * 100}%`,
            }}
          ></div>


  {milestones.map((milestone, index) => (
      <div
      key={index}
      className={`relative flex flex-col items-center w-full md:w-1/4 ${
        index === 0 ? "ml-0" : ""
      }`}
    >
      {/* Circle Indicator */}
      <div
        className={`w-12 h-12 flex items-center justify-center text-lg font-bold rounded-full mb-4 z-10 ${
          milestone.achieved ? "bg-green-500 text-white" : "bg-gray-500"
        }`}
      >
        {milestone.achieved ? "✓" : index + 1}
      </div>
      {/* Milestone Details */}
      <div
        className={`relative flex flex-col items-center p-3 md:p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
          milestone.achieved ? "bg-indigo-800" : "bg-gray-800"
        }`}
      >
        <h3 className="text-lg md:text-xl font-semibold mb-1">{milestone.quarter}</h3>
        <h4 className="text-base md:text-lg font-medium text-indigo-300 mb-3">
          {milestone.title}
        </h4>
        <p className="text-xs md:text-sm text-gray-300 text-center">
          {milestone.description}
          </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}