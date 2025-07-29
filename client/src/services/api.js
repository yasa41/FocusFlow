// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth", // your backend URL and auth base route
  withCredentials: true, // important to send cookies for JWT auth
});

export const loginUser = (email, password) => {
  return api.post("/login", { email, password });
};

export const registerUser = (name, email, password) => {
  return api.post("/register", { name, email, password });
};

// You can continue to add more methods like logoutUser, getUserProfile, etc.
