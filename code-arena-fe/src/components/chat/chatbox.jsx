import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import JwtUtils from "../../utils/security/JwtUtils";
import RoomApi from "../../services/RoomService";
import { connectSocket } from "../../services/connectSocket";

export default function ChatBox({ roomId, height = "600px" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const username = JwtUtils.getUsername() || "Anonymous";

  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socketClient = connectSocket(
      roomId,
      (msg) => {
        setMessages((prev) => [...prev, msg]);
      },
      async () => {
        setConnected(true);
        const res = await RoomApi.getChatsFromRoom(roomId);
        setMessages(res);
      }
    );

    clientRef.current = socketClient;
    return () => socketClient.deactivate();
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim() || !clientRef.current || !connected) return;

    const chatMessage = {
      content: input,
      roomCode: roomId,
      senderUsername: username,
    };

    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });

    setInput("");
  };

  return (
    <div
      className="flex flex-col bg-surface text-text border border-border rounded-radius-xl shadow-shadow-soft p-3"
      style={{ height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-primary">Room Chat</h3>
        <span
          className={`text-xs px-2 py-1 rounded-radius-lg ${
            connected ? "bg-primary/20 text-primary" : "bg-border text-muted"
          }`}
        >
          {connected ? "Connected" : "Connecting..."}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-radius-lg max-w-[85%] break-words whitespace-pre-wrap ${
              msg.senderUsername === username
                ? "bg-primary text-white ml-auto"
                : "bg-bg border border-border"
            }`}
          >
            <p className="text-xs opacity-70">{msg.senderUsername}</p>
            <p className="text-sm font-medium">{msg.content}</p>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex mt-3">
        <textarea
          className="flex-1 p-2 bg-bg border border-border rounded-radius-lg outline-none resize-none no-scrollbar text-text"
          placeholder="Type a message..."
          value={input}
          disabled={!connected}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={!connected}
          className="ml-2 p-3 bg-primary text-white rounded-radius-lg flex items-center justify-center disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
