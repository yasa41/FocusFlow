import { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiTarget, 
  FiSend, 
  FiActivity, 
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';

export default function Sidebar({ user, logoutUser }) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

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
      label: 'Goals',
      icon: FiTarget
    },
    {
      id: 'chats',
      label: 'Chats',
      icon: FiSend,
      badge: 3
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: FiUser
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    console.log(`Navigating to: ${itemId}`);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  const handleMenuItemClick = (action) => {
    setShowUserMenu(false);
    
    switch(action) {
      case 'settings':
        console.log('Navigate to settings');
        break;
      case 'help':
        console.log('Navigate to help');
        break;
      case 'logout':
        logoutUser(); 
        break;
      default:
        break;
    }
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiActivity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">FocusFlow</h1>
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

      {/* User Menu with Dropdown */}
      <div className="p-4 border-t border-gray-100 relative">
        {/* User Profile Button */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getUserInitials()}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-medium text-gray-900 truncate">
              {user?.name || 'Loading...'}
            </p>
            
          </div>
          <FiChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              showUserMenu ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
            {/* Settings */}
            <button
              onClick={() => handleMenuItemClick('settings')}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <FiSettings className="w-4 h-4 mr-3" />
              Settings
            </button>
            
            {/* Logout */}
            <button
              onClick={() => handleMenuItemClick('logout')}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <FiLogOut className="w-4 h-4 mr-3" />
              Log out
            </button>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </div>
    </aside>
  );
}
