import React from "react";
import useChat from "../../../hooks/UseChatData";
import ChatList from "../chats/ChatList";
import ChatWindow from "../chats/ChatWindow";

export default function ChatsPage() {
  const {
    conversations,
    groups,
    activeChat,
    messages,
    setActiveChat,
    sendMessage,
    searchUsers,
    searchResults,
    startChatWithUser,
  } = useChat();

  return (
    <div className="flex h-full rounded shadow overflow-hidden bg-white">
      <ChatList
        conversations={conversations}
        groups={groups}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        searchUsers={searchUsers}
        searchResults={searchResults}
        startChatWithUser={startChatWithUser}
      />
      <main className="flex-grow flex flex-col">
        {activeChat ? (
          <ChatWindow activeChat={activeChat} messages={messages} sendMessage={sendMessage} />
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500 select-none text-lg">
            Select a chat or start a conversation
          </div>
        )}
      </main>
    </div>
  );
}
