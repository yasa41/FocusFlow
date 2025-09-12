import React, { useState, useEffect } from "react";
import { FaTrash, FaSignOutAlt } from "react-icons/fa";

export default function SettingsSection({
  group,
  isOwner,
  onTransferOwnership,
  onLeaveGroup,
  fetchGroupData,
  onDeleteGroup
}) {
  const [transferToUserId, setTransferToUserId] = useState("");
  const [leaveError, setLeaveError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description || "",
  });

  useEffect(() => {
    setFormData({
      name: group.name,
      description: group.description || "",
    });
  }, [group]);

  const handleTransfer = async () => {
    if (!transferToUserId) {
      alert("Select a member to transfer ownership");
      return;
    }
    if (transferToUserId === group.currentUserId) {
      alert("You already are the owner");
      return;
    }
    try {
      const res = await onTransferOwnership(transferToUserId);
      if (res.success) {
        alert("Ownership transferred successfully");
        fetchGroupData();
        setTransferToUserId("");
      } else {
        alert("Failed to transfer ownership: " + res.message);
      }
    } catch (e) {
      alert("Error transferring ownership");
    }
  };

  const handleLeave = async () => {
    if (isOwner) {
      setLeaveError("You need to transfer ownership first before leaving the group.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to leave the group?");
    if (!confirmed) return;
    try {
      const res = await onLeaveGroup();
      if (!res.success) {
        alert("Failed to leave group: " + res.message);
      }
    } catch (e) {
      alert("Error leaving group");
    }
  };

  const handleUpdateGroupDetails = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      alert("Group details updated (simulate)");
      fetchGroupData();
    } catch {
      alert("Failed to update group details");
    }
    setUpdateLoading(false);
  };

const handleDeleteGroup = async () => {
  if (!isOwner) {
    alert("Only the owner can delete the group");
    return;
  }
  
  if (!group?.id) {
    alert("Group data not available");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete the group? This action cannot be undone."
  );
  if (!confirmed) return;

  try {
    const res = await onDeleteGroup(group.id); // Pass group id here!
    if (!res.success) {
      alert("Failed to delete group: " + res.message);
    }
    // Successful redirect or UI update should be handled by parent
  } catch (err) {
    alert("Error deleting group");
  }
};


  // UI
  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-8">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* Form: Group Details */}
      <form
        onSubmit={handleUpdateGroupDetails}
        className="space-y-5 border rounded shadow p-6 bg-white"
      >
        <h3 className="text-xl font-semibold mb-4">Update Group Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="groupName" className="block mb-2 font-semibold">
              Name
            </label>
            <input
              id="groupName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
              className="w-full rounded border px-4 py-2 text-lg"
              required
              disabled={updateLoading}
            />
          </div>
          <div>
            <label htmlFor="groupDescription" className="block mb-2 font-semibold">
              Description
            </label>
            <textarea
              id="groupDescription"
              value={formData.description}
              onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
              className="w-full rounded border px-4 py-2 text-lg"
              rows={3}
              disabled={updateLoading}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            disabled={updateLoading}
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Action Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {isOwner && (
          <section className="border rounded shadow p-6 bg-white flex flex-col gap-4 justify-between">
            <h3 className="text-lg font-bold mb-2">Transfer Ownership</h3>
            <select
              value={transferToUserId}
              onChange={(e) => setTransferToUserId(e.target.value)}
              className="w-full border rounded px-4 py-2 text-lg"
            >
              <option value="">-- Select Member --</option>
              {group.members
                .filter((m) => !m.isOwner)
                .map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.name}
                  </option>
                ))}
            </select>
            <button
              onClick={handleTransfer}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none w-full"
              type="button"
            >
              Transfer Ownership
            </button>
          </section>
        )}

        <section className="border rounded shadow p-6 bg-white flex flex-col gap-4 justify-between">
          <h3 className="text-lg font-bold mb-2">Leave Group</h3>
          {leaveError && <p className="text-red-600 font-semibold">{leaveError}</p>}
          <button
            onClick={handleLeave}
            className={`px-6 py-3 rounded text-white focus:outline-none w-full ${
              isOwner ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
            type="button"
            disabled={isOwner}
            title={isOwner ? "Transfer ownership to leave" : ""}
          >
            Leave Group <FaSignOutAlt className="inline ml-2" />
          </button>
        </section>
      </div>

      {/* Delete Group in a single wide section */}
      {isOwner && (
        <section className="border rounded shadow p-6 bg-white grid gap-4">
          <h3 className="text-lg font-bold text-red-600 mb-2">Delete Group</h3>
          <button
            onClick={handleDeleteGroup}
            className="px-6 py-3 bg-red-700 text-white rounded hover:bg-red-800 focus:outline-none w-full"
            type="button"
          >
            Delete Group <FaTrash className="inline ml-2" />
          </button>
        </section>
      )}
    </div>
  );
}
