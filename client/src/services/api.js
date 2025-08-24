// services/api.js
import axios from "axios";

// Auth API (for login, register, logout)
const authAPI = axios.create({
baseURL:  import.meta.env.VITE_API_AUTH,  withCredentials: true,
});

// Users API (for /me, /profile,/dashboard)
const usersAPI = axios.create({
  baseURL: import.meta.env.VITE_API_USER,
  withCredentials: true,
});

// Response interceptor for BOTH APIs
const handleResponse = (response) => response;
const handleError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/auth'; 
  }
  console.error('API Error:', error);
  return Promise.reject(error);
};

authAPI.interceptors.response.use(handleResponse, handleError);
usersAPI.interceptors.response.use(handleResponse, handleError);

// Auth functions
export const registerUser = (name, email, password) => {
  return authAPI.post("/register", { name, email, password });
};

export const loginUser = (email, password) => {
  return authAPI.post("/login", { email, password });
};

export const logoutUser = () => {
  return authAPI.post("/logout");
};

// User functions  
export const getCurrentUser = () => {
  return usersAPI.get("/me"); 
};

export const updateUserProfile = (profileData) => {
  return usersAPI.put("/profile", profileData); 
};
