import { motion } from "framer-motion";

export default function QuestionView({ question, questionIndex, answers, setAnswers }) {
  return (
    <div className="p-6 mb-4 bg-surface border rounded-radius-xl shadow-shadow-soft">
      <h2 className="text-xl font-display text-primary mb-4">
        Question {questionIndex + 1}
      </h2>

      <p className="text-lg font-semibold mb-6">{question.question}</p>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const selected = answers[questionIndex] === idx;

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-3 border rounded-lg cursor-pointer ${
                selected
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-bg border-border"
              }`}
              onClick={() =>
                setAnswers({ ...answers, [questionIndex]: idx })
              }
            >
              {opt}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
