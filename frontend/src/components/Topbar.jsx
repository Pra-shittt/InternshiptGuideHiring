import { useAuthStore } from "../store/useAuthStore";
import { User, Bell } from "lucide-react";

export function Topbar() {
  const { user, role } = useAuthStore();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      <div></div>
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </button>
        <div className="flex items-center gap-3 border-l border-border pl-6">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-slate-400 capitalize">{role.toLowerCase()}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
