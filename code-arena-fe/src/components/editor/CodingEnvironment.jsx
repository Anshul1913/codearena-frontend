import React from "react";
import { Clock } from "lucide-react";
import CodeEditor from "./CodeEditor";

/**
 * Reusable coding environment layout.
 * Used by CodingRoomPage and PracticeSessionPage.
 */
export default function CodingEnvironment({
    question,
    questions = [],
    currentIndex = 0,
    changeQuestion,
    code,
    setCode,
    language,
    setLanguage,
    starterCode = [],
    onRun,
    onSubmit,
    isRunning,
    onEndTest,
    output,
    timeLeft,
    formatTime,
    renderHeaderRight, // Optional: Additional components for the right side of the header
    renderQuestionNav, // Optional: Override for question navigation
    hideNavigation = false,
    showEndTest = true, // Control End Test button visibility (default true for backward compatibility)
}) {
    return (
        <div className="h-screen flex flex-col bg-bg overflow-hidden text-text">
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-2 border-b text-white bg-surface flex-none">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-primary">
                        {question?.title || "Coding Challenge"}
                    </h2>
                    {timeLeft !== undefined && (
                        <div className="flex items-center gap-2 bg-bg/50 px-3 py-1 rounded-radius-lg border border-surface/50">
                            <Clock size={16} className="text-primary" />
                            <span className="font-mono text-sm">{formatTime ? formatTime(timeLeft) : timeLeft}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {renderHeaderRight && renderHeaderRight()}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT PANEL: Question Details */}
                <div className="w-[25%] border-r text-gray-300 bg-surface p-4 overflow-auto custom-scrollbar">
                    {!hideNavigation && questions.length > 0 && (
                        <div className="mb-6">
                            {renderQuestionNav ? (
                                renderQuestionNav()
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {questions.map((q, idx) => {
                                        const isCurrent = idx === currentIndex;
                                        let bgColor = "bg-surface-light text-muted";

                                        if (q.solved) {
                                            bgColor = "bg-success/20 text-success border border-success/30";
                                        }
                                        if (isCurrent) {
                                            bgColor = "bg-primary text-white border border-primary";
                                        }

                                        return (
                                            <button
                                                key={q.id || idx}
                                                onClick={() => changeQuestion && changeQuestion(idx)}
                                                className={`w-8 h-8 rounded font-semibold text-sm transition-colors ${bgColor}`}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-semibold text-white mb-2">{question?.title}</h3>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <p className="text-muted leading-relaxed whitespace-pre-wrap">{question?.description}</p>
                            </div>
                        </section>

                        {question?.inputFormat && (
                            <section>
                                <h4 className="text-sm font-semibold text-white mb-1">Input Format</h4>
                                <p className="text-xs text-muted font-mono bg-bg/50 p-2 rounded">{question.inputFormat}</p>
                            </section>
                        )}

                        {question?.outputFormat && (
                            <section>
                                <h4 className="text-sm font-semibold text-white mb-1">Output Format</h4>
                                <p className="text-xs text-muted font-mono bg-bg/50 p-2 rounded">{question.outputFormat}</p>
                            </section>
                        )}

                        {question?.constraints && (
                            <section>
                                <h4 className="text-sm font-semibold text-white mb-1">Constraints</h4>
                                <p className="text-xs text-muted font-mono bg-bg/50 p-2 rounded">{question.constraints}</p>
                            </section>
                        )}

                        {question?.testCases && question.testCases.length > 0 && (
                            <section>
                                <h4 className="text-sm font-semibold text-white mb-2">Sample Test Cases</h4>
                                <div className="space-y-3">
                                    {question.testCases.filter(tc => tc.isSample).map((tc, idx) => (
                                        <div key={idx} className="bg-bg/50 rounded-radius-lg border border-surface/50 overflow-hidden">
                                            <div className="px-3 py-1 bg-surface-light border-b border-surface/50 text-[10px] font-bold uppercase tracking-wider text-muted">
                                                Sample {idx + 1}
                                            </div>
                                            <div className="p-3 space-y-2">
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Input</p>
                                                    <pre className="text-xs font-mono text-primary-light">{tc.inputData}</pre>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Expected Output</p>
                                                    <pre className="text-xs font-mono text-success-light">{tc.expectedOutput}</pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {question.testCases.some(tc => !tc.isSample) && (
                                        <p className="text-[11px] text-muted italic italic">Additional hidden test cases will be used for final submission.</p>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Editor & Output */}
                <div className="flex flex-col flex-1 bg-bg-dark">
                    {/* EDITOR AREA */}
                    <div className="flex-1 min-h-0 border-b border-surface/50">
                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            language={language}
                            setLanguage={setLanguage}
                            starterCode={starterCode}
                            onRun={onRun}
                            onSubmit={onSubmit}
                            isRunning={isRunning}
                            onEndTest={onEndTest}
                            showEndTest={showEndTest}
                        />
                    </div>

                    {/* OUTPUT AREA */}
                    <div className="h-[30%] min-h-[150px] bg-bg/95 text-gray-300 p-0 overflow-hidden border-t border-surface/50 flex flex-col">
                        <div className="px-4 py-2 border-b border-surface/50 bg-surface/50 flex items-center justify-between flex-none">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Execution Output</h3>
                        </div>
                        <div className="flex-1 p-4 overflow-auto font-mono text-sm custom-scrollbar">
                            {output ? (
                                <div className={`${output.includes("❌") || output.toLowerCase().includes("error") ? "text-error-light" : "text-success-light"}`}>
                                    <pre className="whitespace-pre-wrap break-words">{output}</pre>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted/30 italic">
                                    Run your code to see results here...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
