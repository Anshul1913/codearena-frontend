import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, MessageCircle, AlertCircle, CheckCircle, Loader } from "lucide-react";
import CodeEditor from "../../components/editor/CodeEditor";
import CodeExecutionApi from "../../services/CodeExecutionService";
import ChatBox from "../../components/chat/chatbox";
import { useNavigate, useParams } from "react-router-dom";
import RoomApi from "../../services/RoomService";
import SubmissionApi from "../../services/SubmissionService";
import { webconnectSocket } from "../../services/connectSocket";

export default function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

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
  const [isWaiting, setIsWaiting] = useState(false); // Waiting for opponent

  const fetched = useRef(false);
  const autoExitTriggered = useRef(false);
  const stompClientRef = useRef(null);

  const languageVersionMap = {
    javascript: "18.15.0",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
  };

  // ================= TIMER =================
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isWaiting) {
        // Only autosubmit or exit if not already waiting
        handleAutoExitCoding();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isWaiting]);

  const handleAutoExitCoding = () => {
    // Optional: Warning toast
  };

  // ================= FETCH DATA =================
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetchQuestions();
    fetchRoomDetails();
    connectToSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [roomCode]);

  const connectToSocket = () => {
    const client = webconnectSocket(() => {
      client.subscribe(`/topic/room/${roomCode}/status`, (message) => {
        try {
          const body = JSON.parse(message.body);
          console.log("📩 Socket Message:", body);

          // Check for match completion
          if (body.event === "MATCH_COMPLETED" || body.type === "MATCH_OVER" || body.status === "COMPLETED") {
            handleMatchOver(body);
          }
        } catch (e) {
          console.error("Error parsing socket message:", e);
        }
      });
    });
    stompClientRef.current = client;
  };

  const handleMatchOver = (data) => {
    console.log("Match completed, navigating to results:", data);

    const formattedResult = {
      score: data.player1Score || data.score || 0,
      timeTaken: data.player1Time || data.timeTaken || 0,
      correctAnswers: data.correctAnswers || 0,
      totalQuestions: data.totalQuestions || questions.length,
      winner: data.winner,
      player1: data.player1,
      player1Score: data.player1Score,
      player1Time: data.player1Time,
      player2: data.player2,
      player2Score: data.player2Score,
      player2Time: data.player2Time,
      message: data.message
    };

    navigate(`/room/${roomCode}/result`, {
      state: { result: formattedResult }
    });
  };

  const fetchRoomDetails = async () => {
    try {
      const response = await RoomApi.getRoomDetails(roomCode);
      if (response && response.data) {
        setRoomDetails(response.data);

        if (response.data.startedAt) {
          const startedAt = new Date(response.data.startedAt).getTime();
          const durationMs = (response.data.expiryDuration || 60) * 60 * 1000;
          const endTime = startedAt + durationMs;
          const now = Date.now();
          const remainingSeconds = Math.max(Math.floor((endTime - now) / 1000), 0);
          setTimeLeft(remainingSeconds);
        } else if (response.data.status === 'ACTIVE' || response.data.status === 'IN_PROGRESS') {
          // Fallback if startedAt is missing but room is active (shouldn't happen but safe guard)
          // Use createdAt or just let the local timer run
          if (response.data.createdAt) {
            const createdAt = new Date(response.data.createdAt).getTime();
            const durationMs = (response.data.expiryDuration || 60) * 60 * 1000;
            const endTime = createdAt + durationMs;
            const now = Date.now();
            const remainingSeconds = Math.max(Math.floor((endTime - now) / 1000), 0);
            setTimeLeft(remainingSeconds);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await RoomApi.fetchRoomQuestionWithTestCases(roomCode);
      console.log("Fetched Questions:", response);

      if (response && response.data) {
        // FILTER: Only Coding Questions
        const codingQuestions = response.data.filter(q => q.type === "CODING");

        setQuestions(codingQuestions);
        if (codingQuestions.length > 0) {
          setStarterCode(codingQuestions[0].starterCodes || []);
          // Default to first available language in starterCodes, or 'java'
          const defaultStarter = codingQuestions[0].starterCodes?.[0];
          setLanguage(defaultStarter ? defaultStarter.language.toLowerCase() : "java");
          setCode(defaultStarter ? defaultStarter.codeTemplate : "");
        }
      }

      return prev - 1;
    });

  }, 1000);

  return () => clearInterval(interval);

}, [timeLeft !== null]);


const loadRoom = async () => {

  try {

    const [
      roomRes,
      questionRes,
      statusRes
    ] = await Promise.all([
      RoomApi.getRoomDetails(roomCode),
      RoomApi.fetchRoomQuestionWithTestCases(roomCode),
      RoomApi.fetchRoomQuestionStatus(roomCode)
    ]);

    // ---------- TIMER ----------

    const startedAt = new Date(roomRes.data.startedAt).getTime();
    const durationMs = roomRes.data.expiryDuration * 60 * 1000;

    const endTime = startedAt + durationMs;
    const now = Date.now();

    const remainingSeconds =
      Math.max(Math.floor((endTime - now) / 1000), 0);

    setTimeLeft(remainingSeconds);

    // ---------- MERGE STATUS ----------

    const statusMap = {};

    statusRes.forEach(s => {
      statusMap[s.questionId] = s;
    });

    const mergedQuestions = questionRes.map(q => ({
      ...q,
      solved: statusMap[q.id]?.solved || false,
      attempts: statusMap[q.id]?.attempts || 0
    }));

    setQuestions(mergedQuestions);

    // ---------- DEFAULT QUESTION ----------

    if (mergedQuestions.length > 0) {
      setStarterCode(mergedQuestions[0].starterCodes);
      setCode(mergedQuestions[0].starterCodes?.[0]?.codeTemplate || "");
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

  // const fetchRoomDetails = async () => {
  //   try {
  //     const response = await RoomApi.getRoomDetails(roomCode);

  //     const startedAt = new Date(response.data.startedAt).getTime();

  //     const durationMs = response.data.expiryDuration * 60 * 1000;

  //     const endTime = startedAt + durationMs;

  //     const now = Date.now();

  //     const remainingSeconds = Math.max(Math.floor((endTime - now) / 1000), 0);

  //     setRoomDetails(response.data);
  //     setTimeLeft(remainingSeconds);
  //     // small delay guarantees state sync
  //     setTimeout(() => setTimerReady(true), 0);
  //   } catch (error) {
  //     console.error("Error fetching room details:", error);
  //   }
  // };

  // const fetchQuestions = async () => {
  //   try {
  //     const response = await RoomApi.fetchRoomQuestionWithTestCases(roomCode);

  //     console.log("Fetched Questions:", response);

  //     setQuestions(response);

  //     if (response.length > 0) {
  //       setStarterCode(response[0].starterCodes);
  //       setCode(response[0].starterCodes?.[0]?.codeTemplate || "");
  //     }
      
  //   } catch (error) {
  //     console.error("Error fetching questions:", error);
  //   }
  // };

  // ================= QUESTION CHANGE =================
  const changeQuestion = (index) => {
    setCurrentIndex(index);
    const q = questions[index];

    setStarterCode(q.starterCodes || []);

    // Try to keep current language if available, otherwise switch to first available
    const matchingStarter = q.starterCodes?.find(s => s.language.toLowerCase() === language.toLowerCase())
      || q.starterCodes?.[0];

    if (matchingStarter) {
      setLanguage(matchingStarter.language.toLowerCase());
      setCode(matchingStarter.codeTemplate || "");
    } else {
      setLanguage("java");
      setCode("");
    }

    setOutput("");
  };

  // ================= RUN CODE =================
  const handleRun = async () => {
    if (!questions[currentIndex]) return;
    try {
      setIsRunning(true);
      const payload = {
        language,
        version: languageVersionMap[language] || "latest",
        code,
        codingQuestionId: questions[currentIndex].id,
      };

      const result = await CodeExecutionApi.executeCode(payload);
      console.log("Execution result:", result);

      // Build comprehensive output
      let outputText = "";

      if (result.compileOutput) {
        outputText += "=== Compilation Output ===\n" + result.compileOutput + "\n\n";
      }

      if (result.stdout) {
        outputText += "=== Output ===\n" + result.stdout;
      }

      if (result.stderr) {
        outputText += (outputText ? "\n\n" : "") + "=== Errors ===\n" + result.stderr;
      }

      if (result.exitCode !== undefined && result.exitCode !== 0) {
        outputText += (outputText ? "\n\n" : "") + `Exit Code: ${result.exitCode}`;
      }

      setOutput(outputText || "No output generated");
    } catch (error) {
      console.error("Execution error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      setOutput(`❌ Execution Error:\n${errorMsg}`);
    } finally {
      setIsRunning(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!questions[currentIndex]) return;

    setIsRunning(true);
    try {
      const submissionPayload = {
        roomCode: roomCode,
        questionType: "CODING",
        codingAnswers: [{
          questionId: questions[currentIndex].id,
          language: language,
          sourceCode: code
        }]
      };

      const result = await SubmissionApi.submitRoomAnswers(submissionPayload);
      console.log("Submission Result:", result);

      if (result.message) setOutput(result.message);

      // ENTER WAITING STATE
      setIsWaiting(true);

    } catch (error) {
      console.error("Submission error:", error);
      setOutput("❌ Submission Failed: " + (error.message || "Unknown error"));
    } finally {
      setIsRunning(false);
    }
  };

  // ================= UI helpers =================
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion && questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg text-muted">
        <Loader className="animate-spin mr-2" /> Loading room...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden relative">

      {/* WAITING OVERLAY */}
      {isWaiting && (
        <div className="absolute inset-0 z-50 bg-bg/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface border border-primary/30 p-8 rounded-2xl shadow-2xl max-w-md w-full"
          >
            <Loader className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Waiting for Opponent</h2>
            <p className="text-muted mb-6">
              You have submitted your solution! Waiting for other players to finish or time to expire.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary bg-primary/10 py-2 px-4 rounded-full">
              <Clock size={16} />
              <span>Time Remaining: {formatTime(timeLeft)}</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-surface text-white bg-surface">
        <h2 className="text-lg font-bold text-primary">Room #{roomCode}</h2>
        <div className="flex items-center gap-2 text-white bg-bg/50 px-3 py-1 rounded-full">
          <Clock size={18} className="text-primary" />
          <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[30%] border-r border-surface text-gray-300 bg-surface/50 p-4 overflow-auto custom-scrollbar">
          {/* Question Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => !isWaiting && changeQuestion(idx)}
                disabled={isWaiting}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${idx === currentIndex
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "bg-surface border border-surface-highlight text-muted hover:border-primary/50"
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestion && (
            <>
              <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.title}</h3>

              <div className="bg-bg/50 p-3 rounded-lg border border-surface mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded ${currentQuestion.difficulty === 'HARD' ? 'bg-red-500/20 text-red-400' : currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{currentQuestion.description}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-bg/30 p-3 rounded-lg border border-surface">
                  <h4 className="text-xs font-bold text-muted uppercase mb-1">Input Format</h4>
                  <p className="text-sm font-mono text-gray-400">{currentQuestion.inputFormat}</p>
                </div>
                <div className="bg-bg/30 p-3 rounded-lg border border-surface">
                  <h4 className="text-xs font-bold text-muted uppercase mb-1">Output Format</h4>
                  <p className="text-sm font-mono text-gray-400">{currentQuestion.outputFormat}</p>
                </div>
                <div className="bg-bg/30 p-3 rounded-lg border border-surface">
                  <h4 className="text-xs font-bold text-muted uppercase mb-1">Constraints</h4>
                  <p className="text-sm font-mono text-gray-400">{currentQuestion.constraints}</p>
                </div>
              </div>

              {/* Test Cases */}
              <div className="mt-6">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  Sample Test Cases
                </h4>
                <div className="space-y-2">
                  {currentQuestion.sampleTestCases && currentQuestion.sampleTestCases.map((tc, idx) => (
                    <div key={idx} className="bg-bg rounded-lg border border-surface overflow-hidden">
                      <div className="bg-surface px-3 py-1 text-xs text-muted border-b border-surface">Case {idx + 1}</div>
                      <div className="p-2 space-y-1">
                        <div className="text-xs">
                          <span className="text-muted">Input: </span>
                          <span className="font-mono text-gray-300">{tc.inputData}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted">Output: </span>
                          <span className="font-mono text-gray-300">{tc.expectedOutput}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* CENTER EDITOR */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* CODE EDITOR */}
          <div className="flex-1 min-h-0 border-b border-surface relative">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={(lang) => {
                if (!isWaiting) setLanguage(lang);
              }}
              starterCode={starterCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning || isWaiting}
            />
          </div>

          {/* OUTPUT PANEL */}
          <div className="h-48 bg-[#1e1e1e] text-gray-300 flex flex-col border-t border-surface">
            <div className="flex items-center justify-between px-4 py-2 bg-surface text-xs font-semibold text-muted border-b border-surface">
              <span>TERMINAL / OUTPUT</span>
              {isRunning && <span className="text-primary animate-pulse">Processing...</span>}
            </div>
            <pre className="flex-1 p-4 font-mono text-sm whitespace-pre-wrap break-words overflow-auto custom-scrollbar">
              {output || <span className="text-gray-600 italic">Run code to see output...</span>}
            </pre>
          </div>
        </div>
      </div>

      {/* CHAT BUTTON */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all z-40"
      >
        <MessageCircle size={24} />
      </button>

      {/* CHAT PANEL */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-surface border-l border-surface z-50 shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-surface bg-surface">
            <span className="font-bold text-white flex items-center gap-2">
              <MessageCircle size={18} className="text-primary" />
              Room Chat
            </span>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <AlertCircle size={18} className="text-muted rotate-45" />
            </button>
          </div>
          <ChatBox roomId={roomCode} height="calc(100% - 60px)" />
        </div>
      )}
    </div>
  );
}
