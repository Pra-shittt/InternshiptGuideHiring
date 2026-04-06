import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { User, Bell, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { notificationAPI } from "../services/api";

export function Topbar() {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdmin = role === "ADMIN";
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch notifications from API (not hardcoded)
  useEffect(() => {
    if (isAdmin) return;
    notificationAPI
      .getAll(false)
      .then((res) => {
        const data = res.data.data;
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const markOneRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id || n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-[#e2ddd8] flex items-center justify-between px-6 shrink-0 relative z-40">
      <div />

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        {!isAdmin && (
          <div className="relative" ref={notifRef}>
            <button
              id="notification-bell"
              onClick={() => { setShowNotifications((v) => !v); setShowUserMenu(false); }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-[#1e3a5f] hover:bg-[#f5f0eb] transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e3a5f] opacity-75" />
                  <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-[#1e3a5f] text-[9px] font-bold text-white">
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
                  className="absolute right-0 top-12 w-80 rounded-xl border border-[#e2ddd8] bg-white shadow-xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between p-4 border-b border-[#e2ddd8]">
                    <h3 className="text-sm font-semibold text-[#1e293b]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-[#1e3a5f] hover:text-[#2563eb] font-medium transition-colors">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-[#e2ddd8]">
                    {notifications.length === 0 && (
                      <div className="px-4 py-8 text-center text-slate-500 text-sm">No notifications</div>
                    )}
                    {notifications.map((n) => {
                      const nId = n._id || n.id;
                      return (
                        <div
                          key={nId}
                          className={`px-4 py-3 hover:bg-[#f5f0eb] transition-colors cursor-pointer ${!n.isRead ? "bg-[#1e3a5f]/5" : ""}`}
                          onClick={() => !n.isRead && markOneRead(nId)}
                        >
                          <div className="flex items-start gap-3">
                            {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#1e3a5f] mt-1.5 shrink-0" />}
                            <div className={!n.isRead ? "" : "ml-5"}>
                              <p className="text-sm font-medium text-[#1e293b]">{n.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                }) : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Divider */}
        <div className="h-8 w-px bg-[#e2ddd8]" />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="user-menu-button"
            onClick={() => { setShowUserMenu((v) => !v); setShowNotifications(false); }}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#f5f0eb] transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#1e293b]">{user?.name || "Guest User"}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role.toLowerCase()}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] flex items-center justify-center text-white">
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
                className="absolute right-0 top-12 w-56 rounded-xl border border-[#e2ddd8] bg-white shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-[#e2ddd8]">
                  <p className="text-sm font-medium text-[#1e293b]">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
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
