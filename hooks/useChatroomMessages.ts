"use client";

import { useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text?: string;
  image?: string; // base64
  timestamp: string;
}

export default function useChatroomMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 20;

  // Load initial dummy messages
  useEffect(() => {
    const dummy: ChatMessage[] = Array.from({ length: 50 }, (_, i) => ({
      id: crypto.randomUUID(),
      sender: i % 2 === 0 ? ("user" as const) : ("ai" as const), // ✅ literal type
      text: `Dummy message ${i + 1}`,
      timestamp: new Date().toISOString(),
    }));

    setMessages(dummy.slice(-ITEMS_PER_PAGE));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string, image?: string) => {
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      image,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    simulateGeminiResponse();
  };

  const simulateGeminiResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "This is a simulated Gemini response!",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000); // Simulate 2s delay
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadOlderMessages = () => {
    const newPage = page + 1;
    const dummy: ChatMessage[] = Array.from({ length: 50 }, (_, i) => ({
      id: crypto.randomUUID(),
      sender: i % 2 === 0 ? ("user" as const) : ("ai" as const), // ✅ literal type
      text: `Older dummy message ${i + 1}`,
      timestamp: new Date().toISOString(),
    }));

    const older: ChatMessage[] = dummy
      .reverse()
      .slice(0, ITEMS_PER_PAGE * newPage);

    setMessages(older);
    setPage(newPage);
  };

  return {
    messages,
    isTyping,
    sendMessage,
    messagesEndRef,
    loadOlderMessages,
  };
}
