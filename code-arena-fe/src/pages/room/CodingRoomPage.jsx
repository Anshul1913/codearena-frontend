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
  const [timeLeft, setTimeLeft] = useState(1000); // 30 min (seconds)

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fetched = useRef(false);

  const languageVersionMap = {
    javascript: "18.15.0",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
  };
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoExitCoding();

      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAutoExitCoding = () => {
    alert("⏰ Time's up! The coding session has ended.");
    // Additional logic for auto-submission or redirecting can be added here
  };
  //   useEffect(() => {

  //   const syncInterval = setInterval(() => {
  //     fetchRoomDetails();
  //   }, 30000); // sync every 30 sec

  //   return () => clearInterval(syncInterval);

  // }, []);

  // ================= FETCH QUESTIONS =================

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetchQuestions();
    fetchRoomDetails();
  }, [roomCode]);

  const fetchRoomDetails = async () => {
    try {
      const response = await RoomApi.getRoomDetails(roomCode);

      const startedAt = new Date(response.data.startedAt).getTime();

      const durationMs = response.data.expiryDuration * 60 * 1000;

      const endTime = startedAt + durationMs;

      const now = Date.now();

      const remainingSeconds = Math.max(Math.floor((endTime - now) / 1000), 0);

      setTimeLeft(remainingSeconds);
      setRoomDetails(response.data);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await RoomApi.fetchRoomQuestionWithTestCases(roomCode);

      console.log("Fetched Questions:", response);

      setQuestions(response);

      if (response.length > 0) {
        setStarterCode(response[0].starterCodes);
        setCode(response[0].starterCodes?.[0]?.codeTemplate || "");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
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
      const result = await CodeExecutionApi.submitCode(payload,roomCode);
      console.log(result.stdout);

      if (result.stdout) setOutput(result.stdout);
      setIsRunning(false);
      alert(`✅ Submission Result: ${result.stdout }`);
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
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeQuestion(idx)}
                    className={`w-8 h-8 rounded ${
                      idx === currentIndex
                        ? "bg-primary text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
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
          <ChatBox roomId={roomCode} height="80%" />
        </div>
      )}
    </div>
  );
}
