import React, { useState } from 'react';
import { FiPlus, FiUsers, FiTarget, FiCalendar, FiMessageCircle, FiBell, FiTrendingUp, FiBook } from 'react-icons/fi';

export default function QuickActions() {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const primaryActions = [
    {
      id: 'create-goal',
      title: 'Create New Goal',
      description: 'Set a personal or group study goal',
      icon: FiTarget,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:from-green-100 hover:to-emerald-100'
    },
    {
      id: 'join-group',
      title: 'Join Study Group',
      description: 'Connect with like-minded learners',
      icon: FiUsers,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:from-purple-100 hover:to-indigo-100'
    },
    {
      id: 'schedule-session',
      title: 'Schedule Session',
      description: 'Plan your next study session',
      icon: FiCalendar,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:from-blue-100 hover:to-cyan-100'
    }
  ];

  const quickLinks = [
    {
      id: 'messages',
      title: 'Messages',
      count: 3,
      icon: FiMessageCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      count: 7,
      icon: FiBell,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'progress',
      title: 'Progress Reports',
      count: null,
      icon: FiTrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'resources',
      title: 'Study Resources',
      count: null,
      icon: FiBook,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  return (
    <section className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Quick Actions
        </h2>
        <p className="text-gray-600">Jump into your most common tasks</p>
      </div>

      {/* Primary Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {primaryActions.map((action, index) => (
          <button
            key={action.id}
            className={`${action.bgColor} ${action.hoverColor} border ${action.borderColor} rounded-2xl p-6 text-left transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 group`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color === 'text-green-600' ? 'from-green-500 to-emerald-500' : action.color === 'text-purple-600' ? 'from-purple-500 to-indigo-500' : 'from-blue-500 to-cyan-500'} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <FiPlus className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:rotate-90 transition-all duration-300" />
            </div>
            
            <h3 className={`text-lg font-semibold ${action.color} mb-2 group-hover:scale-105 transition-transform duration-300`}>
              {action.title}
            </h3>
            <p className="text-gray-600 text-sm">{action.description}</p>

            {/* Hover effect indicator */}
            <div className="mt-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-gray-500 font-medium">Click to get started</span>
              <div className="ml-2 w-4 h-0.5 bg-current rounded-full"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span>Quick Access</span>
          <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <button
              key={link.id}
              className={`${link.bgColor} border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transform hover:scale-105 transition-all duration-300 group relative`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Notification badge */}
              {link.count && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{link.count}</span>
                </div>
              )}
              
              <div className={`w-10 h-10 ${link.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <link.icon className={`w-5 h-5 ${link.color}`} />
              </div>
              
              <h4 className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                {link.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Focus Card */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <FiTarget className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Focus</h3>
              <p className="text-gray-600">Complete your Math Assignment #3</p>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Start Now
          </button>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span>Due in </span>
            <span className="font-semibold text-orange-600">2 hours</span>
          </div>
          <div className="text-sm text-gray-600">
            <span>Priority: </span>
            <span className="font-semibold text-red-600">High</span>
          </div>
        </div>
      </div>
    </section>
  );
}
