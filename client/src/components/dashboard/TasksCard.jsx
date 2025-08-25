import { FiCalendar, FiMoreHorizontal, FiUsers } from "react-icons/fi";

export function TaskCard({ task, onClick }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return {
          accent: "bg-green-500",
          textColor: "text-green-700",
        };
      case "in-progress":
        return {
          accent: "bg-blue-500",
          textColor: "text-blue-700",
        };
      case "pending":
        return {
          accent: "bg-orange-500",
          textColor: "text-orange-700",
        };
      default:
        return {
          accent: "bg-gray-400",
          textColor: "text-gray-600",
        };
    }
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";
  
  const styles = getStatusStyles(task.status);

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 group shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        {/* Status indicator dot */}
        <div className={`w-3 h-3 ${styles.accent} rounded-full flex-shrink-0 shadow-sm`}></div>
        
        {/* Task content */}
        <div className="flex-1 min-w-0">
          {/* Task title */}
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
            {task.title}
          </h3>
          
          {/* Subtitle with time/group info */}
          <div className="flex items-center space-x-2 mt-1">
            {/* Time info */}
            {task.dueDate ? (
              <span className={`text-sm ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {isOverdue 
                  ? `Overdue` 
                  : `Due ${new Date(task.dueDate).toLocaleDateString()}`
                }
              </span>
            ) : task.status === 'in-progress' ? (
              <span className="text-sm text-blue-500 font-medium">Active now</span>
            ) : (
              <span className="text-sm text-gray-500">
                {task.createdAt ? `${Math.ceil((new Date() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24))} days ago` : 'Recently'}
              </span>
            )}
            
            {/* Group name if available */}
            {task.group && (
              <>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-600 truncate font-medium">
                  {task.group.name}
                </span>
              </>
            )}
          </div>
        </div>
              <FiMoreHorizontal/>
            </div>
        </div>
      
   
  );
}
