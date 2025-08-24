import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../services/api'; // ✅ Your existing API
import { FiEdit, FiMail, FiUser, FiStar } from 'react-icons/fi';

export default function ProfilePage({ user }) {
  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetailedProfile = async () => {
      setLoading(true);
      try {
        const response = await getCurrentUser(); // ✅ Your existing /me endpoint
        if (response.data.success) {
          setProfileData(response.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedProfile();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <FiEdit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {profileData?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profileData?.name}</h2>
                <p className="text-gray-600">Level {profileData?.level || 1}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profileData?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FiStar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Total Points</p>
                    <p className="font-medium">{profileData?.totalPoints?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Current Streak</p>
                    <p className="font-medium">{profileData?.currentStreak || 0} days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
