import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MessageCircle } from "lucide-react";
import CodeEditor from "../../components/editor/CodeEditor";
import CodeExecutionApi from "../../services/CodeExecutionService";
import StarterCodeApi from "../../services/StarterCodeService";
import ChatBox from "../../components/chat/chatbox";
import { useParams } from "react-router-dom";
import SplitPane from "react-split-pane";

export default function RoomPage() {
  const { roomCode } = useParams();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Write your solution here...");
  const [language, setLanguage] = useState("javascript");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds
  const [starterCode, setStarterCode] = useState([]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const languageVersionMap = {
    javascript: "18.15.0",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
  };
  //   useEffect(() => {

  //   fetchLanguages();
  // }, []);
  // const fetchLanguages = async () => {
  //     const { data } = await axios.get("https://emkc.org/api/v2/piston/runtimes");
  //     console.log(data);
  //   };

  // useEffect(() => {
  //   fetchQuestion();
  //   const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    fetchStarterCode();
  }, []);
  const fetchStarterCode = async () => {
    try {
      const response = await StarterCodeApi.getStarterCode(
        "82f04364-6d38-4233-abee-3832e5c7fe4a"
      );
      console.log(response.data);
      setStarterCode(response.data);
      // setCode(response.code);
    } catch (error) {
      console.error("Error fetching starter code:", error);
    }
  };

  // const fetchQuestion = async () => {
  //   try {
  //     const data = await Room.getRoomQuestion(roomId);
  //     setQuestion(data);
  //   } catch (err) {
  //     console.error("Error loading question:", err);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const codeExecutionDTO = {
        language: language,
        version: languageVersionMap[language],
        code: code,
      };
      console.log(codeExecutionDTO);

      const result = await CodeExecutionApi.executeCode(codeExecutionDTO);
      // console.log(result);

      // console.log(code, language, version, roomId, timeLeft);

      alert("✅ Code submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting code");
    }
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);

      const codeExecutionDTO = {
        language: language,
        version: languageVersionMap[language],
        code: code,
        input: "", // optional if you want custom input later
      };

      const result = await CodeExecutionApi.executeCode(codeExecutionDTO);
      const data = result.data;
      console.log(result);
      const stdout = result.stdout;
      const stderr = result.stderr;
      const exit = result.exitCode;
      console.log(exit);
      console.log(stdout);
      console.log(stderr);
      
      if (stdout) setOutput(stdout);
      else if (stderr) setOutput(stderr);
      else setOutput("No output");
      // Extract clean output
      // const stdout = data?.run?.stdout?.trim();
      // const stderr = data?.run?.stderr?.trim();
      // const compileErr = data?.compile?.stderr?.trim();
      console.log(stdout);
      console.log(stderr);
      console.log(data);
    } catch (error) {
      setOutput("❌ Error executing code", error);
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      {/* === HEADER === */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-border bg-surface">
        <h2 className="text-lg font-display text-primary">Room #{roomCode}</h2>
        <div className="flex items-center gap-2 text-text">
          <Clock size={18} />
          {/* hook up timer later */}
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: QUESTION + TEST CASES (placeholder for now) */}
        <div className="w-[24%] border-r border-border bg-surface p-3 overflow-auto">
          <h3 className="text-sm font-semibold text-primary mb-2">Question</h3>
          <p className="text-xs text-muted mb-4">
            (Hook this up to your CodingQuestion API)
          </p>

          <div className="mt-2">
            <h4 className="text-xs font-semibold text-primary mb-1">
              Test Cases
            </h4>
            <ul className="text-xs text-text space-y-1">
              <li>• Sample 1</li>
              <li>• Sample 2</li>
              <li>• Hidden tests…</li>
            </ul>
          </div>
        </div>

        {/* CENTER: EDITOR + OUTPUT */}
        <div className="flex flex-col flex-1 min-h-0 bg-bg">
          {/* Editor */}
          <div className="flex-1 min-h-0 border-b border-border">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              starterCode={starterCode}
            />
          </div>

          {/* Output */}
          <div className="h-40 bg-surface border-t border-border p-3 overflow-auto">
            <h3 className="text-sm font-semibold text-primary mb-2">Output</h3>
            <pre className="text-sm text-text whitespace-pre-wrap break-words">
              {output || "Run to see output..."}
            </pre>
          </div>
        </div>
      </div>

      {/* === FOOTER BUTTONS === */}
      <div className="p-3 border-t border-border bg-surface flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleRun}
          disabled={isRunning}
          className="flex-1 py-2 bg-bg border border-border text-text rounded-lg text-sm font-semibold"
        >
          {isRunning ? "Running..." : "Run Code"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSubmit}
          className="flex-1 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-semibold"
        >
          Submit Code
        </motion.button>
      </div>

      {/* === FLOATING CHAT BUTTON === */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 z-30 p-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition"
      >
        <MessageCircle size={22} />
      </button>

      {/* === CHAT SLIDE PANEL === */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-[340px] bg-surface border-l border-border shadow-xl z-40 flex flex-col">
          <div className="flex justify-between items-center px-3 py-2 border-b border-border">
            <h4 className="text-sm font-semibold text-primary">Room Chat</h4>
            <button
              className="text-xs text-muted hover:text-text"
              onClick={() => setShowChat(false)}
            >
              Close ✕
            </button>
          </div>
          <ChatBox roomId={roomCode} height="100%" />
        </div>
      )}
    </div>
  );
}
