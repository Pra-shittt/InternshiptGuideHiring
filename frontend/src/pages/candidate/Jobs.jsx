import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import {
  Briefcase, MapPin, DollarSign, Search, Clock, Tag, Loader2, CheckCircle
} from "lucide-react";
import { jobAPI, applicationAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Internship", "Contract"];

export function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [applying, setApplying] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobAPI.getAll(),
        applicationAPI.getMyApplications(),
      ]);
      setJobs(jobsRes.data.data || []);
      const applied = new Set(
        (appsRes.data.data || []).map((a) => a.job?._id || a.job)
      );
      setAppliedJobs(applied);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applicationAPI.apply({ jobId });
      toast.success("Application submitted!");
      setAppliedJobs((prev) => new Set([...prev, jobId]));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      (j.skills || []).some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "All" || j.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Browse Jobs</h1>
        <p className="text-sm text-muted mt-1">Find and apply to opportunities posted by recruiters</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search jobs by title, company, or skill..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {JOB_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                typeFilter === type
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white border border-[#e2ddd8] text-slate-600 hover:bg-[#f5f0eb]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Count */}
      <p className="text-sm text-muted">{filtered.length} jobs found</p>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-muted font-medium">No jobs found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((job) => {
            const jobId = job._id || job.id;
            const isApplied = appliedJobs.has(jobId);

            return (
              <Card key={jobId} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left — Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground truncate">{job.title}</h3>
                      <Badge variant="primary">{job.type || "Full-Time"}</Badge>
                    </div>
                    <p className="text-sm text-muted mb-3 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {job.location || "Remote"}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" /> {job.salary}
                        </span>
                      )}
                      {job.openings && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> {job.openings} opening{job.openings > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Skills Tags */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[#f5f0eb] text-slate-600 border border-[#e2ddd8]"
                          >
                            <Tag className="w-3 h-3" /> {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right — Actions */}
                  <div className="flex md:flex-col gap-2 shrink-0">
                    {isApplied ? (
                      <Button variant="secondary" disabled className="gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" /> Applied
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleApply(jobId)}
                        disabled={applying === jobId}
                        className="gap-2 text-sm"
                      >
                        {applying === jobId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Briefcase className="w-4 h-4" />
                        )}
                        Apply Now
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/candidate/test")}
                      className="gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Mock Test
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
