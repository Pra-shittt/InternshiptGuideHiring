import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Briefcase, Users, MapPin, Loader2, ChevronDown, ChevronUp, Calendar,
  DollarSign, Mail, FileText
} from "lucide-react";
import { jobAPI, applicationAPI, recruiterAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [loadingApplicants, setLoadingApplicants] = useState(null);

  useEffect(() => {
    jobAPI.getMyJobs()
      .then((res) => setJobs(res.data.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = async (jobId) => {
    if (expanded === jobId) {
      setExpanded(null);
      return;
    }
    setExpanded(jobId);
    if (!applicants[jobId]) {
      setLoadingApplicants(jobId);
      try {
        const res = await applicationAPI.getByJob(jobId);
        setApplicants((prev) => ({ ...prev, [jobId]: res.data.data || [] }));
      } catch {
        setApplicants((prev) => ({ ...prev, [jobId]: [] }));
      } finally {
        setLoadingApplicants(null);
      }
    }
  };

  const handleScheduleInterview = (candidateId, jobId) => {
    navigate(`/recruiter/schedule?candidateId=${candidateId}&jobId=${jobId}`);
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      await applicationAPI.updateStatus(appId, { status });
      toast.success(`Application ${status}`);
      // Refresh applicants for the expanded job
      if (expanded) {
        const res = await applicationAPI.getByJob(expanded);
        setApplicants((prev) => ({ ...prev, [expanded]: res.data.data || [] }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Job Postings</h1>
          <p className="text-sm text-muted mt-1">Manage your jobs and view applicants</p>
        </div>
        <Button onClick={() => navigate("/recruiter/post-job")} className="gap-2">
          <Briefcase className="w-4 h-4" /> Post New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-muted font-medium">No jobs posted yet</p>
          <Button onClick={() => navigate("/recruiter/post-job")} className="mt-4 gap-2">
            Post Your First Job
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const jobId = job._id || job.id;
            const isExpanded = expanded === jobId;
            const jobApplicants = applicants[jobId] || [];

            return (
              <Card key={jobId} className="overflow-hidden">
                {/* Job Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-[#faf8f5] transition-colors"
                  onClick={() => toggleExpand(jobId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                        <Badge variant={job.status === "open" ? "success" : "default"}>
                          {job.status || "open"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Users className="w-4 h-4" />
                        {job.applicationCount || 0} applicants
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Applicants Panel */}
                {isExpanded && (
                  <div className="border-t border-[#e2ddd8] bg-[#faf8f5]">
                    {loadingApplicants === jobId ? (
                      <div className="p-6 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                      </div>
                    ) : jobApplicants.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-400">No applicants yet</div>
                    ) : (
                      <div className="divide-y divide-[#e2ddd8]">
                        {jobApplicants.map((app) => {
                          const applicant = app.applicant || {};
                          return (
                            <div key={app._id} className="p-4 flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-sm">{applicant.name || "Unknown"}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {applicant.email}</span>
                                  <Badge variant={
                                    app.status === "shortlisted" ? "primary" :
                                    app.status === "interview" ? "cyan" :
                                    app.status === "offered" ? "success" :
                                    app.status === "rejected" ? "danger" : "default"
                                  }>
                                    {app.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                {applicant.resumeUrl && (
                                  <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                      <FileText className="w-3.5 h-3.5" /> Resume
                                    </Button>
                                  </a>
                                )}
                                {app.status === "applied" && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="text-xs"
                                    onClick={() => handleUpdateStatus(app._id, "shortlisted")}
                                  >
                                    Shortlist
                                  </Button>
                                )}
                                {(app.status === "applied" || app.status === "shortlisted") && (
                                  <Button
                                    size="sm"
                                    className="text-xs gap-1"
                                    onClick={() => handleScheduleInterview(applicant._id, jobId)}
                                  >
                                    <Calendar className="w-3.5 h-3.5" /> Interview
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
