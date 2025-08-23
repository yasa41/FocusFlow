import React, { useState, useEffect } from "react";
import { FiZap, FiCheckCircle, FiMessageCircle, FiArrowRight, FiUsers, FiCheck, FiClock } from "react-icons/fi";
import { AiOutlineRocket } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { scrollToSection } from "../../hooks/smoothScroll";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleSeeFeatures = (e) => {
    scrollToSection(e, 'features');
  };

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Main heading - updated for FocusFlow branding */}
            <h1 className="text-5xl lg:text-6xl font-bold text-blue-600 leading-tight mb-6">
              Focus. Collaborate. Achieve.
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your partner in reaching goals, whether it's <strong>coding</strong>, 
              <strong> health</strong>, <strong>study</strong>, or any personal challenge. 
              Everything you need for focused collaboration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleGetStarted}
                className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl group"
              >
                <AiOutlineRocket className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Collaborating
                <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Fixed "See Features" button with scroll functionality */}
              <button 
                onClick={handleSeeFeatures}
                className="flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 hover:shadow-md"
              >
                <FiMessageCircle className="w-5 h-5 mr-2" />
                See Features
              </button>
            </div>
          </div>

          {/* Dashboard Preview - updated with FocusFlow branding */}
          <div
            className={`relative transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="ml-4 text-sm text-gray-500 font-medium">FocusFlow</div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <FiUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Focus Flow Group</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        8 members online
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-bold text-sm">Active Group</div>
                    <div className="text-xs text-gray-500">5 tasks pending</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Recent Tasks</div>
                  {[
                    { task: "Refactor React Components", status: "completed", time: "15 mins ago" },
                    { task: "Daily Coding Challenge", status: "in-progress", time: "Active now" },
                    { task: "Read Productivity Articles", status: "pending", time: "Due today" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === "completed" ? "bg-green-500" :
                        item.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{item.task}</div>
                        <div className="text-xs text-gray-500">{item.time}</div>
                      </div>
                      <div className="flex-shrink-0">
                        {item.status === "completed" ? (
                          <FiCheck className="w-4 h-4 text-green-500" />
                        ) : item.status === "in-progress" ? (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiClock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-400 rounded-2xl flex items-center justify-center animate-bounce shadow-lg">
              <FiMessageCircle className="w-10 h-10 text-white" />
            </div>

            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
              <FiUsers className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>
    </section>
  );
};

export default Hero;
