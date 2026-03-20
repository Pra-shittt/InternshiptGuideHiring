import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { recruiterAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export function ScheduleInterview() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    recruiterAPI.getCandidates()
      .then((res) => setCandidates(res.data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidateId || !date || !time) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await recruiterAPI.scheduleInterview({
        candidateId,
        scheduledAt: `${date}T${time}`,
      });
      setSuccess(true);
      setTimeout(() => navigate('/recruiter/dashboard'), 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to schedule");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center h-full">
        <Card className="p-10 text-center space-y-4 shadow-sm">
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-foreground">Interview Scheduled!</h2>
          <p className="text-slate-400">Redirecting to dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Schedule Interview</h1>
        <p className="text-slate-400 mt-1">Create a new interview for a candidate.</p>
      </div>

      <Card className="p-8 shadow-sm border-border/80">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-3">Interview Details</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Select Candidate</label>
              <select
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                required
              >
                <option value="">Choose a candidate...</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-background/50 text-slate-300" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Time</label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-background/50 text-slate-300" required />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border">
            <Button variant="secondary" type="button" onClick={() => navigate('/recruiter/dashboard')} className="px-6">Cancel</Button>
            <Button type="submit" className="px-6 shadow-primary/20 shadow-md" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
