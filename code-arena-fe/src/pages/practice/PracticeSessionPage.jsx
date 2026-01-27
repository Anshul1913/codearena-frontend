
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Clock, SkipForward, CheckCircle, XCircle } from "lucide-react";
import PracticeApi from "../../services/PracticeService";

export default function PracticeSessionPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [answer, setAnswer] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [language, setLanguage] = useState("java"); // Language selection for coding
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        loadSession();
    }, [sessionId]);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeRemaining === 0 && session) {
            handleEndSession();
        }
    }, [timeRemaining]);

    const loadSession = async () => {
        try {
            const response = await PracticeApi.getSessionDetails(sessionId);
            console.log("Session response:", response);
            // Backend returns { success, message, data }
            if (response && response.data) {
                setSession(response.data);
                setTimeRemaining(response.data.remainingTimeMinutes * 60);
                await loadNextQuestion();
            } else {
                console.error("Invalid session response:", response);
                toast.error("Failed to load practice session.");
                navigate("/practice");
            }
        } catch (error) {
            console.error("Failed to load session:", error);
            toast.error("Failed to load practice session.");
            navigate("/practice");
        } finally {
            setLoading(false);
        }
    };

    const loadNextQuestion = async () => {
        try {
            const response = await PracticeApi.getNextQuestion(sessionId);
            console.log("Next question response:", response);
            // Backend returns { success, message, data }
            if (response && response.data) {
                setCurrentQuestion(response.data);
                setAnswer("");
                setSelectedOption(null);
            } else {
                console.log("No more questions, ending session");
                // No more questions, end session
                handleEndSession();
            }
        } catch (error) {
            console.error("Failed to load next question:", error);

            // Check if it's an authentication error
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                // Redirect handled by interceptor
            } else {
                toast.error("Failed to load question. Please try again.");
            }
        }
    };

    const handleSubmitAnswer = async () => {
        if (!currentQuestion) return;

        const isCoding = currentQuestion.questionType === "CODING";
        if (isCoding && !answer.trim()) {
            toast.error("Please write some code before submitting.");
            return;
        }
        if (!isCoding && !selectedOption) {
            toast.error("Please select an option.");
            return;
        }

        setSubmitting(true);
        try {
            const submissionDTO = {
                sessionId: sessionId,
                questionId: currentQuestion.questionId,
                questionType: currentQuestion.questionType,
                language: isCoding ? language : undefined, // ✅ Use selected language
                sourceCode: isCoding ? answer : undefined,
                selectedOptionId: !isCoding ? selectedOption : undefined,
                timeTakenSeconds: 0,
                confidenceScore: 0.5,
                attemptsCount: 1,
            };

            const response = await PracticeApi.submitCurrentQuestion(submissionDTO);
            console.log("Submit response:", response);
            // Backend returns { success, message, data }
            if (response && response.data) {
                const result = response.data;
                if (result.correct) {
                    toast.success("✅ Correct answer!");
                } else {
                    toast.error("❌ Incorrect answer.");
                }

                // Check if there are more questions
                if (result.nextQuestionAvailable) {
                    await loadNextQuestion();
                } else {
                    // Session complete
                    handleEndSession();
                }
            }
        } catch (error) {
            console.error("Failed to submit answer:", error);

            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else {
                toast.error(error.message || "Failed to submit answer. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkipQuestion = async () => {
        setSubmitting(true);
        try {
            const response = await PracticeApi.skipQuestion(sessionId);
            console.log("Skip response:", response);
            // Backend returns { success, message, data }
            if (response && response.data) {
                setCurrentQuestion(response.data);
                setAnswer("");
                setSelectedOption(null);
                toast.info("⏭️ Question skipped.");
            }
        } catch (error) {
            console.error("Failed to skip question:", error);

            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else {
                toast.error("Failed to skip question. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEndSession = async () => {
        try {
            const response = await PracticeApi.endPracticeSession(sessionId);
            console.log("End session response:", response);
            // Backend returns { success, message, data }
            if (response && response.data) {
                toast.success("🎉 Practice session completed!");
                navigate(`/practice/result/${sessionId}`);
            }
        } catch (error) {
            console.error("Failed to end session:", error);
            toast.error("Failed to end session.");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted">Loading practice session...</p>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted">No questions available.</p>
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

    const isCoding = currentQuestion.questionType === "CODING";

    return (
        <div className="min-h-screen bg-bg text-text p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
                        </h1>
                        <p className="text-sm text-muted">{currentQuestion.difficulty}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-surface/50 px-4 py-2 rounded-radius-lg">
                            <Clock size={18} className="text-primary" />
                            <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                        </div>
                        <button
                            onClick={handleEndSession}
                            className="px-4 py-2 bg-error/20 text-error rounded-radius-lg hover:bg-error/30 transition-colors"
                        >
                            End Session
                        </button>
                    </div>
                </div>

                {/* Question Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6 mb-6"
                >
                    <h2 className="text-xl font-semibold mb-4">{currentQuestion.title}</h2>
                    <div className="prose prose-invert max-w-none mb-4">
                        <p className="text-muted whitespace-pre-wrap">{currentQuestion.description}</p>
                    </div>

                    {isCoding ? (
                        <>
                            {currentQuestion.inputFormat && (
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">Input Format:</h3>
                                    <p className="text-muted text-sm">{currentQuestion.inputFormat}</p>
                                </div>
                            )}
                            {currentQuestion.outputFormat && (
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">Output Format:</h3>
                                    <p className="text-muted text-sm">{currentQuestion.outputFormat}</p>
                                </div>
                            )}
                            {currentQuestion.constraints && (
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">Constraints:</h3>
                                    <p className="text-muted text-sm">{currentQuestion.constraints}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-3 mt-6">
                            {currentQuestion.options?.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedOption(option.id)}
                                    className={`w-full text-left p-4 rounded-radius-lg border transition-all ${selectedOption === option.id
                                        ? "border-primary bg-primary/10"
                                        : "border-surface/50 bg-bg/50 hover:border-primary/50"
                                        }`}
                                >
                                    {option.optionText}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Answer Input (for coding questions) */}
                {isCoding && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface/80 border border-surface/50 rounded-radius-xl p-6 mb-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Your Solution:</h3>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-3 py-1.5 bg-bg/70 border border-surface/50 rounded-radius-lg text-sm outline-none focus:border-primary"
                            >
                                <option value="java">Java</option>
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="javascript">JavaScript</option>
                            </select>
                        </div>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Write your code here..."
                            rows={15}
                            className="w-full px-4 py-3 rounded-radius-lg bg-bg/70 border border-surface/50 text-text font-mono text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSkipQuestion}
                        disabled={submitting}
                        className="flex-1 py-3 px-6 bg-bg/70 border border-surface/50 text-muted rounded-radius-lg hover:border-primary hover:text-text transition-all flex items-center justify-center gap-2"
                    >
                        <SkipForward size={20} />
                        Skip
                    </button>
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={submitting || (isCoding ? !answer.trim() : !selectedOption)}
                        className={`flex-1 py-3 px-6 font-semibold rounded-radius-lg transition-all flex items-center justify-center gap-2 ${!submitting && (isCoding ? answer.trim() : selectedOption)
                            ? "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02] shadow-shadow-soft"
                            : "bg-surface text-muted cursor-not-allowed"
                            }`}
                    >
                        <CheckCircle size={20} />
                        {submitting ? "Submitting..." : "Submit Answer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
