import React from "react";
import { FiActivity } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">FocusFlow</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Simple, effective collaboration tools for achieving goals together. Built to make 
              accountability partnerships seamless and motivating.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Features</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Goal Groups</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Real-time Chat</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Progress Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Secure Platform</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 FocusFlow. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <span>Built with React & Socket.io</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
