import { useState, useEffect } from "react";
import { Clock, ChevronRight, ChevronLeft, CheckCircle, XCircle, Play } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { testAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export function MockTest() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("setup"); // setup | test | results
  const [questions, setQuestions] = useState([]);
  const [testSessionId, setTestSessionId] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testCount, setTestCount] = useState(5);

  // Timer
  useEffect(() => {
    if (phase !== "test" || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => {
      if (t <= 1) { handleSubmit(); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await testAPI.start({ count: testCount });
      const data = res.data.data;
      setQuestions(data.questions);
      setTestSessionId(data.testSessionId);
      setTimeLeft(data.timeLimit);
      setAnswers({});
      setCurrentIdx(0);
      setPhase("test");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start test");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const answerArray = questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || null,
      }));
      const res = await testAPI.submit({ testSessionId, answers: answerArray });
      setResults(res.data.data);
      setPhase("results");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit test");
    }
    setLoading(false);
  };

  // ─── Setup Phase ─────────────────────────
  if (phase === "setup") {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-10 max-w-lg w-full text-center space-y-6 shadow-lg">
          <div className="mx-auto w-16 h-16 bg-primary/20 flex items-center justify-center rounded-2xl border border-primary/50">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Start Mock Test</h1>
          <p className="text-slate-500">Randomly selected MCQ questions will be presented. Answer within the time limit!</p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Number of Questions</label>
            <select value={testCount} onChange={(e) => setTestCount(Number(e.target.value))} className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <option value={5}>5 Questions (5 min)</option>
              <option value={10}>10 Questions (10 min)</option>
              <option value={15}>15 Questions (15 min)</option>
              <option value={20}>20 Questions (20 min)</option>
            </select>
          </div>
          <Button onClick={handleStart} className="w-full py-6 text-lg gap-2" disabled={loading}>
            <Play className="w-5 h-5" /> {loading ? "Starting..." : "Begin Test"}
          </Button>
        </Card>
      </div>
    );
  }

  // ─── Results Phase ───────────────────────
  if (phase === "results" && results) {
    return (
      <div className="h-full flex flex-col gap-6 pb-2">
        <Card className="p-8 text-center space-y-4 shadow-sm">
          <h1 className="text-3xl font-bold text-foreground">Test Complete!</h1>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-4">
            <div>
              <p className="text-4xl font-bold text-primary">{results.percentage}%</p>
              <p className="text-slate-500 text-sm mt-1">Score</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-500">{results.correctAnswers}</p>
              <p className="text-slate-500 text-sm mt-1">Correct</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">{results.wrongAnswers}</p>
              <p className="text-slate-500 text-sm mt-1">Wrong</p>
            </div>
          </div>
        </Card>

        <Card className="flex-1 p-6 overflow-y-auto space-y-4 shadow-sm custom-scrollbar">
          <h2 className="text-lg font-bold text-foreground mb-4">Answer Review</h2>
          {results.results.map((r, i) => (
            <div key={i} className={`p-4 rounded-xl border ${r.isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
              <div className="flex items-start gap-3">
                {r.isCorrect ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{r.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">Your answer: <span className={r.isCorrect ? "text-green-600" : "text-red-600"}>{r.selectedAnswer || "No answer"}</span></p>
                  {!r.isCorrect && <p className="text-sm text-green-600 mt-1">Correct: {r.correctAnswer}</p>}
                  {r.explanation && <p className="text-sm text-slate-500 mt-2 italic">{r.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => setPhase("setup")} variant="secondary" className="flex-1 py-5">Take Another Test</Button>
          <Button onClick={() => navigate('/candidate/results')} className="flex-1 py-5">View All Results</Button>
        </div>
      </div>
    );
  }

  // ─── Test Phase ──────────────────────────
  const question = questions[currentIdx];

  return (
    <div className="h-full flex flex-col gap-4 pb-2">
      <Card className="flex items-center justify-between p-4 shrink-0 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mock Test</h2>
          <p className="text-sm text-slate-500 mt-1">Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-lg font-medium px-4 py-2 rounded-lg border shadow-inner ${timeLeft < 60 ? 'text-red-500 bg-red-50 border-red-500/20' : 'text-amber-500 bg-amber-50 border-amber-500/20'}`}>
            <Clock className="w-5 h-5 flex-shrink-0" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="danger" onClick={handleSubmit} disabled={loading} className="shadow-red-500/20 shadow-lg">
            {loading ? "Submitting..." : "Submit Test"}
          </Button>
        </div>
      </Card>

      <div className="flex-1 flex gap-5 min-h-0">
        <Card className="flex-1 overflow-y-auto p-6 bg-card custom-scrollbar shadow-sm">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{currentIdx + 1}. {question?.title}</h3>
              <div className="flex gap-2 mt-3">
                <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${question?.difficulty === 'Easy' ? 'bg-green-50 text-green-500 border-green-500/20' : question?.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-yellow-500/20' : 'bg-red-50 text-red-500 border-red-500/20'}`}>{question?.difficulty}</span>
                <span className="bg-[#f5f0eb] text-slate-500 px-2.5 py-1 rounded text-xs font-semibold border border-[#e2ddd8]">{question?.topic}</span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed text-base">{question?.questionText}</p>

            <div className="space-y-3 mt-6">
              {question?.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setAnswers({ ...answers, [question._id]: option })}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    answers[question._id] === option
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-background text-slate-500 hover:border-slate-600 hover:bg-[#f5f0eb]'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Question navigation sidebar */}
        <Card className="w-48 p-4 shadow-sm shrink-0">
          <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Questions</h4>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  i === currentIdx
                    ? 'bg-primary text-white shadow-sm'
                    : answers[q._id]
                    ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                    : 'bg-[#f5f0eb] text-slate-500 border border-border hover:border-slate-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center pt-2 shrink-0">
        <Button variant="secondary" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0} className="bg-card shadow-sm">
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <div className="text-sm font-semibold text-slate-500">
          {Object.keys(answers).length} / {questions.length} answered
        </div>
        <Button onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))} disabled={currentIdx === questions.length - 1} className="shadow-sm shadow-primary/20">
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
