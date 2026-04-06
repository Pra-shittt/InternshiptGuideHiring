import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LayoutDashboard, Users, Briefcase, Video, LogOut,
  CheckCircle, Clock, FileText, User, Calendar, PlusCircle,
  Target, Building2
} from "lucide-react";
import { cn } from "../utils/cn";
import logoImg from "../assets/logo.png";

const candidateLinks = [
  { name: 'Dashboard', to: '/candidate/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', to: '/candidate/jobs', icon: Briefcase },
  { name: 'My Applications', to: '/candidate/applications', icon: FileText },
  { name: 'Practice', to: '/candidate/practice', icon: Target },
  { name: 'Company Prep', to: '/candidate/companies', icon: Building2 },
  { name: 'Mock Tests', to: '/candidate/test', icon: CheckCircle },
  { name: 'Live Interviews', to: '/candidate/interviews', icon: Video },
  { name: 'History', to: '/candidate/results', icon: Clock },
  { name: 'Profile', to: '/candidate/profile', icon: User },
];

const recruiterLinks = [
  { name: 'Dashboard', to: '/recruiter/dashboard', icon: LayoutDashboard },
  { name: 'Post Job', to: '/recruiter/post-job', icon: PlusCircle },
  { name: 'My Jobs', to: '/recruiter/jobs', icon: Briefcase },
  { name: 'Candidates', to: '/recruiter/candidates', icon: Users },
  { name: 'Interviews', to: '/recruiter/schedule', icon: Calendar },
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

  const dashboardPath = role === 'CANDIDATE' ? '/candidate/dashboard'
    : role === 'RECRUITER' ? '/recruiter/dashboard'
    : role === 'ADMIN' ? '/admin/dashboard'
    : '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-[#0f172a] h-screen flex flex-col shrink-0">
      {/* Logo */}
      <Link to={dashboardPath} className="block p-6 border-b border-white/10 group">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Learn2Hire" className="w-9 h-9 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform" />
          <h1 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
            Learn2Hire
          </h1>
        </div>
      </Link>

      {/* Role Badge */}
      <div className="px-4 pt-4 pb-2">
        <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-center">
          <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-widest">{role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
              isActive
                ? "bg-[#1e3a5f] text-white shadow-md shadow-blue-900/30"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <link.icon className="w-[18px] h-[18px] shrink-0" />
            <span className="truncate">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );
}
