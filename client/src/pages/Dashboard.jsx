import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import MainContent from "../components/dashboard/MainContent/MainContent";
import RightPanel from "../components/dashboard/rightPanel/RightPanel";
import { useDashboard } from "../hooks/usedashboard";

export default function Dashboard() {
   const { dashboardData, loading, error } = useDashboard();
    const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); 
      localStorage.removeItem('token'); 
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
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
      <Sidebar user={dashboardData.user} />
      
      {/*  PASS API DATA TO MAIN CONTENT */}
      <MainContent 
        user={dashboardData.user}
        tasks={dashboardData.tasks}
        groups={dashboardData.groups}
        activity={dashboardData.activity}
      />
      
      {/*  PASS API DATA TO RIGHT PANEL */}
      <RightPanel 
        user={dashboardData.user}
        tasks={dashboardData.tasks}
        groups={dashboardData.groups}
      />
    </div>
  );
}
