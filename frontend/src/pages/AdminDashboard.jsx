import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users, DollarSign, Clock, LogOut, RefreshCw,
  CheckCircle2, XCircle, ChevronDown, Search,
  Phone, Mail, Calendar, User as UserIcon, FlaskConical, Microscope,
  Activity, TestTubes, HeartPulse, Droplets, Upload, FileImage, Eye,
  FileUp, Trash2, ClipboardCopy, Hash, Home, MapPin, Plus
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { useLang } from "@/context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const statusColors = {
  placed: "bg-amber-100 text-amber-800 border border-amber-200",
  confirmed: "bg-sky-100 text-sky-800 border border-sky-200",
  sample_collected: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  processing: "bg-violet-100 text-violet-800 border border-violet-200",
  completed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border border-rose-200",
};

const paymentColors = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  paid: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  failed: "bg-rose-100 text-rose-800 border border-rose-200",
};

// SVG background pattern for lab theme
const LabPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="labgrid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 5 L30 15 M25 15 L35 15 L32 25 Q30 30 28 25 Z" stroke="currentColor" fill="none" strokeWidth="1" />
        <circle cx="10" cy="45" r="6" stroke="currentColor" fill="none" strokeWidth="1" />
        <circle cx="10" cy="45" r="2" fill="currentColor" opacity="0.3" />
        <path d="M48 38 L48 48 L52 48 L52 38" stroke="currentColor" fill="none" strokeWidth="1" />
        <path d="M46 48 L54 48" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#labgrid)" />
  </svg>
);

const AdminDashboard = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [updatingRx, setUpdatingRx] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [uploadingReport, setUploadingReport] = useState(null);
  const [adminReports, setAdminReports] = useState([]);
  const [reportForm, setReportForm] = useState({ uniqueId: "", patientName: "", patientPhone: "", testName: "", notes: "" });
  const [reportFile, setReportFile] = useState(null);
  const [uploadingAdminReport, setUploadingAdminReport] = useState(false);
  const [deletingReport, setDeletingReport] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  
  // Tests Management
  const [testsList, setTestsList] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [newTest, setNewTest] = useState({
    name: "", price: "", parameters: "", reportTime: "", prerequisites: "", category: "", sampleReportUrl: ""
  });

  const token = localStorage.getItem("auth_token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    "Content-Type": "application/json",
  });

  const fetchData = useCallback(async () => {
    if (!token) { navigate("/login"); return; }

    try {
      const [meRes, statsRes, ordersRes, rxRes] = await Promise.all([
        fetch(`${API_BASE}/admin/me`, { headers }),
        fetch(`${API_BASE}/admin/stats`, { headers }),
        fetch(`${API_BASE}/admin/orders`, { headers }),
        fetch(`${API_BASE}/admin/prescriptions`, { headers }),
      ]);

      if (!meRes.ok) { navigate("/login"); return; }

      const meData = await meRes.json();
      const statsData = statsRes.ok ? await statsRes.json() : {};
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];
      const rxData = rxRes.ok ? await rxRes.json() : [];

      setAdmin(meData.admin);
      setStats(statsData);
      setOrders(ordersData);
      setPrescriptions(rxData);

      // Fetch reports and bookings separately so they don't block the dashboard
      try {
        const reportsRes = await fetch(`${API_BASE}/reports/admin/all`, { headers });
        if (reportsRes.ok) setAdminReports(await reportsRes.json());
      } catch { /* reports tab will just be empty */ }
      try {
        const bookingsRes = await fetch(`${API_BASE}/bookings`, { headers });
        if (bookingsRes.ok) setBookings(await bookingsRes.json());
      } catch { /* bookings tab will just be empty */ }
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (activeTab === "manage-tests" && testsList.length === 0) {
      fetchTestsList();
    }
  }, [activeTab, testsList.length]);

  const fetchTestsList = async () => {
    setLoadingTests(true);
    try {
      const res = await fetch(`${API_BASE}/tests`);
      if (res.ok) {
        setTestsList(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleAddTest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTest,
          price: Number(newTest.price),
          parameters: Number(newTest.parameters)
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setTestsList([...testsList, created]);
        setIsAddingTest(false);
        setNewTest({ name: "", price: "", parameters: "", reportTime: "", prerequisites: "", category: "", sampleReportUrl: "" });
        alert("Test added successfully!");
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to add test");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while adding test");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  const updateOrderStatus = async (orderId, field, value) => {
    setUpdatingOrder(orderId);
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const updatePrescriptionStatus = async (rxId, status) => {
    setUpdatingRx(rxId);
    try {
      const res = await fetch(`${API_BASE}/admin/prescriptions/${rxId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPrescriptions((prev) => prev.map((p) => (p._id === rxId ? updated : p)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingRx(null);
    }
  };

  const handleReportUpload = (orderId, itemIndex) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) { alert("File too large. Max 15 MB."); return; }

      const key = `${orderId}-${itemIndex}`;
      setUploadingReport(key);

      const reader = new FileReader();
      reader.onerror = () => {
        alert("Failed to read file. Please try again.");
        setUploadingReport(null);
      };
      reader.onload = async () => {
        try {
          const res = await fetch(`${API_BASE}/admin/orders/${orderId}/items/${itemIndex}/report`, {
            method: "PATCH",
            headers: authHeaders(),
            body: JSON.stringify({ reportFile: reader.result, reportFileName: file.name }),
          });
          if (res.ok) {
            const updated = await res.json();
            setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
            alert("Report uploaded successfully!");
          } else {
            const errData = await res.json().catch(() => ({}));
            alert(errData.error || `Upload failed (${res.status}). Please try a smaller file.`);
          }
        } catch (err) {
          console.error("Upload report error:", err);
          alert("Network error. Please check your connection and try again.");
        } finally {
          setUploadingReport(null);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleReportDelete = async (orderId, itemIndex) => {
    if (!confirm("Remove this report?")) return;
    const key = `${orderId}-${itemIndex}`;
    setUploadingReport(key);
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/items/${itemIndex}/report`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
        alert("Report removed.");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to remove report.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setUploadingReport(null);
    }
  };

  const handleAdminReportUpload = async (e) => {
    e.preventDefault();
    if (!reportFile) { alert("Please select a report file."); return; }
    if (!reportForm.uniqueId.trim()) { alert("Please enter a Unique ID."); return; }
    if (!reportForm.patientName.trim()) { alert("Please enter the patient name."); return; }

    setUploadingAdminReport(true);
    const reader = new FileReader();
    reader.onerror = () => { alert("Failed to read file."); setUploadingAdminReport(false); };
    reader.onload = async () => {
      try {
        const res = await fetch(`${API_BASE}/reports/admin/upload`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            ...reportForm,
            reportFile: reader.result,
            reportFileName: reportFile.name,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setAdminReports((prev) => [data, ...prev]);
          setReportForm({ uniqueId: "", patientName: "", patientPhone: "", testName: "", notes: "" });
          setReportFile(null);
          alert("Report uploaded successfully! Unique ID: " + data.uniqueId);
        } else {
          alert(data.error || "Failed to upload report.");
        }
      } catch (err) {
        console.error(err);
        alert("Network error. Please try again.");
      } finally {
        setUploadingAdminReport(false);
      }
    };
    reader.readAsDataURL(reportFile);
  };

  const handleAdminReportDelete = async (reportId) => {
    if (!confirm("Delete this report permanently?")) return;
    setDeletingReport(reportId);
    try {
      const res = await fetch(`${API_BASE}/reports/admin/${reportId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setAdminReports((prev) => prev.filter((r) => r._id !== reportId));
        alert("Report deleted.");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete report.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setDeletingReport(null);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    setUpdatingBooking(bookingId);
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b._id === bookingId ? updated : b)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingBooking(null);
    }
  };

  const deleteUserAndOrders = async (userId, userName = "this user") => {
    if (!userId) return;
    const ok = window.confirm(`Delete ${userName} and all of their orders? This cannot be undone.`);
    if (!ok) return;

    setDeletingUser(userId);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to delete user.");
        return;
      }

      const deletedCount = Number(data.deletedOrdersCount || 0);
      const deletedRevenue = Number(data.deletedPaidRevenue || 0);

      setOrders((prev) => prev.filter((o) => (o.user?._id || o.user) !== userId));
      setSearchResults((prev) => prev.filter((u) => u.id !== userId));
      setExpandedUser((prev) => (prev === userId ? null : prev));
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          totalUsers: Math.max(0, (prev.totalUsers || 0) - 1),
          totalOrders: Math.max(0, (prev.totalOrders || 0) - deletedCount),
          totalRevenue: Math.max(0, (prev.totalRevenue || 0) - deletedRevenue),
          recentOrders: (prev.recentOrders || []).filter((o) => (o.user?._id || o.user) !== userId),
        };
      });

      alert(`User deleted. Removed ${deletedCount} order(s).`);
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setDeletingUser(null);
    }
  };

  const [deletingBooking, setDeletingBooking] = useState(null);

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setDeletingBooking(bookingId);
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingBooking(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert("Unique ID copied: " + text)).catch(() => {});
  };

  const handleUserSearch = async (e) => {
    e?.preventDefault();
    if (!searchPhone.trim()) return;
    setSearching(true);
    setSearchDone(false);
    setShowSuggestions(false);
    try {
      const res = await fetch(
        `${API_BASE}/admin/users/search?phone=${encodeURIComponent(searchPhone.trim())}`,
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
      setSearchDone(true);
    }
  };

  // Live suggestions as admin types
  useEffect(() => {
    if (activeTab !== "search" || searchPhone.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/admin/users/suggest?phone=${encodeURIComponent(searchPhone.trim())}`,
          { headers }
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchPhone, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <FlaskConical className="w-8 h-8 text-white" />
          </div>
          <RefreshCw className="w-6 h-6 text-teal-500 animate-spin mx-auto" />
          <p className="text-sm text-teal-600 mt-2 font-medium">{t.loadingLabDashboard}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/80 via-cyan-50/60 to-emerald-50/80 relative">
      <LabPattern />

      {/* Top Nav */}
      <header className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">{t.labAdminPanel}</h1>
              <p className="text-[10px] text-teal-200 font-medium tracking-wide uppercase">{t.allianceDiagnostics}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
              <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{admin?.name?.charAt(0) || "A"}</span>
              </div>
              <span className="text-sm text-white font-medium">{admin?.name}</span>
            </div>
            <div className="[&_button]:text-white [&_button:hover]:bg-white/15">
              <NotificationBell role="admin" token={localStorage.getItem("auth_token")} />
            </div>
            <Button
              size="sm"
              onClick={handleLogout}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 mr-1" />
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-200"
                : "bg-white/80 backdrop-blur-sm text-teal-700 hover:bg-white border border-teal-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> {t.dashboard}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-200"
                : "bg-white/80 backdrop-blur-sm text-teal-700 hover:bg-white border border-teal-100"
            }`}
          >
            <TestTubes className="w-3.5 h-3.5" /> {t.allOrders} ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "search"
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-200"
                : "bg-white/80 backdrop-blur-sm text-teal-700 hover:bg-white border border-teal-100"
            }`}
          >
            <Search className="w-3.5 h-3.5" /> {t.searchUsers}
          </button>
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "prescriptions"
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-200"
                : "bg-white/80 backdrop-blur-sm text-teal-700 hover:bg-white border border-teal-100"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> {t.prescriptions} ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "reports"
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-200"
                : "bg-white/80 backdrop-blur-sm text-teal-700 hover:bg-white border border-teal-100"
            }`}
          >
            <FileUp className="w-3.5 h-3.5" /> {t.uploadReports} ({adminReports.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "bookings"
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-200"
                : "bg-white/80 backdrop-blur-sm text-teal-700 hover:bg-white border border-teal-100"
            }`}
          >
            <Home className="w-3.5 h-3.5" /> {t.homeBookings} ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("manage-tests")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "manage-tests"
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-200"
                : "bg-white/80 backdrop-blur-sm text-teal-700 hover:bg-white border border-teal-100"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" /> Manage Tests
          </button>
          <button
            onClick={fetchData}
            className="ml-auto px-3 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm text-teal-600 hover:bg-white border border-teal-100 text-sm transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {activeTab === "dashboard" && stats && (
          <>
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 p-5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <TestTubes className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-teal-600 font-medium">{t.totalOrders}</span>
                </div>
                <p className="text-3xl font-bold text-slate-800">{stats.totalOrders || 0}</p>
                <p className="text-xs text-teal-500 mt-1">{t.labTestBookings}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-emerald-600 font-medium">{t.revenuePaid}</span>
                </div>
                <p className="text-3xl font-bold text-slate-800">₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}</p>
                <p className="text-xs text-emerald-500 mt-1">{t.totalCollections}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-cyan-100 p-5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-cyan-600 font-medium">{t.totalPatients}</span>
                </div>
                <p className="text-3xl font-bold text-slate-800">{stats.totalUsers || 0}</p>
                <p className="text-xs text-cyan-500 mt-1">{t.registeredUsers}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 p-5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-amber-600 font-medium">{t.pendingSamples}</span>
                </div>
                <p className="text-3xl font-bold text-slate-800">{stats.pendingOrders || 0}</p>
                <p className="text-xs text-amber-500 mt-1">{t.awaitingCollection}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-sm">
              <div className="p-5 border-b border-teal-50 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-teal-500" />
                <h2 className="font-bold text-lg text-slate-800">{t.recentLabOrders}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-600">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.orderId}</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.patient}</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.amount}</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.payment}</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.status}</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.date}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-50">
                    {(stats.recentOrders || []).map((order) => (
                      <tr key={order._id} className="hover:bg-teal-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs bg-teal-50/30 rounded-l">{order._id.slice(-8)}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">{order.user?.name || "N/A"}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800">₹{order.totalPrice?.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus] || ""}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || ""}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                  <div className="text-center py-12">
                    <FlaskConical className="w-10 h-10 text-teal-200 mx-auto mb-2" />
                    <p className="text-teal-400 font-medium">{t.noLabOrders}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-sm">
            <div className="p-5 border-b border-teal-50 flex items-center gap-2">
              <TestTubes className="w-5 h-5 text-teal-500" />
              <h2 className="font-bold text-lg text-slate-800">{t.allLabOrders}</h2>
            </div>
            <div className="divide-y divide-teal-50">
              {orders.length === 0 && (
                <div className="text-center py-16">
                  <FlaskConical className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                  <p className="text-teal-400 font-medium">{t.noLabOrdersFound}</p>
                </div>
              )}
              {orders.map((order) => (
                <div key={order._id} className="p-5 hover:bg-teal-50/30 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg border border-teal-100">{order._id.slice(-8)}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                          {order.orderStatus.replace("_", " ")}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-xs text-teal-400 ml-auto">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-teal-500">{t.patient}:</span>{" "}
                          <span className="font-medium text-slate-700">{order.user?.name || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-teal-500">{t.email}:</span>{" "}
                          <span className="font-medium text-slate-700">{order.user?.email || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-teal-500">{t.phone}:</span>{" "}
                          <span className="font-medium text-slate-700">{order.phone}</span>
                        </div>
                        <div>
                          <span className="text-teal-500">{t.payment}:</span>{" "}
                          <span className="font-medium uppercase text-slate-700">{order.paymentMethod}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-teal-500">{t.address}:</span>{" "}
                          <span className="font-medium text-slate-700">{order.address}</span>
                        </div>
                      </div>

                      {/* Items with Report Upload */}
                      <div className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl p-3.5 mb-3 border border-teal-100/50">
                        <p className="text-xs text-teal-600 mb-2 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Microscope className="w-3 h-3" /> {t.testItemsReports}
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between gap-2 text-sm bg-white/60 rounded-lg px-3 py-2 border border-teal-100/50">
                              <div className="flex-1 min-w-0">
                                <span className="text-slate-700 font-medium">{item.name}</span>
                                <span className="text-teal-400 ml-1">x {item.quantity}</span>
                                <span className="text-slate-600 ml-2">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {item.reportFile ? (
                                  <>
                                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> {t.reportUploaded}
                                    </span>
                                    <button
                                      onClick={() => handleReportDelete(order._id, i)}
                                      disabled={uploadingReport === `${order._id}-${i}`}
                                      className="text-[10px] text-rose-500 hover:text-rose-700 px-1.5 py-0.5 rounded transition-colors"
                                      title="Remove report"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleReportUpload(order._id, i)}
                                    disabled={uploadingReport === `${order._id}-${i}`}
                                    className="text-[10px] font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 flex items-center gap-1 transition-colors"
                                  >
                                    {uploadingReport === `${order._id}-${i}` ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Upload className="w-3 h-3" />
                                    )}
                                    {t.uploadReport}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-teal-200/50 mt-2 pt-2 flex justify-between font-bold text-sm">
                          <span className="text-teal-700">{t.total}</span>
                          <span className="text-teal-800">₹{order.totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[200px] bg-teal-50/50 rounded-xl p-3 border border-teal-100/50">
                      <label className="text-xs text-teal-600 font-semibold uppercase tracking-wider">{t.orderStatusLabel}</label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, "orderStatus", e.target.value)}
                        disabled={updatingOrder === order._id}
                        className="px-3 py-2 rounded-lg border border-teal-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700"
                      >
                        <option value="placed">{t.placed}</option>
                        <option value="confirmed">{t.confirmed}</option>
                        <option value="sample_collected">{t.sampleCollected}</option>
                        <option value="processing">{t.processing}</option>
                        <option value="completed">{t.completed}</option>
                        <option value="cancelled">{t.cancelled}</option>
                      </select>

                      <label className="text-xs text-teal-600 font-semibold uppercase tracking-wider mt-1">{t.paymentStatusLabel}</label>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updateOrderStatus(order._id, "paymentStatus", e.target.value)}
                        disabled={updatingOrder === order._id}
                        className="px-3 py-2 rounded-lg border border-teal-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700"
                      >
                        <option value="pending">{t.pending}</option>
                        <option value="paid">{t.paid}</option>
                        <option value="failed">{t.failed}</option>
                      </select>

                      {order.user?._id && (
                        <button
                          type="button"
                          onClick={() => deleteUserAndOrders(order.user._id, order.user?.name || "this user")}
                          disabled={deletingUser === order.user._id}
                          className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-60"
                        >
                          {deletingUser === order.user._id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Delete User + Orders
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "search" && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 p-5 shadow-sm">
              <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-teal-500" />
                {t.searchPatientByMobile}
              </h2>
              <form onSubmit={handleUserSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                  <input
                    type="text"
                    value={searchPhone}
                    onChange={(e) => { setSearchPhone(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Enter mobile number to search..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teal-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 text-slate-700"
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-teal-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                      {suggestions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-teal-50 border-b border-teal-50 last:border-0 flex items-center gap-3 transition-colors"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSearchPhone(s.phone);
                            setShowSuggestions(false);
                            setTimeout(() => {
                              setSearching(true);
                              setSearchDone(false);
                              fetch(`${API_BASE}/admin/users/search?phone=${encodeURIComponent(s.phone)}`, { headers })
                                .then((r) => r.ok ? r.json() : [])
                                .then((data) => { setSearchResults(data); setSearchDone(true); })
                                .catch(() => { setSearchResults([]); setSearchDone(true); })
                                .finally(() => setSearching(false));
                            }, 0);
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0">
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                            <p className="text-xs text-teal-500 truncate">{s.phone} &bull; {s.email}</p>
                          </div>
                          <Phone className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={searching || !searchPhone.trim()}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 rounded-xl shadow-sm"
                >
                  {searching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <><Search className="w-4 h-4 mr-1" /> {t.search}</>
                  )}
                </Button>
              </form>
            </div>

            {/* Search Results */}
            {searchDone && searchResults.length === 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 p-8 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mx-auto mb-3">
                  <UserIcon className="w-8 h-8 text-teal-300" />
                </div>
                <p className="text-slate-600 font-medium">{t.noPatientsFound}</p>
                <p className="text-sm text-teal-400 mt-1">{t.tryDifferentPhone}</p>
              </div>
            )}

            {searchResults.map((user) => (
              <div key={user.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 overflow-hidden shadow-sm">
                {/* User Info Card */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-md">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-teal-400 mb-0.5">{t.patientName}</p>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-teal-400 mb-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {t.email}
                        </p>
                        <p className="font-medium text-slate-700 text-sm">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-teal-400 mb-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {t.phone}
                        </p>
                        <p className="font-medium text-slate-700 text-sm">{user.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-teal-400 mb-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {t.registered}
                        </p>
                        <p className="font-medium text-slate-700 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="bg-teal-100 text-teal-700 border border-teal-200 text-xs font-medium px-2.5 py-1 rounded-full">
                        {user.totalOrders} test{user.totalOrders !== 1 ? "s" : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteUserAndOrders(user.id, user.name)}
                        disabled={deletingUser === user.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-60"
                      >
                        {deletingUser === user.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete User
                      </button>
                      <button
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                        className="text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1 transition-colors"
                      >
                        {expandedUser === user.id ? t.hideOrders : t.viewOrders}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedUser === user.id ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Orders (Expandable) */}
                {expandedUser === user.id && (
                  <div className="border-t border-teal-100 bg-teal-50/40">
                    {user.orders.length === 0 ? (
                      <p className="text-center text-teal-400 py-6 text-sm">{t.noLabOrdersPlaced}</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-600">
                            <tr>
                              <th className="text-left px-5 py-2.5 font-medium">{t.sampleId}</th>
                              <th className="text-left px-5 py-2.5 font-medium">{t.tests}</th>
                              <th className="text-left px-5 py-2.5 font-medium">{t.amount}</th>
                              <th className="text-left px-5 py-2.5 font-medium">{t.payment}</th>
                              <th className="text-left px-5 py-2.5 font-medium">{t.status}</th>
                              <th className="text-left px-5 py-2.5 font-medium">{t.date}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-teal-100/60">
                            {user.orders.map((order) => (
                              <tr key={order._id} className="hover:bg-white/60 transition-colors">
                                <td className="px-5 py-3 font-mono text-xs text-teal-600">{order._id.slice(-8)}</td>
                                <td className="px-5 py-3">
                                  <div className="space-y-0.5">
                                    {order.items.map((item, i) => (
                                      <p key={i} className="text-xs text-slate-700">
                                        {item.name} <span className="text-teal-400">× {item.quantity}</span>
                                      </p>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-5 py-3 font-semibold text-slate-800">₹{order.totalPrice.toLocaleString("en-IN")}</td>
                                <td className="px-5 py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus] || ""}`}>
                                    {order.paymentStatus}
                                  </span>
                                  <span className="text-xs text-teal-400 ml-1 uppercase">{order.paymentMethod}</span>
                                </td>
                                <td className="px-5 py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || ""}`}>
                                    {order.orderStatus.replace("_", " ")}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-teal-500 text-xs">
                                  {new Date(order.createdAt).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === "prescriptions" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{t.uploadedPrescriptions}</h2>
                <p className="text-xs text-teal-500">{t.reviewPrescriptions}</p>
              </div>
            </div>

            {prescriptions.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 p-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-8 h-8 text-teal-300" />
                </div>
                <p className="text-slate-600 font-medium">{t.noPrescriptionsUploaded}</p>
                <p className="text-sm text-teal-400 mt-1">{t.prescriptionsAppearHere}</p>
              </div>
            ) : (
              prescriptions.map((rx) => (
                <div key={rx._id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 overflow-hidden shadow-sm">
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Patient Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{rx.patientName}</p>
                            <p className="text-xs text-teal-500">
                              {rx.age} yrs &bull; {rx.gender} &bull; Uploaded by: {rx.user?.name || "Unknown"}
                            </p>
                          </div>
                          <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${
                            rx.status === "pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                            rx.status === "reviewed" ? "bg-sky-100 text-sky-800 border border-sky-200" :
                            rx.status === "tests_assigned" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                            "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}>
                            {rx.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-teal-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {t.phone}</p>
                            <p className="font-medium text-slate-700">{rx.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-teal-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {t.email}</p>
                            <p className="font-medium text-slate-700 truncate">{rx.email || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-teal-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.uploaded}</p>
                            <p className="font-medium text-slate-700">{new Date(rx.createdAt).toLocaleDateString()}</p>
                          </div>
                          {rx.address && (
                            <div>
                              <p className="text-xs text-teal-400">{t.address}</p>
                              <p className="font-medium text-slate-700 truncate">{rx.address}</p>
                            </div>
                          )}
                        </div>

                        {rx.notes && (
                          <div className="mt-3 bg-teal-50/50 rounded-lg p-3 text-sm text-slate-600">
                            <span className="font-medium text-teal-600">{t.notes}: </span>{rx.notes}
                          </div>
                        )}
                      </div>

                      {/* Prescription Image + Actions */}
                      <div className="flex flex-col items-center gap-3 shrink-0 lg:w-48">
                        {rx.prescriptionImage?.startsWith("data:image") ? (
                          <button
                            onClick={() => setViewingImage(rx.prescriptionImage)}
                            className="w-full h-32 rounded-xl border border-teal-200 overflow-hidden bg-teal-50/30 hover:opacity-80 transition-opacity relative group"
                          >
                            <img src={rx.prescriptionImage} alt="Prescription" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-6 h-6 text-white" />
                            </div>
                          </button>
                        ) : (
                          <div className="w-full h-32 rounded-xl border border-teal-200 bg-teal-50/30 flex flex-col items-center justify-center">
                            <FileImage className="w-8 h-8 text-teal-300 mb-1" />
                            <p className="text-xs text-teal-500 truncate max-w-full px-2">{rx.fileName || "File"}</p>
                          </div>
                        )}

                        {/* Status Update Buttons */}
                        <div className="flex flex-wrap gap-1.5 w-full">
                          {["pending", "reviewed", "tests_assigned", "rejected"].map((s) => (
                            <button
                              key={s}
                              disabled={updatingRx === rx._id || rx.status === s}
                              onClick={() => updatePrescriptionStatus(rx._id, s)}
                              className={`flex-1 min-w-[60px] px-2 py-1.5 rounded-lg text-[10px] font-medium capitalize transition-all ${
                                rx.status === s
                                  ? "bg-teal-500 text-white"
                                  : "bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-100"
                              } ${updatingRx === rx._id ? "opacity-50" : ""}`}
                            >
                              {s.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Upload Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Upload Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 p-5 shadow-sm">
              <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <FileUp className="w-5 h-5 text-teal-500" />
                {t.uploadPatientReport}
              </h2>
              <form onSubmit={handleAdminReportUpload} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1 block">
                      {t.uniqueId} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                      <input
                        type="text"
                        value={reportForm.uniqueId}
                        onChange={(e) => setReportForm((f) => ({ ...f, uniqueId: e.target.value }))}
                        placeholder="e.g. RPT-2024-001"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teal-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1 block">
                      {t.patientName} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                      <input
                        type="text"
                        value={reportForm.patientName}
                        onChange={(e) => setReportForm((f) => ({ ...f, patientName: e.target.value }))}
                        placeholder="Patient full name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teal-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1 block">
                      {t.patientPhone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                      <input
                        type="text"
                        value={reportForm.patientPhone}
                        onChange={(e) => setReportForm((f) => ({ ...f, patientPhone: e.target.value }))}
                        placeholder="Mobile number (optional)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teal-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1 block">
                      {t.testNameLabel}
                    </label>
                    <div className="relative">
                      <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                      <input
                        type="text"
                        value={reportForm.testName}
                        onChange={(e) => setReportForm((f) => ({ ...f, testName: e.target.value }))}
                        placeholder="e.g. Complete Blood Count"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teal-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1 block">
                    {t.notesLabel}
                  </label>
                  <textarea
                    value={reportForm.notes}
                    onChange={(e) => setReportForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Any additional notes (optional)"
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-teal-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1 block">
                    Report File (PDF/Image, max 15MB) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 15 * 1024 * 1024) {
                        alert("File too large. Max 15 MB.");
                        e.target.value = "";
                        return;
                      }
                      setReportFile(file || null);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-teal-200 text-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  {reportFile && (
                    <p className="text-xs text-teal-500 mt-1">Selected: {reportFile.name} ({(reportFile.size / 1024).toFixed(1)} KB)</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={uploadingAdminReport}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-8 rounded-xl shadow-sm"
                >
                  {uploadingAdminReport ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> {t.uploading}</>
                  ) : (
                    <><FileUp className="w-4 h-4 mr-2" /> {t.uploadReport}</>
                  )}
                </Button>
              </form>
            </div>

            {/* Uploaded Reports List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-sm">
              <div className="p-5 border-b border-teal-50 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-teal-500" />
                <h2 className="font-bold text-lg text-slate-800">{t.uploadedReports} ({adminReports.length})</h2>
              </div>
              {adminReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileUp className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                  <p className="text-teal-400 font-medium">{t.noReportsUploaded}</p>
                  <p className="text-sm text-teal-300 mt-1">{t.uploadReportAbove}</p>
                </div>
              ) : (
                <div className="divide-y divide-teal-50">
                  {adminReports.map((report) => (
                    <div key={report._id} className="p-4 hover:bg-teal-50/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg border border-teal-100 font-bold">
                              {report.uniqueId}
                            </span>
                            <button
                              onClick={() => copyToClipboard(report.uniqueId)}
                              className="text-teal-400 hover:text-teal-600 transition-colors"
                              title="Copy Unique ID"
                            >
                              <ClipboardCopy className="w-3.5 h-3.5" />
                            </button>
                            {report.testName && (
                              <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-200">
                                {report.testName}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-700">
                            {report.patientName}
                            {report.patientPhone && <span className="text-teal-400 ml-2">{report.patientPhone}</span>}
                          </p>
                          <p className="text-xs text-teal-400 mt-0.5">
                            {report.reportFileName} &bull; Uploaded {new Date(report.createdAt).toLocaleString()}
                          </p>
                          {report.notes && <p className="text-xs text-slate-500 mt-1">{report.notes}</p>}
                        </div>
                        <button
                          onClick={() => handleAdminReportDelete(report._id)}
                          disabled={deletingReport === report._id}
                          className="shrink-0 text-xs font-medium text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg border border-rose-200 flex items-center gap-1 transition-colors"
                        >
                          {deletingReport === report._id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{t.homeCollectionBookings}</h2>
                <p className="text-xs text-teal-500">{t.manageHomeCollection}</p>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 p-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mx-auto mb-3">
                  <Home className="w-8 h-8 text-teal-300" />
                </div>
                <p className="text-slate-600 font-medium">{t.noHomeBookings}</p>
                <p className="text-sm text-teal-400 mt-1">{t.bookingsAppearHere}</p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-600">
                      <tr>
                        <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">#</th>
                        <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.patientName}</th>
                        <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.phone}</th>
                        <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.city}</th>
                        <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.status}</th>
                        <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.bookedOn}</th>
                        <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-50">
                      {bookings.map((booking, idx) => (
                        <tr key={booking._id} className="hover:bg-teal-50/50 transition-colors">
                          <td className="px-5 py-3.5 text-teal-400 font-mono text-xs">{idx + 1}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0">
                                <UserIcon className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium text-slate-700">{booking.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <a href={`tel:${booking.phone}`} className="flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium">
                              <Phone className="w-3.5 h-3.5" /> {booking.phone}
                            </a>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-1 text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-teal-400" /> {booking.city}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              booking.status === "pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                              booking.status === "confirmed" ? "bg-sky-100 text-sky-800 border border-sky-200" :
                              booking.status === "completed" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                              "bg-rose-100 text-rose-800 border border-rose-200"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 text-xs">
                            {new Date(booking.createdAt).toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                                disabled={updatingBooking === booking._id}
                                className="px-2.5 py-1.5 rounded-lg border border-teal-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700"
                              >
                                <option value="pending">{t.pending}</option>
                                <option value="confirmed">{t.confirmed}</option>
                                <option value="completed">{t.completed}</option>
                                <option value="cancelled">{t.cancelled}</option>
                              </select>
                              <button
                                onClick={() => deleteBooking(booking._id)}
                                disabled={deletingBooking === booking._id}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors disabled:opacity-50"
                                title="Delete booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manage Tests Tab */}
        {activeTab === "manage-tests" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Manage Tests</h2>
                  <p className="text-xs text-teal-500">Create and manage lab tests</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddingTest(!isAddingTest)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-md shadow-teal-200"
              >
                {isAddingTest ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isAddingTest ? "Cancel" : "Add New Test"}
              </button>
            </div>

            {isAddingTest && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-100 p-6 shadow-sm mb-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Add a New Lab Test</h3>
                <form onSubmit={handleAddTest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Test Name</label>
                    <input 
                      type="text" required value={newTest.name} onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                      placeholder="e.g. Complete Blood Count (CBC)"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Price (₹)</label>
                    <input 
                      type="number" required min="0" value={newTest.price} onChange={(e) => setNewTest({...newTest, price: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Number of Parameters</label>
                    <input 
                      type="number" required min="1" value={newTest.parameters} onChange={(e) => setNewTest({...newTest, parameters: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                      placeholder="e.g. 24"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Report Time</label>
                    <input 
                      type="text" required value={newTest.reportTime} onChange={(e) => setNewTest({...newTest, reportTime: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                      placeholder="e.g. 24 Hours or Same Day"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Prerequisites</label>
                    <input 
                      type="text" required value={newTest.prerequisites} onChange={(e) => setNewTest({...newTest, prerequisites: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                      placeholder="e.g. Fasting for 10-12 hours"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Category</label>
                    <input 
                      type="text" required value={newTest.category} onChange={(e) => setNewTest({...newTest, category: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                      placeholder="e.g. Blood Tests"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Sample Report URL (Optional)</label>
                    <input 
                      type="url" value={newTest.sampleReportUrl} onChange={(e) => setNewTest({...newTest, sampleReportUrl: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                      placeholder="https://example.com/sample.pdf"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end mt-2">
                    <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-teal-200">
                      Save Test
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loadingTests ? (
              <div className="text-center py-10">
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Loading tests...</p>
              </div>
            ) : testsList.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 p-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mx-auto mb-3">
                  <FlaskConical className="w-8 h-8 text-teal-300" />
                </div>
                <p className="text-slate-600 font-medium">No tests found</p>
                <p className="text-sm text-teal-400 mt-1">Start by adding a new lab test</p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-600">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">Test Name</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">Category</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">Price</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">Parameters</th>
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">Report Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-50">
                    {testsList.map((test) => (
                      <tr key={test._id} className="hover:bg-teal-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-700">{test.name}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
                            {test.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-teal-600">₹{test.price}</td>
                        <td className="px-5 py-3.5 text-slate-500">{test.parameters} params</td>
                        <td className="px-5 py-3.5 text-slate-500">{test.reportTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Image Viewer Modal */}
        {viewingImage && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={() => setViewingImage(null)}>
            <div className="max-w-3xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setViewingImage(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-600 shadow-lg flex items-center justify-center hover:bg-slate-100 text-lg font-bold z-10"
              >
                ×
              </button>
              <img src={viewingImage} alt="Prescription" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
