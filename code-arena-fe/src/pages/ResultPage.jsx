import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { webconnectSocket, subscribeToRoomStatus } from "../services/connectSocket";
import JwtUtils from "../utils/security/JwtUtils";
import RoomApi from "../services/RoomService";

export default function RoomResultPage() {
  const { roomCode } = useParams();
  const location = useLocation();
  const initialResult = location.state?.result;
  console.log(location.state);
  
  const [result, setResult] = useState(initialResult);
  const [waiting, setWaiting] = useState(!initialResult?.winner || initialResult?.winner === "PENDING" || initialResult?.winner === "WAITING");
  const [winner, setWinner] = useState(initialResult?.winner && initialResult?.winner !== "PENDING" && initialResult?.winner !== "WAITING" ? initialResult.winner : null);
  const [roomQuestions, setRoomQuestions] = useState([]);
  const [questionStatuses, setQuestionStatuses] = useState([]);

  useEffect(() => {
    console.log("ResultPage mounted for room:", roomCode);

    // If we have a definite winner, we can stop waiting, but we still might want WS for other things
    // However, if winner is PENDING or WAITING, we MUST connect.
    const isPending = !result?.winner || result?.winner === "PENDING" || result?.winner === "WAITING";

    if (!isPending) {
      setWaiting(false);
    }

    // Always fetch questions and status
    fetchQuestionsInfo();
    fetchRoomStatus();

    // Connect to WebSocket to listen for match completion if pending
    let socket = null;
    if (isPending) {
      console.log("Match is pending, connecting to WebSocket...");
      socket = webconnectSocket(() => {
        console.log("WebSocket connected, subscribing to room status...");
        subscribeToRoomStatus(roomCode, (data) => {
          console.log("Received WebSocket event:", data);
          if (data.event === "MATCH_COMPLETED") {
            console.log("Match completed event received! Winner:", data.winner);
            setWinner(data.winner);
            setWaiting(false);
            const currentUsername = JwtUtils.getUsername();
            if (data.player1 === currentUsername || data.player2 === currentUsername) {
              const isPlayer1 = data.player1 === currentUsername;
            
              
              setResult(prev => ({
                ...prev,
                score: isPlayer1 ? data.player1Score : data.player2Score,
                winner: data.winner
              }));
            }
          }
        });
      });
    }

    // Fallback polling if still waiting after 2 seconds, and every 5 seconds thereafter
    let pollInterval = null;
    if (isPending) {
      pollInterval = setInterval(() => {
        if (waiting) {
          console.log("Still waiting... polling for status update...");
          fetchRoomStatus();
        }
      }, 5000);
    }

    return () => {
      console.log("ResultPage unmounting, cleaning up...");
      if (socket) socket.deactivate();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [roomCode, waiting]); // Re-run if waiting changes or roomCode changes

  const fetchRoomStatus = async () => {
    try {
      console.log("Fetching room details for status update...");
      const response = await RoomApi.getRoomDetails(roomCode);
      const roomData = response.data; // API returns { success, message, data: { ...roomInfo } }
      console.log("Room details fetched:", roomData?.status, roomData?.winner);
        // console.log(isPlayer1);
              console.log(initialResult);
              console.log(result);
              
      if (roomData?.status === "COMPLETED") {
        setWinner(roomData.winner || "TIE");
        setWaiting(false);
        setResult(prev => ({
          ...prev,
          winner: roomData.winner || "TIE"
        }));
      }
    } catch (err) {
      console.error("Error fetching room status:", err);
    }
  };

  const fetchQuestionsInfo = async () => {
    try {
      const questions = await RoomApi.roomQuestions(roomCode);
      const statuses = await RoomApi.fetchRoomQuestionStatus(roomCode);
      setRoomQuestions(questions);
      setQuestionStatuses(statuses);
    } catch (err) {
      console.error("Error fetching questions info:", err);
    }
  };

  if (!result) {
    return <div className="p-10 text-center text-white"><h2>No Result Found</h2></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bg text-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-primary">Match Results</h1>

        <div className="mb-6 min-h-[100px] flex items-center justify-center">
          {waiting ? (
            <div className="flex flex-col items-center animate-pulse">
              <span className="text-5xl mb-2">⏳</span>
              <h2 className="text-xl font-bold text-yellow-400">Waiting for Opponent...</h2>
              <p className="text-gray-400 text-sm">Results will update automatically.</p>
            </div>
          ) : (
            winner === "TIE" ? (
              <div className="text-4xl font-black text-yellow-400 mb-2">IT'S A TIE! 🤝</div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <span className="text-gray-400 text-sm uppercase tracking-widest mb-1">Winner</span>
                <span className="text-4xl font-black text-green-400 truncate max-w-full">{winner} 🏆</span>
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-left bg-black/20 p-4 rounded-xl mb-6">
          <div>
            <p className="text-xs text-gray-400">Your Score</p>
            <p className="text-xl font-bold">{result.score ?? questionStatuses.filter(s => s.solved).length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Correct Answers</p>
            <p className="text-xl font-bold">{result.correctAnswers ?? questionStatuses.filter(s => s.solved).length}</p>
          </div>
          {result.timeTaken!=undefined && (
            <div>
              <p className="text-xs text-gray-400">Time Taken</p>
              <p className="text-xl font-bold">{result.timeTaken ?? 0}s</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400">Total Questions</p>
            <p className="text-xl font-bold">{result.totalQuestions || roomQuestions.length || 0}</p>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/dashboard'}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold w-full transition-colors"
        >
          Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
