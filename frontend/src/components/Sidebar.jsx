import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LayoutDashboard, Users, UserPlus, Briefcase, Video, LogOut,
  FileText, CheckCircle, Trophy, BarChart3, Code, Zap
} from "lucide-react";
import { cn } from "../utils/cn";

const candidateLinks = [
  { name: 'Dashboard', to: '/candidate/dashboard', icon: LayoutDashboard },
  { name: 'Practice', to: '/candidate/practice', icon: Code },
  { name: 'Company Prep', to: '/candidate/companies', icon: Briefcase },
  { name: 'Mock Test', to: '/candidate/test', icon: CheckCircle },
  { name: 'Assessment', to: '/candidate/assessment', icon: FileText },
  { name: 'My Results', to: '/candidate/results', icon: CheckCircle },
  { name: 'Performance', to: '/candidate/performance', icon: BarChart3 },
  { name: 'Leaderboard', to: '/candidate/leaderboard', icon: Trophy },
];

const recruiterLinks = [
  { name: 'Dashboard', to: '/recruiter/dashboard', icon: LayoutDashboard },
  { name: 'Candidates', to: '/recruiter/candidates', icon: Users },
  { name: 'Schedule Interview', to: '/recruiter/schedule', icon: UserPlus },
];

const adminLinks = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Manage Users', to: '/admin/users', icon: Users },
  { name: 'Manage Content', to: '/admin/content', icon: FileText },
];

export function Sidebar() {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();

  let links = [];
  if (role === 'CANDIDATE') links = candidateLinks;
  else if (role === 'RECRUITER') links = recruiterLinks;
  else if (role === 'ADMIN') links = adminLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gradient">
            HireFlow
          </h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
              isActive
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-foreground"
            )}
          >
            <link.icon className="w-5 h-5" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
