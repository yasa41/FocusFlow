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
  updateTaskStatus,
  removeMember,
  transferOwnership,
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
    console.log("[useGroupRoom] fetchGroupData called for groupId:", groupId);
    try {
      const groupRes = await getGroupDetails(groupId);
      console.log("[useGroupRoom] getGroupDetails response:", groupRes);
      if (!groupRes.data.success) {
        setError("Failed to load group details");
        setLoading(false);
        return;
      }
      setGroup(groupRes.data.group);

      const tasksRes = await getGroupTasks(groupId);
      console.log("[useGroupRoom] getGroupTasks response:", tasksRes);
      if (!tasksRes.data.success) {
        setError("Failed to load group tasks");
        setLoading(false);
        return;
      }
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      console.error("[useGroupRoom] Error fetching group data:", err);
      setError("Error fetching group data");
    }
    setLoading(false);
  }, [groupId]);

  useEffect(() => {
    console.log("[useGroupRoom] useEffect - groupId:", groupId);
    fetchGroupData();
  }, [fetchGroupData]);

  // Join group by invite code
  const handleJoinGroup = async (inviteCode) => {
    console.log("[useGroupRoom] handleJoinGroup called with inviteCode:", inviteCode);
    try {
      const res = await joinGroupByInvite(inviteCode);
      console.log("[useGroupRoom] joinGroup response:", res);
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
    console.log("[useGroupRoom] handleLeaveGroup called");
    try {
      const res = await leaveGroup(groupId);
      console.log("[useGroupRoom] leaveGroup response:", res);
      if (res.data.success) {
        navigate("/dashboard/groups");
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] leaveGroup error:", err);
      return { success: false, message: err.message };
    }
  };

  // Create new task
  const handleCreateTask = async (taskData) => {
    console.log("[useGroupRoom] handleCreateTask called", taskData);
    try {
      const res = await createTask(groupId, taskData);
      console.log("[useGroupRoom] createTask response:", res);
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
    console.log("[useGroupRoom] handleUpdateTask called for taskId:", taskId, updatedData);
    try {
      const res = await updateTask(taskId, updatedData);
      console.log("[useGroupRoom] updateTask response:", res);
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
    console.log("[useGroupRoom] handleDeleteTask called for taskId:", taskId);
    try {
      const res = await deleteTask(taskId);
      console.log("[useGroupRoom] deleteTask response:", res);
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
    console.log("[useGroupRoom] handleUpdateTaskStatus called", { taskId, status });
    try {
      const res = await updateTaskStatus(taskId, status);
      console.log("[useGroupRoom] updateTaskStatus response:", res);
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
    console.log("[useGroupRoom] handleRemoveMember called for userId:", userId);
    try {
      const res = await removeMember(groupId, userId);
      console.log("[useGroupRoom] removeMember response:", res);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] removeMember error:", err);
      return { success: false, message: err.message };
    }
  };

  // Transfer ownership
  const handleTransferOwnership = async (newOwnerId) => {
    console.log("[useGroupRoom] handleTransferOwnership called with newOwnerId:", newOwnerId);
    try {
      const res = await transferOwnership(groupId, newOwnerId);
      console.log("[useGroupRoom] transferOwnership response:", res);
      if (res.data.success) {
        await fetchGroupData();
      }
      return res.data;
    } catch (err) {
      console.error("[useGroupRoom] transferOwnership error:", err);
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    console.log("[useGroupRoom] State:", { group, tasks, loading, error });
  }, [group, tasks, loading, error]);

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
  };
}
