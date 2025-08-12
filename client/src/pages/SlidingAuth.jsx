import React, { useState } from "react";
import { loginUser, registerUser } from "../services/api"; 
import ProfileCompletion from "../components/ProfileCompletion"; // <-- import
import "./SlidingAuth.css";

export default function SlidingAuth() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfileCompletion, setShowProfileCompletion] = useState(false); // <-- new

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await registerUser(signUpData.name, signUpData.email, signUpData.password);

      if (response.data.success) {
        // clear form
        setSignUpData({ name: "", email: "", password: "" });
        // show profile completion page
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
        // redirect to dashboard
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

  // after completing profile
  const handleProfileComplete = () => {
    window.location.href = "/dashboard";
  };

  // if user skips profile
  const handleProfileSkip = () => {
    window.location.href = "/dashboard";
  };

  // show profile completion after registration
  if (showProfileCompletion) {
    return (
      <ProfileCompletion
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300">
      <div className={`auth-container ${isSignUpMode ? "right-panel-active" : ""}`}>
        
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit} className="auth-form">
            <h2 className="form-title">Create Account</h2>
            <input
              type="text"
              placeholder="Name"
              value={signUpData.name}
              onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
              className="auth-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
              className="auth-input"
              required
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit} className="auth-form">
            <h2 className="form-title">Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={signInData.email}
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
              className="auth-input"
              required
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Overlay Panel */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2 className="overlay-title">Welcome Back!</h2>
              <p className="overlay-text">
                If you already have an account, please sign in.
              </p>
              <button 
                className="ghost-button" 
                onClick={() => setIsSignUpMode(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2 className="overlay-title">Hello, Friend!</h2>
              <p className="overlay-text">
                Enter your personal details and start your journey with us.
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
  );
}
