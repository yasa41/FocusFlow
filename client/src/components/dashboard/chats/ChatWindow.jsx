import React, { useState, useRef, useEffect } from "react";

export default function ChatWindow({ activeChat, messages, sendMessage }) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full p-6">
      <header className="border-b border-gray-200 pb-3 mb-3 text-xl font-semibold">
        {activeChat.name}
      </header>
      <div className="flex-grow overflow-y-auto space-y-3 px-2 bg-gray-100 rounded p-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">No messages yet</p>
        )}
        {messages.map((msg, idx) => {
          const isSelf = !msg.sender || msg.sender._id === activeChat._id;
          return (
            <div
              key={idx}
              className={`max-w-xs p-2 rounded ${
                isSelf ? "bg-blue-600 text-white self-end" : "bg-white text-gray-900 self-start"
              }`}
            >
              {msg.content}
              <div className="text-xs opacity-60 mt-1 text-right">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={onSubmit} className="flex mt-3">
        <input
          type="text"
          className="rounded-l border border-gray-300 p-2 flex-grow focus:outline-blue-500"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-blue-600 rounded-r px-5 text-white hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
