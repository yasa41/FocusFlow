import React from "react";
import { FiUsers, FiTarget, FiMessageCircle, FiShield } from "react-icons/fi";

const Features = () => {
  const features = [
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Goal Groups",
      description:
        "Create or join groups with like-minded people working toward similar objectives",
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: "Progress Tracking",
      description:
        "Set goals, create tasks, and track your progress with accountability partners",
    },
    {
      icon: <FiMessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description:
        "Stay motivated with instant messaging and support from your group members",
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Secure & Protected",
      description:
        "Secure authentication, protected routes, and safe data handling you can trust",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Built for{" "}
            <span className="text-blue-600">Focused Collaboration</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to stay accountable, motivated, and on track
            toward your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 hover:border-blue-200"
            >
              <div
                className={`w-16 h-16 ${
                  index === 0
                    ? "bg-blue-500"
                    : index === 1
                    ? "bg-green-500"
                    : index === 2
                    ? "bg-purple-500"
                    : "bg-pink-500"
                } rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
