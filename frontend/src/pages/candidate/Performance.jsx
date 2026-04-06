import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { BarChart3, TrendingUp, TrendingDown, Target } from "lucide-react";
import { performanceAPI } from "../../services/api";

export function Performance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceAPI.getSummary()
      .then((res) => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-500">Loading performance data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-500">No data available. Take a mock test first!</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" /> Performance Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">Detailed breakdown of your test performance and topic mastery</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <Card className="p-5 border-l-4 border-l-primary shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Average Score</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{data.avgScore}%</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-indigo-500 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Tests</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{data.totalTests}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-green-500 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Points</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{data.totalScore}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-amber-500 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Topics Covered</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{data.topicStats?.length || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Topic Performance */}
        <Card className="p-6 flex flex-col shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Topic Mastery</h2>
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {data.topicStats?.map((t) => (
              <div key={t.topic} className="p-4 rounded-xl border border-border bg-background">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">{t.topic}</span>
                  <span className={`text-sm font-semibold ${t.accuracy >= 70 ? 'text-green-600' : t.accuracy >= 50 ? 'text-yellow-400' : 'text-red-600'}`}>{t.accuracy}%</span>
                </div>
                <div className="w-full h-2 bg-[#f5f0eb] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${t.accuracy >= 70 ? 'bg-green-500' : t.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${t.accuracy}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{t.correct}/{t.total} correct</p>
              </div>
            ))}
            {(!data.topicStats || data.topicStats.length === 0) && (
              <p className="text-slate-500 text-sm">No topic data yet.</p>
            )}
          </div>
        </Card>

        {/* Weak & Strong Topics */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 flex-1 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-600" /> Weak Areas</h2>
            <div className="space-y-2">
              {data.weakTopics?.length === 0 && <p className="text-slate-500 text-sm">No weak areas! Keep it up 🎉</p>}
              {data.weakTopics?.map((t) => (
                <div key={t.topic} className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                  <span className="font-medium text-foreground">{t.topic}</span>
                  <span className="text-red-600 text-sm font-semibold">{t.accuracy}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 flex-1 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" /> Strong Areas</h2>
            <div className="space-y-2">
              {data.strongTopics?.length === 0 && <p className="text-slate-500 text-sm">Take more tests to see your strengths.</p>}
              {data.strongTopics?.map((t) => (
                <div key={t.topic} className="flex items-center justify-between p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <span className="font-medium text-foreground">{t.topic}</span>
                  <span className="text-green-600 text-sm font-semibold">{t.accuracy}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
