import React, { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";

export default function TaskForm({ members, editingTask, onSubmit, onCancel }) {
  const initialFormData = {
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: "", // single string for dropdown
    subject: "",
    estimatedTime: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "",
        priority: editingTask.priority || "Medium",
        assignedTo:
          Array.isArray(editingTask.assignedTo) && editingTask.assignedTo.length
            ? typeof editingTask.assignedTo[0] === "string"
              ? editingTask.assignedTo[0]
              : editingTask.assignedTo[0]?._id || ""
            : typeof editingTask.assignedTo === "string"
            ? editingTask.assignedTo
            : editingTask.assignedTo?._id || "",
        subject: editingTask.subject || "",
        estimatedTime: editingTask.estimatedTime || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1 font-semibold">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          required
          className="w-full border px-3 py-2 rounded"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 font-semibold">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
          required
          rows={3}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="dueDate" className="block mb-1 font-semibold">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block mb-1 font-semibold">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="assignedTo" className="block mb-1 font-semibold">
            Assigned To
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block mb-1 font-semibold">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject/topic"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label htmlFor="estimatedTime" className="block mb-1 font-semibold">
          Estimated Time (hours)
        </label>
        <input
          id="estimatedTime"
          name="estimatedTime"
          type="number"
          step="0.1"
          min="0"
          value={formData.estimatedTime}
          onChange={handleChange}
          placeholder="Estimated time"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaSave />
          {editingTask ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
