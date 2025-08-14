import {
  FiEdit3,
  FiMessageSquare,
  FiPlus,
  FiClock,
  FiMoreHorizontal,
  FiEye,
} from "react-icons/fi";
import { useState } from "react";

export default function AssignmentsList() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock data - replace with real API data
  const assignments = [
    {
      id: 1,
      title: "Design System Components",
      progress: 90,
      dueDate: "Today",
      priority: "high",
      type: "project",
    },
    {
      id: 2,
      title: "React Components Build",
      progress: 45,
      dueDate: "Tomorrow",
      priority: "medium",
      type: "coding",
    },
    {
      id: 3,
      title: "Math Problem Set #4",
      progress: 70,
      dueDate: "Mar 18",
      priority: "low",
      type: "homework",
    },
    {
      id: 4,
      title: "Literature Essay Draft",
      progress: 20,
      dueDate: "Mar 20",
      priority: "medium",
      type: "essay",
    },
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-700 bg-red-50 border-red-200",
      medium: "text-yellow-700 bg-yellow-50 border-yellow-200",
      low: "text-green-700 bg-green-50 border-green-200",
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type) => {
    const icons = {
      project: "🎯",
      coding: "💻",
      homework: "📝",
      essay: "📄",
    };
    return icons[type] || "📋";
  };

  const getDueDateColor = (dueDate) => {
    if (dueDate === "Today") return "text-red-600 font-semibold";
    if (dueDate === "Tomorrow") return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const urgentAssignments = assignments.filter(
    (a) => a.dueDate === "Today" || a.dueDate === "Tomorrow"
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">My Assignments</h3>
        </div>

        {/* View More/Less Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-blue-600 text-sm hover:text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {isCollapsed ? "View more" : "View less"}
        </button>
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed
            ? "max-h-0 overflow-hidden opacity-0"
            : "max-h-96 opacity-100"
        }`}
      >
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group"
            >
              {/* Assignment header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-lg group-hover:scale-105 transition-transform duration-200">
                    {getTypeIcon(assignment.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate mb-2">
                      {assignment.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full capitalize font-medium border ${getPriorityColor(
                          assignment.priority
                        )}`}
                      >
                        {assignment.priority}
                      </span>
                      <span
                        className={`text-xs ${getDueDateColor(
                          assignment.dueDate
                        )}`}
                      >
                        Due {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-100 transition-all duration-200">
                  <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span className="font-medium">Progress</span>
                  <span className="font-semibold">{assignment.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getProgressColor(
                      assignment.progress
                    )} h-2 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center justify-between">
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors">
                  Continue Working
                </button>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Edit"
                  >
                    <FiEdit3 className="w-3 h-3 text-gray-500" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Comments"
                  >
                    <FiMessageSquare className="w-3 h-3 text-gray-500" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Time"
                  >
                    <FiClock className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsed State Summary */}
      {isCollapsed && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {assignments.length} assignments
              </span>
              {urgentAssignments.length > 0 && (
                <span className="ml-2 text-red-600 font-medium">
                  {urgentAssignments.length} due soon
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
