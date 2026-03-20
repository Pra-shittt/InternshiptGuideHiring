import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff,
  User, Clock, Loader2, CheckCircle
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { interviewAPI } from "../../services/api";

export function VideoInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [joined, setJoined] = useState(false);
  const localVideoRef = useRef(null);

  useEffect(() => {
    interviewAPI.getById(id)
      .then((res) => setInterview(res.data.data))
      .catch(() => setInterview(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Timer
  useEffect(() => {
    if (!joined) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [joined]);

  // Camera
  useEffect(() => {
    let stream = null;
    const getMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch (err) {
        console.log("Camera unavailable:", err.message);
      }
    };
    if (videoOn && joined) getMedia();
    return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [videoOn, joined]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Waiting screen before joining
  if (!joined) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-10 max-w-lg w-full text-center space-y-6 shadow-lg">
          <div className="mx-auto w-16 h-16 bg-primary/20 flex items-center justify-center rounded-2xl border border-primary/50">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Interview Room</h1>
          <div className="space-y-2">
            <p className="text-muted">You are about to join an interview with</p>
            <p className="text-lg font-semibold text-foreground">
              {interview?.recruiterId?.name || "Recruiter"}
            </p>
            {interview?.recruiterId?.company && (
              <Badge variant="primary">{interview.recruiterId.company}</Badge>
            )}
          </div>
          <div className="p-4 rounded-lg bg-background border border-border text-sm text-muted">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span>Scheduled: {new Date(interview?.scheduledAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Your camera and microphone will be used</span>
            </div>
          </div>
          <Button onClick={() => setJoined(true)} className="w-full py-6 text-lg gap-2 shadow-xl shadow-primary/30">
            <Video className="w-5 h-5" /> Join Interview
          </Button>
        </Card>
      </div>
    );
  }

  const recruiter = interview?.recruiterId;

  return (
    <div className="h-full flex flex-col gap-4 pb-2">
      {/* Info Bar */}
      <Card className="p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Badge variant="success" className="gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
          </Badge>
          <span className="text-sm font-medium text-foreground">
            Interview with {recruiter?.name || "Recruiter"}
            {recruiter?.company && <span className="text-muted"> · {recruiter.company}</span>}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-mono font-medium text-muted border border-border">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(elapsed)}
        </div>
      </Card>

      {/* Video Area */}
      <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-border flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-3 p-3">
          {/* Recruiter Video */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                <User className="w-12 h-12 text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">{recruiter?.name || "Recruiter"}</p>
              <p className="text-slate-600 text-sm">{recruiter?.company}</p>
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/10 text-white flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {recruiter?.name || "Interviewer"}
            </div>
          </div>

          {/* Local Video */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden flex items-center justify-center">
            {videoOn ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                  <VideoOff className="w-12 h-12 text-slate-500" />
                </div>
                <p className="text-slate-500 text-sm">Camera Off</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/10 text-white flex items-center gap-1.5">
              You (Candidate)
              {!micOn && <MicOff className="w-3 h-3 text-red-400" />}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="h-16 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-3 px-6 shrink-0">
          <Button variant={micOn ? "secondary" : "danger"} size="icon" className="rounded-full w-11 h-11 hover:scale-105 transition-transform" onClick={() => setMicOn(!micOn)}>
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>
          <Button variant={videoOn ? "secondary" : "danger"} size="icon" className="rounded-full w-11 h-11 hover:scale-105 transition-transform" onClick={() => setVideoOn(!videoOn)}>
            {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full w-11 h-11 hover:scale-105 transition-transform">
            <MonitorUp className="w-4 h-4" />
          </Button>
          <div className="w-px h-7 bg-slate-800 mx-1" />
          <Button variant="danger" size="icon" className="rounded-full w-11 h-11 hover:bg-red-600 hover:scale-105 transition-transform"
            onClick={() => navigate("/candidate/dashboard")}
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
