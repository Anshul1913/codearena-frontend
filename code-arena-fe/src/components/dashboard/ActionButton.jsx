import { motion } from "framer-motion";
import { PlusCircle, KeyRound, Brain } from "lucide-react";

export default function ActionButtons({ onCreate, onJoin, onPractice }) {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-8 mb-20">
      {/* Create Room */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCreate}
        className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-radius-xl font-display font-semibold text-lg shadow-shadow-soft hover:shadow-shadow-strong transition-all"
      >
        <PlusCircle size={24} />
        Create Room
      </motion.button>

      {/* Join Room */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.97 }}
        onClick={onJoin}
        className="flex items-center justify-center gap-3 px-8 py-5 border-2 border-primary text-primary rounded-radius-xl font-display font-semibold text-lg hover:bg-primary/10 transition-all"
      >
        <KeyRound size={24} />
        Join Room
      </motion.button>

      {/* Practice Mode */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.97 }}
        onClick={onPractice}
        className="flex items-center justify-center gap-3 px-8 py-5 border-2 border-secondary text-secondary rounded-radius-xl font-display font-semibold text-lg hover:bg-secondary/10 transition-all"
      >
        <Brain size={24} />
        Practice Mode
      </motion.button>
    </div>
  );
}
