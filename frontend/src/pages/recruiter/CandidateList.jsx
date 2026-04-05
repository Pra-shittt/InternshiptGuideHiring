import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { SlideOver } from "../../components/ui/SlideOver";
import {
  Search, Filter, Users, Video, Calendar, Star, FileText,
  CheckCircle, XCircle, Eye, ChevronDown, Clock, BarChart3,
  Mail, Download
} from "lucide-react";
import { recruiterAPI, interviewAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const statusBadgeVariant = {
  available: "success",
  "in-interview": "warning",
  hired: "primary",
  rejected: "danger",
};

export function CandidateList() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [candidateDetail, setCandidateDetail] = useState(null);

  useEffect(() => {
    recruiterAPI.getCandidates()
      .then((r) => setCandidates(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const openProfile = async (candidate) => {
    setSelectedCandidate(candidate);
    setSlideOpen(true);
    try {
      const perfRes = await recruiterAPI.getCandidatePerformance(candidate.id);
      setCandidateDetail(perfRes.data.data);
    } catch {
      setCandidateDetail(null);
    }
  };

  const closeProfile = () => {
    setSlideOpen(false);
    setSelectedCandidate(null);
    setCandidateDetail(null);
  };

  const handleStartInterview = async (candidateId) => {
    try {
      const res = await recruiterAPI.scheduleInterview({
        candidateId,
        scheduledAt: new Date().toISOString(),
      });
      const interview = res.data.data;
      const startRes = await interviewAPI.start(interview._id);
      navigate(`/recruiter/interview/${interview._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start interview");
    }
  };

  const handleSchedule = (candidateId) => {
    navigate(`/recruiter/schedule?candidateId=${candidateId}`);
  };

  // Collect all unique skills
  const allSkills = [...new Set(candidates.flatMap((c) => c.skills || []))].sort();

  // Filter candidates
  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchSkill = !skillFilter || (c.skills || []).includes(skillFilter);
    const matchStatus = !statusFilter || c.interviewStatus === statusFilter;
    return matchSearch && matchSkill && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Candidate Management</h1>
          <p className="text-sm text-muted mt-1">{candidates.length} total candidates</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="h-10 pl-10 pr-8 rounded-lg border border-border bg-background text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Skills</option>
              {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-4 pr-8 rounded-lg border border-border bg-background text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="in-interview">In Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Candidate Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-800/30">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Candidate</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Skills</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Score</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Resume</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted">Loading candidates...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted">No candidates found</td></tr>
              )}
              {filtered.map((candidate, i) => (
                <motion.tr
                  key={candidate.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {candidate.name[0]}
                      </div>
                      <div>
                        <button onClick={() => openProfile(candidate)} className="font-medium text-foreground text-sm hover:text-primary transition-colors text-left">
                          {candidate.name}
                        </button>
                        <p className="text-xs text-muted">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(candidate.skills || []).slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="default" className="text-[10px]">{skill}</Badge>
                      ))}
                      {(candidate.skills || []).length > 3 && (
                        <Badge variant="default" className="text-[10px]">+{candidate.skills.length - 3}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        candidate.avgScore >= 70 ? 'bg-green-500/10 text-green-500' :
                        candidate.avgScore >= 50 ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {candidate.avgScore}
                      </div>
                      <span className="text-xs text-muted">/ 100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {candidate.resumeUrl ? (
                      <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                        <FileText className="w-3.5 h-3.5" /> View
                      </a>
                    ) : (
                      <span className="text-xs text-muted">No resume</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusBadgeVariant[candidate.interviewStatus] || "default"}>
                      {candidate.interviewStatus || "available"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => openProfile(candidate)} title="View Profile" className="h-8 w-8 p-0">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleSchedule(candidate.id)} title="Schedule Interview" className="h-8 w-8 p-0">
                        <Calendar className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => handleStartInterview(candidate.id)} title="Start Interview" className="h-8 px-3 text-xs gap-1">
                        <Video className="w-3 h-3" /> Start
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Candidate Profile Slide-Over */}
      <SlideOver open={slideOpen} onClose={closeProfile} title="Candidate Profile">
        {selectedCandidate && (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                {selectedCandidate.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{selectedCandidate.name}</h3>
                <p className="text-sm text-muted flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedCandidate.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={statusBadgeVariant[selectedCandidate.interviewStatus] || "default"}>
                    {selectedCandidate.interviewStatus || "available"}
                  </Badge>
                  <span className="text-xs text-muted">Joined {new Date(selectedCandidate.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(selectedCandidate.skills || []).map((skill) => (
                  <Badge key={skill} variant="primary">{skill}</Badge>
                ))}
                {(selectedCandidate.skills || []).length === 0 && (
                  <span className="text-sm text-muted">No skills listed</span>
                )}
              </div>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-background border border-border">
                <p className="text-2xl font-bold text-primary">{selectedCandidate.avgScore || 0}%</p>
                <p className="text-xs text-muted mt-1">Avg Score</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background border border-border">
                <p className="text-2xl font-bold text-foreground">{selectedCandidate.totalAttempts || 0}</p>
                <p className="text-xs text-muted mt-1">Tests Taken</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background border border-border">
                <p className="text-2xl font-bold text-foreground">{selectedCandidate.totalScore || 0}</p>
                <p className="text-xs text-muted mt-1">Total Score</p>
              </div>
            </div>

            {/* Resume */}
            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Resume</h4>
              {selectedCandidate.resumeUrl ? (
                <a href={selectedCandidate.resumeUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:bg-slate-800/50 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Resume.pdf</p>
                    <p className="text-xs text-muted">Click to view or download</p>
                  </div>
                  <Download className="w-4 h-4 text-muted" />
                </a>
              ) : (
                <div className="p-4 rounded-lg border border-border bg-background text-center">
                  <p className="text-sm text-muted">No resume uploaded</p>
                </div>
              )}
            </div>


            {/* Test History */}
            <div>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Test History</h4>
              <div className="space-y-2">
                {(!candidateDetail?.testHistory || candidateDetail.testHistory.length === 0) && (
                  <p className="text-sm text-muted text-center py-3">No test history</p>
                )}
                {(candidateDetail?.testHistory || []).slice(0, 5).map((t) => (
                  <div key={t._id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.correctAnswers}/{t.totalQuestions} correct</p>
                      <p className="text-xs text-muted">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={
                      Math.round((t.correctAnswers / t.totalQuestions) * 100) >= 70 ? 'success' :
                      Math.round((t.correctAnswers / t.totalQuestions) * 100) >= 50 ? 'warning' : 'danger'
                    }>
                      {Math.round((t.correctAnswers / t.totalQuestions) * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gap-2" onClick={() => handleStartInterview(selectedCandidate.id)}>
                <Video className="w-4 h-4" /> Start Interview
              </Button>
              <Button variant="secondary" className="flex-1 gap-2" onClick={() => handleSchedule(selectedCandidate.id)}>
                <Calendar className="w-4 h-4" /> Schedule
              </Button>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
