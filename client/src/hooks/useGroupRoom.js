import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getGroupDetails,
  getGroupTasks,
 joinGroupByInvite,
  leaveGroup,
  createTask,
  deleteTask,
  updateTask,
  deleteGroup,
  updateTaskStatus,
  removeMember,
  transferOwnership,updateGroup
} from "../services/api";

export function useGroupRoom() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState({
    all: [],
    byStatus: { pending: [], inProgress: [], completed: [] },
    summary: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch group details and tasks
  const fetchGroupData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const groupRes = await getGroupDetails(groupId);
      if (!groupRes.data.success) {
        setError("Failed to load group details");
        setLoading(false);
        return;
      }
      setGroup(groupRes.data.group);

      const tasksRes = await getGroupTasks(groupId);
      if (!tasksRes.data.success) {
        setError("Failed to load group tasks");
        setLoading(false);
        return;
      }
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      setError("Error fetching group data");
    }
    setLoading(false);
  }, [groupId]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  // Join group by invite code
  const handleJoinGroup = async (inviteCode) => {
    try {
      const res = await joinGroupByInvite(inviteCode);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] joinGroup error:", err);
      return { success: false, message: err.message };
    }
  };

  // Leave group
  const handleLeaveGroup = async () => {
    try {
      const res = await leaveGroup(groupId);
      if (res.data.success) {
        navigate("/dashboard");
      }
      return res.data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };
  //Update Group Details 
const handleUpdateGroupDetails = async (updatedData) => {
    try {
      const res = await updateGroup(groupId, updatedData);
      return res.data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };
  // Create new task
  const handleCreateTask = async (taskData) => {
    try {
      const res = await createTask(groupId, taskData);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] createTask error:", err);
      return { success: false, message: err.message };
    }
  };

  // Update task details
  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const res = await updateTask(taskId, updatedData);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] updateTask error:", err);
      return { success: false, message: err.message };
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const res = await deleteTask(taskId);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] deleteTask error:", err);
      return { success: false, message: err.message };
    }
  };

  // Update task status
  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      const res = await updateTaskStatus(taskId, status);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] updateTaskStatus error:", err);
      return { success: false, message: err.message };
    }
  };

  // Remove member
  const handleRemoveMember = async (userId) => {
    try {
      const res = await removeMember(groupId, userId);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] removeMember error:", err);
      return { success: false, message: err.message };
    }
  };
 
  // Delete group
const handleDeleteGroup = async () => {
  if (!group) {
    return { success: false, message: 'Group data not loaded' };
  }
  const confirmed = window.confirm("Are you sure you want to delete the group? This action cannot be undone.");
  if (!confirmed) return { success: false, message: 'Delete cancelled' };

  try {
    const res = await deleteGroup(group.id);

    if (res.data.success) {
      navigate('/dashboard');
    }
    return res.data;
  } catch (err) {
    console.error("deleteGroup error:", err);
    return { success: false, message: err.message || 'Failed to delete group' };
  }
};

  // Transfer ownership
  const handleTransferOwnership = async (newOwnerId) => {
    try {
      const res = await transferOwnership(groupId, newOwnerId);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] transferOwnership error:", err);
      return { success: false, message: err.message };
    }
  };

  useEffect(() => { }, [group, tasks, loading, error]);

  return {
    group,
    tasks,
    loading,
    error,
    fetchGroupData,
    handleJoinGroup,
    handleLeaveGroup,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleUpdateTaskStatus,
    handleRemoveMember,
    handleTransferOwnership,
     handleDeleteGroup,handleUpdateGroupDetails
  };
}
