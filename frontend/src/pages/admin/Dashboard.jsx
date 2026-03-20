import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { adminAPI } from "../../services/api";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const items = [
    { label: "Total Users", value: stats?.totalUsers, color: "border-l-primary" },
    { label: "Active Candidates", value: stats?.totalCandidates, color: "border-l-green-500" },
    { label: "Recruiters", value: stats?.totalRecruiters, color: "border-l-amber-500" },
    { label: "Total Questions", value: stats?.totalQuestions, color: "border-l-indigo-500" },
    { label: "Total Tests Taken", value: stats?.totalTests, color: "border-l-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {items.map((item) => (
          <Card key={item.label} className={`p-6 border-l-4 ${item.color}`}>
            <h3 className="font-medium text-slate-400">{item.label}</h3>
            <p className="text-3xl font-bold mt-2">{loading ? "..." : item.value ?? 0}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
