"use client";

import { useEffect, useState } from "react";
import {
  createData,
  getData,
  updateData,
  deleteData,
} from "@/actions/crud-actions";

export interface Chatroom {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export default function useChatrooms(userId: string) {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);

  // Load chatrooms for the current user
  useEffect(() => {
    const allRooms = getData("chatrooms") || [];
    const userRooms = allRooms.filter(
      (room: Chatroom) => room.userId === userId
    );
    setChatrooms(userRooms);
  }, [userId]);

  const createChatroom = (title: string) => {
    const newRoom: Chatroom = {
      id: crypto.randomUUID(),
      userId,
      title,
      createdAt: new Date().toISOString(),
    };

    const result = createData("chatrooms", newRoom, "id");

    if (result.status === 200) {
      setChatrooms((prev) => [...prev, newRoom]);
    } else {
      console.warn("Chatroom already exists or failed to create.");
    }
  };

  const updateChatroom = (id: string, updatedFields: Partial<Chatroom>) => {
    const result = updateData("chatrooms", "id", id, updatedFields);

    if (result.status === 200) {
      setChatrooms((prev) =>
        prev.map((room) =>
          room.id === id ? { ...room, ...updatedFields } : room
        )
      );
    } else {
      console.warn("Chatroom not found or failed to update.");
    }
  };

  const deleteChatroomById = (id: string) => {
    const result = deleteData("chatrooms", "id", id);

    if (result.status === 200) {
      setChatrooms((prev) => prev.filter((room) => room.id !== id));
    } else {
      console.warn("Chatroom not found or failed to delete.");
    }
  };

  return {
    chatrooms,
    createChatroom,
    updateChatroom,
    deleteChatroom: deleteChatroomById,
  };
}
