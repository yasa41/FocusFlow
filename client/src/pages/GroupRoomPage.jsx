import React, { useState, useEffect } from "react";
import { useGroupRoom } from "../hooks/useGroupRoom";
import { useNavigate } from "react-router-dom";

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
    // handleUpdateTask,
    // handleUpdateTaskStatus,
    // handleRemoveMember,
    // handleTransferOwnership,
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

  // New task handler
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

  // Style constants
  const cardStyle = "bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6";
  const sectionTitle = "text-xl font-semibold text-blue-700 mb-3";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          className="text-blue-600 font-medium hover:underline flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <span aria-hidden>←</span> Back to Groups
        </button>

        <button
          className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
          onClick={handleLeaveGroup}
        >
          Leave Group
        </button>
      </div>

      {/* Group Info Card */}
      <div className={`${cardStyle}`}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
          {group.isOwner && (
            <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27l5.192 3.142-1.404-5.412 4.212-3.477-5.377-.436-2.223-5.437-2.223 5.437-5.377.436 4.212 3.477-1.404 5.412z"/></svg>
              Owner
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-3">{group.description}</p>
        <div className="flex items-center gap-6 mt-2">
          <span>
            <strong>{group.memberCount || 0}</strong>&nbsp;
            <span className="text-gray-500">members</span>
          </span>
          <span>
            Created: <span className="text-gray-500">{new Date(group.createdAt).toLocaleDateString()}</span>
          </span>
          {group.inviteCode && (
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
              Invite Code: <span className="font-mono">{group.inviteCode}</span>
            </span>
          )}
        </div>
      </div>

      {/* Task Summary + Add Task */}
      <div className={`flex flex-col md:flex-row gap-6 mb-6`}>
        <div className={`${cardStyle} flex-1`}>
          <div className={sectionTitle}>Tasks Overview</div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-blue-700">{tasks.summary?.completed || 0}</span>
              <span className="text-gray-500"> / {tasks.summary?.total || 0} completed</span>
            </div>
            <div>
              <span className="font-medium text-lg text-blue-600">
                {tasks.summary?.total ? Math.round((tasks.summary?.completed / tasks.summary?.total) * 100) : 0}%
              </span>
              <span className="text-gray-500 ml-1">progress</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="h-2 rounded-full transition-all duration-700 ease-out bg-blue-500"
              style={{ width: `${tasks.summary?.total ? (tasks.summary?.completed / tasks.summary?.total) * 100 : 0}%` }}
            />
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2">
              <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                Pending: {tasks.summary?.pending || 0}
              </span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                In-Progress: {tasks.summary?.inProgress || 0}
              </span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                Completed: {tasks.summary?.completed || 0}
              </span>
            </div>
          </div>
        </div>

        <div className={`${cardStyle} flex-1`}>
          <div className={sectionTitle}>Add a Task</div>
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="border p-2 mr-2 w-full mb-2 rounded"
          />
          <textarea
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            rows={2}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-all"
            onClick={createTaskHandler}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className={cardStyle}>
        <div className={sectionTitle}>All Tasks</div>
        {tasks.all && tasks.all.length > 0 ? (
          <ul className="space-y-3">
            {tasks.all.map((task) => (
              <li key={task._id} className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between hover:bg-blue-50 transition-all">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{task.title}</h4>
                  <p className="text-gray-500 text-sm mb-1">{task.description}</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      task.status === "pending" ? "bg-yellow-50 text-yellow-700"
                        : task.status === "in-progress" ? "bg-blue-50 text-blue-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    title="Delete Task"
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white font-semibold transition-all"
                  >
                    Delete
                  </button>
                  {/* You can add more actions, such as Edit, Mark Completed, etc. */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks available.</p>
        )}
      </div>
    </div>
  );
}
