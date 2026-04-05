import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Users, FileText, CheckCircle, Shield, ArrowUpRight, Activity, BookOpen, Building2
} from "lucide-react";
import { adminAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500/5 border-blue-500/20" },
    { label: "Candidates", value: stats?.totalCandidates ?? 0, icon: Users, gradient: "from-green-500 to-emerald-500", bg: "bg-green-500/5 border-green-500/20" },
    { label: "Recruiters", value: stats?.totalRecruiters ?? 0, icon: Shield, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-500/5 border-amber-500/20" },
    { label: "Questions", value: stats?.totalQuestions ?? 0, icon: FileText, gradient: "from-purple-500 to-pink-500", bg: "bg-purple-500/5 border-purple-500/20" },
    { label: "Companies", value: stats?.totalCompanies ?? 0, icon: Building2, gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/5 border-cyan-500/20" },
    { label: "Tests Taken", value: stats?.totalTests ?? 0, icon: CheckCircle, gradient: "from-red-500 to-rose-500", bg: "bg-red-500/5 border-red-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Admin Dashboard
            <Badge variant="purple" className="gap-1"><Shield className="w-3 h-3" /> Admin</Badge>
          </h1>
          <p className="text-sm text-muted mt-1">Platform overview and management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/admin/users')} className="gap-2">
            <Users className="w-4 h-4" /> Manage Users
          </Button>
          <Button onClick={() => navigate('/admin/content')} className="gap-2 shadow-lg shadow-primary/25">
            <FileText className="w-4 h-4" /> Manage Content
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
            <Card className={`p-5 border ${card.bg} hover:scale-[1.02] transition-transform duration-200`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{loading ? "..." : card.value}</p>
              <p className="text-xs font-medium text-muted mt-1 uppercase tracking-wider">{card.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
          <Card className="p-6 hover:border-primary/20 transition-all group cursor-pointer" onClick={() => navigate('/admin/users')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">User Management</h3>
            <p className="text-sm text-muted">View and manage all registered users.</p>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
          <Card className="p-6 hover:border-primary/20 transition-all group cursor-pointer" onClick={() => navigate('/admin/content')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Content Management</h3>
            <p className="text-sm text-muted">Add and manage MCQ / coding questions.</p>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}>
          <Card className="p-6 hover:border-primary/20 transition-all group cursor-pointer" onClick={() => navigate('/admin/companies')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Company Management</h3>
            <p className="text-sm text-muted">Create and manage companies on the platform.</p>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={9}>
          <Card className="p-6 hover:border-primary/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <Badge variant="success">Live</Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Platform Health</h3>
            <p className="text-sm text-muted">All systems operational. API healthy.</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
