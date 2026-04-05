import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Users, Calendar, Clock, CheckCircle, Video, ArrowUpRight
} from "lucide-react";
import { recruiterAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" },
  }),
};

export function RecruiterDashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      recruiterAPI.getCandidates().then((r) => setCandidates(r.data.data)),
      recruiterAPI.getInterviews().then((r) => setInterviews(r.data.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const upcomingInterviews = interviews.filter((i) => i.status === "SCHEDULED");
  const completedInterviews = interviews.filter((i) => i.status === "COMPLETED");
  const inProgressInterviews = interviews.filter((i) => i.status === "IN_PROGRESS");

  const statCards = [
    { label: "My Candidates", value: candidates.length, icon: Users, gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500/5 border-blue-500/20" },
    { label: "Upcoming Interviews", value: upcomingInterviews.length, icon: Calendar, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-500/5 border-amber-500/20" },
    { label: "Completed", value: completedInterviews.length, icon: CheckCircle, gradient: "from-green-500 to-emerald-500", bg: "bg-green-500/5 border-green-500/20" },
    { label: "Total Interviews", value: interviews.length, icon: Clock, gradient: "from-purple-500 to-pink-500", bg: "bg-purple-500/5 border-purple-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recruiter Dashboard</h1>
          <p className="text-sm text-muted mt-1">Manage your candidates and interviews</p>
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
            <Card className={`p-5 border ${card.bg} hover:scale-[1.02] transition-transform duration-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-muted text-xs uppercase tracking-wider">{card.label}</h3>
                  <p className="text-3xl font-bold mt-2 text-foreground">{loading ? "..." : card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Interview List */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Interviews</h2>
              {inProgressInterviews.length > 0 && (
                <Badge variant="warning" className="gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {inProgressInterviews.length} Live
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/recruiter/candidates')} className="gap-1 text-muted hover:text-foreground">
              View All <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {interviews.length === 0 && !loading && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-muted font-medium">No interviews scheduled yet</p>
              <p className="text-sm text-slate-600 mt-1">Schedule your first interview to get started</p>
              <Button onClick={() => navigate('/recruiter/schedule')} className="mt-4 gap-2">
                <Calendar className="w-4 h-4" /> Schedule Interview
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {interviews.slice(0, 8).map((i) => (
              <div key={i._id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border hover:border-border/80 hover:bg-slate-800/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-primary">
                    {(i.candidateId?.name || "?")[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{i.candidateId?.name || "Unknown"}</h4>
                    <p className="text-xs text-muted">{new Date(i.scheduledAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {i.result && i.result !== "pending" && (
                    <Badge variant={i.result === "selected" ? "success" : "danger"}>
                      {i.result}
                    </Badge>
                  )}
                  <Badge variant={
                    i.status === 'SCHEDULED' ? 'primary' :
                    i.status === 'COMPLETED' ? 'success' :
                    i.status === 'IN_PROGRESS' ? 'warning' : 'danger'
                  }>
                    {i.status === 'IN_PROGRESS' && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1" />}
                    {i.status}
                  </Badge>
                  {i.status === 'SCHEDULED' && (
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/recruiter/interview/${i._id}`)} className="gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <Video className="w-3 h-3" /> Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Candidates Summary */}
      {candidates.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">Your Candidates</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/recruiter/candidates')} className="gap-1 text-muted hover:text-foreground">
                View All <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {candidates.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-primary">
                      {(c.name || "?")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted">{c.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${c.avgScore >= 70 ? 'text-green-400' : c.avgScore >= 50 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {c.avgScore}%
                    </p>
                    <p className="text-[10px] text-slate-600">{c.totalAttempts} tests</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
