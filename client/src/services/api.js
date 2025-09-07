// services/api.js
import axios from "axios";

// Auth API 
const authAPI = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH, withCredentials: true,
});

// Users API 
const usersAPI = axios.create({
  baseURL: import.meta.env.VITE_API_USER,
  withCredentials: true,
});

//Groups API
const groupsAPI = axios.create({
  baseURL: import.meta.env.VITE_API_GROUP,
  withCredentials: true,
});

//Tasks API
const tasksAPI = axios.create({
  baseURL: import.meta.env.VITE_API_TASK,
  withCredentials: true,
});

const messagesAPI = axios.create({
  baseURL: import.meta.env.VITE_API_MESSAGE,
  withCredentials: true,
});

// Response interceptor for all APIs
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
groupsAPI.interceptors.response.use(handleResponse, handleError);
tasksAPI.interceptors.response.use(handleResponse, handleError);
messagesAPI.interceptors.response.use(handleResponse, handleError);




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

export const getUserDashboard = () => {
  return usersAPI.get("/dashboard");
}

export const searchUser = (query) => {
  return usersAPI.get(`/search?query=${encodeURIComponent(query)}`);
};


// Group functions
export const createGroup = (groupData) => {
  return groupsAPI.post("/", groupData);
};

export const deleteGroup = (groupId) => {
  return groupsAPI.delete(`/${groupId}/delete`);
};

export const updateGroup = (groupId, updatedData) => {
  return groupsAPI.put(`/${groupId}/update`, updatedData);
};

export const removeMember = (groupId, userId) => {
  return groupsAPI.delete(`/${groupId}/remove/${userId}`);
};

export const transferOwnership = (groupId, newOwnerId) => {
  return groupsAPI.put(`/${groupId}/transfer-ownership`, { newOwnerId });
};

export const joinGroupByInvite = (inviteCode) => {
  return groupsAPI.post("/join", { inviteCode });
};

export const getGroupDetails = (groupId) => {
  return groupsAPI.get(`/${groupId}/details`);
};

export const leaveGroup = (groupId) => {
  return groupsAPI.post(`/${groupId}/leave`);
};

//Task functions 

export const createTask = (groupId, details) => {
  return tasksAPI.post(`/${groupId}/`, details);
}

export const deleteTask = (taskId) => {
  return tasksAPI.delete(`/${taskId}/delete`);
}
export const updateTask = (taskId, details) => {
  return tasksAPI.put(`/${taskId}/update`, details);
}
export const updateTaskStatus = (taskId, status) => {
  return tasksAPI.put(`/${taskId}/status`, { status });
}

export const getGroupTasks = (groupId) => {
  return tasksAPI.get(`/${groupId}/group-tasks`);
}

export const getMyTasks = () => {
  return tasksAPI.get("/my-tasks");
};

export const getCreatedTasks = () => {
  return tasksAPI.get("/created-tasks");
};

//Messages functions

export const getMyConversations = async () => {
  const res = await messagesAPI.get('/my-conversations');
  return res.data;
};

export const getMyGroups = async () => {
  const res = await messagesAPI.get('/my-groups');
  return res.data;
};

export const getPrivateMessages = async (userId) => {
  const res = await messagesAPI.get(`/private/${userId}`);
  return res.data;
};

export const getGroupMessages = async (groupId) => {
  const res = await messagesAPI.get(`/group/${groupId}`);
  return res.data;
};

