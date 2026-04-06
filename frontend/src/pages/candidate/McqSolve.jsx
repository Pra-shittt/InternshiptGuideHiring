import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Clock, CheckCircle, XCircle, ArrowLeft, Loader2,
  Lightbulb, RotateCcw, ChevronRight, Trophy
} from "lucide-react";
import { questionAPI } from "../../services/api";

export function McqSolve() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Fetch question
  useEffect(() => {
    setLoading(true);
    setError(null);
    questionAPI.getById(id)
      .then((res) => {
        const q = res.data.data;
        if (q.type !== "MCQ") {
          setError("This is not an MCQ question");
          return;
        }
        setQuestion(q);
        setTimerActive(true);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load question");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Timer
  useEffect(() => {
    if (!timerActive || submitted) return;
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [timerActive, submitted]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer) return;
    setSubmitted(true);
    setTimerActive(false);
  }, [selectedAnswer]);

  const handleRetry = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowExplanation(false);
    setTimeElapsed(0);
    setTimerActive(true);
  };

  const isCorrect = submitted && selectedAnswer === question?.correctAnswer;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted text-sm">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Error</h2>
          <p className="text-muted">{error}</p>
          <Button onClick={() => navigate(-1)} variant="secondary" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-5 pb-2">
      {/* Header Bar */}
      <Card className="flex items-center justify-between p-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-muted hover:text-[#1e293b]">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-lg font-bold text-foreground">{question.title}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={question.difficulty === "Easy" ? "success" : question.difficulty === "Medium" ? "warning" : "danger"}>
                {question.difficulty}
              </Badge>
              <span className="text-xs text-muted">{question.topic}</span>
              {question.company && (
                <>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">{question.company}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-mono text-sm font-medium px-3 py-1.5 rounded-lg border ${
            timeElapsed > 120 ? "text-amber-500 bg-amber-50 border-amber-500/20" : "text-slate-500 bg-[#f5f0eb] border-border"
          }`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeElapsed)}
          </div>
        </div>
      </Card>

      {/* Question Content */}
      <div className="flex-1 flex gap-5 min-h-0">
        <Card className="flex-1 overflow-y-auto p-8 custom-scrollbar shadow-sm">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Question Text */}
            <div>
              <p className="text-lg text-foreground leading-relaxed font-medium">
                {question.questionText}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options?.map((option, idx) => {
                let optionStyles = "border-border bg-background text-slate-500 hover:border-slate-600 hover:bg-[#f5f0eb]";

                if (submitted) {
                  if (option === question.correctAnswer) {
                    optionStyles = "border-green-500 bg-green-50 text-green-600 shadow-sm shadow-green-500/10";
                  } else if (option === selectedAnswer && option !== question.correctAnswer) {
                    optionStyles = "border-red-500 bg-red-50 text-red-600 shadow-sm shadow-red-500/10";
                  } else {
                    optionStyles = "border-border bg-background/50 text-slate-500 opacity-60";
                  }
                } else if (option === selectedAnswer) {
                  optionStyles = "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10";
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!submitted ? { scale: 1.01 } : {}}
                    whileTap={!submitted ? { scale: 0.99 } : {}}
                    onClick={() => !submitted && setSelectedAnswer(option)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${optionStyles}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      submitted && option === question.correctAnswer
                        ? "bg-green-500/20 text-green-600"
                        : submitted && option === selectedAnswer
                        ? "bg-red-500/20 text-red-600"
                        : option === selectedAnswer
                        ? "bg-primary/20 text-primary"
                        : "bg-[#f5f0eb] text-slate-500"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <span className="flex-1 font-medium">{option}</span>

                    {submitted && option === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    )}
                    {submitted && option === selectedAnswer && option !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Result & Explanation */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-4"
                >
                  {/* Result Banner */}
                  <div className={`p-5 rounded-xl border-2 ${
                    isCorrect
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}>
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-green-600">Correct! 🎉</h3>
                            <p className="text-sm text-muted">Solved in {formatTime(timeElapsed)}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-red-600">Incorrect</h3>
                            <p className="text-sm text-muted">
                              Correct answer: <span className="text-green-600 font-medium">{question.correctAnswer}</span>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Explanation Toggle */}
                  {question.explanation && (
                    <div>
                      <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <Lightbulb className="w-4 h-4" />
                        {showExplanation ? "Hide" : "Show"} Explanation
                        <ChevronRight className={`w-3 h-3 transition-transform ${showExplanation ? "rotate-90" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {showExplanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-4 rounded-xl bg-[#f5f0eb] border border-border"
                          >
                            <p className="text-sm text-slate-500 leading-relaxed">{question.explanation}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center shrink-0">
        <Button variant="secondary" onClick={() => navigate("/candidate/practice")} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> All Questions
        </Button>
        <div className="flex gap-3">
          {submitted ? (
            <>
              <Button variant="secondary" onClick={handleRetry} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </Button>
              <Button onClick={() => navigate("/candidate/practice")} className="gap-2 shadow-lg shadow-primary/25">
                Next Question <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="gap-2 shadow-lg shadow-primary/25 px-8"
            >
              <CheckCircle className="w-4 h-4" /> Submit Answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
