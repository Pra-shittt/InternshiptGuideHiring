import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { User, Bell, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Role-specific notifications
const candidateNotifications = [
  { id: 1, title: "Interview scheduled", desc: "Your interview has been confirmed", time: "1h ago", unread: true },
  { id: 2, title: "Score updated", desc: "Your mock test score has been recorded", time: "3h ago", unread: true },
  { id: 3, title: "Practice reminder", desc: "You haven't practiced in 2 days", time: "1d ago", unread: false },
];

const recruiterNotifications = [
  { id: 1, title: "New candidate available", desc: "A new candidate has been assigned", time: "30m ago", unread: true },
  { id: 2, title: "Interview reminder", desc: "You have an interview scheduled today", time: "2h ago", unread: true },
  { id: 3, title: "Interview completed", desc: "Candidate feedback pending", time: "1d ago", unread: false },
];

export function Topbar() {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Role-based notifications — Admin gets none
  const isAdmin = role === "ADMIN";
  const initialNotifs = role === "CANDIDATE" ? candidateNotifications : role === "RECRUITER" ? recruiterNotifications : [];
  const [notifications, setNotifications] = useState(initialNotifs);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 shrink-0 relative z-40">
      {/* Left side — empty now that search is removed */}
      <div />

      <div className="flex items-center gap-4">
        {/* Notification Bell — hidden for Admin */}
        {!isAdmin && (
          <div className="relative" ref={notifRef}>
            <button
              id="notification-bell"
              onClick={() => { setShowNotifications((v) => !v); setShowUserMenu(false); }}
              className="relative p-2 rounded-lg text-slate-400 hover:text-foreground hover:bg-slate-800/60 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-primary text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-border">
                    {notifications.length === 0 && (
                      <div className="px-4 py-8 text-center text-muted text-sm">No notifications</div>
                    )}
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-slate-800/40 transition-colors cursor-pointer ${n.unread ? "bg-primary/5" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          {n.unread && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                          <div className={n.unread ? "" : "ml-5"}>
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            <p className="text-xs text-muted mt-0.5">{n.desc}</p>
                            <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Divider */}
        <div className="h-8 w-px bg-border" />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="user-menu-button"
            onClick={() => { setShowUserMenu((v) => !v); setShowNotifications(false); }}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name || "Guest User"}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role.toLowerCase()}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-primary border border-primary/20">
              <User className="w-4 h-4" />
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden z-50"
              >
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
