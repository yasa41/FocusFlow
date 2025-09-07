import { useState, useEffect, useCallback } from "react";
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

  useEffect(() => {
    console.log("[useChat] Connecting socket...");
    socket.connect();

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
  }, []);

  useEffect(() => {
    console.log("[useChat] Active chat effect triggered. activeChat:", activeChat);
    if (!activeChat) {
      console.log("[useChat] No active chat selected; clearing messages.");
      setMessages([]);
      return;
    }

    if (activeChat.isGroup) {
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
      socket.emit("join_groups", [activeChat._id]);
    } else {
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
      socket.emit("get_unread_messages");
    }
  }, [activeChat]);

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

    socket.on("private_message_received", onPrivateMessage);
    socket.on("group_message_received", onGroupMessage);

    return () => {
      socket.off("private_message_received", onPrivateMessage);
      socket.off("group_message_received", onGroupMessage);
    };
  }, [activeChat]);

  // Memoize searchUsers to avoid infinite loop in effects that depend on it
  const searchUsers = useCallback((query) => {
    console.log("[useChat] Searching users with query:", query);
    if (!query || query.trim() === "") {
      setSearchResults([]);
      return;
    }
    searchUser(query)
      .then((res) => {
        if (res.data && res.data.success) {
          setSearchResults(res.data.users || []);
        } else {
          setSearchResults([]);
        }
      })
      .catch(() => setSearchResults([]));
  }, []);

  const startChatWithUser = (user) => {
    console.log("[useChat] Starting chat with user:", user);
    setSearchResults([]);
    if (!conversations.find((c) => c._id === user._id)) {
      setConversations((prev) => [...prev, user]);
    }
    setActiveChat(user);
  };

  const sendMessage = (content) => {
    if (!activeChat) return;
    const payload = {
      content,
      ...(activeChat.isGroup ? { groupId: activeChat._id } : { toUserId: activeChat._id }),
    };
    console.log("[useChat] Sending socket message with payload:", payload);
    socket.emit(activeChat.isGroup ? "group_message" : "private_message", payload);
  };

  const addLocalMessage = (content, sender, recipient, group) => {
    const tempMessage = {
      _id: Date.now().toString(),
      content,
      sender,
      recipient,
      group,
      createdAt: new Date().toISOString(),
    };
    console.log("[useChat] Adding local message to UI:", tempMessage);
    setMessages((prev) => [...prev, tempMessage]);
  };

  useEffect(() => {
    console.log("[useChat] State update:", { conversations, groups, activeChat, messages, searchResults });
  }, [conversations, groups, activeChat, messages, searchResults]);

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
    addLocalMessage,
  };
}
