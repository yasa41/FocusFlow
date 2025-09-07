import React, { useState } from "react";
import useChat from "../../../hooks/UseChatData";

export default function ChatsPage({ user }) {
  const {
    conversations,
    groups,
    activeChat,
    setActiveChat,
    messages,
    sendMessage,
    searchUsers,
    searchResults,
    startChatWithUser,
    addLocalMessage,
  } = useChat();

  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    if (q.trim() === "") {
      setSearchResults([]);
    } else {
      searchUsers(q);
    }
  };

  const getId = (field) => {
    if (!field) return null;
    if (typeof field === "object") return field._id || field.id || null;
    return String(field).trim();
  };

  const filteredMessages = messages.filter((msg) => {
    if (!activeChat) return false;

    const myId = String(user.id).trim();
    const chatId = String(activeChat._id).trim();

    const senderId = getId(msg.sender);
    const recipientId = getId(msg.recipient);

    return (
      (senderId === myId && recipientId === chatId) ||
      (senderId === chatId && recipientId === myId)
    );
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    // Optimistic UI update
    addLocalMessage(
      messageInput.trim(),
      { id: user.id, name: user.name },
      !activeChat.isGroup ? { _id: activeChat._id, name: activeChat.name } : null,
      activeChat.isGroup ? { _id: activeChat._id, name: activeChat.name } : null
    );

    sendMessage(messageInput.trim());

    setMessageInput("");
  };

  return (
    <div className="flex w-screen h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white flex flex-col">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full p-2 mt-4 mb-4 border rounded"
          style={{ borderColor: "#2563eb" }}
          autoComplete="off"
        />
        {search && searchResults.length > 0 && (
          <div className="mb-4 px-2 overflow-auto max-h-60">
            <h4 className="font-semibold mb-2 text-blue-600">Search Results</h4>
            <ul>
              {searchResults
                .slice(0, 50)
                .map((u) => (
                  <li
                    key={u.id}
                    className="cursor-pointer p-2 hover:bg-blue-50 rounded"
                    onClick={() => {
                      const existing = conversations.find(
                        (c) => c._id === u.id || c.id === u.id
                      );
                      if (existing) {
                        setActiveChat(existing);
                      } else {
                        startChatWithUser(u);
                      }
                    }}
                  >
                    <span className="text-blue-600">{u.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className="px-2 overflow-auto flex-1">
          <h4 className="font-semibold mt-2 mb-2 text-blue-600">Chats</h4>
          <ul>
            {conversations
              .filter((c) => c._id !== user.id)
              .map((chat) => (
                <li
                  key={chat._id}
                  className={`p-2 cursor-pointer rounded ${
                    activeChat?._id === chat._id && !activeChat?.isGroup
                      ? "bg-blue-100 font-semibold"
                      : "hover:bg-blue-50"
                  }`}
                  onClick={() => setActiveChat(chat)}
                >
                  {chat.name}
                </li>
              ))}
          </ul>
          <h4 className="font-semibold mt-4 mb-2 text-blue-600">Groups</h4>
          <ul>
            {groups.map((group) => (
              <li
                key={group._id}
                className={`p-2 cursor-pointer rounded ${
                  activeChat?._id === group._id && activeChat?.isGroup
                    ? "bg-blue-100 font-semibold"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => setActiveChat({ ...group, isGroup: true })}
              >
                {group.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-gray-50" style={{ minHeight: "100vh" }}>
        <div className="p-4 border-b flex items-center" style={{ borderColor: "#2563eb" }}>
          <h3 className="text-xl font-bold text-blue-700">
            {activeChat
              ? activeChat.isGroup
                ? `Group: ${activeChat.name}`
                : `Chat with ${activeChat.name}`
              : "Select a chat"}
          </h3>
        </div>
        <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
          {filteredMessages.length === 0 && activeChat ? (
            <div className="text-gray-400 mt-8">No messages yet. Say hello!</div>
          ) : (
            filteredMessages.map((msg) => {
              const senderId =
                typeof msg.sender === "object"
                  ? msg.sender.id || msg.sender._id
                  : msg.sender;
              const isSenderMe = senderId === user.id;

              return (
                <div
                  key={msg._id}
                  className={`mb-3 flex ${isSenderMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg shadow-md max-w-lg break-words ${
                      isSenderMe ? "bg-blue-500 text-white" : "bg-white border border-blue-200"
                    }`}
                  >
                    <span className="font-medium">
                      {isSenderMe ? "You" : msg.sender?.name || "Unknown"}
                    </span>
                    {": "} {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {activeChat && (
          <div className="p-4 border-t flex bg-white" style={{ borderColor: "#2563eb" }}>
            <input
              type="text"
              className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500"
              style={{ borderColor: "#2563eb" }}
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              autoFocus
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
