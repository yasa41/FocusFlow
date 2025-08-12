// src/components/ProfileCompletion.js
import React, { useState } from "react";
import { updateUserProfile } from "../services/api"; 

export default function ProfileCompletion({ onComplete, onSkip }) {
  const [profileData, setProfileData] = useState({
    avatar: "",
    bio: "",
    interests: []
  });
  const [newInterest, setNewInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Predefined interest options
  const predefinedInterests = [
    "Mathematics", "Science", "Programming", "Literature", "History",
    "Art", "Music", "Sports", "Languages", "Psychology", "Business",
    "Technology", "Medicine", "Engineering", "Philosophy"
  ];

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
      interests: profileData.interests.filter(interest => interest !== interestToRemove)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await updateUserProfile(profileData);
      if (response.data.success) {
        onComplete();
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-300 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">Help us personalize your StudySync experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Avatar
            </label>
            <div className="flex flex-wrap gap-3">
              {["😊", "🎓", "📚", "🚀", "🎯", "⭐", "🌟", "🔥"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setProfileData({ ...profileData, avatar: emoji })}
                  className={`w-12 h-12 text-2xl rounded-full border-2 transition-all ${
                    profileData.avatar === emoji
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio (Optional)
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Tell us a bit about yourself..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              maxLength="200"
            />
            <p className="text-sm text-gray-500 mt-1">
              {profileData.bio.length}/200 characters
            </p>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            
            {/* Predefined interests */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => addPredefinedInterest(interest)}
                    disabled={profileData.interests.includes(interest)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      profileData.interests.includes(interest)
                        ? "bg-blue-100 border-blue-300 text-blue-700 cursor-not-allowed"
                        : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom interest input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add custom interest"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Selected interests */}
            {profileData.interests.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Your interests:</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
