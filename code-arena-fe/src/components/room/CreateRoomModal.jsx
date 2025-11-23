import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import DropListApi from "../../services/DropListService";
import { toast } from "react-toastify";

export default function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const [questionType, setQuestionType] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [numQuestions, setNumQuestions] = useState(2);
  const maxQuestions =
    selectedQuestionType?.optionValue === "Coding Question" ? 10 :
    selectedQuestionType?.optionValue === "MCQ Question" ? 50 :
    20;
  const [difficulty, setDifficulty] = useState(null);
  const [duration, setDuration] = useState(30); // in minutes
  const [questionTypes, setQuestionTypes] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);
//   useEffect(() => {
//   if (selectedQuestionType) {
//     console.log("Updated selectedQuestionType:", selectedQuestionType);
//   }
// }, [selectedQuestionType]);

  const fetchInitialData = async () => {
    try {
      const questionTypes = await DropListApi.findByLabelKey("QUESTION_TYPE");
      const difficulties = await DropListApi.findByLabelKey("DIFFICULTY");
      console.log(questionTypes);
      console.log(difficulties);
      setQuestionTypes(questionTypes);
      setDifficulties(difficulties);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleSubmit = () => {
    if (numQuestions <= 0)
      return toast.warn("Please enter a valid number of questions.");
    if (duration < 30 || duration > 120)
      return toast.warn("Room duration must be between 30 and 120 minutes.");
    
    if (!selectedQuestionType)
      return toast.warn("Please select a question type.");
    const roomData = {
      questionType: selectedQuestionType.id,
      numQuestions,
      difficulty: difficulty ? difficulty : null,
      duration,
    };

    onCreate(roomData);
    onReset();
    onClose();
  };
  const onReset = () => {
    setQuestionType(null);
    setNumQuestions(2);
    setDifficulty(null);
    setSelectedQuestionType(null);
    setDuration(30);
  };

  const handleChange = (e) => {
    const selected = questionTypes.find((q) => (q.id) === e.target.value);
    
    setQuestionType(selected.value);
    setSelectedQuestionType(selected);
    const selectedType = selected.optionValue;

    const newMax =
    selectedType === "Coding Question" ? 10 :
    selectedType === "MCQ Question" ? 50 :
    20;

  if (numQuestions > newMax) {
    setNumQuestions(newMax);
  }
    console.log(selectedQuestionType);
  };
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface p-8 rounded-radius-xl shadow-shadow-strong w-[90%] max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted hover:text-primary transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-display text-primary mb-6 text-center">
          Create New Room
        </h2>

        {/* Question Type */}
        <label className="block text-sm font-medium text-text mb-2">
          Question Type
        </label>
        <select
          className="w-full px-4 py-2 rounded-radius-lg bg-bg border border-border text-text mb-4 focus:outline-none focus:ring-2 focus:border-none focus:ring-primary"
          value={questionType}
           onChange={handleChange}
           required
        >
          <option value="">Select Question Type</option>
          {questionTypes.map((type) => (
            <option key={type.id || type.optionValue} value={type.id || type.optionValue}>
              {type.optionValue}
            </option>
          ))}
        </select>

        {/* Number of Questions */}
        <label className="block text-sm font-medium  text-text mb-2">
          Number of Questions
        </label>
        <input
          type="number"
          className="w-full px-4 py-2 rounded-radius-lg bg-bg border border-border text-text mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-none"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          placeholder="e.g. 5"
          min={1}
          max={maxQuestions}
          required
        />

        {/* Difficulty (only if coding) */}
        {selectedQuestionType?.optionValue === "Coding Question" && (
          <>
            <label className="block text-sm font-medium text-text mb-2">
              Difficulty Level
            </label>
            <select
              className="w-full px-4 py-2 rounded-radius-lg bg-bg border border-border text-text mb-4 focus:outline-none focus:ring-2 focus:border-none focus:ring-primary"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="">Select Difficulty Level</option>
              {difficulties.map((level) => (
                <option key={level.id || level.optionValue} value={level.optionValue}>
                  {level.optionValue}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Room Duration */}
        <label className="block text-sm font-medium text-text mb-2">
          Room Duration (minutes)
        </label>
        <input
          type="number"
          min={30}
          max={180}
          step={5}
          className="w-full px-4 py-2 rounded-radius-lg bg-bg border border-border text-text mb-6 focus:outline-none focus:ring-2 focus:ring-primary focus:border-none"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="30 - 120"
          required
        />
        <p className="text-xs text-muted mb-4">
          Minimum 30 minutes, maximum 120 minutes (2 hours)
        </p>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-radius-lg font-display font-semibold shadow-shadow-soft hover:shadow-shadow-strong transition-all"
        >
          Create Room
        </motion.button>
      </motion.div>
    </div>
  );
}
