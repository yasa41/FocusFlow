import React from 'react';
import { FiPlus, FiFilter, FiClock, FiTarget } from 'react-icons/fi';

export default function TasksPage({ tasks, user }) {
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-2">Track your goals and assignments • {tasks?.statistics?.total || 0} total</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <FiPlus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <FiTarget className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{tasks?.statistics?.completed || 0}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <FiClock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{tasks?.statistics?.inProgress || 0}</p>
                <p className="text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <FiTarget className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{tasks?.statistics?.pending || 0}</p>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Lists */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          {tasks?.upcoming?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
              <div className="space-y-4">
                {tasks.upcoming.map(task => (
                  <div key={task.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
                        <p className="text-gray-600 mt-1">{task.subject}</p>
                        <p className="text-sm text-blue-600 mt-2 flex items-center">
                          <FiClock className="w-4 h-4 mr-1" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overdue Tasks */}
          {tasks?.overdue?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-4">Overdue Tasks</h2>
              <div className="space-y-4">
                {tasks.overdue.map(task => (
                  <div key={task.id} className="bg-red-50 border border-red-200 p-6 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
                        <p className="text-gray-600 mt-1">{task.group?.name}</p>
                        <p className="text-sm text-red-600 mt-2 flex items-center">
                          <FiClock className="w-4 h-4 mr-1" />
                          Overdue by {task.daysOverdue} days
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
