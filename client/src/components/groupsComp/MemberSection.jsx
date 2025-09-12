import React, { useEffect } from "react";
import { FaUserMinus } from "react-icons/fa";

export default function MembersSection({ members, isOwner, onRemoveMember, getAvatarDisplay }) {
  useEffect(() => {
  }, [members]);

  const handleRemove = async (userId, name) => {
    if (window.confirm(`Remove member ${name} from group?`)) {
      await onRemoveMember(userId);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Members</h2>
      {members.length === 0 && <p>No members in this group.</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.userId} className="flex items-center gap-4 border rounded p-3 shadow">
            {getAvatarDisplay(member.avatar)}
            <div className="flex-1">
              <div className="font-semibold">{member.name}</div>
              <div className="text-sm text-gray-600">{member.email}</div>
            </div>
            {isOwner && !member.isOwner && (
              <button
                onClick={() => handleRemove(member.userId, member.name)}
                title="Remove Member"
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                type="button"
              >
                <FaUserMinus />
              </button>
            )}
            {member.isOwner && (
              <span className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold select-none">
                Owner
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
