import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JoinRoomModal({ isOpen, onClose, onJoin }) {
  const [roomId, setRoomId] = useState("");

  const handleJoin = () => {
    if (roomId.trim()) {
      onJoin(roomId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-surface p-8 rounded-radius-xl shadow-shadow-strong w-[90%] max-w-md text-text"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-display font-semibold mb-6 text-center text-primary">
              Join Room
            </h2>

            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="w-full bg-bg border border-border rounded-md px-3 py-2 mb-6"
            />

            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-muted text-muted rounded-md hover:bg-muted/10"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                className="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-md font-semibold hover:opacity-90"
              >
                Join Room
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
