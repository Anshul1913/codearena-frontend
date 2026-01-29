import { useEffect, useState, useRef } from "react";
import { MessageCircle } from "lucide-react";
import CodingEnvironment from "../../components/editor/CodingEnvironment";
import CodeExecutionApi from "../../services/CodeExecutionService";
import ChatBox from "../../components/chat/chatbox";
import { useParams, useNavigate } from "react-router-dom";
import RoomApi from "../../services/RoomService";

export default function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roomDetails, setRoomDetails] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [starterCode, setStarterCode] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const autoExitTriggered = useRef(false);

  const languageVersionMap = {
    javascript: "18.15.0",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
  };

  useEffect(() => {
    if (!roomCode) return;
    loadRoom();
  }, [roomCode]);

  useEffect(() => {
    if (timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
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
  }, [timeLeft]);

  const loadRoom = async () => {
    try {
      const [roomRes, questionRes, statusRes] = await Promise.all([
        RoomApi.getRoomDetails(roomCode),
        RoomApi.fetchRoomQuestionWithTestCases(roomCode),
        RoomApi.fetchRoomQuestionStatus(roomCode),
      ]);

      const startedAt = new Date(roomRes.data.startedAt).getTime();
      const expiryMinutes = roomRes.data.expiryDuration;
      const endTime = startedAt + expiryMinutes * 60 * 1000;
      const now = Date.now();
      const remainingSeconds = Math.max(Math.floor((endTime - now) / 1000), 0);

      setRoomDetails(roomRes.data);
      if (roomRes.data.startedAt) {
        setTimeLeft(remainingSeconds);
      } else {
        setTimeLeft(roomRes.data.expiryDuration * 60);
      }

      const statusMap = {};
      statusRes.forEach((s) => {
        statusMap[s.questionId] = s;
      });

      const mergedQuestions = questionRes.map((q) => ({
        ...q,
        solved: statusMap[q.id]?.solved || false,
        attempts: statusMap[q.id]?.attempts || 0,
      }));

      setQuestions(mergedQuestions);

      if (mergedQuestions.length > 0) {
        const first = mergedQuestions[0];
        setStarterCode(first.starterCodes || []);
        setCode(first.starterCodes?.[0]?.codeTemplate || "");
      }
    } catch (err) {
      console.error("Room load error", err);
    }
  };

  const mergeQuestionStatus = (questionsList, statusList) => {
    const statusMap = {};
    statusList.forEach((s) => {
      statusMap[s.questionId] = s;
    });

    const merged = questionsList.map((q) => {
      const status = statusMap[q.id];
      return {
        ...q,
        solved: status?.solved || false,
        attempts: status?.attempts || 0,
      };
    });

    setQuestions(merged);
  };

  const changeQuestion = (index) => {
    setCurrentIndex(index);
    const q = questions[index];
    setStarterCode(q.starterCodes);
    setCode(q.starterCodes?.[0]?.codeTemplate || "");
    setOutput("");
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      const payload = {
        language,
        version: languageVersionMap[language],
        code,
        codingQuestionId: questions[currentIndex].id,
      };

      const result = await CodeExecutionApi.executeCode(payload);
      if (result.stdout) setOutput(result.stdout);
      else if (result.stderr) setOutput(result.stderr);
      else setOutput("No Output");
    } catch (error) {
      console.error(error);
      setOutput("❌ Execution Error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    try {
      const payload = {
        language,
        version: languageVersionMap[language],
        code,
        codingQuestionId: questions[currentIndex].id,
      };
      const result = await CodeExecutionApi.submitCode(payload, roomCode);
      if (result.stdout) setOutput(result.stdout);

      const statusResponse = await RoomApi.fetchRoomQuestionStatus(roomCode);
      mergeQuestionStatus(questions, statusResponse);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleEndTest = async () => {
    try {
      await RoomApi.endTestSession(roomCode);
      navigate(`/room/${roomCode}/result`, {
        state: { result: { roomCode, winner: "PENDING" } },
      });
    } catch (err) {
      console.error("Error ending test:", err);
      navigate(`/room/${roomCode}/result`, {
        state: { result: { roomCode, winner: "PENDING" } },
      });
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const renderHeaderRight = () => (
    <h3 className="text-sm font-bold text-muted-foreground mr-4">Room #{roomCode}</h3>
  );

  return (
    <>
      <CodingEnvironment
        question={questions[currentIndex]}
        questions={questions}
        currentIndex={currentIndex}
        changeQuestion={changeQuestion}
        code={code}
        setCode={setCode}
        language={language}
        setLanguage={setLanguage}
        starterCode={starterCode}
        onRun={handleRun}
        onSubmit={handleSubmit}
        isRunning={isRunning}
        onEndTest={handleEndTest}
        output={output}
        timeLeft={timeLeft}
        formatTime={formatTime}
        renderHeaderRight={renderHeaderRight}
      />

      {/* CHAT BUTTON */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg z-40"
      >
        <MessageCircle size={22} />
      </button>

      {/* CHAT PANEL */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-[350px] bg-surface border-l z-50 shadow-2xl">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-primary">Chat</span>
            <button
              onClick={() => setShowChat(false)}
              className="text-sm text-error hover:text-error/80"
            >
              ✕
            </button>
          </div>
          <ChatBox roomId={roomCode} height="calc(100% - 50px)" />
        </div>
      )}
    </>
  );
}
