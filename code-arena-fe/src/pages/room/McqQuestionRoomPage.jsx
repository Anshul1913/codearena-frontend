import { useState } from "react";
import { motion } from "framer-motion";
import ChatBox from "../../components/chat/chatbox";
import { useParams } from "react-router-dom";

export default function McqRoomPage() {
  
   const { roomCode } = useParams();

  console.log("Room Code:", roomCode);

  // Demo Questions (no backend)
  const demoQuestions = [
    {
      id: 1,
      question: "What does HTTP stand for?",
      options: [
        "HyperText Transfer Protocol",
        "HighText Transmission Protocol",
        "Hyperlink Transfer Package",
        "None of the above",
      ],
    },
    {
      id: 2,
      question: "What is closure in JavaScript?",
      options: [
        "A function inside a function",
        "Block-level variable",
        "A CSS property",
        "A promise wrapper",
      ],
    },
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = demoQuestions[current];

  return (
    <div className="grid grid-cols-12 bg-bg text-text gap-4 p-6">

      {/* LEFT SIDE — QUESTIONS */}
      <div className="col-span-8">
        <div className="p-6 bg-surface border border-border rounded-radius-xl shadow-shadow-soft">

          <h2 className="text-xl font-display text-primary mb-4">
            MCQ Question {current + 1}
          </h2>

          <p className="text-lg font-semibold mb-4">{question.question}</p>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const selected = answers[current] === idx;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 border rounded-radius-lg cursor-pointer 
                    ${
                      selected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-bg border-border"
                    }`}
                  onClick={() =>
                    setAnswers({ ...answers, [current]: idx })
                  }
                >
                  {opt}
                </motion.div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="px-4 py-2 bg-bg border border-border rounded-radius-lg disabled:opacity-40"
            >
              Previous
            </button>

            {current === demoQuestions.length - 1 ? (
              <button className="px-6 py-2 bg-primary text-white rounded-radius-lg">
                Submit
              </button>
            ) : (
              <button
                onClick={() => setCurrent(current + 1)}
                className="px-4 py-2 bg-primary text-white rounded-radius-lg"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — CHAT BOX */}
      <div className="col-span-4">
          <ChatBox roomId={roomCode}  height="650px" />
      </div>
    </div>
  );
}
