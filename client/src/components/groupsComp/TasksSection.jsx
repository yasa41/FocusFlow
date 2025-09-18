import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Modal from "../modals/CreateTaskModel";
import TaskForm from "../groupsComp/TaskForm";

export default function TaskSection({
  tasks,
  group,
  onCreate,
  onUpdate,
  onUpdateStatus,
  onDelete,
  currentUserId,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
  }, [
    tasks?.all?.length,
    tasks?.byStatus?.pending?.length,
    tasks?.byStatus?.inProgress?.length,
    tasks?.byStatus?.completed?.length,
  ]);

  const displayedTasks = tasks.all;

  const totalTasks = tasks.all.length;
  const completedTasks = tasks.byStatus.completed.length;
  const progressPercent = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const openNewModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };
  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (taskData) => {
    if (editingTask) {
      await onUpdate(editingTask.id, taskData);
    } else {
      await onCreate(taskData);
    }
    closeModal();
  };

  const handleStatusChange = async (task, newStatus) => {
    if (task.status !== newStatus) {
      await onUpdateStatus(task._id, newStatus);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure to delete this task?")) {
      await onDelete(taskId);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
       

        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={openNewModal}
          type="button"
        >
          <FaPlus />
          New Task
        </button>
      </div>

      <div className="mb-6 font-semibold">
        Group Task Progress: {completedTasks} / {totalTasks} tasks completed (
        {progressPercent}%)
      </div>

      <div className="grid grid-cols-3 gap-6">
        {displayedTasks.length === 0 && <p>No tasks available.</p>}
        {displayedTasks.map((task) => (
          <div
            key={task._id}
            className="border rounded p-4 shadow flex flex-col justify-between gap-4"
          >
            <div>
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="text-gray-700">{task.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}{" "}
                | Priority: {task.priority} | Subject: {task.subject} | Est.{" "}
                {task.estimatedTime} hrs
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Assigned to:{" "}
                {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                  ? task.assignedTo.map((user) => user?.name ?? "Unknown").join(", ")
                  : "Unassigned"}{" "}
                | Created by: {task.createdBy?.name ?? "Unknown"}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task, e.target.value)}
                className="px-2 py-1 border rounded"
                aria-label={`Change status for task ${task.title}`}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => openEditModal(task)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                type="button"
                aria-label={`Edit task ${task.title}`}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(task._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                type="button"
                aria-label={`Delete task ${task.title}`}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "Create Task"}
      >
        <TaskForm
          members={group.members}
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
}
