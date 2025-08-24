import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api"; // ✅ Your existing API
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import MainContent from "../components/dashboard/MainContent/MainContent";
import GroupsPage from "../components/dashboard/pages/GroupsPage";
import TasksPage from "../components/dashboard/pages/TasksPage";
import ChatsPage from "../components/dashboard/pages/ChatsPage";
import ProfilePage from "../components/dashboard/pages/ProfilePage";
import RightPanel from "../components/dashboard/rightPanel/RightPanel";
import { useDashboard } from "../hooks/usedashboard";

export default function Dashboard() {
  const { dashboardData, loading, error } = useDashboard();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await logoutUser(); // ✅ Your existing API function
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (viewId) => {
    setActiveView(viewId);
  };

  const renderMainContent = () => {
    switch(activeView) {
      case 'dashboard':
        return (
          <MainContent 
            user={dashboardData.user}
            tasks={dashboardData.tasks}
            groups={dashboardData.groups}
            activity={dashboardData.activity}
          />
        );
      case 'groups':
        return <GroupsPage groups={dashboardData.groups} />; // ✅ Uses dashboard data
      case 'goals':
        return <TasksPage tasks={dashboardData.tasks} user={dashboardData.user} />; // ✅ Uses dashboard data
      case 'chats':
        return <ChatsPage user={dashboardData.user} />;
      case 'profile':
        return <ProfilePage user={dashboardData.user} />; // ✅ Will use getCurrentUser() API internally
      default:
        return (
          <MainContent 
            user={dashboardData.user}
            tasks={dashboardData.tasks}
            groups={dashboardData.groups}
            activity={dashboardData.activity}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
          </div>
        </div>
        <div className="w-80 bg-white"></div> 
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg font-semibold mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
        <div className="w-80 bg-white"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        user={dashboardData.user} 
        logoutUser={handleLogout}
        activeView={activeView}
        onNavigate={handleNavigation}
      />
      
      {renderMainContent()}
      
      {activeView === 'dashboard' && (
        <RightPanel 
          user={dashboardData.user}
          tasks={dashboardData.tasks}
          groups={dashboardData.groups}
        />
      )}
    </div>
  );
}
