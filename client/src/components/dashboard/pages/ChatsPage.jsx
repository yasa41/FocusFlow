import React, { useState, useEffect } from "react";
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
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [messageInput, setMessageInput] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchUsers(debouncedSearch);
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  }, [debouncedSearch, searchUsers]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getId = (field) => {
    if (!field) return null;
    if (typeof field === "object") return field._id || field.id || null;
    return String(field).trim();
  };

  // Helper to resolve sender name for private messages
  const getSenderName = (msg) => {
    // My messages
    const senderId =
      typeof msg.sender === "object"
        ? msg.sender.id || msg.sender._id
        : msg.sender;
    if (senderId === user.id) return "You";

    // Incoming private messages: lookup sender in conversations if possible
    if (!activeChat?.isGroup) {
      // Is sender my chat partner?
      if (activeChat && getId(activeChat) === senderId) {
        return activeChat.name;
      }
      // Search conversations list for name
      const found = conversations.find(
        (c) => getId(c) === senderId
      );
      if (found) return found.name;
    }
    // Fallback to .name property if present (for group messages)
    return msg.sender?.name || "Unknown";
  };

  const filteredMessages = messages.filter((msg) => {
    if (!activeChat) return false;

    if (activeChat.isGroup) {
      return msg.group === activeChat._id && msg.type === "group";
    } else {
      const myId = String(user.id).trim();
      const chatId = String(activeChat._id).trim();

      const senderId = getId(msg.sender);
      const recipientId = getId(msg.recipient);

      return (
        (senderId === myId && recipientId === chatId) ||
        (senderId === chatId && recipientId === myId)
      );
    }
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

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
      <div className="w-80 border-r bg-white flex flex-col relative">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full p-2 mt-4 mb-4 border rounded"
          style={{ borderColor: "#2563eb" }}
          autoComplete="off"
        />

        {showSearchDropdown && searchResults.length > 0 && (
          <div
            className="absolute top-16 left-0 w-full z-10 bg-white border border-blue-200 rounded shadow-md"
            style={{ maxHeight: "250px", overflowY: "auto" }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <ul>
              {searchResults.map((u) => {
                const existingChat = conversations.find(
                  (c) => getId(c) === u._id
                );
                return (
                  <li
                    key={u._id}
                    className="cursor-pointer p-2 hover:bg-blue-50 rounded"
                    onClick={() => {
                      if (existingChat) {
                        setActiveChat(existingChat);
                      } else {
                        startChatWithUser(u);
                      }
                      setSearch(""); 
                      setShowSearchDropdown(false); 
                    }}
                  >
                    <span className="text-blue-600">{u.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="px-2 overflow-auto flex-1">
          <h4 className="font-semibold mt-2 mb-2 text-blue-600">Chats</h4>
          <ul>
            {conversations
              .filter((c) => getId(c) !== user.id)
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
              const senderId = getId(msg.sender);
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
                      {getSenderName(msg)}
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
