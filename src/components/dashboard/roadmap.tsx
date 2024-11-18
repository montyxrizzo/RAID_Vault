// import React from "react";

interface RoadmapMilestone {
  quarter: string;
  title: string;
  description: string;
  achieved: boolean;
}

const milestones: RoadmapMilestone[] = [
  {
    quarter: "Q1 2025",
    title: "Launch RAID Token",
    description:
      "Initial token launch on Solana blockchain with foundational infrastructure for GPU contributions.",
    achieved: true,
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
    title: "Marketplace for AI Jobs",
    description:
      "Introduce a decentralized marketplace for AI training jobs leveraging GPU resources.",
    achieved: false,
  },
  {
    quarter: "Q4 2025",
    title: "Global Expansion",
    description:
      "Expand the RAID network to support more contributors, AI jobs, and enterprise partners globally.",
    achieved: false,
  },
];

export default function RoadmapFeature() {
  return (
    <div className="bg-gradient-to-b from-indigo-900 to-gray-900 text-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="text-indigo-400">RAID</span> Project Roadmap
        </h2>

        <div className="relative flex items-center">
          {/* Horizontal Timeline */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-600"></div>

          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center w-1/4 px-4"
            >
              {/* Circle Indicator */}
              <div
                className={`w-12 h-12 flex items-center justify-center text-lg font-bold rounded-full mb-4 z-10 ${
                  milestone.achieved ? "bg-green-500 text-white" : "bg-gray-500"
                }`}
              >
                {milestone.achieved ? "✓" : index + 1}
              </div>

              {/* Connecting Lines */}
              {index < milestones.length - 1 && (
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 w-full h-1 z-0 ${
                    milestone.achieved ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></div>
              )}

              {/* Milestone Details */}
              <div
                className={`relative flex flex-col items-center p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                  milestone.achieved ? "bg-indigo-800" : "bg-gray-800"
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{milestone.quarter}</h3>
                <h4 className="text-lg font-medium text-indigo-300 mb-4">
                  {milestone.title}
                </h4>
                <p className="text-sm text-gray-300 text-center">
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
