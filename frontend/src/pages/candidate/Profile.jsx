import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { User, Mail, Phone, FileText, Loader2, Save } from "lucide-react";
import { userAPI, resumeAPI } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

export function Profile() {
  const { user: authUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", bio: "", skills: "" });

  useEffect(() => {
    userAPI
      .getProfile()
      .then((res) => {
        const u = res.data.data;
        setProfile(u);
        setForm({
          name: u.name || "",
          phone: u.phone || "",
          bio: u.bio || "",
          skills: (u.skills || []).join(", "),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name: form.name,
        phone: form.phone,
        bio: form.bio,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await userAPI.updateProfile(data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await resumeAPI.upload(formData);
      toast.success("Resume uploaded!");
    } catch {
      toast.error("Upload failed");
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your personal information</p>
      </div>

      {/* Info Card */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-[#e2ddd8]">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] flex items-center justify-center text-white text-xl font-bold">
            {(profile?.name || "U")[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{profile?.name}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {profile?.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Full Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Phone</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Your phone number"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              className="flex w-full rounded-xl border border-[#d6d0ca] bg-[#faf8f5] px-3 py-2 text-sm text-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/30 focus-visible:border-[#1e3a5f] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Skills (comma-separated)</label>
            <Input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="e.g. Java, React, MongoDB"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Resume</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e2ddd8] text-sm font-medium text-slate-600 hover:bg-[#f5f0eb] transition-colors">
                  <FileText className="w-4 h-4" /> Upload Resume
                </span>
              </label>
              {profile?.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  View current
                </a>
              )}
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2 mt-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </Card>
    </div>
  );
}
