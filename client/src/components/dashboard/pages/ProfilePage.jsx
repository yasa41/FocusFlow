import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile } from '../../../services/api';
import { 
  FiEdit, FiMail, FiStar, FiTrendingUp, FiAward, 
  FiCalendar, FiTarget, FiZap, FiUsers, 
   FiSave
} from 'react-icons/fi';

export default function ProfilePage({ user }) {
  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDetailedProfile = async () => {
      setLoading(true);
      try {
        const response = await getCurrentUser();
        if (response.data.success) {
          setProfileData(response.data.user);
          setEditedData(response.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(editedData);
      setProfileData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const getAvatarDisplay = () => {
    if (profileData?.avatar) {
      return (
        <img 
          src={profileData.avatar} 
          alt="Profile" 
          className="w-full h-full object-cover rounded-3xl"
        />
      );
    }
    return (
      <span className="text-white text-4xl font-bold">
        {profileData?.name?.split(' ').map(n => n[0]).join('') || 'U'}
      </span>
    );
  };

 
  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-xl w-1/4"></div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-200/50">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gray-950 bg-clip-text text-transparent">
            Profile
          </h1>
          
          {!isEditing ? (
            <button 
              onClick={handleEdit}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiEdit className="w-4 h-4" />
              <span className="font-semibold">Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-3">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:transition-all duration-300 flex items-center space-x-2 shadow-lg disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span className="font-semibold">{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button 
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
               
                <span className="font-semibold">Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 overflow-hidden shadow-xl">
          
          {/* Profile Header */}
          <div className="relative bg-blue-500  p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 "></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {getAvatarDisplay()}
                </div>
                            </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="mb-4">
                 
                    <h2 className="text-3xl font-bold">{profileData?.name}</h2>
                 
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <FiMail className="w-4 h-4 text-white/80" />
                    <span className="text-white/90">{profileData?.email}</span>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mb-4">
                  {isEditing ? (
                    <textarea
                      value={editedData.bio || ''}
                      onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                      className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white/90 text-lg">
                      {profileData?.bio || 'No bio added yet. Click edit to add one!'}
                    </p>
                  )}
                </div>


                {/* Interests Tags */}
                <div className="flex flex-wrap gap-2">
                  {profileData?.interests?.map((interest, index) => (
                    <span key={index} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white border border-white/30">
                      #{interest}
                    </span>
                  ))}
                  {(!profileData?.interests || profileData.interests.length === 0) && (
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white/70 border border-white/30">
                      No interests added yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
              <span>Your Progress</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Points */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{(profileData?.totalPoints || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Current Streak */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <FiZap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{profileData?.currentStreak || 0} days</p>
                  </div>
                </div>
              </div>

              {/* Longest Streak */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Longest Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{profileData?.longestStreak || 0} days</p>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Active Groups</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(profileData?.groups?.length || 0) }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Data */}
            {profileData?.streakData && (
              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FiTarget className="w-5 h-5 text-blue-600" />
                  <span>Streak Breakdown</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Daily</span>
                      <span className="text-xl font-bold text-blue-600">{profileData.streakData.daily}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Weekly</span>
                      <span className="text-xl font-bold text-blue-600">{profileData.streakData.weekly}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Monthly</span>
                      <span className="text-xl font-bold text-blue-600">{profileData.streakData.monthly}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Member Since */}
            {profileData?.createdAt && (
              <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <FiCalendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(profileData.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
