import {  FiUsers, FiMoreHorizontal, FiTrendingUp, FiZap, FiTarget, FiStar, FiArrowRight } from "react-icons/fi";
import { useMemo } from "react";

export default function GroupCard({ group, allTasks = [] }) {
  
  // Filter tasks for this specific group
  const groupTasks = useMemo(() => {
    return allTasks.filter(task => 
      task.group?.id === group.id || task.group?._id === group.id
    );
  }, [allTasks, group.id]);

  // Calculate progress from filtered tasks
  const progressData = useMemo(() => {
    if (!groupTasks || groupTasks.length === 0) {
      return { progress: 0, completed: 0, total: 0, thisWeek: 0 };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekTasks = groupTasks.filter(task => 
      new Date(task.updatedAt || task.createdAt) >= weekAgo
    );
    
    const completedThisWeek = thisWeekTasks.filter(task => 
      task.status === 'completed' || task.isCompleted
    ).length;
    
    const totalTasks = groupTasks.length;
    const completedTasks = groupTasks.filter(task => 
      task.status === 'completed' || task.isCompleted
    ).length;
    
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const weeklyProgress = thisWeekTasks.length > 0 ? Math.round((completedThisWeek / thisWeekTasks.length) * 100) : 0;
    
    return {
      progress: weeklyProgress,
      completed: completedTasks,
      total: totalTasks,
      thisWeek: completedThisWeek,
      thisWeekTotal: thisWeekTasks.length,
      overallProgress
    };
  }, [groupTasks]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return groupTasks.filter(task => 
      (task.status === 'completed' || task.isCompleted) && 
      task.completedAt && 
      new Date(task.completedAt) >= yesterday
    ).length;
  }, [groupTasks]);

  // Dynamic gradient and colors
  const getProgressGradient = (progress) => {
    if (progress >= 80) return "from-emerald-400 to-cyan-400";
    if (progress >= 60) return "from-blue-400 to-indigo-400";
    if (progress >= 40) return "from-yellow-400 to-orange-400";
    return "from-blue-400 to-blue-400";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "text-emerald-600";
    if (progress >= 60) return "text-blue-600";
    if (progress >= 40) return "text-yellow-600";
    return "text-blue-600";
  };

  const getBgGradient = (progress) => {
    if (progress >= 80) return "from-emerald-50 to-cyan-50 border-emerald-200";
    if (progress >= 60) return "from-blue-50 to-indigo-50 border-blue-200";
    if (progress >= 40) return "from-yellow-50 to-orange-50 border-yellow-200";
    return "from-blue-50 to-blue-50 border-blue-200";
  };

  return (
    <div className={`group relative bg-gradient-to-br ${getBgGradient(progressData.overallProgress)} border rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 overflow-hidden`}>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
      </div>

      {/* Activity pulse indicator */}
      {recentActivity > 0 && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
      )}

      {/* Header */}
      <div className="relative z-10 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            {/* Enhanced avatar with progress ring */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getProgressGradient(progressData.overallProgress)} flex items-center justify-center`}>
                  <FiUsers className="w-4 h-4 text-white" />
                </div>
              </div>
              
             
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors duration-300">
                {group.name}
              </h3>
              <p className="text-gray-600 text-sm truncate mb-3">
                {group.description}
              </p>
              
              {/* Status badges */}
              <div className="flex items-center space-x-2">
                {group.isOwner && (
                  <div className="flex items-center space-x-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                    <FiStar className="w-3 h-3" />
                    <span className="text-xs font-semibold">Owner</span>
                  </div>
                )}
                
                {recentActivity > 0 && (
                  <div className="flex items-center space-x-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                    <FiZap className="w-3 h-3" />
                    <span className="text-xs font-semibold">Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/50 transition-all duration-200">
            <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="relative z-10 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Weekly Flow</span>
          </div>
          
          <span className={`text-lg font-bold ${getProgressColor(progressData.progress)}`}>
            {progressData.progress}%
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className={`h-2 rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${getProgressGradient(progressData.progress)}`}
            style={{ width: `${progressData.progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>This week's focus</span>
          <span className="font-medium">{progressData.thisWeek}/{progressData.thisWeekTotal} completed</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <FiUsers className="w-4 h-4" />
            <span className="text-sm font-medium">
              {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getProgressGradient(progressData.overallProgress)}`} />
            <span className="text-sm font-medium">
              {progressData.completed}/{progressData.total} total
            </span>
          </div>
        </div>
        
        {/* View button on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
            <span className="text-sm font-medium">View</span>
            <FiArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
