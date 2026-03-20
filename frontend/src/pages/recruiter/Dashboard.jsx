import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Users, Calendar, Clock, TrendingUp, CheckCircle, XCircle,
  BarChart3, UserCheck, Video, ArrowUpRight, Activity
} from "lucide-react";
import { recruiterAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function FunnelBar({ label, value, max, color }) {
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export function RecruiterDashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      recruiterAPI.getCandidates().then((r) => setCandidates(r.data.data)),
      recruiterAPI.getInterviews().then((r) => setInterviews(r.data.data)),
      recruiterAPI.getAnalytics().then((r) => setAnalytics(r.data.data)).catch(() => null),
    ]).finally(() => setLoading(false));
  }, []);

  const upcomingInterviews = interviews.filter((i) => i.status === "SCHEDULED");
  const completedInterviews = interviews.filter((i) => i.status === "COMPLETED");
  const funnel = analytics?.hiringFunnel || {};
  const skillDist = analytics?.skillDistribution || [];
  const successRate = analytics?.interviewSuccessRate || 0;

  const statCards = [
    { label: "Total Candidates", value: candidates.length, icon: Users, color: "border-l-primary", iconColor: "text-primary/20" },
    { label: "Upcoming Interviews", value: upcomingInterviews.length, icon: Calendar, color: "border-l-amber-500", iconColor: "text-amber-500/20" },
    { label: "Completed", value: completedInterviews.length, icon: CheckCircle, color: "border-l-green-500", iconColor: "text-green-500/20" },
    { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp, color: "border-l-purple-500", iconColor: "text-purple-500/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recruiter Dashboard</h1>
          <p className="text-sm text-muted mt-1">ATS Overview & Hiring Analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/recruiter/candidates')} className="gap-2">
            <Users className="w-4 h-4" /> View Candidates
          </Button>
          <Button onClick={() => navigate('/recruiter/schedule')} className="gap-2 shadow-lg shadow-primary/25">
            <Calendar className="w-4 h-4" /> Schedule Interview
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
            <Card className={`p-5 ${card.color} border-l-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors`}>
              <div>
                <h3 className="font-medium text-muted text-sm">{card.label}</h3>
                <p className="text-2xl font-bold mt-1 text-foreground">{loading ? "..." : card.value}</p>
              </div>
              <card.icon className={`w-10 h-10 ${card.iconColor}`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Funnel */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Hiring Funnel</h2>
              <Activity className="w-5 h-5 text-muted" />
            </div>
            <div className="space-y-4">
              <FunnelBar label="Applied" value={funnel.applied || 0} max={funnel.applied || 1} color="bg-blue-500" />
              <FunnelBar label="Interviewed" value={funnel.interviewed || 0} max={funnel.applied || 1} color="bg-purple-500" />
              <FunnelBar label="Selected" value={funnel.selected || 0} max={funnel.applied || 1} color="bg-green-500" />
              <FunnelBar label="Rejected" value={funnel.rejected || 0} max={funnel.applied || 1} color="bg-red-500" />
              <FunnelBar label="Pending" value={funnel.pending || 0} max={funnel.applied || 1} color="bg-amber-500" />
            </div>
          </Card>
        </motion.div>

        {/* Skill Distribution */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Skill Distribution</h2>
              <BarChart3 className="w-5 h-5 text-muted" />
            </div>
            <div className="space-y-3">
              {skillDist.length === 0 && !loading && (
                <p className="text-muted text-sm py-4 text-center">No skill data yet</p>
              )}
              {skillDist.map((s) => {
                const maxCount = skillDist[0]?.count || 1;
                return (
                  <div key={s.skill} className="flex items-center gap-3">
                    <span className="text-sm text-muted w-24 truncate">{s.skill}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500"
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-6 text-right">{s.count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Interview Success Rate + Quick Stats */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
          <Card className="p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-foreground mb-6">Interview Metrics</h2>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative w-32 h-32">
                <svg width="128" height="128" className="-rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth="10" />
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#22c55e" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 - (successRate / 100) * 2 * Math.PI * 56}
                    style={{ transition: "stroke-dashoffset 1.5s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{successRate}%</span>
                  <span className="text-xs text-muted">Success</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="text-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <UserCheck className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{funnel.selected || 0}</p>
                  <p className="text-xs text-muted">Selected</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{funnel.rejected || 0}</p>
                  <p className="text-xs text-muted">Rejected</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Interviews */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Interviews</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/recruiter/candidates')} className="gap-1 text-muted hover:text-foreground">
              View All <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
          {interviews.length === 0 && !loading && <p className="text-muted text-sm py-4 text-center">No interviews scheduled yet.</p>}
          <div className="space-y-3">
            {interviews.slice(0, 5).map((i) => (
              <div key={i._id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-border/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-primary">
                    {(i.candidateId?.name || "?")[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{i.candidateId?.name || "Unknown"}</h4>
                    <p className="text-xs text-muted">{new Date(i.scheduledAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    i.status === 'SCHEDULED' ? 'primary' :
                    i.status === 'COMPLETED' ? 'success' :
                    i.status === 'IN_PROGRESS' ? 'warning' : 'danger'
                  }>
                    {i.status}
                  </Badge>
                  {i.status === 'SCHEDULED' && (
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/recruiter/interview/${i._id}`)} className="gap-1 text-xs">
                      <Video className="w-3 h-3" /> Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
