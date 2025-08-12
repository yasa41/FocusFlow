import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth",
  withCredentials: true,
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const registerUser = (name, email, password) => {
  return api.post("/register", { name, email, password });
};

export const loginUser = (email, password) => {
  return api.post("/login", { email, password });
};

export const logoutUser = () => {
  return api.post("/logout");
};

export const updateUserProfile = (profileData) => {
  return api.put("/profile", profileData);
};

export const getCurrentUser = () => {
  return api.get("/me");
};
