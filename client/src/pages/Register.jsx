// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        { name, email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/profile");
      } else {
        setError(
          res.data.message === "user already exists"
            ? "You already have an account. Please login instead."
            : res.data.message || "Registration failed"
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-fuchsia-200 to-violet-300">
      <div className="bg-white/90 shadow-2xl rounded-3xl flex flex-col md:flex-row items-center overflow-hidden max-w-3xl border border-fuchsia-200">
        {/* Illustration Section */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-b from-violet-100 via-purple-50 to-fuchsia-100 w-96 h-96">
          <img
            src="https://undraw.co/api/illustrations/f71b2301-409d-41c6-921d-b1302e3e786f"
            alt="Register Illustration"
            className="w-72 h-auto object-contain"
          />
        </div>
        {/* Form Section */}
        <div className="p-10 flex-1 w-full">
          <h2 className="text-2xl font-extrabold mb-2 text-fuchsia-700 text-center">
            Create a StudySync Account
          </h2>
          <p className="mb-6 text-gray-500 text-center">
            Join the community to enhance your study experience!
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              autoComplete="name"
              required
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-fuchsia-50 placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-fuchsia-50 placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-fuchsia-50 placeholder-gray-400"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600 text-white py-2 rounded-2xl font-semibold hover:shadow-lg shadow transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="mt-4 flex justify-center text-sm">
            
            <a href="/login" className="text-fuchsia-700 hover:underline">
              Already have an account? Log In
            </a>
          </div>
        
         
        </div>
      </div>
    </div>
  );
}
