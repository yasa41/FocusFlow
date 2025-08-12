import React, { useState } from "react";
import { loginUser, registerUser } from "../services/api"; // Adjust path as needed
import "./SlidingAuth.css";

export default function SlidingAuth() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await registerUser(
        signUpData.name, 
        signUpData.email, 
        signUpData.password
      );

      if (response.data.success) {
        alert("Sign up successful!");
        setSignUpData({ name: "", email: "", password: "" });
        // Optionally switch to sign in mode
        // setIsSignUpMode(false);
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
        alert("Sign in successful!");
        setSignInData({ email: "", password: "" });
        // Handle successful login (redirect, update state, etc.)
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

        {/* Overlay Panel - Same as before */}
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
