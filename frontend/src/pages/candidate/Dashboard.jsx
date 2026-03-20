import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Play, BarChart3, Trophy, Clock, Calendar, Video,
  TrendingUp, Target, ChevronRight, BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { performanceAPI, interviewAPI } from "../../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function ProgressRing({ percentage, size = 80, stroke = 8, color = "#3b82f6" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
}

export function CandidateDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      performanceAPI.getSummary().then((res) => setStats(res.data.data)).catch(() => setStats(null)),
      interviewAPI.getCandidateUpcoming().then((res) => setInterviews(res.data.data)).catch(() => setInterviews([])),
    ]).finally(() => setLoading(false));
  }, []);

  const totalTests = stats?.totalTests || 0;
  const avgScore = stats?.avgScore || 0;
  const weakTopics = stats?.weakTopics || [];
  const recentActivity = stats?.recentActivity || [];

  const statCards = [
    { label: "Avg Score", value: `${avgScore}%`, icon: BarChart3, color: "border-l-primary", iconColor: "text-primary" },
    { label: "Tests Taken", value: totalTests, icon: Trophy, color: "border-l-green-500", iconColor: "text-green-500" },
    { label: "Total Score", value: stats?.totalScore || 0, icon: TrendingUp, color: "border-l-purple-500", iconColor: "text-purple-500" },
    { label: "Weak Areas", value: weakTopics.length > 0 ? weakTopics[0].topic : "None 🎉", icon: Target, color: "border-l-amber-500", iconColor: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Candidate Dashboard</h1>
          <p className="text-sm text-muted mt-1">Track your practice, assessments, and interviews</p>
        </div>
        <Button onClick={() => navigate('/candidate/test')} className="gap-2 shadow-lg shadow-primary/25">
          <Play className="w-4 h-4" /> Start Mock Test
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
            <Card className={`p-5 ${card.color} border-l-4 hover:bg-slate-800/50 transition-colors`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-muted text-sm">{card.label}</h3>
                  <p className="text-2xl font-bold mt-1 text-foreground">{loading ? "..." : card.value}</p>
                </div>
                <card.icon className={`w-8 h-8 ${card.iconColor} opacity-20`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Quick Actions */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Mock Test", icon: Play, to: "/candidate/test", color: "from-blue-500 to-cyan-500" },
                { label: "Assessment", icon: BookOpen, to: "/candidate/assessment", color: "from-purple-500 to-pink-500" },
                { label: "Companies", icon: Trophy, to: "/candidate/companies", color: "from-amber-500 to-orange-500" },
                { label: "Analytics", icon: BarChart3, to: "/candidate/performance", color: "from-green-500 to-emerald-500" },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.to)}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-slate-800/30 hover:bg-slate-800/60 hover:border-primary/30 transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <a.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-muted group-hover:text-foreground transition-colors">{a.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.length === 0 && !loading && (
                <p className="text-muted text-sm py-4 text-center">No tests taken yet. Start your first mock test!</p>
              )}
              {recentActivity.slice(0, 5).map((a, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-border/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.percentage >= 70 ? 'bg-green-500/10 text-green-500' : a.percentage >= 50 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Mock Test</h4>
                      <p className="text-xs text-muted">{a.correctAnswers}/{a.totalQuestions} correct</p>
                    </div>
                  </div>
                  <Badge variant={a.percentage >= 70 ? 'success' : a.percentage >= 50 ? 'warning' : 'danger'}>
                    {a.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="space-y-6">
          {/* Score Progress */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Your Progress</h2>
            <div className="flex items-center justify-center py-4">
              <ProgressRing percentage={avgScore} size={120} stroke={10} />
            </div>
            <p className="text-center text-muted text-sm mt-2">Average Score across {totalTests} tests</p>
          </Card>

          {/* Upcoming Interviews */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Interviews</h2>
              <Calendar className="w-5 h-5 text-muted" />
            </div>
            {interviews.length === 0 && !loading && (
              <p className="text-muted text-sm py-4 text-center">No interviews scheduled</p>
            )}
            <div className="space-y-3">
              {interviews.slice(0, 3).map((interview) => (
                <div key={interview._id} className="p-3 rounded-lg border border-border bg-background">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{interview.recruiterId?.company || 'Interview'}</span>
                  </div>
                  <p className="text-xs text-muted mb-3">
                    {new Date(interview.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                    {new Date(interview.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {interview.status === 'IN_PROGRESS' ? (
                    <Button size="sm" onClick={() => navigate(`/candidate/interview/${interview._id}`)} className="w-full gap-1 text-xs">
                      <Video className="w-3 h-3" /> Join Now
                    </Button>
                  ) : (
                    <Badge variant="primary">
                      <Clock className="w-3 h-3 mr-1" /> Scheduled
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Weak Areas */}
          {weakTopics.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Focus Areas</h2>
              <div className="space-y-2">
                {weakTopics.slice(0, 4).map((topic, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                    <span className="text-sm font-medium text-foreground">{topic.topic}</span>
                    <Badge variant="warning">{topic.score}%</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
