"use client";

import { useEffect, useRef, useState } from "react";
import useChatroomMessages from "@/hooks/useChatroomMessages";
import { ClipboardIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { SIGNIN_PAGE } from "@/config/constants";
import { useLoading } from "@/hooks/context/LoadingContext";

export default function Chatroom() {
  const { messages, isTyping, sendMessage, messagesEndRef, loadOlderMessages } =
    useChatroomMessages();
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const { setLoading: setModalLoading } = useLoading();
  const router = useRouter();
  const dispatch = useDispatch();
 useEffect(() => {
    setModalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;
    sendMessage(input.trim(), imagePreview || undefined);
    setInput("");
    setImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied!");
  };

  const handleSignOut = () => {
    dispatch({ type: "auth/logout" });
    router.push(SIGNIN_PAGE);
    toast.success("Signed out!");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors">
     
      <header className="fixed h-15 top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-100 transition-colors">
        <h1 className="text-lg font-bold">Chatroom</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm">{`${currentUser?.firstName} ${currentUser?.lastName}`}</span>
          <UserCircleIcon className="w-6 h-6 text-black dark:text-gray-200" />
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
          >
            Sign Out
          </button>
        </div>
      </header>

     
      <div className="flex-1 flex flex-col mt-16 mb-24 overflow-y-auto">
        <div className="flex-1 flex flex-col-reverse px-4 pb-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-xs md:max-w-sm rounded-xl px-4 py-3 shadow transition-colors transform hover:scale-[1.02] ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
                  }`}
                  onClick={() => msg.text && copyToClipboard(msg.text)}
                >
                  {msg.text && <p>{msg.text}</p>}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded"
                      className="mt-2 rounded-lg max-h-40 object-cover"
                    />
                  )}
                  <p className="text-xs mt-1 opacity-60 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {msg.text && (
                    <ClipboardIcon className="w-4 h-4 absolute top-1 right-1 opacity-50 hover:opacity-80" />
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-4 py-2 rounded-lg shadow text-sm transition-colors">
                  Gemini is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {imagePreview && (
          <div className="p-2 flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 rounded-lg border border-gray-300 dark:border-gray-600 shadow transition-colors"
            />
          </div>
        )}
      </div>

      
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-300 dark:border-gray-700 p-4 flex gap-2 bg-white dark:bg-gray-800 transition-colors">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 shadow-sm bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-full shadow transition-colors"
          title="Upload image"
        >
          📷
        </button>
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow transition"
        >
          Send
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </main>
  );
}
