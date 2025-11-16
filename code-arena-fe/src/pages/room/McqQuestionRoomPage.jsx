// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Timer, CircleDot, User2 } from "lucide-react";
// import RoomApi from "../../services/RoomService";

// export default function MCQRoom() {
//   const [question, setQuestion] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(300);

// //   useEffect(() => {
// //     fetchMCQQuestion();
// //   }, []);

// //   const fetchMCQQuestion = async () => {
// //     try {
// //       const res = await RoomApi.getMCQByRoomId(roomId);
// //       setQuestion(res.data);
// //     } catch (err) {
// //       console.error("Error loading MCQ:", err);
// //     }
// //   };

//   const submitAnswer = () => {
//     RoomApi.submitMCQ({
//     //   roomId,
//       questionId: question.id,
//       selectedOption,
//     });
//   };

//   // Timer countdown
//   useEffect(() => {
//     if (timeLeft <= 0) return;
//     const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   if (!question)
//     return <p className="text-center text-white">Loading question...</p>;

//   return (
//     <div className="flex h-screen bg-bg text-text">

//       {/* LEFT MAIN AREA */}
//       <div className="flex-1 p-6 flex flex-col">

//         {/* TOP BAR */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center gap-2 text-primary font-semibold">
//             <CircleDot /> Room: 
//           </div>

//           <div className="flex items-center gap-2 text-secondary font-semibold">
//             <Timer />
//             {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
//           </div>
//         </div>

//         {/* QUESTION BOX */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-surface rounded-radius-xl p-6 shadow-shadow-strong border border-border"
//         >
//           <div className="flex items-center justify-between mb-3">
//             <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
//               {question.difficulty}
//             </span>
//             <span className="text-sm text-muted">Points: {question.points}</span>
//           </div>

//           <h2 className="text-xl font-display text-primary mb-2">
//             {question.title}
//           </h2>

//           <p className="text-sm text-muted mb-6">{question.description}</p>

//           {/* OPTIONS */}
//           <div className="space-y-3">
//             {question.options.map((opt, idx) => (
//               <motion.div
//                 key={idx}
//                 whileHover={{ scale: 1.02 }}
//                 onClick={() => setSelectedOption(opt)}
//                 className={`p-4 rounded-radius-lg border cursor-pointer transition-all
//                   ${selectedOption === opt
//                     ? "bg-primary text-white border-primary shadow-shadow-strong"
//                     : "bg-bg border-border hover:bg-primary/10"}`}
//               >
//                 {opt}
//               </motion.div>
//             ))}
//           </div>

//           {/* SUBMIT */}
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             onClick={submitAnswer}
//             disabled={!selectedOption}
//             className="mt-6 w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-radius-lg font-semibold shadow-shadow-soft hover:shadow-shadow-strong disabled:bg-muted disabled:cursor-not-allowed"
//           >
//             Submit Answer
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* RIGHT PANEL — CHAT */}
//       <div className="w-[28%] border-l border-border bg-surface/40 backdrop-blur-lg p-3">
//         {/* Chat Component */}
//         <h3 className="text-primary font-semibold mb-3 flex items-center gap-2">
//           <User2 /> Chat
//         </h3>

//         {/* Your teammate's Chat component goes here */}
//         <div className="h-[90%] bg-bg rounded-radius-lg p-4 text-muted">
//           Chat area…
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { motion } from "framer-motion";

export default function McqRoomDemo() {
  // -------------------------------------
  // ✅ Demo MCQ Questions (NO Backend)
  // -------------------------------------
  const demoQuestions = [
    {
      id: 1,
      question:
        "What is the time complexity of binary search in a sorted array?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correct: 1,
    },
    {
      id: 2,
      question: "Which data structure uses FIFO principle?",
      options: ["Stack", "Array", "Queue", "Tree"],
      correct: 2,
    },
    {
      id: 3,
      question: "Which keyword is used to create an object in Java?",
      options: ["new", "create", "init", "object"],
      correct: 0,
    },
    {
      id: 4,
      question: "React is mainly used for building _____",
      options: ["Database", "User Interface", "Operating System", "Compiler"],
      correct: 1,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleSelect = (optionIndex) => {
    setAnswers({ ...answers, [current]: optionIndex });
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Your answers are submitted!");
  };

  const question = demoQuestions[current];

  return (
    <div className="p-6 max-w-3xl mx-auto bg-surface text-text rounded-radius-xl shadow-shadow-soft">

      {/* Header */}
      <h1 className="text-2xl font-display text-primary mb-4 text-center">
        MCQ Challenge Room
      </h1>

      {/* Question Card */}
      <div className="bg-bg border border-border p-6 rounded-radius-lg shadow-shadow-soft mb-6">

        <p className="text-lg font-semibold text-text mb-4">
          Q{current + 1}. {question.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt, index) => {
            const isSelected = answers[current] === index;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSelect(index)}
                className={`p-3 rounded-radius-lg cursor-pointer border 
                ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-surface border-border hover:bg-bg"
                }`}
              >
                {opt}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          disabled={current === 0}
          onClick={() => setCurrent((prev) => prev - 1)}
          className="px-4 py-2 bg-bg border border-border text-text rounded-radius-lg disabled:opacity-40"
        >
          Previous
        </button>

        {current === demoQuestions.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-radius-lg shadow-shadow-soft"
          >
            Submit
          </motion.button>
        ) : (
          <button
            onClick={() => setCurrent((prev) => prev + 1)}
            className="px-4 py-2 bg-primary text-white rounded-radius-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
