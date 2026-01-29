import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Play, Clock, Hash, Target, BookOpen } from "lucide-react";
import PracticeApi from "../../services/PracticeService";

export default function PracticeSetupPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeSessions, setActiveSessions] = useState([]);
    const [form, setForm] = useState({
        questionType: "CODING",
        maxQuestions: 5,
        timeLimitMinutes: 30,
        difficultyPreference: "MEDIUM",
        topic: "",
    });

    useEffect(() => {
        fetchActiveSessions();
    }, []);

    const fetchActiveSessions = async () => {
        try {
            const response = await PracticeApi.getActiveSessions();
            console.log("Active sessions response:", response);
            // Backend returns { success, message, data }
            if (response && response.data) {
                setActiveSessions(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch active sessions:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleStartPractice = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const matchRequest = {
                questionType: form.questionType,
                maxQuestions: parseInt(form.maxQuestions),
                timeLimitMinutes: parseInt(form.timeLimitMinutes),
                difficultyPreference: form.difficultyPreference,
                topic: form.topic.trim() || undefined,
            };

            const response = await PracticeApi.startPracticeSession(matchRequest);
            console.log("Start session response:", response);
            // Backend returns { success, message, data }
            if (response && response.data) {
                toast.success("🎯 Practice session started!");
                navigate(`/practice/session/${response.data.sessionId}`);
            }
        } catch (error) {
            console.error("Failed to start practice session:", error);
            toast.error(error.message || "Failed to start practice session.");
        } finally {
            setLoading(false);
        }
    };

    const handleResumeSession = (sessionId) => {
        navigate(`/practice/session/${sessionId}`);
    };

    return (
        <div className="min-h-screen bg-bg text-text p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-display font-extrabold mb-2">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Practice Mode
                        </span>
                    </h1>
                    <p className="text-muted">
                        Sharpen your skills with adaptive practice sessions
                    </p>
                </motion.div>

                {/* Active Sessions */}
                {activeSessions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 bg-surface/50 border border-surface/50 rounded-radius-xl p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Clock className="text-primary" size={20} />
                            Active Sessions
                        </h2>
                        <div className="space-y-3">
                            {activeSessions.map((session) => (
                                <div
                                    key={session.sessionId}
                                    className="flex items-center justify-between bg-bg/50 p-4 rounded-radius-lg border border-surface/30"
                                >
                                    <div>
                                        <p className="font-semibold">{session.questionType}</p>
                                        <p className="text-sm text-muted">
                                            {session.currentQuestionNumber} / {session.maxQuestions} questions
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleResumeSession(session.sessionId)}
                                        className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-radius-lg font-semibold hover:scale-105 transition-transform"
                                    >
                                        Resume
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Setup Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-surface/80 backdrop-blur-md border border-surface/50 rounded-radius-xl p-8"
                >
                    <h2 className="text-2xl font-semibold mb-6">Start New Session</h2>

                    <form onSubmit={handleStartPractice} className="space-y-6">
                        {/* Question Type */}
                        <div>
                            <label className="block text-sm mb-2 text-muted flex items-center gap-2">
                                <BookOpen size={16} />
                                Question Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {["CODING", "MCQ"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, questionType: type }))}
                                        className={`py-3 px-4 rounded-radius-lg font-semibold transition-all ${form.questionType === type
                                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-shadow-soft"
                                            : "bg-bg/70 border border-surface/50 text-muted hover:border-primary"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Max Questions */}
                        <div>
                            <label className="block text-sm mb-2 text-muted flex items-center gap-2">
                                <Hash size={16} />
                                Number of Questions: {form.maxQuestions}
                            </label>
                            <input
                                type="range"
                                name="maxQuestions"
                                min="1"
                                max="20"
                                value={form.maxQuestions}
                                onChange={handleChange}
                                className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted mt-1">
                                <span>1</span>
                                <span>20</span>
                            </div>
                        </div>

                        {/* Time Limit */}
                        <div>
                            <label className="block text-sm mb-2 text-muted flex items-center gap-2">
                                <Clock size={16} />
                                Time Limit (minutes)
                            </label>
                            <input
                                type="number"
                                name="timeLimitMinutes"
                                value={form.timeLimitMinutes}
                                onChange={handleChange}
                                min="5"
                                max="180"
                                className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Difficulty Preference - Only for CODING */}
                        {form.questionType === "CODING" && (
                            <div>
                                <label className="block text-sm mb-2 text-muted flex items-center gap-2">
                                    <Target size={16} />
                                    Difficulty Preference
                                </label>
                                <select
                                    name="difficultyPreference"
                                    value={form.difficultyPreference}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="EASY">Easy</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HARD">Hard</option>
                                </select>
                            </div>
                        )}

                        {/* Topic (Optional) */}
                        <div>
                            <label className="block text-sm mb-2 text-muted">
                                Topic (Optional)
                            </label>
                            <input
                                type="text"
                                name="topic"
                                value={form.topic}
                                onChange={handleChange}
                                placeholder="e.g., Arrays, Strings, Algorithms"
                                className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Start Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 font-display font-semibold rounded-radius-lg transition-all shadow-shadow-soft hover:shadow-shadow-strong flex items-center justify-center gap-2 ${!loading
                                ? "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]"
                                : "bg-surface text-muted cursor-not-allowed"
                                }`}
                        >
                            <Play size={20} />
                            {loading ? "Starting..." : "Start Practice"}
                        </button>
                    </form>
                </motion.div>

                {/* Back to Dashboard */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-center"
                >
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-muted hover:text-primary transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
