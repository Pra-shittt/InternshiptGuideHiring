import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff,
  User, Clock, Loader2, CheckCircle, Wifi
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
  const [loadError, setLoadError] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [connectionState, setConnectionState] = useState("idle"); // idle | connecting | waiting | connected
  const localVideoRef = useRef(null);

  // Load interview
  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    interviewAPI.getById(id)
      .then((res) => {
        setInterview(res.data.data);
      })
      .catch((err) => {
        setLoadError(err.response?.data?.message || "Failed to load interview");
        setInterview(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Timer
  useEffect(() => {
    if (connectionState !== "connected") return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [connectionState]);

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
    if (videoOn && connectionState === "connected") getMedia();
    return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [videoOn, connectionState]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleJoin = () => {
    setConnectionState("connecting");

    // Simulate connection sequence
    setTimeout(() => {
      setConnectionState("waiting");
      setTimeout(() => {
        setConnectionState("connected");
      }, 1500);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted text-sm">Loading interview...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-10 max-w-lg w-full text-center space-y-4">
          <div className="text-5xl">❌</div>
          <h2 className="text-xl font-bold text-foreground">Interview Not Found</h2>
          <p className="text-muted">{loadError}</p>
          <Button onClick={() => navigate("/candidate/dashboard")} variant="secondary" className="mt-4">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Pre-join screen
  if (connectionState === "idle") {
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
          <Button onClick={handleJoin} className="w-full py-6 text-lg gap-2 shadow-xl shadow-primary/30">
            <Video className="w-5 h-5" /> Join Interview
          </Button>
        </Card>
      </div>
    );
  }

  // Connecting screen
  if (connectionState === "connecting") {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-10 max-w-md w-full text-center space-y-6 shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Connecting...</h2>
          <p className="text-muted text-sm">Setting up your audio and video</p>
        </Card>
      </div>
    );
  }

  // Waiting for recruiter screen
  if (connectionState === "waiting") {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-10 max-w-md w-full text-center space-y-6 shadow-lg">
          <div className="mx-auto w-14 h-14 bg-amber-500/20 flex items-center justify-center rounded-2xl border border-amber-500/40">
            <Wifi className="w-7 h-7 text-amber-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Waiting for recruiter...</h2>
          <p className="text-muted text-sm">You'll be connected once the recruiter joins</p>
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
          </div>
        </Card>
      </div>
    );
  }

  // Connected — interview in progress
  const recruiter = interview?.recruiterId;

  return (
    <div className="h-full flex flex-col gap-4 pb-2">
      {/* Info Bar */}
      <Card className="p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Badge variant="success" className="gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Interview Started
          </Badge>
          <span className="text-sm font-medium text-foreground">
            Interview with {recruiter?.name || "Recruiter"}
            {recruiter?.company && <span className="text-muted"> · {recruiter.company}</span>}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#f5f0eb] px-3 py-1.5 rounded-lg text-sm font-mono font-medium text-muted border border-border">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(elapsed)}
        </div>
      </Card>

      {/* Video Area */}
      <div className="flex-1 bg-[#f5f0eb] rounded-xl overflow-hidden border border-border flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-3 p-3">
          {/* Recruiter Video */}
          <div className="bg-[#f5f0eb] rounded-lg border border-[#e2ddd8] relative overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[#e2ddd8] flex items-center justify-center mx-auto mb-3">
                <User className="w-12 h-12 text-slate-500" />
              </div>
              <p className="text-slate-500 font-medium">{recruiter?.name || "Recruiter"}</p>
              <p className="text-slate-500 text-sm">{recruiter?.company}</p>
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/10 text-white flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {recruiter?.name || "Interviewer"}
            </div>
          </div>

          {/* Local Video */}
          <div className="bg-[#f5f0eb] rounded-lg border border-[#e2ddd8] relative overflow-hidden flex items-center justify-center">
            {videoOn ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-[#e2ddd8] flex items-center justify-center mx-auto mb-3">
                  <VideoOff className="w-12 h-12 text-slate-500" />
                </div>
                <p className="text-slate-500 text-sm">Camera Off</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/10 text-white flex items-center gap-1.5">
              You (Candidate)
              {!micOn && <MicOff className="w-3 h-3 text-red-600" />}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="h-16 bg-slate-950 border-t border-[#e2ddd8] flex items-center justify-center gap-3 px-6 shrink-0">
          <Button variant={micOn ? "secondary" : "danger"} size="icon" className="rounded-full w-11 h-11 hover:scale-105 transition-transform" onClick={() => setMicOn(!micOn)}>
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>
          <Button variant={videoOn ? "secondary" : "danger"} size="icon" className="rounded-full w-11 h-11 hover:scale-105 transition-transform" onClick={() => setVideoOn(!videoOn)}>
            {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full w-11 h-11 hover:scale-105 transition-transform">
            <MonitorUp className="w-4 h-4" />
          </Button>
          <div className="w-px h-7 bg-[#f5f0eb] mx-1" />
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
