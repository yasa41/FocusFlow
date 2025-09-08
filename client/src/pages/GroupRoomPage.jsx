import React, { useState, useEffect } from "react";
import { useGroupRoom } from "../hooks/useGroupRoom";
import { useNavigate } from "react-router-dom";

function OverviewIcon() {
  return (
    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function TasksIcon() {
  return (
    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M5 8h14M5 16h14M5 20h14" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20h6M9 10a4 4 0 1 0 6 0 4 4 0 0 0-6 0zM4 18v2h5v-2" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M4.93 4.93l1.41 1.41M18.36 18.36l1.41 1.41M1 12h2m16 0h2M4.93 19.07l1.41-1.41M18.36 5.64l1.41-1.41" />
    </svg>
  );
}

export default function GroupRoomPage() {
  const navigate = useNavigate();
  const {
    group,
    tasks,
    loading,
    error,
    handleLeaveGroup,
    handleCreateTask,
    handleDeleteTask,
  } = useGroupRoom();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  useEffect(() => {
    console.log("[GroupRoomPage] Rendered with group:", group, "tasks:", tasks, "error:", error);
  }, [group, tasks, error]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading group room...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-screen items-start justify-center pt-10 px-8">
        <div className="text-red-600 text-lg font-semibold mb-4">Error: {error}</div>
      </div>
    );
  }
  if (!group) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600 text-lg">Group not found or access denied.</div>
      </div>
    );
  }

  const createTaskHandler = async () => {
    if (!newTaskTitle.trim()) return alert("Task title required");
    const res = await handleCreateTask({ title: newTaskTitle, description: newTaskDescription });
    if (res.success) {
      setNewTaskTitle("");
      setNewTaskDescription("");
    } else {
      alert(res.message || "Failed to create task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top Banner */}
      <div className="relative h-56 rounded-3xl bg-blue-600 flex items-center px-10 py-8 mb-10 shadow-lg text-white">
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold mb-2">{group.name}</h1>
          <p className="text-lg opacity-80 max-w-xl">{group.description}</p>
          <div className="mt-4 flex gap-6 text-sm opacity-90 font-light">
            <span>{group.memberCount || 0} members</span>
            <span>Created: {new Date(group.createdAt).toLocaleDateString()}</span>
            {group.inviteCode && (
              <span className="bg-blue-600 bg-opacity-30 px-2 py-1 rounded font-mono">
                Invite Code: {group.inviteCode}
              </span>
            )}
          </div>
          {group.isOwner && (
            <span className="mt-2 inline-flex items-center gap-1 bg-white bg-opacity-30 text-white px-3 py-1 rounded-full text-sm font-semibold w-max select-none">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27l5.192 3.142-1.404-5.412 4.212-3.477-5.377-.436-2.223-5.437-2.223 5.437-5.377.436 4.212 3.477-1.404 5.412z"/></svg>
              Owner
            </span>
          )}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-2xl transition cursor-pointer select-none">
          <OverviewIcon />
          <h3 className="text-xl font-semibold text-blue-800 mt-3">Overview</h3>
          <p className="text-gray-600 mt-1">Summary & stats of tasks</p>
        </div>
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-2xl transition cursor-pointer select-none">
          <TasksIcon />
          <h3 className="text-xl font-semibold text-blue-800 mt-3">Tasks</h3>
          <p className="text-gray-600 mt-1">Manage your tasks</p>
        </div>
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-2xl transition cursor-pointer select-none">
          <UsersIcon />
          <h3 className="text-xl font-semibold text-blue-800 mt-3">Members</h3>
          <p className="text-gray-600 mt-1">View and manage members</p>
        </div>
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-2xl transition cursor-pointer select-none">
          <SettingsIcon />
          <h3 className="text-xl font-semibold text-blue-800 mt-3">Settings</h3>
          <p className="text-gray-600 mt-1">Group preferences</p>
        </div>
      </div>

      {/* Task Overview & Add Task */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Tasks Overview Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Tasks Overview</h2>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-3xl font-bold text-blue-700">{tasks.summary?.completed || 0}</span>
              <span className="text-gray-500 ml-2">/ {tasks.summary?.total || 0} completed</span>
            </div>
            <div>
              <span className="font-semibold text-lg text-blue-600">
                {tasks.summary?.total ? Math.round((tasks.summary.completed / tasks.summary.total) * 100) : 0}%
              </span>
              <span className="text-gray-500 ml-1">progress</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
            <div
              className="h-3 rounded-full bg-blue-600 transition-all duration-700 ease-out"
              style={{
                width: `${tasks.summary?.total ? (tasks.summary.completed / tasks.summary.total) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="bg-yellow-50 text-yellow-700 px-4 py-1 rounded-full text-xs font-semibold">
              Pending: {tasks.summary?.pending || 0}
            </span>
            <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-semibold">
              In-Progress: {tasks.summary?.inProgress || 0}
            </span>
            <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs font-semibold">
              Completed: {tasks.summary?.completed || 0}
            </span>
          </div>
        </div>

        {/* Add Task Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Add a Task</h2>
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <textarea
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            rows={3}
            className="border border-gray-300 rounded-md p-3 mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <button
            onClick={createTaskHandler}
            className="bg-blue-600 text-white rounded-md py-3 font-semibold hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* All Tasks List */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">All Tasks</h2>
        {tasks.all && tasks.all.length > 0 ? (
          <ul className="space-y-4">
            {tasks.all.map((task) => (
              <li
                key={task._id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-blue-50 transition"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{task.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.status === "pending"
                        ? "bg-yellow-50 text-yellow-800"
                        : task.status === "in-progress"
                        ? "bg-blue-50 text-blue-800"
                        : "bg-green-50 text-green-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                  <button
                    title="Delete Task"
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks available.</p>
        )}
      </div>

      

      {/* Bottom Leave Group Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleLeaveGroup}
          className="bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-red-700 transition"
        >
          Leave Group
        </button>
      </div>
    </div>
  );
}
