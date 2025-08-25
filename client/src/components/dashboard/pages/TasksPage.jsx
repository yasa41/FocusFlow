import  { useState, useEffect } from 'react';
import { 
  FiPlus, FiFilter, FiClock, FiTarget, FiCheckCircle, 
  FiAlertCircle, FiCalendar, FiUser, FiMoreHorizontal,
  FiTrendingUp, FiZap,  FiUsers
} from 'react-icons/fi';
import { getMyTasks, getCreatedTasks, updateTaskStatus } from '../../../services/api';
import { TaskModal } from '../../modals/TaskModal';
import { TaskCard } from '../TasksCard';
export default function TasksPage({ user }) {
  const [tasks, setTasks] = useState(null);
  const [activeTab, setActiveTab] = useState('assigned');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'assigned' ? 
        await getMyTasks() : 
        await getCreatedTasks();
      
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const getFilteredTasks = () => {
    if (!tasks) return [];
    if (statusFilter === 'all') return tasks.all;
    return tasks.byStatus[statusFilter === 'in-progress' ? 'inProgress' : statusFilter] || [];
  };

  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
            <div>
              <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent p-2">
                My Tasks
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Stay focused and crush your goals • {tasks?.summary?.total || 0} total tasks
              </p>
            </div>
     
          {/* Tab Navigation */}
          <div className="flex space-x-4 bg-white/80 backdrop-blur-sm p-2 rounded-3xl border border-gray-200/50 shadow-sm">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-6 py-3 rounded-3xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'assigned' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
             
              <span>Assigned to Me</span>
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`px-6 py-3 rounded-3xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'created' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span>Created by Me</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-3 8over:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
                  <FiCheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  
                  <p className="text-green-600 font-semibold">{tasks?.summary?.completed || 0} Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-3 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FiZap className="w-4 h-4 text-white" />
                </div>
                <div>
                  
                  <p className="text-blue-600 font-semibold">{tasks?.summary?.inProgress || 0} In Progress</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-3 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                  <FiClock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-orange-600 font-semibold">{tasks?.summary?.pending || 0} Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-3 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-red-600 font-semibold">{tasks?.summary?.overdue || 0} Overdue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
            <span className="text-gray-700 font-medium flex items-center">
              <FiFilter className="w-4 h-4 mr-2" />
              Filter by status:
            </span>
            {['all', 'pending', 'in-progress', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-3xl font-medium transition-all duration-300 ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {status === 'all' ? 'All Tasks' : 
                 status === 'in-progress' ? 'In Progress' : 
                 status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Tasks Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <FiTrendingUp className="w-6 h-6" />
              <span>
                {statusFilter === 'all' ? 'All Tasks' : 
                 statusFilter === 'in-progress' ? 'In Progress Tasks' :
                 `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tasks`}
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {getFilteredTasks().length}
              </span>
            </h2>
            
            {getFilteredTasks().length > 0 ? (
              <div className="flex  flex-col gap-6">
                {getFilteredTasks().map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                <FiTarget className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
                <p className="text-gray-500">
                  {statusFilter === 'all' 
                    ? "You don't have any tasks yet. Create one to get started!"
                    : `No ${statusFilter} tasks found.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      {showModal && selectedTask && (
        <TaskModal 
          task={selectedTask}
          onClose={() => setShowModal(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
}





