import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Trophy,
    Target,
    Clock,
    TrendingUp,
    TrendingDown,
    RotateCcw,
    Home,
    Lightbulb,
} from "lucide-react";
import PracticeApi from "../../services/PracticeService";

export default function PracticeResultPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResults();
    }, [sessionId]);

    const loadResults = async () => {
        try {
            const response = await PracticeApi.endPracticeSession(sessionId);
            console.log("Practice result response:", response);
            // Backend returns { success, message, data }
            if (response && response.data) {
                setResult(response.data);
            }
        } catch (error) {
            console.error("Failed to load results:", error);
            toast.error("Failed to load practice results.");
            navigate("/practice");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted">Loading results...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted">No results available.</p>
                    <button
                        onClick={() => navigate("/practice")}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-radius-lg"
                    >
                        Back to Practice
                    </button>
                </div>
            </div>
        );
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-bg text-text p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-block p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full mb-4">
                        <Trophy size={48} className="text-primary" />
                    </div>
                    <h1 className="text-4xl font-display font-extrabold mb-2">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Practice Complete!
                        </span>
                    </h1>
                    <p className="text-muted">Session Code: {result.sessionCode}</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    <div className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6 text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                            {result.correctAnswers}/{result.totalQuestions}
                        </div>
                        <div className="text-sm text-muted">Questions Correct</div>
                    </div>

                    <div className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6 text-center">
                        <div className="text-3xl font-bold text-secondary mb-2">
                            {result.accuracyPercentage?.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted">Accuracy</div>
                    </div>

                    <div className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6 text-center">
                        <div className="text-3xl font-bold text-text mb-2">
                            {formatTime(result.totalTimeTakenSeconds || 0)}
                        </div>
                        <div className="text-sm text-muted">Total Time</div>
                    </div>
                </motion.div>

                {/* Performance Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6 mb-6"
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Target className="text-primary" size={20} />
                        Performance Summary
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted">Average Time per Question</span>
                            <span className="font-semibold">
                                {formatTime(result.averageTimePerQuestion || 0)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted">Difficulty Level</span>
                            <span className="font-semibold">{result.overallDifficultyLevel}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted">Question Type</span>
                            <span className="font-semibold">{result.questionType}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Strengths & Weaknesses */}
                {(result.strengths?.length > 0 || result.weaknesses?.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                    >
                        {result.strengths?.length > 0 && (
                            <div className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6">
                                <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-400">
                                    <TrendingUp size={18} />
                                    Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {result.strengths.map((strength, index) => (
                                        <li key={index} className="text-sm text-muted flex items-start gap-2">
                                            <span className="text-green-400">✓</span>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.weaknesses?.length > 0 && (
                            <div className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6">
                                <h3 className="font-semibold mb-3 flex items-center gap-2 text-orange-400">
                                    <TrendingDown size={18} />
                                    Areas to Improve
                                </h3>
                                <ul className="space-y-2">
                                    {result.weaknesses.map((weakness, index) => (
                                        <li key={index} className="text-sm text-muted flex items-start gap-2">
                                            <span className="text-orange-400">!</span>
                                            {weakness}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* AI Feedback */}
                {result.aiFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6 mb-6"
                    >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="text-primary" size={18} />
                            AI Feedback
                        </h3>
                        <p className="text-muted text-sm whitespace-pre-wrap">{result.aiFeedback}</p>
                    </motion.div>
                )}

                {/* Recommendations */}
                {result.recommendations && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6 mb-6"
                    >
                        <h3 className="font-semibold mb-3">Recommendations</h3>
                        <div className="space-y-3 text-sm">
                            {result.recommendations.nextTopicsToPractice?.length > 0 && (
                                <div>
                                    <span className="text-muted">Next Topics: </span>
                                    <span className="font-semibold">
                                        {result.recommendations.nextTopicsToPractice.join(", ")}
                                    </span>
                                </div>
                            )}
                            {result.recommendations.suggestedDifficulty && (
                                <div>
                                    <span className="text-muted">Suggested Difficulty: </span>
                                    <span className="font-semibold">
                                        {result.recommendations.suggestedDifficulty}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4"
                >
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex-1 py-3 px-6 bg-bg/70 border border-surface/50 text-muted rounded-radius-lg hover:border-primary hover:text-text transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/practice")}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-radius-lg font-semibold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-shadow-soft"
                    >
                        <RotateCcw size={20} />
                        Practice Again
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
