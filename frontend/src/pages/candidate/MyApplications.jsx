import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Briefcase, MapPin, Calendar, Loader2, FileText, ArrowRight
} from "lucide-react";
import { applicationAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  applied: { label: "Applied", variant: "default" },
  shortlisted: { label: "Shortlisted", variant: "primary" },
  interview: { label: "Interview", variant: "cyan" },
  offered: { label: "Hired", variant: "success" },
  hired: { label: "Hired", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  withdrawn: { label: "Withdrawn", variant: "warning" },
};

export function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationAPI
      .getMyApplications()
      .then((res) => setApplications(res.data.data || []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-sm text-muted mt-1">Track the status of all your job applications</p>
      </div>

      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-muted font-medium">No applications yet</p>
          <p className="text-sm text-slate-400 mt-1">Browse jobs and apply to get started</p>
          <Button onClick={() => navigate("/candidate/jobs")} className="mt-4 gap-2">
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => {
            const job = app.job || {};
            const status = statusConfig[app.status] || statusConfig.applied;

            return (
              <Card key={app._id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-foreground truncate">
                        {job.title || "Unknown Job"}
                      </h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-2">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> {job.company || "—"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {job.location || "Remote"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        }) : "—"}
                      </span>
                    </div>

                    {job.salary && (
                      <p className="text-sm text-slate-500 mt-1">💰 {job.salary}</p>
                    )}
                  </div>

                  {/* Status timeline dot */}
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                    <div className={`w-3 h-3 rounded-full ${
                      app.status === "offered" || app.status === "hired"
                        ? "bg-green-500"
                        : app.status === "rejected"
                        ? "bg-red-500"
                        : app.status === "shortlisted" || app.status === "interview"
                        ? "bg-blue-500"
                        : "bg-slate-300"
                    }`} />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {status.label}
                    </span>
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
