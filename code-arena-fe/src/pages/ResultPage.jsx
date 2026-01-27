import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { webconnectSocket, subscribeToRoomStatus } from "../services/connectSocket";

export default function RoomResultPage() {
  const { roomCode } = useParams();
  const location = useLocation();
  const initialResult = location.state?.result;

  const [result, setResult] = useState(initialResult);
  const [waiting, setWaiting] = useState(!initialResult?.winner);
  const [winner, setWinner] = useState(initialResult?.winner);

  useEffect(() => {
    // If we already have a winner, no need to connect
    if (result?.winner) {
      setWaiting(false);
      return;
    }

    // Connect to WebSocket to listen for match completion
    const socket = webconnectSocket(() => {
      subscribeToRoomStatus(roomCode, (data) => {
        if (data.event === "MATCH_COMPLETED") {
          setWinner(data.winner);
          setWaiting(false);
          // Determine if it was a tie
          if (data.message.includes("Tie")) {
            setWinner("TIE");
          }
        }
      });
    });

    return () => {
      if (socket) socket.deactivate();
    };
  }, [roomCode, result]);

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
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm uppercase tracking-widest mb-1">Winner</span>
                <span className="text-4xl font-black text-green-400">{winner} 🏆</span>
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-left bg-black/20 p-4 rounded-xl">
          <div>
            <p className="text-xs text-gray-400">Your Score</p>
            <p className="text-xl font-bold">{result.score}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Correct Answers</p>
            <p className="text-xl font-bold">{result.correctAnswers}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Time Taken</p>
            <p className="text-xl font-bold">{result.timeTaken}s</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Questions</p>
            <p className="text-xl font-bold">{result.totalQuestions}</p>
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
