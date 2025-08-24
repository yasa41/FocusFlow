import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ProfileCompletion from '../pages/ProfileCompletion';

export default function Onboarding() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Calling /me endpoint...');
        const response = await getCurrentUser();
        console.log('/me response:', response.data); 
        
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          setError('Failed to load user data');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileComplete = () => {
    console.log('Profile completed, navigating to dashboard');
    navigate('/dashboard');
  };

  const handleProfileSkip = () => {
    console.log('Profile skipped, navigating to dashboard');
    navigate('/dashboard');  
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">Error: {error}</div>
          <button 
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProfileCompletion
      userData={userData}
      onComplete={handleProfileComplete}
      onSkip={handleProfileSkip}
    />
  );
}
