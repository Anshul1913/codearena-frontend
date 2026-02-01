import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionPalette from "../../components/mcqQuestion/QuestionPalette";
import QuestionView from "../../components/mcqQuestion/QuestionView";
import Controls from "../../components/mcqQuestion/Controls";
import ChatBox from "../../components/chat/chatbox";
import RoomApi from "../../services/RoomService";
import SubmissionApi from "../../services/SubmissionService";
import { Clock, MessageCircle, X } from "lucide-react"; //  Imported X for Close Button

export default function McqRoomPage() {
  const { roomCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ 1. State for Notification
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  document.addEventListener("copy", (e) => e.preventDefault());
  document.addEventListener("paste", (e) => e.preventDefault());
  const [timeLeft, setTimeLeft] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const autoExitTriggered = useRef(false);

  // ✅ 2. Callback passed to ChatBox
  const handleMessageReceived = () => {
    if (!showChat) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  // ✅ 3. Toggle Logic
  const toggleChat = () => {
    setShowChat((prev) => !prev);
    if (!showChat) {
      setUnreadCount(0); // Reset when opening
    }
  };

  const handleEndTest = () => {
    console.log("end test");
    // handleSubmit();
  };

  useEffect(() => {
    if (roomCode) {
      fetchQuestions(roomCode);
      fetchRoomDetails();
    }
  }, [roomCode]);

  useEffect(() => {
    if (timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          if (!autoExitTriggered.current) {
            autoExitTriggered.current = true;
            handleEndTest();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft !== null]);

  const fetchRoomDetails = async () => {
    try {
      const res = await RoomApi.getRoomDetails(roomCode);
      const data = res.data;

      const startedAt = new Date(data.startedAt).getTime();
      const expiryMinutes = data.expiryDuration;

      const endTime = startedAt + expiryMinutes * 60 * 1000;
      const now = Date.now();

      const remainingSeconds = Math.max(
        Math.floor((endTime - now) / 1000),
        0
      );

      setRoomDetails(data);
      if (data.startedAt) {
        setTimeLeft(remainingSeconds);
      } else {
        console.warn("Room status ACTIVE but startedAt is NULL");
        setTimeLeft(expiryMinutes * 60); 
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchQuestions = async (roomCode) => {
    try {
      const response = await RoomApi.roomQuestions(roomCode);
      setQuestions(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting:", answers);

      const result = await SubmissionApi.submitAnswers(
        answers,
        roomCode,
        "MCQ"
      );

      console.log("Result:", result);

      try {
        await RoomApi.endTestSession(roomCode);
      } catch (e) {
        console.error("Failed to end test session", e);
      }

      navigate(`/room/${roomCode}/result`, {
        state: { result }
      });

    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading Questions...</div>;
  }

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="h-screen flex flex-col bg-bg text-gray-300 overflow-hidden relative">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-surface">
        <h2 className="text-lg font-bold text-primary">Room #{roomCode}</h2>

        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span className="font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* MAIN CONTENT */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            showChat ? "lg:mr-[340px]" : ""
          }`}
        >
          <div className="flex-1 overflow-auto p-4">
            {questions.length > 0 && (
              <QuestionView
                question={questions[current]}
                questionIndex={current}
                answers={answers}
                setAnswers={setAnswers}
              />
            )}

            {questions.length > 0 && (
              <Controls
                current={current}
                total={questions.length}
                setCurrent={setCurrent}
                onSubmit={handleSubmit}
              />
            )}

            <div className="mt-4 lg:hidden">
              <QuestionPalette
                questions={questions}
                current={current}
                answers={answers}
                onSelect={(idx) => setCurrent(idx)}
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-[260px] bg-surface border-l p-3 overflow-auto">
          <QuestionPalette
            questions={questions}
            current={current}
            answers={answers}
            onSelect={(idx) => setCurrent(idx)}
          />
        </div>
      </div>

      {/* ✅ 4. Enhanced Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-2xl z-50 hover:scale-110 hover:bg-primary/90 transition-all duration-300 ease-out ${
          showChat 
            ? "opacity-0 pointer-events-none translate-y-20 scale-50" 
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* Slightly Smaller Icon (24px) */}
        <MessageCircle size={24} strokeWidth={2.5} />
        
        {unreadCount > 0 && (
          <>
            {/* 🌊 Ripple Effect */}
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 opacity-75 animate-ping pointer-events-none"></span>
            
            {/* 🔴 Badge Count */}
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-600 border-[2px] border-surface text-white text-[10px] font-bold shadow-md">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* ✅ 5. Persisted Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-surface border-l z-40 transition-transform duration-300 ease-in-out w-[340px] shadow-2xl ${
          showChat ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-3 border-b">
          <span className="font-semibold text-primary">Chat</span>
          
          {/* ❌ RED CLOSE BUTTON with Hover */}
          <button
            onClick={() => {
                setShowChat(false);
                setUnreadCount(0);
            }}
            className="p-1 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <ChatBox 
            roomId={roomCode} 
            height="92%" 
            onMessageReceived={handleMessageReceived} 
        />
      </div>
    </div>
  );
}