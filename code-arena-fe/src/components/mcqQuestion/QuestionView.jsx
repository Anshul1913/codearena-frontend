import { motion } from "framer-motion";

export default function QuestionView({
  question,
  questionIndex,
  answers,
  setAnswers,
}) {
  const selectedOptionId = answers[question.questionId];
  return (
    <div className="p-4 sm:p-6 mb-4 bg-surface border rounded-radius-xl shadow-shadow-soft">
      <h2 className="text-xl font-display text-primary mb-4">
        Question {questionIndex + 1}
      </h2>

      <p className="text-lg font-semibold mb-6">{question.title}</p>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const selected = selectedOptionId === opt.id;

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
                setAnswers({ ...answers, [question.questionId]: opt.id })
              }
            >
              {opt.optionText}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
