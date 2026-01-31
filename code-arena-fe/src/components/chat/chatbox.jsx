import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MoreHorizontal } from "lucide-react"; // Import MoreHorizontal for typing icon
import JwtUtils from "../../utils/security/JwtUtils";
import RoomApi from "../../services/RoomService";
import { connectSocket } from "../../services/connectSocket";

// ✅ 1. Accept 'onMessageReceived' prop to notify parent
export default function ChatBox({ roomId, height = "600px", onMessageReceived }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  
  // ✅ 2. State for Typing Indicator
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);

  const username = JwtUtils.getUsername() || "Anonymous";
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]); // Scroll when typing appears too

  useEffect(() => {
    const socketClient = connectSocket(
      roomId,
      (msg) => {
        // ✅ 3. Handle Message Types
        if (msg.type === "TYPING") {
          // Ignore my own typing
          if (msg.senderUsername !== username) {
            setTypingUser(msg.senderUsername);
            
            // Clear typing status after 2 seconds
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
          }
          return; // Don't add to message list
        }

        // Normal Chat Message
        setMessages((prev) => [...prev, msg]);
        
        // ✅ 4. Notify Parent (for Red Bubble)
        if (onMessageReceived) {
            onMessageReceived();
        }
      },
      async () => {
        setConnected(true);
        const res = await RoomApi.getChatsFromRoom(roomId);        
        setMessages(res);
      }
    );

    clientRef.current = socketClient;
    return () => socketClient.deactivate();
  }, [roomId, username, onMessageReceived]);

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // ✅ 5. Send Typing Signal
    if (clientRef.current && connected) {
        const typingMsg = {
            senderUsername: username,
            roomCode: roomId,
            type: "TYPING"
        };
        clientRef.current.publish({
            destination: `/app/chat.typing/${roomId}`,
            body: JSON.stringify(typingMsg),
        });
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !clientRef.current || !connected) return;

    const chatMessage = {
      content: input,
      roomCode: roomId,
      senderUsername: username,
      type: "CHAT" // Explicitly set type
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
      <div className="flex items-center justify-between mb-2 border-b border-border pb-2">
        <h3 className="text-sm font-semibold text-primary">Room Chat</h3>
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></span>
            <span className="text-xs text-muted">
            {connected ? "Online" : "Offline"}
            </span>
        </div>
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
            <p className="text-[10px] opacity-70 mb-1">{msg.senderUsername.split('@')[0]}</p>
            <p className="text-sm font-medium">{msg.content}</p>
          </motion.div>
        ))}
        
        {/* ✅ 6. Typing Indicator UI */}
        <AnimatePresence>
            {typingUser && (
                <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs text-muted italic ml-1"
                >
                    <MoreHorizontal size={14} className="animate-pulse text-primary"/>
                    <span>{typingUser.split('@')[0]} is typing...</span>
                </motion.div>
            )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex mt-3 items-end gap-2">
        <textarea
          className="flex-1 p-2 bg-bg border border-border rounded-radius-lg outline-none resize-none no-scrollbar text-text focus:ring-1 focus:ring-primary transition-all"
          placeholder="Type a message..."
          value={input}
          disabled={!connected}
          onChange={handleInputChange} // Linked to new handler
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
          className="p-3 bg-primary text-white rounded-radius-lg flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}