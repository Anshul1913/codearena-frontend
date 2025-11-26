import { useState } from "react";
import { useParams } from "react-router-dom";
import QuestionPalette from "../../components/mcqQuestion/QuestionPalette";
import QuestionView from "../../components/mcqQuestion/QuestionView";
import Controls from "../../components/mcqQuestion/Controls";
import ChatBox from "../../components/chat/chatbox";
export default function McqRoomPage() {
  const { roomCode } = useParams();

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
  const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex }

  return (
    <div className="grid grid-cols-12 gap-4 p-6 bg-bg text-text">
      
      {/* LEFT PALETTE */}
      <div className="col-span-2">
        <QuestionPalette
          questions={demoQuestions}
          current={current}
          answers={answers}
          onSelect={(idx) => setCurrent(idx)}
        />
      </div>

      {/* CENTER QUESTION */}
      <div className="col-span-6">
        <QuestionView
          question={demoQuestions[current]}
          questionIndex={current}
          answers={answers}
          setAnswers={setAnswers}
        />
        <Controls
          current={current}
          total={demoQuestions.length}
          setCurrent={setCurrent}
          onSubmit={() => console.log("Submit clicked")}
        />
      </div>

      {/* RIGHT CHAT */}
      <div className="col-span-4">
        <ChatBox roomId={roomCode} height="650px" />
      </div>
    </div>
  );
}
