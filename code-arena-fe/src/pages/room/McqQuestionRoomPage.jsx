import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionPalette from "../../components/mcqQuestion/QuestionPalette";
import QuestionView from "../../components/mcqQuestion/QuestionView";
import Controls from "../../components/mcqQuestion/Controls";
import ChatBox from "../../components/chat/chatbox";
import RoomApi from "../../services/RoomService";
import SubmissionApi from "../../services/SubmissionService";
import { Clock, MessageCircle } from "lucide-react";

export default function McqRoomPage() {
  const { roomCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.addEventListener("copy", (e) => e.preventDefault());
  document.addEventListener("paste", (e) => e.preventDefault());
  const [timeLeft, setTimeLeft] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex }
  const navigate = useNavigate();

  const autoExitTriggered = useRef(false);
  

  const handleEndTest = () => {
    console.log("end test");

    // alert("Time is up! The test will be submitted automatically.");
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
    setTimeLeft(remainingSeconds);
      setRoomDetails(roomDetails.data);
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

      // Redirect to result page
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
    <div className="h-screen flex flex-col bg-bg text-gray-300 overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-surface">
        <h2 className="text-lg font-bold text-primary">Room #{roomCode}</h2>

        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span className="font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT (Compress when chat opens) */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300
        ${showChat ? "lg:mr-[100px]" : ""}`}
        >
          {/* QUESTION VIEW */}
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

            {/* MOBILE PALETTE (BELOW QUESTION) */}
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

        {/* DESKTOP PALETTE */}
        <div className="hidden lg:block w-[260px] bg-surface border-l p-3 overflow-auto">
          <QuestionPalette
            questions={questions}
            current={current}
            answers={answers}
            onSelect={(idx) => setCurrent(idx)}
          />
        </div>
      </div>

      {/* CHAT FLOAT BUTTON */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg "
      >
        <MessageCircle size={22} />
      </button>

      {/* CHAT PANEL (RIGHT SIDE) */}
      <div
        className={`fixed top-0 right-0 h-full bg-surface border-l z-40
      transition-all duration-300
      ${showChat ? "w-[340px]" : "w-0 overflow-hidden"}`}
      >
        {showChat && (
          <>
            {/* Chat Header */}
            <div className="flex justify-between items-center p-3 border-b">
              <span className="font-semibold text-primary"></span>

              <button
                onClick={() => setShowChat(false)}
                className="text-red-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <ChatBox roomId={roomCode} height="92%" />
          </>
        )}
      </div>
    </div>
  );
}
