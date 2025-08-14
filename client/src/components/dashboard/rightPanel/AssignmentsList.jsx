export default function AssignmentsList() {
  // Mock data - replace with real API data
  const assignments = [
    {
      id: 1,
      title: "Design System",
      progress: 90,
      dueDate: "Today",
      priority: "high",
      type: "project"
    },
    {
      id: 2,
      title: "React Components",
      progress: 45,
      dueDate: "Tomorrow", 
      priority: "medium",
      type: "coding"
    },
    {
      id: 3,
      title: "Math Problem Set",
      progress: 70,
      dueDate: "Mar 18",
      priority: "low",
      type: "homework"
    },
    {
      id: 4,
      title: "Literature Essay",
      progress: 20,
      dueDate: "Mar 20",
      priority: "medium",
      type: "essay"
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600 bg-red-50",
      medium: "text-yellow-600 bg-yellow-50", 
      low: "text-green-600 bg-green-50"
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type) => {
    const icons = {
      project: "🎯",
      coding: "💻",
      homework: "📝",
      essay: "📄"
    };
    return icons[type] || "📋";
  };

  const getDueDateColor = (dueDate) => {
    if (dueDate === "Today") return "text-red-600 font-semibold";
    if (dueDate === "Tomorrow") return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">My Assignments</h3>
        <button className="text-purple-600 text-sm hover:text-purple-700">View All</button>
      </div>
      
      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors">
            {/* Assignment header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-2 flex-1">
                <span className="text-lg">{getTypeIcon(assignment.type)}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm truncate">{assignment.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(assignment.priority)} capitalize`}>
                      {assignment.priority}
                    </span>
                    <span className={`text-xs ${getDueDateColor(assignment.dueDate)}`}>
                      Due {assignment.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{assignment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${assignment.progress}%` }}
                />
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="flex items-center justify-between">
              <button className="text-xs text-gray-500 hover:text-gray-700">
                Continue Working
              </button>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded text-xs">✏️</button>
                <button className="p-1 hover:bg-gray-100 rounded text-xs">💬</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add new assignment */}
      <button className="w-full mt-4 border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-lg text-sm hover:border-purple-300 hover:text-purple-600 transition-colors">
        + Add New Assignment
      </button>
    </div>
  );
}
