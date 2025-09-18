import React, { useState, useEffect } from "react";
import { FaTasks, FaUsers, FaCog, FaUserShield } from "react-icons/fa";
import { useGroupRoom } from "../hooks/useGroupRoom";

import TaskSection from "../components/groupsComp/TasksSection";
import MembersSection from "../components/groupsComp/MemberSection";
import SettingsSection from "../components/groupsComp/SettingsSection";

function TabButton({ isActive, icon, label, onClick }) {
  return (
    <button
      className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition ${
        isActive
          ? "bg-blue-600 text-white shadow"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function GroupRoomPage() {
  const {
    group,
    tasks,
    loading,
    error,
    handleCreateTask,
    handleUpdateTask,
    handleUpdateTaskStatus,
    handleDeleteTask,
    handleRemoveMember,
    handleTransferOwnership,
    handleLeaveGroup,
    fetchGroupData, handleUpdateGroupDetails,
     handleDeleteGroup
  } = useGroupRoom();

  const [activeSection, setActiveSection] = useState("tasks");

  useEffect(() => {}, [group, tasks, activeSection]);

  if (loading) return <div>Loading group data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!group) return null;

  const getAvatarDisplay = (avatar) => {
    if (avatar) {
      return (
        <img
          src={avatar}
          alt="Member Avatar"
          className="w-12 h-12 rounded-full object-cover border"
        />
      );
    }
    return <div className="w-12 h-12 rounded-full bg-gray-300" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
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
              <FaUserShield />
              Owner
            </span>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 mb-8">
        <TabButton
          isActive={activeSection === "tasks"}
          icon={<FaTasks />}
          label="Tasks"
          onClick={() => {
            setActiveSection("tasks");
          }}
        />
        <TabButton
          isActive={activeSection === "members"}
          icon={<FaUsers />}
          label="Members"
          onClick={() => {
            setActiveSection("members");
          }}
        />
        <TabButton
          isActive={activeSection === "settings"}
          icon={<FaCog />}
          label="Settings"
          onClick={() => {
            setActiveSection("settings");
          }}
        />
      </div>

      {/* Sections */}
      {activeSection === "tasks" && (
        <TaskSection
          tasks={tasks}
          group={group}
          onCreate={handleCreateTask}
          onUpdate={handleUpdateTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDelete={handleDeleteTask}
          currentUserId={group.currentUserId}
        />
      )}

      {activeSection === "members" && (
        <MembersSection
          members={group.members}
          isOwner={group.isOwner}
          onRemoveMember={handleRemoveMember}
          getAvatarDisplay={getAvatarDisplay}
        />
      )}

      {activeSection === "settings" && (
        <SettingsSection
          group={group}
          isOwner={group.isOwner}
          onTransferOwnership={handleTransferOwnership}
          onLeaveGroup={handleLeaveGroup}
          fetchGroupData={fetchGroupData}
          onDeleteGroup={handleDeleteGroup}
           onUpdateGroupDetails={handleUpdateGroupDetails} 
        />
      )}
    </div>
  );
}
