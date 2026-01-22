import { useLocation, useParams } from "react-router-dom";

export default function RoomResultPage() {

  const { roomCode } = useParams();
  const location = useLocation();

  const result = location.state?.result;

  if (!result) {
    return <h2>No Result Found</h2>;
  }

  return (
    <div className="p-10 text-center">

      <h1 className="text-3xl font-bold mb-6">
        Room {roomCode} Results
      </h1>

      <div className="bg-surface p-6 rounded-xl shadow">

        <p>Total Questions: {result.totalQuestions}</p>
        <p>Correct Answers: {result.correctAnswers}</p>
        <p>Score: {result.score}</p>
        <p>Time Taken: {result.timeTaken}s</p>

        <h2 className="text-xl mt-4 font-bold text-primary">
          Winner: {result.winner}
        </h2>

      </div>
    </div>
  );
}
