import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { AiOutlineRocket } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-blue-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl overflow-hidden">
        
          <div className="absolute inset-0 bg-black/5"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Focus & Achieve?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join people who are crushing their goals together. Find your accountability partners, 
              stay motivated, and make real progress.
            </p>
            
            {/*  CTA Button */}
            <div className="flex justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 hover:shadow-xl transition-all flex items-center space-x-2 group transform hover:scale-105 duration-200"
              >
                <AiOutlineRocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Start Your Journey</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            
          </div>
          
          {/* Animated Background Blobs */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
