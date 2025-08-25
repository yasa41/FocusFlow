import { useState} from 'react';
import { 
 FiClock, FiTarget,
  FiAlertCircle, FiCalendar,
  FiTrendingUp, FiFlag, FiUsers, FiX
} from 'react-icons/fi';

export function TaskModal({ task, onClose, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await onStatusUpdate(task._id, newStatus);
    setIsUpdating(false);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Title */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h3>
            {isOverdue && (
              <div className="bg-red-100 border border-red-200 rounded-xl p-3 mb-4">
                <div className="flex items-center space-x-2 text-red-700">
                  <FiAlertCircle className="w-5 h-5" />
                  <span className="font-semibold">This task is overdue!</span>
                </div>
              </div>
            )}
          </div>

          {/* Status and Priority Badges */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-4 py-2 rounded-xl border font-semibold ${getStatusStyles(task.status)}`}>
              {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
            <span className={`px-4 py-2 rounded-xl border font-semibold ${getPriorityStyles(task.priority)}`}>
              <FiFlag className="w-4 h-4 inline mr-2" />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{task.description}</p>
            </div>
          )}

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Group */}
            {task.group && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-gray-700 mb-1">
                  <FiUsers className="w-5 h-5" />
                  <span className="font-semibold">Group</span>
                </div>
                <p className="text-gray-900 font-medium">{task.group.name}</p>
              </div>
            )}

        

            {/* Due Date */}
            {task.dueDate && (
              <div className={`rounded-xl p-4 ${isOverdue ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className={`flex items-center space-x-2 mb-1 ${isOverdue ? 'text-red-700' : 'text-gray-700'}`}>
                  <FiCalendar className="w-5 h-5" />
                  <span className="font-semibold">Due Date</span>
                </div>
                <p className={`font-medium ${isOverdue ? 'text-red-900' : 'text-gray-900'}`}>
                  {new Date(task.dueDate).toLocaleDateString()}
                  {isOverdue && (
                    <span className="block text-sm text-red-600 mt-1">
                      {Math.ceil((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24))} days overdue
                    </span>
                  )}
                </p>
              </div>
            )}


            
          </div>

          {/* Assigned Users */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Assigned To</h4>
              <div className="flex flex-wrap gap-2">
                {task.assignedTo.map(user => (
                  <div key={user._id} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl font-medium">
                    {user.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex flex-wrap gap-3">
            {task.status !== 'pending' && (
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={isUpdating}
                className="flex-1 py-3 px-4 font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                Mark Pending
              </button>
            )}
            
            {task.status !== 'in-progress' && (
              <button
                onClick={() => handleStatusChange('in-progress')}
                disabled={isUpdating}
                className="flex-1 py-3 px-4 font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                In Progress
              </button>
            )}
            
            {task.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdating}
                className="flex-1 py-3 px-4 font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}