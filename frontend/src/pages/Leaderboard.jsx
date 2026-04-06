import { useState, useEffect } from "react";
import { Trophy, Medal } from "lucide-react";
import { Card } from "../components/ui/Card";
import { leaderboardAPI } from "../services/api";

export function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardAPI.get()
      .then((res) => setLeaders(res.data.data))
      .catch(() => setLeaders([]))
      .finally(() => setLoading(false));
  }, []);

  const getRankStyle = (rank) => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (rank === 2) return "bg-slate-400/20 text-slate-500 border-slate-400/30";
    if (rank === 3) return "bg-amber-700/20 text-amber-500 border-amber-700/30";
    return "bg-[#f5f0eb] text-slate-500 border-[#e2ddd8]";
  };

  return (
    <div className="h-full flex flex-col gap-6 pb-2">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-600" /> Leaderboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Top performers ranked by total score</p>
        </div>
      </div>

      {/* Top 3 podium */}
      {leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 shrink-0">
          {[leaders[1], leaders[0], leaders[2]].map((l, i) => (
            <Card key={l.userId} className={`p-6 text-center ${i === 1 ? 'border-yellow-500/30 bg-yellow-500/5 scale-105' : ''} shadow-sm`}>
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 ${getRankStyle(l.rank)}`}>
                {l.rank <= 3 ? <Medal className="w-6 h-6" /> : l.rank}
              </div>
              <h3 className="text-lg font-bold text-foreground mt-3">{l.name}</h3>
              <p className="text-2xl font-bold text-primary mt-1">{l.totalScore}</p>
              <p className="text-sm text-slate-500 mt-1">{l.accuracy}% accuracy • {l.testCount} tests</p>
            </Card>
          ))}
        </div>
      )}

      <Card className="flex-1 p-6 flex flex-col min-h-0 shadow-sm border-border/80">
        <div className="flex-1 overflow-y-auto custom-scrollbar border border-border rounded-xl bg-background/50 shadow-inner">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-slate-500 uppercase bg-[#f5f0eb]/80 sticky top-0 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-border">Rank</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Name</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Total Score</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Tests</th>
                <th className="px-6 py-4 font-semibold border-b border-border">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-500 bg-card/40">
              {loading && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>}
              {!loading && leaders.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No data yet. Take a test to appear on the leaderboard!</td></tr>}
              {leaders.map((l) => (
                <tr key={l.userId} className="hover:bg-[#f5f0eb] transition-colors">
                  <td className="px-6 py-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${getRankStyle(l.rank)}`}>{l.rank}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{l.name}</td>
                  <td className="px-6 py-4 font-mono font-medium text-primary">{l.totalScore}</td>
                  <td className="px-6 py-4">{l.testCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${l.accuracy >= 70 ? 'text-green-600 bg-green-400/10' : l.accuracy >= 50 ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-600 bg-red-400/10'}`}>{l.accuracy}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
