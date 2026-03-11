import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, ShoppingCart, FileText, Upload, Home, ClipboardList, X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const typeIcons = {
  new_order: ShoppingCart,
  order_status_update: ShoppingCart,
  new_prescription: Upload,
  prescription_status_update: FileText,
  new_booking: Home,
  booking_status_update: Home,
  report_uploaded: FileText,
  admin_report_uploaded: FileText,
};

const typeColors = {
  new_order: "text-blue-500 bg-blue-50",
  order_status_update: "text-emerald-500 bg-emerald-50",
  new_prescription: "text-purple-500 bg-purple-50",
  prescription_status_update: "text-purple-500 bg-purple-50",
  new_booking: "text-teal-500 bg-teal-50",
  booking_status_update: "text-teal-500 bg-teal-50",
  report_uploaded: "text-amber-500 bg-amber-50",
  admin_report_uploaded: "text-amber-500 bg-amber-50",
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function NotificationBell({ role = "user", token }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const endpoint = role === "admin" ? "admin" : "user";
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Poll unread count every 30s
  useEffect(() => {
    if (!token) return;
    const fetchCount = () => {
      fetch(`${API_BASE}/notifications/${endpoint}/unread-count`, { headers: authHeaders })
        .then((r) => r.json())
        .then((d) => setUnreadCount(d.count || 0))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [token, endpoint]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications/${endpoint}`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (_) {}
    setLoading(false);
  };

  const toggleOpen = () => {
    if (!open) fetchNotifications();
    setOpen(!open);
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        headers: authHeaders,
      });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (_) {}
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read/${endpoint}`, {
        method: "PATCH",
        headers: authHeaders,
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
            <h3 className="font-bold text-foreground text-sm">{t.notifications}</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> {t.markAllRead}
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground text-sm">{t.loading}</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm font-medium">{t.noNotifications}</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcons[n.type] || Bell;
                const color = typeColors[n.type] || "text-gray-500 bg-gray-50";
                return (
                  <div
                    key={n._id}
                    onClick={() => !n.read && markAsRead(n._id)}
                    className={`flex gap-3 px-4 py-3 border-b border-border/50 cursor-pointer transition-colors ${
                      n.read ? "bg-transparent opacity-70" : "bg-primary/5 hover:bg-primary/10"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 bg-primary rounded-full shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
