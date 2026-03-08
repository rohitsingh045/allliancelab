import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search, AlertCircle, CheckCircle2, RefreshCw, User, FlaskConical, Calendar, Hash, ClipboardList, LogIn, Package } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DownloadReport = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("booked");

  // --- Search by ID state ---
  const [uniqueId, setUniqueId] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // --- Booked reports state ---
  const [bookedOrders, setBookedOrders] = useState([]);
  const [bookedLoading, setBookedLoading] = useState(false);
  const [bookedError, setBookedError] = useState("");
  const [downloadingItem, setDownloadingItem] = useState(null);

  // Fetch booked reports when user is logged in and tab is booked
  useEffect(() => {
    if (user && token && activeTab === "booked") {
      fetchBookedReports();
    }
  }, [user, token, activeTab]);

  const fetchBookedReports = async () => {
    setBookedLoading(true);
    setBookedError("");
    try {
      const res = await fetch(`${API_BASE}/orders/my-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookedOrders(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setBookedError(data.error || "Failed to fetch your reports.");
      }
    } catch {
      setBookedError("Network error. Please check your connection.");
    } finally {
      setBookedLoading(false);
    }
  };

  const handleDownloadBookedReport = async (orderId, itemIndex, fileName) => {
    setDownloadingItem(`${orderId}-${itemIndex}`);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/items/${itemIndex}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error("Failed to download report.");
        return;
      }
      const data = await res.json();
      if (!data.reportFile) {
        toast.error("Report file not available.");
        return;
      }
      const link = document.createElement("a");
      link.href = data.reportFile;
      link.download = data.reportFileName || fileName || "report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Report downloaded!");
    } catch {
      toast.error("Failed to download report.");
    } finally {
      setDownloadingItem(null);
    }
  };

  const handleViewBookedReport = async (orderId, itemIndex) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/items/${itemIndex}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error("Failed to load report.");
        return;
      }
      const data = await res.json();
      if (!data.reportFile) {
        toast.error("Report file not available.");
        return;
      }
      const newWindow = window.open();
      if (newWindow) {
        if (data.reportFile.startsWith("data:application/pdf")) {
          newWindow.document.write(
            `<iframe src="${data.reportFile}" style="width:100%;height:100%;border:none;" title="Report"></iframe>`
          );
        } else {
          newWindow.document.write(
            `<img src="${data.reportFile}" style="max-width:100%;height:auto;" alt="Report" />`
          );
        }
        newWindow.document.title = data.reportFileName || "Report";
      }
    } catch {
      toast.error("Failed to load report.");
    }
  };

  // --- Search by ID handlers ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!uniqueId.trim()) {
      setError("Please enter a Report ID.");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);
    setSearched(true);

    try {
      const res = await fetch(`${API_BASE}/reports/download/${encodeURIComponent(uniqueId.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No report found with this ID.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report?.reportFile) return;
    const link = document.createElement("a");
    link.href = report.reportFile;
    link.download = report.reportFileName || "report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report downloaded!");
  };

  const handleView = () => {
    if (!report?.reportFile) return;
    const newWindow = window.open();
    if (newWindow) {
      if (report.reportFile.startsWith("data:application/pdf")) {
        newWindow.document.write(
          `<iframe src="${report.reportFile}" style="width:100%;height:100%;border:none;" title="Report"></iframe>`
        );
      } else {
        newWindow.document.write(
          `<img src="${report.reportFile}" style="max-width:100%;height:auto;" alt="Report" />`
        );
      }
      newWindow.document.title = report.reportFileName || "Report";
    }
  };

  // Count total reports with files across all booked orders
  const totalBookedReports = bookedOrders.reduce(
    (sum, order) => sum + order.items.filter((item) => item.hasReport).length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Download Your Report</h1>
          <p className="text-muted-foreground">
            View your booked test reports or search by Report ID to download.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-muted rounded-2xl p-1.5 mb-6">
          <button
            onClick={() => setActiveTab("booked")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "booked"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            My Booked Reports
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "search"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Hash className="w-4 h-4" />
            Search by Report ID
          </button>
        </div>

        {/* ========== TAB: My Booked Reports ========== */}
        {activeTab === "booked" && (
          <div>
            {!user ? (
              /* Not logged in */
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <LogIn className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Login Required</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Please log in to view reports for your booked tests.
                </p>
                <Button
                  onClick={() => (window.location.href = "/login")}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-xl"
                >
                  <LogIn className="w-4 h-4 mr-2" /> Log In
                </Button>
              </div>
            ) : bookedLoading ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <RefreshCw className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
                <p className="text-muted-foreground font-medium">Loading your reports...</p>
              </div>
            ) : bookedError ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                <p className="text-rose-700 font-medium">{bookedError}</p>
                <Button
                  onClick={fetchBookedReports}
                  variant="outline"
                  className="mt-4 rounded-xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Button>
              </div>
            ) : totalBookedReports === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground text-sm mb-1">
                  Reports for your booked tests will appear here once they are uploaded by the admin.
                </p>
                <p className="text-muted-foreground text-sm">
                  You can also use the <button onClick={() => setActiveTab("search")} className="text-primary font-semibold underline underline-offset-2">Search by Report ID</button> tab if you have a unique ID.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {totalBookedReports} report{totalBookedReports !== 1 ? "s" : ""} available for download
                </p>
                {bookedOrders.map((order) =>
                  order.items
                    .filter((item) => item.hasReport)
                    .map((item) => (
                      <div
                        key={`${order._id}-${item.index}`}
                        className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                                <FlaskConical className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground">{item.name}</h4>
                                <p className="text-xs text-muted-foreground capitalize">{item.itemType}</p>
                              </div>
                            </div>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                order.orderStatus === "completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {order.orderStatus.replace("_", " ")}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Ordered: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                            {item.reportUploadedAt && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Report: {new Date(item.reportUploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={() => handleViewBookedReport(order._id, item.index)}
                              variant="outline"
                              className="flex-1 rounded-xl"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Report
                            </Button>
                            <Button
                              onClick={() => handleDownloadBookedReport(order._id, item.index, item.reportFileName)}
                              disabled={downloadingItem === `${order._id}-${item.index}`}
                              className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold rounded-xl"
                            >
                              {downloadingItem === `${order._id}-${item.index}` ? (
                                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Downloading...</>
                              ) : (
                                <><Download className="w-4 h-4 mr-2" /> Download</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ========== TAB: Search by Report ID ========== */}
        {activeTab === "search" && (
          <div>
            {/* Search Form */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Report ID
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={uniqueId}
                      onChange={(e) => { setUniqueId(e.target.value); setError(""); setReport(null); setSearched(false); }}
                      placeholder="Enter your Report ID (e.g. RPT-2024-001)"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
                      autoFocus
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading || !uniqueId.trim()}
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-xl"
                >
                  {loading ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Searching...</>
                  ) : (
                    <><Search className="w-4 h-4 mr-2" /> Find My Report</>
                  )}
                </Button>
              </form>
            </div>

            {/* Error State */}
            {error && searched && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center mb-6">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                <p className="text-rose-700 font-medium">{error}</p>
                <p className="text-sm text-rose-500 mt-1">
                  Please verify your Report ID and try again.
                </p>
              </div>
            )}

            {/* Report Found */}
            {report && (
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-white font-bold text-lg">Report Found!</h3>
                      <p className="text-emerald-100 text-sm">Your report is ready to view and download.</p>
                    </div>
                  </div>
                </div>

                {/* Report Details */}
                <div className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Report ID</p>
                        <p className="font-mono font-bold text-foreground">{report.uniqueId}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Patient Name</p>
                        <p className="font-semibold text-foreground">{report.patientName}</p>
                      </div>
                    </div>
                    {report.testName && (
                      <div className="flex items-start gap-3">
                        <FlaskConical className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-medium">Test Name</p>
                          <p className="font-medium text-foreground">{report.testName}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Uploaded On</p>
                        <p className="font-medium text-foreground">{new Date(report.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleView}
                      variant="outline"
                      className="flex-1 py-3 rounded-xl"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                    <Button
                      onClick={handleDownload}
                      className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Help Text */}
            {!searched && !report && (
              <div className="text-center text-sm text-muted-foreground mt-8">
                <p>Enter the unique Report ID given to you by the admin to find and download your report.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DownloadReport;
