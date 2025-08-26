import React from "react";
import { FiUser, FiUsers, FiMessageCircle } from "react-icons/fi";

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Sign up securely and set up your profile. Takes less than a minute.",
      icon: <FiUser className="w-8 h-8" />,
    },
    {
      step: "2",
      title: "Find Your Tribe",
      description: "Join goal-focused groups or create your own accountability circle.",
      icon: <FiUsers className="w-8 h-8" />,
    },
    {
      step: "3",
      title: "Focus & Achieve Together",
      description: "Track progress, chat with peers, and celebrate wins together.",
      icon: <FiMessageCircle className="w-8 h-8" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Getting Started is Simple
          </h2>
          <p className="text-xl text-gray-600">Three steps to focused collaboration</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-10 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-blue-300 -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg hover:bg-blue-700 transition-colors duration-200 relative z-20">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
