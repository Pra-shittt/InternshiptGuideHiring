import { useState } from "react";
import { Video, Square, Play } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function PracticeMode() {
  const [recording, setRecording] = useState(false);

  return (
    <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto pb-4">
      <div className="text-center space-y-2 shrink-0">
        <h1 className="text-2xl font-bold text-foreground">AI Mock Interview Practice</h1>
        <p className="text-slate-400">Behavioral & Technical Questions (Frontend Developer)</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 flex flex-col gap-6">
          <Card className="p-6 bg-card border-primary/20 shadow-lg relative overflow-hidden shrink-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Current Question</h3>
            <p className="text-xl font-medium text-foreground leading-relaxed">
              &quot;Tell me about a time you had to optimize the performance of a React application. What was your approach?&quot;
            </p>
          </Card>

          <Card className="flex-1 bg-slate-900 border-border relative overflow-hidden shadow-inner flex flex-col justify-end p-6 min-h-0">
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Video className="w-32 h-32 text-slate-500" />
             </div>
             
             { recording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full border border-red-500/30 text-sm font-medium backdrop-blur-sm z-10 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  Recording Answer
                </div>
             )}

             <div className="relative z-10 mx-auto flex gap-4 mt-auto">
                <Button variant={recording ? "danger" : "primary"} onClick={() => setRecording(!recording)} className="w-48 shadow-lg font-medium text-base">
                   {recording ? <><Square className="w-4 h-4 mr-2" /> Stop Recording</> : <><Play className="w-4 h-4 mr-2" /> Start Recording</>}
                </Button>
             </div>
          </Card>
        </div>

        <Card className="w-80 p-6 bg-card flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar shadow-sm">
           <h3 className="font-semibold text-foreground border-b border-border pb-3">Interview Progress</h3>
           
           <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-slate-700 before:to-transparent mt-4">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-primary bg-primary/20 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                     <span className="text-[10px] font-bold">1</span>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-primary/30 bg-primary/5 text-sm shadow-sm md:ml-4">Behavioral: Challenge</div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mt-6">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                     <span className="text-[10px] font-bold">2</span>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-800 bg-slate-900 text-slate-500 text-sm md:mr-4">Technical: Architecture</div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mt-6">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                     <span className="text-[10px] font-bold">3</span>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-800 bg-slate-900 text-slate-500 text-sm md:ml-4">Technical: Algorithms</div>
              </div>
           </div>
           
           <div className="mt-auto pt-6 border-t border-border">
              <Button variant="secondary" className="w-full">End Practice Session</Button>
           </div>
        </Card>
      </div>
    </div>
  );
}
