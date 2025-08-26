import React, { useState } from 'react';
import { FiPlus, FiGrid } from 'react-icons/fi';
import GroupCard from './GroupCard';
import CreateGroupModal from '../../modals/createGroupModal';
import Toast from '../../ui/Toast';

export default function GroupsSection({ groups, recentTasks = [] }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  // Use real API data - combine owned and member groups
  const allGroups = [
    ...(groups?.memberOf || []),
    ...(groups?.owned || [])
  ];

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleCreateSuccess = (message, groupData) => {
    showToast('success', `${message} Invite code: ${groupData.inviteCode}`);
  };

  return (
    <>
      <section className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">My Study Groups</h2>
            <p className="text-gray-600 mt-1">
              Track progress with your study buddies • {allGroups.length} active groups
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Create Group Button */}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              <span className="font-medium">Create Group</span>
            </button>
          </div>
        </div>

        {/* Groups Grid - Pass tasks data to each card */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGroups.map(group => (
            <GroupCard 
              key={group.id} 
              group={group} 
              allTasks={recentTasks} 
            />
          ))}
        </div>

        {/* Empty State - Show when no groups */}
        {allGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiGrid className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first study group to start collaborating with others.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Create Your First Group
            </button>
          </div>
        )}
      </section>

      {/* Create Group Modal */}
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
