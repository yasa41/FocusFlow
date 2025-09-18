import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiMoreHorizontal,
  FiTrendingUp,
  FiZap,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";

export default function GroupCard({ group, allTasks = [] }) {
  const navigate = useNavigate();

  const groupTasks = allTasks.filter(
    (task) => task.group?.id === group.id || task.group?._id === group.id,
  );

  const totalTasks = groupTasks.length;
  const completedTasks = groupTasks.filter(
    (task) => task.status === "completed" || task.isCompleted,
  ).length;

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recentActivity =
    groupTasks.some(
      (task) =>
        task.status === "completed" &&
        task.completedAt &&
        new Date(task.completedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000),
    )
      ? 1
      : 0;

  // Handler to navigate to group room page
  const handleClick = () => {
    navigate(`/groups/${group.id || group._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
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
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-400 flex items-center justify-center">
                  <FiUsers className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors duration-300">
                {group.name}
              </h3>

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

          <span className="text-lg font-bold text-blue-600">{progress}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-700 ease-out bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>This week&apos;s focus</span>
          <span className="font-medium">
            {completedTasks}/{totalTasks} completed
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <FiUsers className="w-4 h-4" />
            <span className="text-sm font-medium">
              {group.memberCount || 0} member{group.memberCount !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">
              {completedTasks}/{totalTasks} total
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
