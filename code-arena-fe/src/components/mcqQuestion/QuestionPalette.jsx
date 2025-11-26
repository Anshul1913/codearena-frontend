export default function QuestionPalette({ questions, current, answers, onSelect }) {

  const getStatusClass = (idx) => {
    if (idx === current) return "bg-blue-500 text-white";
    if (answers[idx] !== undefined) return "bg-green-500 text-white";
    return "bg-gray-300 text-black";
  };

  return (
    <div className="p-4 bg-surface border rounded-radius-xl shadow-shadow-soft space-y-4">
      <h3 className="text-sm font-semibold text-primary">Question Navigator</h3>

      <div className="grid grid-cols-4 gap-2">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`h-10 w-10 rounded-md font-bold ${getStatusClass(idx)}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md bg-blue-500"></div>
          <span>Current Question</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md bg-green-500"></div>
          <span>Answered</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md bg-gray-300 border"></div>
          <span>Not Answered</span>
        </div>

        {/* For future Mark for Review feature */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md bg-purple-500"></div>
          <span>Marked for Review</span>
        </div>
      </div>
    </div>
  );
}
