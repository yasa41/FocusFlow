import { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiTarget, 
  FiBell, 
  FiAward, 
  FiUser,
  FiSettings
} from 'react-icons/fi';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FiHome
    },
    {
      id: 'groups',
      label: 'My Groups',
      icon: FiUsers
    },
    {
      id: 'goals',
      label: 'Personal Goals',
      icon: FiTarget
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: FiBell,
      badge: 3
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: FiAward
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: FiUser
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    // Add navigation logic here later
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">StudySync</h1>
            <p className="text-xs text-gray-500">Collaborative Planner</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors duration-200 ${
                  activeItem === item.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                
                {/* Notification Badge */}
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Section at Bottom */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">Alex Kim</p>
            <p className="text-sm text-gray-500 truncate">Student</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <FiSettings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-gray-50 m-4 rounded-lg">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <span className="text-2xl">🔥</span>
            <span className="text-2xl font-bold text-blue-600">7</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Day Streak</p>
        </div>
      </div>
    </aside>
  );
}
