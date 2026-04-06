import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Video, Calendar, Loader2, User } from "lucide-react";
import { interviewAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export function LiveInterviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewAPI
      .getCandidateUpcoming()
      .then((res) => setInterviews(res.data.data || []))
      .catch(() => setInterviews([]))
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
        <h1 className="text-2xl font-bold text-foreground">Live Interviews</h1>
        <p className="text-sm text-muted mt-1">Your upcoming and active interview sessions</p>
      </div>

      {interviews.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-muted font-medium">No upcoming interviews</p>
          <p className="text-sm text-slate-400 mt-1">When a recruiter schedules an interview, it will appear here</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {interviews.map((interview) => {
            const recruiter = typeof interview.recruiterId === "object" ? interview.recruiterId : {};
            const id = interview._id || interview.id;
            const isActive = interview.status === "IN_PROGRESS";

            return (
              <Card key={id} className={`p-5 ${isActive ? "border-primary/30 shadow-md" : ""}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-foreground">
                        Interview with {recruiter.name || "Recruiter"}
                      </h3>
                      <Badge variant={isActive ? "success" : "primary"}>
                        {isActive ? "LIVE" : interview.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      {recruiter.company && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> {recruiter.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {interview.scheduledAt
                          ? new Date(interview.scheduledAt).toLocaleString("en-US", {
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                            })
                          : "TBD"}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate(`/candidate/interview/${id}`)}
                    className="gap-2"
                  >
                    <Video className="w-4 h-4" /> {isActive ? "Join Now" : "Open"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
