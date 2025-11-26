import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import {  startMatchSocket, subscribeToRoomStatus, webconnectSocket } from "../../services/connectSocket";
import JwtUtils from "../../utils/security/JwtUtils";
import RoomApi from "../../services/RoomService";
import { set } from "lodash";

export default function McqWaitingRoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
const [copied, setCopied] = useState(false);

const copyCode = () => {
  navigator.clipboard.writeText(roomCode);
  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 1500); // reset after animation
};
  const [playerCount, setPlayerCount] = useState(1);
  const [player1, setPlayer1] = useState(JwtUtils.getUsername());
  const [player2, setPlayer2] = useState(null);


  useEffect(() => {
  const socket = webconnectSocket(() => {
    setuserDetails();
    console.log("WS Connected, now subscribing to status");

    subscribeToRoomStatus(roomCode, (data) => {
      console.log("STATUS EVENT:", data);

      if (data.event === "PLAYER_JOINED") {
        setPlayer2(data.username);
        setPlayerCount(data.playerCount);
      }

      if (data.event === "START_MATCH") {
        navigate(`/mcq-room/${roomCode}`);
      }
    });
  });

  return () => socket.deactivate();
}, []);

const setuserDetails = async() => {
  try {
    const response = await RoomApi.getRoomDetails(roomCode);
    console.log(response);
    setPlayer1(response.data.createdByName);
    if(response.data.joinedByName){
      setPlayer2(response.data.joinedByName);
      setPlayerCount(2);
    }
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
  }
};

  const startMatch = () => startMatchSocket(roomCode);


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-[#1e1e2f] to-[#0f0f17] text-white select-none">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black mb-6 tracking-wide"
      >
        Waiting for Opponent ⚔️
      </motion.h1>

      {/* Avatars */}
      <div className="flex items-center gap-12 mb-10">

        {/* Player A */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="h-32 w-32 rounded-full bg-purple-600/70 border-[4px] border-purple-400 shadow-xl shadow-purple-500/50 flex items-center justify-center text-4xl font-bold">
            🧑
          </div>
          <p className="mt-3 text-lg font-semibold text-purple-300">{player1}</p>
        </motion.div>

        {/* VS text */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            textShadow: ["0 0 10px #ff2f2f", "0 0 25px #ff2f2f"]
          }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="text-4xl font-extrabold"
        >
          VS
        </motion.div>

        {/* Player B */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className={`h-32 w-32 rounded-full border-[4px] shadow-xl flex items-center justify-center text-4xl font-bold
              ${player2 ? "bg-green-600/70 border-green-400 shadow-green-500/50" : "bg-gray-600/50 border-gray-400 animate-pulse"}`}
          >
            {player2 ? "🧑" : "…"}
          </div>
          <p className="mt-3 text-lg font-semibold text-green-300">
            {player2 ?? "Waiting..."}
          </p>
        </motion.div>
      </div>

      {/* Room Code */}
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="flex items-center gap-3 bg-black/40 px-5 py-3 rounded-xl border border-gray-600 shadow-md shadow-purple-500/30"
>
  <span className="text-xl font-mono">{roomCode}</span>

  <motion.button
    onClick={copyCode}
    whileTap={{ scale: 0.8 }}
    animate={copied ? { scale: [1, 1.2, 1], backgroundColor: "#22c55e" } : {}}
    transition={{ duration: 0.4 }}
    className="p-2 bg-purple-500/80 hover:bg-purple-600 rounded-lg flex items-center gap-1"
  >
    <Copy size={18} />
    {copied && <span className="text-xs font-bold">Copied!</span>}
  </motion.button>
</motion.div>

      {/* Start Button */}
      {playerCount === 2 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={startMatch}
          className="mt-8 px-10 py-3 text-xl rounded-xl font-bold bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50"
        >
          Start Match 🚀
        </motion.button>
      )}
    </div>
  );
}
