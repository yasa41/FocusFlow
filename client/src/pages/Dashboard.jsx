// In pages/Dashboard.jsx
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import MainContent from "../components/dashboard/MainContent/MainContent";
import RightPanel from "../components/dashboard/rightPanel/RightPanel";
export default function Dashboard() {
  return (
    // Add this to your Dashboard.jsx for responsive design
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <MainContent />
      <RightPanel />
    </div>
  );
}
