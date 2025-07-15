"use client";

import { Chatroom } from "../hooks/useChatrooms";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ChatroomCard({
  room,
  onDelete,
}: {
  room: Chatroom;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg">{room.title}</h3>
        <p className="text-xs text-slate-500 mt-1">
          Created: {new Date(room.createdAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => onDelete(room.id)}
        className="flex items-center gap-1 mt-4 text-red-600 hover:text-red-800 text-sm"
      >
        <TrashIcon className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}
