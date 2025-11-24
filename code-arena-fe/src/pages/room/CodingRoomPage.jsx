import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import CodeEditor from "../../components/editor/CodeEditor";
import CodeExecutionApi from "../../services/CodeExecutionService";
import StarterCodeApi from "../../services/StarterCodeService";

export default function RoomPage({ roomId }) {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Write your solution here...");
  const [language, setLanguage] = useState("javascript");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds
  const [starterCode, setStarterCode] = useState([]);
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
      const response = await StarterCodeApi.getStarterCode("c560c587-33c7-4148-906e-8a4599972df9")
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
    console.log(result);
    
    // console.log(code, language, version, roomId, timeLeft);
    
      alert("✅ Code submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting code");
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="h-screen flex flex-col bg-bg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-border bg-surface">
        <h2 className="text-xl font-display text-primary">
          Room #{roomId} — {question?.title || "Loading..."}
        </h2>
        <div className="flex items-center gap-2 text-text">
          <Clock size={18} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Question + Code */}
        <div className="flex flex-col flex-1 border-r border-border overflow-auto">
          {/* <QuestionPanel question={question} /> */}
          <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage}  starterCode={starterCode}/>
        </div>

        {/* Right: Chat */}
        <div className="w-[28%] bg-surface border-l border-border flex flex-col">
          {/* <Chat roomId={roomId} /> */}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-surface">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-radius-lg font-display font-semibold shadow-shadow-soft hover:shadow-shadow-strong transition-all"
        >
          Submit Code
        </motion.button>
      </div>
    </div>
  );
}
