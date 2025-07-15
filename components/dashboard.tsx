"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import useChatrooms from "@/hooks/useChatrooms";
import toast from "react-hot-toast";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes"; 
import { SIGNIN_PAGE } from "@/config/constants";
import { useLoading } from "@/hooks/context/LoadingContext";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme(); 

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const userId = currentUser?.mobileNumber ?? "guest";

  const { chatrooms, createChatroom, updateChatroom, deleteChatroom } =
    useChatrooms(userId);

  const [newRoomTitle, setNewRoomTitle] = useState("");
  const [search, setSearch] = useState("");
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
 const { setLoading: setModalLoading } = useLoading();
  const filteredRooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(search.toLowerCase())
  );
 useEffect(() => {
    setModalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleCreateRoom = () => {
    if (!newRoomTitle.trim()) {
      toast.error("Enter a valid room title!");
      return;
    }
    createChatroom(newRoomTitle.trim());
    toast.success("Chatroom created!");
    setNewRoomTitle("");
  };

  const handleUpdateRoom = (roomId: string) => {
    if (!editedTitle.trim()) {
      toast.error("Enter a valid title!");
      return;
    }
    updateChatroom(roomId, { title: editedTitle.trim() });
    toast.success("Chatroom updated!");
    setEditingRoomId(null);
    setEditedTitle("");
  };

  const handleDeleteRoom = (roomId: string) => {
    deleteChatroom(roomId);
    toast.success("Chatroom deleted!");
  };

  const handleSignOut = () => {
    dispatch({ type: "auth/logout" });
    router.push(SIGNIN_PAGE);
    toast.success("Signed out!");
  };

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-slate-100 dark:bg-gray-900 text-slate-800 dark:text-gray-100 transition-colors">
      <header className="fixed h-15 top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-lg px-4 py-3 flex items-center justify-between transition-colors">
        <h1 className="text-xl font-bold text-slate-700 dark:text-gray-100">
          My Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="text-slate-600 dark:text-gray-300 hover:text-blue-600 transition"
          >
            {theme === "dark" ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="font-medium">
              {`${currentUser?.firstName} ${currentUser?.lastName}`}
            </span>
            <UserCircleIcon className="w-7 h-7 text-slate-600 dark:text-gray-300" />
          </div>

          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="pt-20 w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">
              Welcome, {currentUser?.firstName}!
            </h2>
            <p className="text-slate-500 dark:text-gray-400">
              Manage your chatrooms below
            </p>
          </div>
          <PlusIcon className="w-12 h-12 text-blue-500 opacity-20 hidden sm:block" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            value={newRoomTitle}
            onChange={(e) => setNewRoomTitle(e.target.value)}
            placeholder="New chatroom title"
            className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 shadow-sm transition-colors"
          />
          <button
            onClick={handleCreateRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition shadow"
          >
            Create Room
          </button>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 dark:text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search chatrooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                className="p-4 bg-slate-50 dark:bg-gray-700 rounded-lg shadow flex flex-col gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors"
              >
                {/* Only the room title area navigates */}
                <div
                  onClick={() => {
                    if (editingRoomId === room.id) return; // Don’t navigate if editing
                    setModalLoading(true);
                    router.push(`/chatroom/${room.id}`);
                  }}
                >
                  <h3 className="text-lg font-semibold">{room.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Created: {new Date(room.createdAt).toLocaleString()}
                  </p>
                </div>

                {editingRoomId === room.id ? (
                  <>
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="border border-gray-300 dark:border-gray-500 rounded px-2 py-1 w-full bg-white dark:bg-gray-600 text-slate-800 dark:text-gray-100 transition-colors"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent click!
                        handleUpdateRoom(room.id);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 rounded transition"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingRoomId(room.id);
                        setEditedTitle(room.title);
                      }}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <PencilSquareIcon className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoom(room.id);
                      }}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <TrashIcon className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-slate-500 dark:text-gray-400 py-6">
              No chatrooms found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
