import React, { useState } from 'react';
import { FiTarget, FiZap, FiUsers, FiPlus } from "react-icons/fi";
import JoinGroupModal from '../../modals/JoinGroupModal';
import CreateGroupModal from '../../modals/createGroupModal';
import Toast from '../../ui/Toast';

export default function HeroSection({ user, tasks }) {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  // Calculate real progress from tasks data
  const completedGoals = tasks?.statistics?.completed || 0;
  const totalGoals = tasks?.statistics?.total || 0;
  const currentStreak = user?.currentStreak || 0;
  const userName = user?.name || "there";

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleJoinSuccess = (message, groupData) => {
    showToast('success', message);  
  };

  const handleCreateSuccess = (message, groupData) => {
    showToast('success', `${message} Invite code: ${groupData.inviteCode}`);
  };

  return (
    <>
      <div className="bg-blue-600 rounded-xl p-8 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 right-20 w-20 h-20 bg-white opacity-5 rounded-full translate-y-4"></div>

        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Dynamic greeting */}
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {userName}!
              </h1>
              <p className="text-blue-100 mb-6 text-lg">
                Ready to crush your study goals today? Let's make progress together!
              </p>

              {/* Stats from API data */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <FiTarget className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-sm text-blue-100">Goals Today</p>
                    <p className="font-semibold">
                      {completedGoals} of {totalGoals}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FiZap className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-sm text-blue-100">Study Streak</p>
                    <p className="font-semibold">{currentStreak} days</p>
                  </div>
                </div>
              </div>

              {/* Updated buttons with modals */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowJoinModal(true)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg flex items-center space-x-2"
                >
                  <FiUsers className="w-5 h-5" />
                  <span>Join New Study Group</span>
                </button>

                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200 flex items-center space-x-2"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Create Group</span>
                </button>
              </div>
            </div>

            {/* Hero illustration/avatar */}
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={handleJoinSuccess}
      />
      
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
}
