import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, MessageCircle } from "lucide-react";
import CodeEditor from "../../components/editor/CodeEditor";
import CodeExecutionApi from "../../services/CodeExecutionService";
import ChatBox from "../../components/chat/chatbox";
import { useParams } from "react-router-dom";
import RoomApi from "../../services/RoomService";
import SubmissionApi from "../../services/SubmissionService";

export default function RoomPage() {
  const { roomCode } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roomDetails, setRoomDetails] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [starterCode, setStarterCode] = useState([]);
  const [timerReady, setTimerReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fetched = useRef(false);
  const autoExitTriggered = useRef(false);
  const languageVersionMap = {
    javascript: "18.15.0",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
  };

  useEffect(() => {
    if (!roomCode) return;

    fetched.current = false; // reset on room change
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
      console.log("ROOM FULL:", roomRes.data);
      console.log("QUESTION FULL:", questionRes);
      console.log("STATUS FULL:", statusRes);

      // ---------- TIMER ----------

      const startedAt = new Date(roomRes.data.startedAt).getTime();
      const expiryMinutes = roomRes.data.expiryDuration;

      const endTime = startedAt + expiryMinutes * 60 * 1000;
      const now = Date.now();

      const remainingSeconds = Math.max(Math.floor((endTime - now) / 1000), 0);

      setRoomDetails(roomRes.data);
      setTimeLeft(remainingSeconds);

      // ---------- MERGE STATUS ----------

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

      // ---------- DEFAULT QUESTION ----------

      if (mergedQuestions.length > 0) {
        const first = mergedQuestions[0];

        setStarterCode(first.starterCodes || []);
        setCode(first.starterCodes?.[0]?.codeTemplate || "");
      }
    } catch (err) {
      console.error("Room load error", err);
    }
  };

  const mergeQuestionStatus = (questions, statusList) => {
    const statusMap = {};

    statusList.forEach((s) => {
      statusMap[s.questionId] = s;
    });

    const merged = questions.map((q) => {
      const status = statusMap[q.id];

      return {
        ...q,
        solved: status?.solved || false,
        attempts: status?.attempts || 0,
      };
    });

    setQuestions(merged);
  };

  // ================= QUESTION CHANGE =================

  const changeQuestion = (index) => {
    setCurrentIndex(index);

    const q = questions[index];

    setStarterCode(q.starterCodes);
    setCode(q.starterCodes?.[0]?.codeTemplate || "");
    setOutput("");
  };

  // ================= RUN CODE =================

  const handleRun = async () => {
    try {
      setIsRunning(true);
      console.log(questions[currentIndex]);

      const payload = {
        language,
        version: languageVersionMap[language],
        code,
        codingQuestionId: questions[currentIndex].id,
      };

      const result = await CodeExecutionApi.executeCode(payload);

      const stdout = result.stdout;
      const stderr = result.stderr;

      if (stdout) setOutput(stdout);
      else if (stderr) setOutput(stderr);
      else setOutput("No Output");
    } catch (error) {
      console.error(error);
      setOutput("❌ Execution Error");
    } finally {
      setIsRunning(false);
    }
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {
    setIsRunning(true);
    console.log(questions[currentIndex]);

    const payload = {
      language,
      version: languageVersionMap[language],
      code,
      codingQuestionId: questions[currentIndex].id,
    };
    const result = await CodeExecutionApi.submitCode(payload, roomCode);
    console.log(result.stdout);

    if (result.stdout) setOutput(result.stdout);
    setIsRunning(false);
    fetchRoomQuestionStatus();
    // alert(`✅ Submission Result: ${result.stdout}`);
  };
  const fetchRoomQuestionStatus = async () => {
    try {
      const response = await RoomApi.fetchRoomQuestionStatus(roomCode);
      console.log("Fetched Question Status:", response);
      // Update question statuses if needed
      mergeQuestionStatus(questions, response);
      console.log(questions);
    } catch (error) {
      console.error("Error fetching question status:", error);
    }
  };
  const handleEndTest = async () => {
    
  };
  // ================= UI =================

  const currentQuestion = questions[currentIndex];

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 border-b text-white bg-surface">
        <h2 className="text-lg font-bold text-primary">Room #{roomCode}</h2>
        <div className="flex items-center gap-2 text-white">
          <Clock size={18} />
          <span className="font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[25%] border-r text-gray-300 bg-surface p-3 overflow-auto">
          {questions.length === 0 ? (
            <p className="text-sm">Loading Questions...</p>
          ) : (
            <>
              {/* Question Navigation */}
              <div className="flex flex-wrap gap-2 mb-4">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;

                  let bgColor = "bg-gray-300 text-gray-800"; // not attempted

                  if (q.solved) {
                    bgColor = "bg-green-500 text-white"; // solved
                  }

                  if (isCurrent) {
                    bgColor = "bg-primary text-white"; // current overrides all
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => changeQuestion(idx)}
                      className={`w-8 h-8 rounded font-semibold ${bgColor}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Detail */}
              <h3 className="font-semibold mb-2">{currentQuestion.title}</h3>

              <p className="text-sm mb-3">{currentQuestion.description}</p>

              <p className="text-xs mb-1">
                <b>Input:</b> {currentQuestion.inputFormat}
              </p>

              <p className="text-xs mb-1">
                <b>Output:</b> {currentQuestion.outputFormat}
              </p>

              <p className="text-xs mb-3">
                <b>Constraints:</b> {currentQuestion.constraints}
              </p>

              {/* Test Cases */}
              <h4 className="text-sm font-semibold mb-1">Test Cases</h4>

              <ul className="text-xs space-y-1">
                {currentQuestion.testCases.map((tc, idx) => (
                  <li key={idx}>
                    • {!tc.isSample ? "Hidden Test Case" : tc.inputData}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* CENTER EDITOR */}
        <div className="flex flex-col flex-1">
          {/* CODE EDITOR */}
          <div className="flex-1 min-h-0 border-b">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              starterCode={starterCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              onEndTest={handleEndTest}
            />
          </div>

          {/* OUTPUT PANEL */}
          <div className="h-40 bg-surface text-gray-300 p-3 overflow-auto border-t">
            <h3 className="text-sm font-semibold mb-2">Output</h3>

            <pre className="text-sm whitespace-pre-wrap break-words">
              {output || "Run code to see output"}
            </pre>
          </div>
        </div>
      </div>

      {/* CHAT BUTTON */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full"
      >
        <MessageCircle size={22} />
      </button>

      {/* CHAT PANEL */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-[350px] bg-surface border-l z-50">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-primary"> </span>
            <button
              onClick={() => setShowChat(false)}
              className="text-sm text-red-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <ChatBox roomId={roomCode} height="92%" />
        </div>
      )}
    </div>
  );
}