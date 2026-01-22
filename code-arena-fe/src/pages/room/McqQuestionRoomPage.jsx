import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionPalette from "../../components/mcqQuestion/QuestionPalette";
import QuestionView from "../../components/mcqQuestion/QuestionView";
import Controls from "../../components/mcqQuestion/Controls";
import ChatBox from "../../components/chat/chatbox";
import RoomApi from "../../services/RoomService";
import SubmissionApi from "../../services/SubmissionService";
import { set } from "lodash";
import { toast } from "react-toastify";
export default function McqRoomPage() {
  const { roomCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  navigator.mediaDevices.getUserMedia({ video: true ,audio:true});
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("paste", e => e.preventDefault());

// window.addEventListener("blur", () => {

//   const now = Date.now();
// toast.warning("⚠️ Focus lost! Please stay focused on the test.");
// });


// const [submitted, setSubmitted] = useState(false);

// if (submitted) return;

// setSubmitted(true);

  useEffect(() => {
  if (roomCode) {
    fetchQuestions(roomCode);
  }
}, [roomCode]);

  
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

  // const demoQuestions = [
  //   {
  //     id: 1,
  //     question: "What does HTTP stand for?",
  //     options: [
  //       "HyperText Transfer Protocol",
  //       "HighText Transmission Protocol",
  //       "Hyperlink Transfer Package",
  //       "None of the above",
  //     ],
  //   },
  //   {
  //     id: 2,
  //     question: "What is closure in JavaScript?",
  //     options: [
  //       "A function inside a function",
  //       "Block-level variable",
  //       "A CSS property",
  //       "A promise wrapper",
  //     ],
  //   },
  // ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex }
  const navigate = useNavigate();
  
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

  return (
    <div className="grid grid-cols-12 gap-4 p-6 bg-bg text-text">
      {/* LEFT PALETTE */}
      <div className="col-span-2">
        <QuestionPalette
          questions={questions}
          current={current}
          answers={answers}
          onSelect={(idx) => setCurrent(idx)}
        />
      </div>

      {/* CENTER QUESTION */}
      <div className="col-span-6">
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
      </div>

      {/* RIGHT CHAT */}
      <div className="col-span-4">
        <ChatBox roomId={roomCode} height="650px" />
      </div>
    </div>
  );
}
