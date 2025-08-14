import { FiUsers, FiCalendar, FiMoreHorizontal } from 'react-icons/fi';

export default function GroupCard({ group }) {
  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        progress: 'bg-purple-500',
        badge: 'bg-purple-100 text-purple-700',
        hover: 'hover:bg-purple-100'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200', 
        progress: 'bg-green-500',
        badge: 'bg-green-100 text-green-700',
        hover: 'hover:bg-green-100'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        progress: 'bg-blue-500', 
        badge: 'bg-blue-100 text-blue-700',
        hover: 'hover:bg-blue-100'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        progress: 'bg-orange-500', 
        badge: 'bg-orange-100 text-orange-700',
        hover: 'hover:bg-orange-100'
      }
    };
    return colors[color] || colors.purple;
  };

  const colorClasses = getColorClasses(group.color);

  const getTypeIcon = (type) => {
    const icons = {
      study: '📚',
      fitness: '💪', 
      coding: '💻',
      language: '🗣️',
      math: '🔢',
      science: '🧪'
    };
    return icons[type] || '📚';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`${colorClasses.bg} border ${colorClasses.border} rounded-xl p-6 transition-all duration-300 cursor-pointer group hover:shadow-md hover:-translate-y-0.5 ${colorClasses.hover}`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl group-hover:scale-105 transition-transform duration-200">
            {getTypeIcon(group.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{group.name}</h3>
            <p className="text-gray-600 text-sm truncate">{group.subject}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`${colorClasses.badge} text-xs px-3 py-1 rounded-full font-medium capitalize`}>
            {group.type}
          </span>
          <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/50 transition-all duration-200">
            <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
          <span className={`text-sm font-semibold ${getProgressColor(group.progress)}`}>
            {group.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`${colorClasses.progress} h-2 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${group.progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>This week</span>
          <span>{Math.round((group.progress / 100) * 10)}/10 goals</span>
        </div>
      </div>

      {/* Members and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {group.members.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className="w-8 h-8 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium shadow-sm hover:scale-105 transition-transform duration-200"
                style={{ zIndex: group.members.length - index }}
                title={member.name}
              >
                {member.avatar}
              </div>
            ))}
            {group.members.length > 3 && (
              <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600 font-medium shadow-sm">
                +{group.members.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <FiUsers className="w-4 h-4" />
            <span className="text-sm font-medium">
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {group.daysLeft && (
          <div className="flex items-center space-x-1 text-gray-500">
            <FiCalendar className="w-4 h-4" />
            <span className="text-sm font-medium">{group.daysLeft} days left</span>
          </div>
        )}
      </div>
    </div>
  );
}
