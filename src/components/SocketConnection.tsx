import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/rootSlice";

// Initialize socket connection
const socket: Socket = io("https://server-team-collaboration.onrender.com");

// Message interface
interface Message {
  sender: string;
  content: string;
  timestamp: string;
  senderId?: string;
}

// Define User type
interface User {
  id: string;
  name: string;
}

// Chat component
const ChatTest: React.FC = () => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { userTeam } = useAppSelector((state) => state.root);
  const teamId = userTeam?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Properly parse and type user from localStorage
  const user: User = JSON.parse(localStorage.getItem("user") || '{"id": "", "name": "Anonymous"}');
  const currentUserName = user.name || "Anonymous";
  const senderId = user.id;

  // Fetch messages on mount or when teamId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!teamId) return;
      dispatch(showLoading());
      try {
        const res = await axios.get("/api/messages/get", {
          params: { teamId },
        });

        const formattedMessages = res.data.data.map((msg: any) => ({
          content: msg.content,
          sender: msg.senderId?.name || "Unknown",
          timestamp: msg.createdAt,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchMessages();
  }, [teamId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!teamId) return;

    socket.emit("joinRoom", teamId);

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [teamId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !senderId || !teamId) return;

    const newMessage: Message = {
      sender: currentUserName,
      content: input.trim(),
      timestamp: new Date().toISOString(),
      senderId,
    };

    try {
      socket.emit("sendMessage", { teamId, ...newMessage });
      setInput("");
      await axios.post("/api/messages/add", {
        content: newMessage.content,
        senderId,
        teamId,
      });

     
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Message failed to send.");
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:border-gray-700 p-4 h-[100%]">
      <div className="flex-1 overflow-y-auto mb-4 px-2 space-y-1">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No messages yet.</p>
        )}

        {messages.map((msg, i) => {
          const isCurrentUser = msg.sender === currentUserName;
          return (
            <div
              key={i}
              className={`flex mb-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] min-w-30 px-2 py-1 rounded-lg shadow ${
                  isCurrentUser
                    ? "bg-[#0a0233] text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                <div className="text-xs text-yellow-600 font-semibold underline">
                  {msg.sender}
                </div>

                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="text-[10px] text-gray-400 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatTest;
