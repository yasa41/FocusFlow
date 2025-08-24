import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../services/api";
import { 
  FiUser, 
  FiZap, 
  FiTarget, 
  FiHeart, 
  FiStar, 
  FiTrendingUp, 
  FiBookOpen, 
  FiCode, 
  FiMusic, 
  FiCamera, 
  FiGlobe, 
  FiCoffee,
  FiArrowRight,
  FiCheck,
  FiX,
  FiRefreshCw
} from "react-icons/fi";

export default function ProfileCompletion({ userData, onComplete, onSkip }) {
  const [profileData, setProfileData] = useState({
    avatar: "",
    bio: "",
    interests: []
  });
  const [newInterest, setNewInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const avatarPhotos = [
    '/avatar1.png',
    '/avatar2.png',
    '/avatar3.png',
    '/avatar4.png',
    '/avatar5.png',
    '/avatar6.png'
  ];

  const predefinedInterests = [
    { name: "Coding", icon: <FiCode />, gradient: "from-blue-400 to-blue-600" },
    { name: "Fitness", icon: <FiZap />, gradient: "from-green-400 to-green-600" },
    { name: "Reading", icon: <FiBookOpen />, gradient: "from-purple-400 to-purple-600" },
    { name: "Music", icon: <FiMusic />, gradient: "from-pink-400 to-pink-600" },
    { name: "Photography", icon: <FiCamera />, gradient: "from-orange-400 to-orange-600" },
    { name: "Travel", icon: <FiGlobe />, gradient: "from-cyan-400 to-cyan-600" },
    { name: "Coffee", icon: <FiCoffee />, gradient: "from-amber-400 to-amber-600" },
    { name: "Goals", icon: <FiTarget />, gradient: "from-emerald-400 to-emerald-600" },
    { name: "Design", icon: <FiStar />, gradient: "from-indigo-400 to-indigo-600" },
    { name: "Business", icon: <FiTrendingUp />, gradient: "from-red-400 to-red-600" },
  ];

  useEffect(() => {
    console.log('ProfileCompletion received userData:', userData);
    
    if (userData) {
      setProfileData({
        avatar: userData.avatar || avatarPhotos[0],
        bio: userData.bio || "", 
        interests: userData.interests || []
      });
      
      // Set selected avatar index if user has an avatar
      if (userData.avatar) {
        const avatarIndex = avatarPhotos.findIndex(photo => photo === userData.avatar);
        if (avatarIndex !== -1) {
          setSelectedAvatar(avatarIndex);
        }
      }
    } else {
      // Set default avatar if no userData
      setProfileData(prev => ({
        ...prev,
        avatar: avatarPhotos[0]
      }));
    }
    setIsFetching(false); 
  }, [userData]);

  const handleAddInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, newInterest.trim()]
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter((interest) => interest !== interestToRemove)
    });
  };

  const addPredefinedInterest = (interest) => {
    if (!profileData.interests.includes(interest)) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, interest]
      });
    }
  };

  // Avatar selection
  const selectAvatar = (index) => {
    setSelectedAvatar(index);
    setProfileData({
      ...profileData,
      avatar: avatarPhotos[index]
    });
  };

  // Random avatar selection
  const selectRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatarPhotos.length);
    selectAvatar(randomIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log('Submitting profile data:', profileData);

    try {
      const response = await updateUserProfile(profileData);
      console.log('Update response:', response.data);
      
      if (response.data.success) {
        onComplete();
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  const progress = ((profileData.avatar ? 1 : 0) + (profileData.bio ? 1 : 0) + (profileData.interests.length > 0 ? 1 : 0)) / 3 * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      
      {/*Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 "></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 "></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 " ></div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 w-full max-w-5xl animate-[fadeInUp_0.8s_ease-out]">
          
          {/* Header */}
          <div className="text-center mb-8 animate-[slideInDown_0.6s_ease-out]">
            
            <h1 className="text-5xl font-bold bg-blue-600 bg-clip-text text-transparent mb-3">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 text-xl font-medium">
              Let's personalize your FocusFlow experience 
            </p>
            {userData && (
              <p className="text-sm text-gray-500 mt-2">
                Hello, {userData.name}! 
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-10 animate-[slideInLeft_0.6s_ease-out_0.3s_both]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 flex items-center">
                <FiTarget className="w-4 h-4 mr-2 text-blue-500" />
                Progress
              </span>
              <span className="text-sm font-bold text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Avatar Selection  */}
            <div className="space-y-6 animate-[slideInRight_0.6s_ease-out_0.6s_both]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Choose Your Profile Photo</h2>
                <button
                  type="button"
                  onClick={selectRandomAvatar}
                  className="ml-auto p-2 text-blue-500 hover:text-blue-700 transition-colors duration-300 hover:scale-110 transform"
                >
                  <FiRefreshCw className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {avatarPhotos.map((photo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectAvatar(index)}
                    className={`relative group transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 ${
                      selectedAvatar === index
                        ? "scale-110 -translate-y-2"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 ${
                        selectedAvatar === index
                          ? "ring-4 ring-blue-400 ring-offset-4 shadow-2xl"
                          : "shadow-lg group-hover:shadow-2xl"
                      }`}>
                        <img
                          src={photo}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Simplified fallback without avatarNames
                            e.target.style.backgroundColor = '#3B82F6';
                            e.target.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">${index + 1}</div>`;
                          }}
                        />
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Selected Avatar Preview */}
              <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={profileData.avatar}
                      alt="Selected Avatar"
                      className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white"
                      onError={(e) => {
                        e.target.style.backgroundColor = '#3B82F6';
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Selected Photo</p>
                    <p className="text-sm text-gray-600">
                      Avatar {selectedAvatar + 1}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section  */}
            <div className="space-y-6 animate-[slideInLeft_0.6s_ease-out_0.9s_both]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FiBookOpen className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Tell us about yourself</h2>
              </div>
              
              <div className="relative">
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Share your goals, interests, or what motivates you... "
                  className="w-full px-6 py-4 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 resize-none text-gray-700 placeholder-gray-500 shadow-inner text-lg leading-relaxed"
                  rows="4"
                  maxLength="200"
                />
                <div className="absolute bottom-3 right-4 text-sm font-medium text-gray-400 bg-white px-2 py-1 rounded-full">
                  {profileData.bio.length}/200
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="space-y-6 animate-[slideInUp_0.6s_ease-out_1.2s_both]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FiStar className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">What are you passionate about?</h2>
              </div>

              {/* Quick Select Interests */}
              <div className="space-y-4">
                <p className="text-lg font-semibold text-gray-700 flex items-center">
                  Quick select:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {predefinedInterests.map((interest, index) => (
                    <button
                      key={interest.name}
                      type="button"
                      onClick={() => addPredefinedInterest(interest.name)}
                      disabled={profileData.interests.includes(interest.name)}
                      className={`group relative flex items-center justify-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                        profileData.interests.includes(interest.name)
                          ? `bg-gray-400 ${interest.gradient} text-gray-600 cursor-not-allowed shadow-lg ring-2`
                          : "bg-white border-1 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-100 hover:shadow-lg"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="mr-2 text-lg">{interest.icon}</span>
                      {interest.name}
                      {profileData.interests.includes(interest.name) }
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Interest Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add your own interest... "
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 text-gray-700 placeholder-gray-500 shadow-inner text-lg"
                
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-6 py-4 bg-blue-600 text-white rounded-2xl hover:from-purple-600 hover: transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FiCheck className="w-6 h-6" />
                </button>
              </div>

              {/* Selected Interests */}
              {profileData.interests.length > 0 && (
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-gray-700 flex items-center">
                    Your interests:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {profileData.interests.map((interest, index) => (
                      <span
                        key={interest}
                        className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-200  to-blue-100 text-gray-800 rounded-full text-sm font-semibold border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 animate-[scaleIn_0.3s_ease-out]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="ml-2 w-5 h-5 text-gray-500 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-100 flex items-center justify-center"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl animate-[shake_0.5s_ease-in-out] shadow-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <FiX className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 animate-[slideInUp_0.6s_ease-out_1.5s_both]">
              <button
                type="button"
                onClick={onSkip}
                className="flex-1 py-4 px-8 border-2 border-gray-300 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 px-8 bg-blue-500  text-white font-bold rounded-2xl hover: transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Saving Profile...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <FiArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
