import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff,
  FileText, Star, ThumbsUp, ThumbsDown, Clock, Save,
  User, Loader2
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { interviewAPI } from "../../services/api";

export function InterviewPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(3);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const autoSaveTimer = useRef(null);
  const localVideoRef = useRef(null);

  // Load interview data
  useEffect(() => {
    interviewAPI.getById(id)
      .then((res) => {
        setInterview(res.data.data);
        setNotes(res.data.data.notes || "");
        setRating(res.data.data.rating || 3);
      })
      .catch(() => setInterview(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Interview timer
  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-save notes
  useEffect(() => {
    if (!interview) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaveStatus("Saving...");
      try {
        await interviewAPI.saveNotes(id, { notes, rating });
        setAutoSaveStatus("Saved");
        setTimeout(() => setAutoSaveStatus(""), 2000);
      } catch {
        setAutoSaveStatus("Failed to save");
      }
    }, 1500);
    return () => clearTimeout(autoSaveTimer.current);
  }, [notes, rating]);

  // Get local camera stream
  useEffect(() => {
    let stream = null;
    const getMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log("Camera not available:", err.message);
      }
    };
    if (videoOn) getMedia();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [videoOn]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h.toString().padStart(2, "0") + ":" : ""}${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleEndCall = async (result) => {
    setSaving(true);
    try {
      await interviewAPI.end(id, { result, notes, rating });
      navigate("/recruiter/dashboard");
    } catch (err) {
      alert("Failed to end interview");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const candidate = interview?.candidateId;

  return (
    <div className="h-full flex gap-4 pb-2">
      {/* Left Section: Video */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Candidate Info Bar */}
        <Card className="p-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-sm font-bold text-primary">
              {candidate?.name?.[0] || "?"}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{candidate?.name || "Candidate"}</h3>
              <p className="text-xs text-muted">{candidate?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {candidate?.skills?.slice(0, 3).map((s) => (
              <Badge key={s} variant="default" className="text-[10px]">{s}</Badge>
            ))}
            <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 font-mono text-sm font-medium">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(elapsed)}
            </div>
          </div>
        </Card>

        {/* Video Area */}
        <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-border relative flex flex-col">
          <div className="flex-1 grid grid-cols-2 gap-3 p-3">
            {/* Candidate Video */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-500 text-sm">Candidate Video Stream</p>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/10 text-white flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {candidate?.name || "Candidate"}
              </div>
            </div>

            {/* Recruiter (Local) Video */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden flex items-center justify-center">
              {videoOn ? (
                <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                    <VideoOff className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-slate-500 text-sm">Camera Off</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/10 text-white flex items-center gap-1.5">
                You (Recruiter)
                {!micOn && <MicOff className="w-3 h-3 text-red-400" />}
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="h-16 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-3 px-6 shrink-0">
            <Button
              variant={micOn ? "secondary" : "danger"}
              size="icon"
              className="rounded-full w-11 h-11 transition-transform hover:scale-105"
              onClick={() => setMicOn(!micOn)}
            >
              {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button
              variant={videoOn ? "secondary" : "danger"}
              size="icon"
              className="rounded-full w-11 h-11 transition-transform hover:scale-105"
              onClick={() => setVideoOn(!videoOn)}
            >
              {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full w-11 h-11 transition-transform hover:scale-105">
              <MonitorUp className="w-4 h-4" />
            </Button>
            <div className="w-px h-7 bg-slate-800 mx-1" />
            <Button
              variant="danger"
              size="icon"
              className="rounded-full w-11 h-11 hover:bg-red-600 transition-transform hover:scale-105"
              onClick={() => handleEndCall("pending")}
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section: Notes & Controls */}
      <Card className="w-[360px] flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Interview Notes</h3>
          </div>
          {autoSaveStatus && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              autoSaveStatus === "Saved" ? "bg-green-500/10 text-green-400" :
              autoSaveStatus === "Saving..." ? "bg-primary/10 text-primary" :
              "bg-red-500/10 text-red-400"
            }`}>
              {autoSaveStatus}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-background/30">
          {/* Notes Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Observations</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-3 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground placeholder:text-slate-600"
              placeholder="Technical skills assessment, communication notes, cultural fit observations..."
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Rating</label>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-all duration-150 hover:scale-110 ${
                      star <= rating ? "text-yellow-500" : "text-slate-600"
                    }`}
                  >
                    <Star className="w-6 h-6" fill={star <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground ml-auto">{rating}/5</span>
            </div>
          </div>

          {/* Rating Slider */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Quick Rating</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>Poor</span>
              <span>Average</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        {/* Decision Buttons */}
        <div className="p-4 border-t border-border space-y-3 bg-card/50">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
              onClick={() => handleEndCall("selected")}
              disabled={saving}
            >
              <ThumbsUp className="w-4 h-4" /> Hire
            </Button>
            <Button
              variant="danger"
              className="gap-2 shadow-lg shadow-red-500/20"
              onClick={() => handleEndCall("rejected")}
              disabled={saving}
            >
              <ThumbsDown className="w-4 h-4" /> Reject
            </Button>
          </div>
          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={async () => {
              setSaving(true);
              try {
                await interviewAPI.saveNotes(id, { notes, rating });
                setAutoSaveStatus("Saved");
              } catch { setAutoSaveStatus("Failed"); }
              setSaving(false);
            }}
            disabled={saving}
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Summary"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
