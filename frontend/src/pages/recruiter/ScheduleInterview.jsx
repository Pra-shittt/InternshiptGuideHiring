import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { recruiterAPI, jobAPI, applicationAPI } from "../../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, ChevronDown, Briefcase } from "lucide-react";

const timeSlots = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    const label = `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${mm} ${h < 12 ? "AM" : "PM"}`;
    timeSlots.push({ value: `${hh}:${mm}`, label });
  }
}

export function ScheduleInterview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState(searchParams.get("jobId") || "");
  const [applicants, setApplicants] = useState([]);
  const [candidateId, setCandidateId] = useState(searchParams.get("candidateId") || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch recruiter's own job postings
  useEffect(() => {
    jobAPI.getMyJobs()
      .then((res) => setJobs(res.data.data || []))
      .catch(() => setJobs([]));
  }, []);

  // When job changes, fetch applicants for that job
  useEffect(() => {
    if (!jobId) {
      setApplicants([]);
      setCandidateId("");
      return;
    }
    applicationAPI.getByJob(jobId)
      .then((res) => {
        const apps = res.data.data || [];
        setApplicants(apps);
        // If candidateId from URL no longer matches applicants, reset
        const valid = apps.find(
          (a) => (a.applicant?._id || a.applicantId) === candidateId
        );
        if (!valid) setCandidateId("");
      })
      .catch(() => setApplicants([]));
  }, [jobId]);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!jobId || !candidateId || !date || !time) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await recruiterAPI.scheduleInterview({
        candidateId,
        jobId,
        scheduledAt: `${date}T${time}`,
      });
      setSuccess(true);
      setTimeout(() => navigate("/recruiter/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center h-full">
        <Card className="p-10 text-center space-y-4 shadow-sm">
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-foreground">Interview Scheduled!</h2>
          <p className="text-slate-500">Redirecting to dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Schedule Interview</h1>
        <p className="text-slate-500 mt-1">
          Create a new interview for a candidate who applied to one of your jobs.
        </p>
      </div>

      <Card className="p-8 shadow-sm border-border/80">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-500/20 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-3">
              Interview Details
            </h3>

            {/* Job Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted" /> Select Job
              </label>
              <div className="relative">
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Choose a job posting...</option>
                  {jobs.map((j) => (
                    <option key={j._id || j.id} value={j._id || j.id}>
                      {j.title} — {j.company}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>

            {/* Candidate Selector — only shows applicants for selected job */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Select Candidate</label>
              <div className="relative">
                <select
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm appearance-none cursor-pointer disabled:opacity-50"
                  required
                  disabled={!jobId}
                >
                  <option value="">
                    {jobId ? "Choose a candidate..." : "Select a job first"}
                  </option>
                  {applicants.map((a) => {
                    const id = a.applicant?._id || a.applicantId;
                    const name = a.applicant?.name || a.applicantName || "Unknown";
                    const email = a.applicant?.email || a.applicantEmail || "";
                    return (
                      <option key={id} value={id}>
                        {name} ({email})
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
              {jobId && applicants.length === 0 && (
                <p className="text-xs text-amber-600">
                  No applicants found for this job yet.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted" /> Date
                </label>
                <Input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-background/50 text-slate-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted" /> Time
                </label>
                <div className="relative">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select time...</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/recruiter/dashboard")}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 shadow-primary/20 shadow-md"
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
