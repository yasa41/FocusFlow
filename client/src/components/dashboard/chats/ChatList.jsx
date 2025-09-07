import React, { useState } from "react";

export default function ChatList({
  conversations = [],
  groups = [],
  activeChat,
  setActiveChat,
  searchUsers,
  searchResults,
  startChatWithUser,
}) {
  const [query, setQuery] = useState("");

  const onSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    searchUsers(val);
  };

  return (
    <aside className="w-80 border-r border-gray-300 bg-gray-50 flex flex-col p-4 overflow-y-auto">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={onSearchChange}
        className="mb-4 px-3 py-2 rounded border border-gray-300 focus:outline-blue-500"
        autoComplete="off"
      />

      {searchResults.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold mb-2">Search Results</h3>
          <div>
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="cursor-pointer p-2 rounded hover:bg-blue-100"
                onClick={() => {
                  startChatWithUser(user);
                  setQuery("");
                }}
              >
                {user.name} <span className="text-gray-500 text-sm">({user.email})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6 flex-grow overflow-auto">
        <h3 className="font-semibold mb-2">Groups</h3>
        {groups.length === 0 ? (
          <p className="text-gray-400">No groups found</p>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              className={`cursor-pointer p-2 rounded mb-1 ${
                activeChat?.isGroup === true && activeChat?._id === group._id
                  ? "bg-blue-300 font-semibold"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => setActiveChat({ ...group, isGroup: true })}
            >
              {group.name}
            </div>
          ))
        )}
      </section>

      <section className="flex-grow overflow-auto">
        <h3 className="font-semibold mb-2">Chats</h3>
        {conversations.length === 0 ? (
          <p className="text-gray-400">No chats found</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className={`cursor-pointer p-2 rounded mb-1 ${
                activeChat?.isGroup === false && activeChat?._id === conv._id
                  ? "bg-blue-300 font-semibold"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => setActiveChat(conv)}
            >
              <div>{conv.name}</div>
              <div className="text-sm text-gray-500">{conv.email}</div>
            </div>
          ))
        )}
      </section>
    </aside>
  );
}
