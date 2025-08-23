import React, { useState } from "react";
import { loginUser, registerUser } from "../services/api"; 
import ProfileCompletion from "./ProfileCompletion";
import { FiArrowLeft, FiBook, FiEye, FiEyeOff} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./SlidingAuth.css";

export default function SlidingAuth() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await registerUser(signUpData.name, signUpData.email, signUpData.password);

      if (response.data.success) {
        setSignUpData({ name: "", email: "", password: "" });
        setShowProfileCompletion(true);
      } else {
        setError(response.data.message || "Sign up failed");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Sign up failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginUser(signInData.email, signInData.password);
      if (response.data.success) {
        setSignInData({ email: "", password: "" });
        window.location.href = "/dashboard";
      } else {
        setError(response.data.message || "Sign in failed");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid credentials");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = () => {
    window.location.href = "/dashboard";
  };

  const handleProfileSkip = () => {
    window.location.href = "/dashboard";
  };

  if (showProfileCompletion) {
    return (
      <ProfileCompletion
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>


      {/* Top Navigation */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group text-sm md:text-base"
        >
          <FiArrowLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-1 transition-transform" />
          <span className="text-blue-600 font-medium hidden sm:inline">Back to Home</span>
          <span className="text-blue-600 font-medium sm:hidden">Back</span>
        </button>
      </div>

      {/* Logo in top right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <div className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiBook className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </div>
          <span className="text-base md:text-lg font-bold text-blue-600">FocusFlow</span>
        </div>
      </div>

      {/* Mobile Form Toggle (only visible on mobile) */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <div className="flex bg-white/90 backdrop-blur-md rounded-full p-1 shadow-lg">
          <button
            onClick={() => setIsSignUpMode(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !isSignUpMode 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUpMode(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isSignUpMode 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Main Auth Container with entrance animation */}
      <div className={`auth-container animate-fade-in-up ${isSignUpMode ? "right-panel-active" : ""}`}>
        
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit} className="auth-form">
            <div className="form-header">
              <h2 className="form-title">Join FocusFlow</h2>
              <p className="form-subtitle">Start your goal achievement journey</p>
            </div>
            
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={signUpData.name}
                onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                className="auth-input"
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className="auth-input"
                required
              />
            </div>
            
            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {error && (
              <div className="error-message animate-shake">
                {error}
              </div>
            )}
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Start Your Journey"
              )}
            </button>

            <p className="form-footer">
              By signing up, you agree to our Terms & Privacy Policy
            </p>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit} className="auth-form">
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Continue your goal achievement journey</p>
            </div>
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                className="auth-input"
                required
              />
            </div>
            
            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {error && (
              <div className="error-message animate-shake">
                {error}
              </div>
            )}
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                "Continue Focusing"
              )}
            </button>

            <a href="#" className="forgot-password">
              Forgot your password?
            </a>
          </form>
        </div>

        {/* Enhanced Overlay Panel */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <div className="overlay-content">
                <h2 className="overlay-title">Ready to Focus?</h2>
                <p className="overlay-text">
                  Sign in to continue your goal achievement journey and reconnect with your accountability partners.
                </p>
                
                <button 
                  className="ghost-button" 
                  onClick={() => setIsSignUpMode(false)}
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="overlay-panel overlay-right">
              <div className="overlay-content">
                <h2 className="overlay-title">Start Your Journey!</h2>
                <p className="overlay-text">
                  Join thousands who are crushing their goals together. Find your accountability partners and make real progress.
                </p>
               
                <button 
                  className="ghost-button" 
                  onClick={() => setIsSignUpMode(true)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
