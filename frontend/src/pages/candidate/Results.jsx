import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Filter, Download } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { testAPI } from "../../services/api";

export function Results() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testAPI.getAttempts()
      .then((res) => setAttempts(res.data.data))
      .catch(() => setAttempts([]))
      .finally(() => setLoading(false));
  }, []);

  const totalTests = attempts.length;
  const avgScore = totalTests > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalTests)
    : 0;
  const bestScore = totalTests > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;

  return (
    <div className="h-full flex flex-col gap-6 pb-2">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Test Results</h1>
          <p className="text-sm text-slate-400 mt-1">Review your mock test history and scores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <Card className="p-5 border-l-4 border-l-primary shadow-sm bg-card/60 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Average Score</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{loading ? "..." : `${avgScore}%`}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-indigo-500 shadow-sm bg-card/60 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Tests Taken</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{loading ? "..." : totalTests}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-amber-500 shadow-sm bg-card/60 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Best Score</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{loading ? "..." : `${bestScore}%`}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-green-500 shadow-sm bg-card/60 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Points</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{loading ? "..." : attempts.reduce((sum, a) => sum + a.totalScore, 0)}</p>
        </Card>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <Card className="flex-1 p-6 flex flex-col shadow-sm border-border/80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Test History</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar border border-border rounded-xl bg-background/50 shadow-inner">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 sticky top-0 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold border-b border-border">#</th>
                  <th className="px-6 py-4 font-semibold border-b border-border">Date</th>
                  <th className="px-6 py-4 font-semibold border-b border-border">Questions</th>
                  <th className="px-6 py-4 font-semibold border-b border-border">Correct</th>
                  <th className="px-6 py-4 font-semibold border-b border-border">Score</th>
                  <th className="px-6 py-4 font-semibold border-b border-border">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-300 bg-card/40">
                {loading && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                )}
                {!loading && attempts.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No tests taken yet</td></tr>
                )}
                {attempts.map((a, idx) => (
                  <tr key={a.testSessionId} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{a.totalQuestions}</td>
                    <td className="px-6 py-4 text-green-400">{a.correctAnswers}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${a.percentage >= 70 ? 'text-green-400 bg-green-400/10 border border-green-500/20' : a.percentage >= 50 ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-500/20' : 'text-red-400 bg-red-400/10 border border-red-500/20'}`}>
                        {a.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">{a.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
