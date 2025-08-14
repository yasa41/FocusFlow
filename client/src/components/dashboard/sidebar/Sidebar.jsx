import { useState } from 'react';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      isActive: true
    },
    {
      id: 'groups',
      label: 'My Groups',
      icon: '👥',
      isActive: false
    },
    {
      id: 'goals',
      label: 'Personal Goals',
      icon: '🎯',
      isActive: false
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      isActive: false,
      badge: 3 // Notification count
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: '🏆',
      isActive: false
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      isActive: false
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    // Add navigation logic here later
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">StudySync</h1>
            <p className="text-xs text-gray-500">Collaborative Planner</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                activeItem === item.id
                  ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              
              {/* Notification Badge */}
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* User Section at Bottom */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">Alex Kim</p>
            <p className="text-sm text-gray-500 truncate">Student</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-gray-50 m-4 rounded-lg">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <span className="text-2xl">🔥</span>
            <span className="text-2xl font-bold text-orange-500">7</span>
          </div>
          <p className="text-sm text-gray-600">Day Streak</p>
        </div>
      </div>
    </aside>
  );
}
