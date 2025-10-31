import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Brain, Trophy } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-bg text-text font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent blur-3xl" />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 relative z-10 border-b border-surface/50">
        <h1 className="text-3xl font-display font-extrabold tracking-wide">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CodeArena
          </span>
        </h1>

        <div className="hidden md:flex space-x-8 text-muted font-medium">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#leaderboard" className="hover:text-primary transition-colors">Leaderboard</a>
          <a href="#community" className="hover:text-primary transition-colors">Community</a>
        </div>

        <button className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-radius-lg font-display font-semibold shadow-shadow-soft hover:shadow-shadow-strong transition-all">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-20 md:mt-32 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-display font-extrabold mb-4 tracking-wide"
        >
          Battle. Learn.{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Win.
          </span>
        </motion.h1>

        <p className="text-muted max-w-2xl mb-8 text-lg">
          A competitive coding and quiz platform where you challenge others in
          real-time duels using <span className="text-primary">code</span> or{" "}
          <span className="text-secondary">MCQs</span>.
        </p>

        <div className="flex gap-4">
          <button className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-radius-lg font-display font-semibold hover:scale-105 transition-all flex items-center gap-2">
            Start Battle ⚔️ <ArrowRight size={18} />
          </button>

          <button className="border border-primary text-primary px-6 py-3 rounded-radius-lg font-display font-semibold hover:bg-primary/10 transition-all">
            Practice Mode 🧠
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mt-28 px-6 md:px-16 relative z-10">
        <h2 className="text-3xl font-display font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-surface/80 backdrop-blur-md p-6 rounded-radius-xl border border-surface/50 shadow-shadow-soft"
          >
            <Code size={40} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2 font-display">Code Duels</h3>
            <p className="text-muted">
              Battle head-to-head in real-time coding duels with instant feedback and scoring.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-surface/80 backdrop-blur-md p-6 rounded-radius-xl border border-surface/50 shadow-shadow-soft"
          >
            <Brain size={40} className="text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2 font-display">Quiz Battles</h3>
            <p className="text-muted">
              Challenge others with timed MCQ matches and climb the leaderboard.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-surface/80 backdrop-blur-md p-6 rounded-radius-xl border border-surface/50 shadow-shadow-soft"
          >
            <Trophy size={40} className="text-success mb-4" />
            <h3 className="text-xl font-semibold mb-2 font-display">Leaderboard</h3>
            <p className="text-muted">
              Track your wins, ranks, and streaks to become the ultimate CodeWarrior.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-10 text-center text-muted text-sm relative z-10 border-t border-surface/50">
        © {new Date().getFullYear()} CodeArena — Battle. Learn. Win. 💻🔥
      </footer>
    </div>
  );
}
export default LandingPage;