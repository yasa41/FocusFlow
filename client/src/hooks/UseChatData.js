import { useState, useEffect } from "react";
import socket from "../services/socket";
import {
  getMyConversations,
  getMyGroups,
  getPrivateMessages,
  getGroupMessages,
  searchUser,
} from "../services/api";

export default function useChat() {
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Connect socket and load conversations and groups on mount
  useEffect(() => {
    console.log("[useChat] Connecting socket...");
    socket.connect();

    console.log("[useChat] Fetching conversations...");
    getMyConversations()
      .then((res) => {
        console.log("[useChat] Conversations response:", res);
        if (res.success) setConversations(res.conversations);
        else {
          console.warn("[useChat] Failed to load conversations");
          setConversations([]);
        }
      })
      .catch((err) => {
        console.error("[useChat] Error fetching conversations:", err);
        setConversations([]);
      });

    console.log("[useChat] Fetching groups...");
    getMyGroups()
      .then((res) => {
        console.log("[useChat] Groups response:", res);
        if (res.success) setGroups(res.groups);
        else {
          console.warn("[useChat] Failed to load groups");
          setGroups([]);
        }
      })
      .catch((err) => {
        console.error("[useChat] Error fetching groups:", err);
        setGroups([]);
      });

    // Cleanup removed to keep socket connected longer
  }, []);

  // Load messages when active chat changes
  useEffect(() => {
    if (!activeChat) {
      console.log("[useChat] No active chat selected, clearing messages");
      setMessages([]);
      return;
    }

    console.log("[useChat] Active chat changed:", activeChat);

    if (activeChat.isGroup) {
      console.log(`[useChat] Fetching group messages for group: ${activeChat._id}`);
      getGroupMessages(activeChat._id)
        .then((res) => {
          console.log("[useChat] Group messages response:", res);
          if (res.success) setMessages(res.messages);
          else setMessages([]);
        })
        .catch((err) => {
          console.error("[useChat] Error fetching group messages:", err);
          setMessages([]);
        });
      console.log("[useChat] Emitting 'join_groups' with groupId:", activeChat._id);
      socket.emit("join_groups", [activeChat._id]);
    } else {
      console.log(`[useChat] Fetching private messages for user: ${activeChat._id}`);
      getPrivateMessages(activeChat._id)
        .then((res) => {
          console.log("[useChat] Private messages response:", res);
          if (res.success) setMessages(res.messages);
          else setMessages([]);
        })
        .catch((err) => {
          console.error("[useChat] Error fetching private messages:", err);
          setMessages([]);
        });
      console.log("[useChat] Emitting 'get_unread_messages'");
      socket.emit("get_unread_messages");
    }
  }, [activeChat]);

  // Real-time message listeners
  useEffect(() => {
    const onPrivateMessage = (msg) => {
      console.log("[useChat] Received private message:", msg);

      setConversations((prev) => {
        if (!prev.find((c) => c._id === msg.sender._id)) {
          console.log("[useChat] Adding new user to conversations from private message:", msg.sender);
          return [...prev, msg.sender];
        }
        return prev;
      });

      if (activeChat && !activeChat.isGroup && msg.sender._id === activeChat._id) {
        console.log("[useChat] Appending private message to current messages");
        setMessages((prev) => [...prev, msg]);
      }
    };

    const onGroupMessage = (msg) => {
      console.log("[useChat] Received group message:", msg);

      setGroups((prev) => {
        if (!prev.find((g) => g._id === msg.group)) {
          console.log("[useChat] Adding new group from group message:", msg.group);
          return [...prev, { _id: msg.group, name: "New Group" }];
        }
        return prev;
      });

      if (activeChat && activeChat.isGroup && msg.group === activeChat._id) {
        console.log("[useChat] Appending group message to current messages");
        setMessages((prev) => [...prev, msg]);
      }
    };

    console.log("[useChat] Setting up socket message listeners");
    socket.on("private_message_received", onPrivateMessage);
    socket.on("group_message_received", onGroupMessage);

    return () => {
      console.log("[useChat] Cleaning up socket message listeners");
      socket.off("private_message_received", onPrivateMessage);
      socket.off("group_message_received", onGroupMessage);
    };
  }, [activeChat]);

  // Search users by text query
  const searchUsers = (query) => {
    console.log("[useChat] Searching users with query:", query);
    if (!query || query.trim() === "") {
      setSearchResults([]);
      return;
    }
    searchUser(query)
      .then((res) => {
        console.log("[useChat] Search users response:", res);
        if (res.success) setSearchResults(res.users);
        else setSearchResults([]);
      })
      .catch((err) => {
        console.error("[useChat] Error searching users:", err);
        setSearchResults([]);
      });
  };

  // Start a new private chat with a selected user from search results
  const startChatWithUser = (user) => {
    console.log("[useChat] Starting chat with user:", user);
    setSearchResults([]);
    if (!conversations.find((c) => c._id === user._id)) {
      setConversations((prev) => [...prev, user]);
    }
    setActiveChat(user);
  };

  // Send message to active chat (group or private)
  const sendMessage = (content) => {
    console.log("[useChat] Sending message:", content);
    if (!activeChat) return;
    const payload = {
      content,
      ...(activeChat.isGroup ? { groupId: activeChat._id } : { toUserId: activeChat._id }),
    };
    socket.emit(activeChat.isGroup ? "group_message" : "private_message", payload);
  };

  return {
    conversations,
    groups,
    activeChat,
    messages,
    setActiveChat,
    sendMessage,
    searchUsers,
    searchResults,
    startChatWithUser,
  };
}
