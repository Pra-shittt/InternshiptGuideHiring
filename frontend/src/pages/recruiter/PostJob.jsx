import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PlusCircle, Loader2, ArrowLeft } from "lucide-react";
import { jobAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Contract"];

export function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    type: "Full-Time",
    salary: "",
    skills: "",
    openings: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) {
      toast.error("Title, company, and description are required");
      return;
    }
    setLoading(true);
    try {
      await jobAPI.create({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        openings: parseInt(form.openings) || 1,
      });
      toast.success("Job posted successfully!");
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-[#f5f0eb] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
          <p className="text-sm text-muted mt-0.5">Fill in the details to create a job listing</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Job Title *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Company *</label>
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Google"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Job responsibilities, requirements..."
              rows={4}
              className="flex w-full rounded-xl border border-[#d6d0ca] bg-[#faf8f5] px-3 py-2 text-sm text-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/30 focus-visible:border-[#1e3a5f] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600">Location</label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Remote, Bangalore"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600">Job Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="flex w-full rounded-xl border border-[#d6d0ca] bg-[#faf8f5] px-3 py-2 text-sm text-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/30"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600">Salary</label>
              <Input
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g. ₹8-12 LPA"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600">Openings</label>
              <Input
                type="number"
                min="1"
                value={form.openings}
                onChange={(e) => setForm({ ...form, openings: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Skills (comma-separated)</label>
            <Input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </div>

          <Button type="submit" disabled={loading} className="gap-2 w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            Post Job
          </Button>
        </form>
      </Card>
    </div>
  );
}
