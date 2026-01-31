
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Clock, SkipForward, CheckCircle, XCircle } from "lucide-react";
import PracticeApi from "../../services/PracticeService";
import CodingEnvironment from "../../components/editor/CodingEnvironment";
import CodeExecutionApi from "../../services/CodeExecutionService";

export default function PracticeSessionPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [answer, setAnswer] = useState(""); // This is the code for editor
    const [selectedOption, setSelectedOption] = useState(null);
    const [language, setLanguage] = useState("java");
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now()); // Track question start time

    const languageVersionMap = {
        javascript: "18.15.0",
        python: "3.10.0",
        cpp: "10.2.0",
        java: "15.0.2",
    };

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
            console.log(response);
            
            if (response && response.data) {
                setSession(response.data);
                setTimeRemaining(response.data.remainingTimeMinutes * 60);
                await loadNextQuestion();
            } else {
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
            if (response && response.data) {
                setCurrentQuestion(response.data);
                setAnswer(response.data.starterCodes?.[0]?.codeTemplate || "");
                setSelectedOption(null);
                setOutput("");
                setQuestionStartTime(Date.now()); // Reset timer for new question
            } else {
                handleEndSession();
            }
        } catch (error) {
            console.error("Failed to load next question:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else {
                toast.error("Failed to load question. Please try again.");
            }
        }
    };

    const handleRunCode = async () => {
        if (!currentQuestion || currentQuestion.questionType !== "CODING") return;

        setIsRunning(true);
        try {
            const payload = {
                language,
                version: languageVersionMap[language],
                code: answer,
                codingQuestionId: currentQuestion.questionId,
            };

            const result = await CodeExecutionApi.executeCode(payload);
            if (result.stdout) setOutput(result.stdout);
            else if (result.stderr) setOutput(result.stderr);
            else setOutput("No Output");
        } catch (error) {
            console.error(error);
            setOutput("❌ Execution Error");
        } finally {
            setIsRunning(false);
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
            // Calculate time taken for this question
            const timeTakenSeconds = Math.floor((Date.now() - questionStartTime) / 1000);

            const submissionDTO = {
                sessionId: sessionId,
                questionId: currentQuestion.questionId,
                questionType: currentQuestion.questionType,
                language: isCoding ? language : undefined,
                sourceCode: isCoding ? answer : undefined,
                selectedOptionId: !isCoding ? selectedOption : undefined,
                timeTakenSeconds: timeTakenSeconds,
                confidenceScore: 0.5,
                attemptsCount: 1,
            };

            const response = await PracticeApi.submitCurrentQuestion(submissionDTO);
            if (response && response.data) {
                const result = response.data;
                if (result.correct) {
                    toast.success("✅ Correct answer!");
                } else {
                    toast.error("❌ Incorrect answer.");
                }

                if (result.nextQuestionAvailable) {
                    await loadNextQuestion();
                } else {
                    handleEndSession();
                }
            }
        } catch (error) {
            console.error("Failed to submit answer:", error);
            toast.error(error.message || "Failed to submit answer. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkipQuestion = async () => {
        setSubmitting(true);
        try {
            console.log(session.maxQuestions);
            console.log(currentQuestion.questionNumber);
            
            if (session.maxQuestions == currentQuestion.questionNumber) {
                handleEndSession();
                return;
            }
            const response = await PracticeApi.skipQuestion(sessionId);
            
            console.log(response);
            
            if (response && response.data) {
                setCurrentQuestion(response.data);
                setAnswer(response.data.starterCodes?.[0]?.codeTemplate || "");
                setSelectedOption(null);
                setOutput("");
                setQuestionStartTime(Date.now()); // Reset timer for new question
                toast.info("⏭️ Question skipped.");
            }
        } catch (error) {
            console.error("Failed to skip question:", error);
            toast.error("Failed to skip question. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEndSession = async () => {
        try {
            const response = await PracticeApi.endPracticeSession(sessionId);
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

    if (isCoding) {
        return (
            <CodingEnvironment
                question={currentQuestion}
                code={answer}
                setCode={setAnswer}
                language={language}
                setLanguage={setLanguage}
                starterCode={currentQuestion.starterCodes}
                onRun={handleRunCode}
                onSubmit={handleSubmitAnswer}
                isRunning={isRunning || submitting}
                onEndTest={handleEndSession}
                output={output}
                timeLeft={timeRemaining}
                formatTime={formatTime}
                hideNavigation={true}
                showEndTest={false}
                renderHeaderRight={() => (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSkipQuestion}
                            disabled={submitting}
                            className="px-3 py-1 bg-surface-light text-muted hover:text-white rounded text-sm transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleEndSession}
                            className="px-3 py-1 bg-error/10 text-error hover:bg-error/20 rounded text-sm transition-colors"
                        >
                            End Session
                        </button>
                    </div>
                )}
            />
        );
    }

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
                </motion.div>

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
