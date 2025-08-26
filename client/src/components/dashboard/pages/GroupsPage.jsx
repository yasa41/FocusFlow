import React from 'react';
import GroupCard from '../MainContent/GroupCard'; 
import { createGroup } from '../../../services/api'; 
import { FiPlus, FiGrid } from 'react-icons/fi';

export default function GroupsPage({ groups }) {
  const allGroups = [...(groups?.memberOf || []), ...(groups?.owned || [])];

  const handleCreateGroup = async () => {
    try {
      const response = await createGroup(); 
      console.log('Group created:', response.data);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Study Groups</h1>
            <p className="text-gray-600 mt-2">Manage and join study groups • {allGroups.length} groups</p>
          </div>
          <button 
            onClick={handleCreateGroup}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create Group</span>
          </button>
        </div>
        
        {allGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiGrid className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups yet</h3>
            <p className="text-gray-500 mb-6">Create your first study group to start collaborating.</p>
            <button 
              onClick={handleCreateGroup}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGroups.map(group => (
              <GroupCard key={group.id} group={group} /> 
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
