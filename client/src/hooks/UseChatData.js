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
    socket.connect();

    getMyConversations()
      .then((res) => {
        if (res.success) setConversations(res.conversations);
        else {
          console.warn(" Failed to load conversations");
          setConversations([]);
        }
      })
      .catch((err) => {
        console.error(" Error fetching conversations:", err);
        setConversations([]);
      });

    getMyGroups()
      .then((res) => {
        if (res.success) setGroups(res.groups);
        else {
          console.warn(" Failed to load groups");
          setGroups([]);
        }
      })
      .catch((err) => {
        console.error(" Error fetching groups:", err);
        setGroups([]);
      });
  }, []);

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    if (activeChat.isGroup) {
      getGroupMessages(activeChat._id)
        .then((res) => {
          if (res.success) setMessages(res.messages);
          else setMessages([]);
        })
        .catch((err) => {
          console.error(" Error fetching group messages:", err);
          setMessages([]);
        });
      socket.emit("join_groups", [activeChat._id]);
    } else {
      getPrivateMessages(activeChat._id)
        .then((res) => {
          if (res.success) setMessages(res.messages);
          else setMessages([]);
        })
        .catch((err) => {
          console.error(" Error fetching private messages:", err);
          setMessages([]);
        });
      socket.emit("get_unread_messages");
    }
  }, [activeChat]);

  useEffect(() => {
    const onPrivateMessage = (msg) => {

      setConversations((prev) => {
        if (!prev.find((c) => c._id === msg.sender._id)) {
          return [...prev, msg.sender];
        }
        return prev;
      });

      if (activeChat && !activeChat.isGroup && msg.sender._id === activeChat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const onGroupMessage = (msg) => {

      setGroups((prev) => {
        if (!prev.find((g) => g._id === msg.group)) {
          return [...prev, { _id: msg.group, name: "New Group" }];
        }
        return prev;
      });

      if (activeChat && activeChat.isGroup && msg.group === activeChat._id) {
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

  const searchUsers = useCallback((query) => {
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
    setMessages((prev) => [...prev, tempMessage]);
  };

  useEffect(() => {
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
