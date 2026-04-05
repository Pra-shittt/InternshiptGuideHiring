import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LayoutDashboard, Users, UserPlus, Briefcase, Video, LogOut,
  CheckCircle, Trophy, BarChart3, Code
} from "lucide-react";
import { cn } from "../utils/cn";
import logoImg from "../assets/logo.png";

const candidateLinks = [
  { name: 'Dashboard', to: '/candidate/dashboard', icon: LayoutDashboard },
  { name: 'Practice', to: '/candidate/practice', icon: Code },
  { name: 'Company Prep', to: '/candidate/companies', icon: Briefcase },
  { name: 'Mock Test', to: '/candidate/test', icon: CheckCircle },
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
  { name: 'Manage Content', to: '/admin/content', icon: Code },
];

export function Sidebar() {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();

  let links = [];
  if (role === 'CANDIDATE') links = candidateLinks;
  else if (role === 'RECRUITER') links = recruiterLinks;
  else if (role === 'ADMIN') links = adminLinks;

  const dashboardPath = role === 'CANDIDATE' ? '/candidate/dashboard'
    : role === 'RECRUITER' ? '/recruiter/dashboard'
    : role === 'ADMIN' ? '/admin/dashboard'
    : '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-card/80 backdrop-blur-xl border-r border-border h-screen flex flex-col shrink-0">
      {/* Logo — clickable, navigates to dashboard */}
      <Link to={dashboardPath} className="block p-6 border-b border-border group">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Learn2Hire" className="w-9 h-9 rounded-lg object-cover shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow" />
          <h1 className="text-xl font-bold text-primary group-hover:opacity-80 transition-opacity">
            Learn2Hire
          </h1>
        </div>
      </Link>

      {/* Role Badge */}
      <div className="px-4 pt-4 pb-2">
        <div className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-center">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">{role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group",
              isActive
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-foreground border border-transparent"
            )}
          >
            <link.icon className="w-[18px] h-[18px] shrink-0" />
            <span className="truncate">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );
}
