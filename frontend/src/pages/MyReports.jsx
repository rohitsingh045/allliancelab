import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Download, FileText, ArrowLeft, RefreshCw, CheckCircle2,
  Clock, FlaskConical, ChevronDown, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MyReports = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useLang();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchReports();
  }, [token]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders/my-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (orderId, itemIndex, fileName) => {
    const key = `${orderId}-${itemIndex}`;
    setDownloading(key);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/items/${itemIndex}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Report not available");

      const data = await res.json();

      // Trigger download from base64 data URI
      const link = document.createElement("a");
      link.href = data.reportFile;
      link.download = data.reportFileName || "report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Report downloaded!");
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setDownloading(null);
    }
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <Download className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t.loginRequired}</h2>
          <p className="text-muted-foreground mb-6">{t.loginToViewMyReports}</p>
          <Button onClick={() => navigate("/login")} className="bg-gradient-primary text-white px-8">
            {t.goToLogin}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Count items with reports
  const totalReports = orders.reduce(
    (acc, o) => acc + o.items.filter((item) => item.hasReport).length,
    0
  );

  const statusLabel = {
    placed: { text: t.placed, cls: "bg-amber-100 text-amber-700" },
    confirmed: { text: t.confirmed, cls: "bg-sky-100 text-sky-700" },
    sample_collected: { text: t.sampleCollected || "Sample Collected", cls: "bg-indigo-100 text-indigo-700" },
    processing: { text: t.processing, cls: "bg-violet-100 text-violet-700" },
    completed: { text: t.completed, cls: "bg-emerald-100 text-emerald-700" },
    cancelled: { text: t.cancelled, cls: "bg-rose-100 text-rose-700" },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t.backToHome}
        </button>

        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t.myReports}</h1>
              <p className="text-sm text-muted-foreground">
                {totalReports} report{totalReports !== 1 ? "s" : ""} available from {orders.length} order{orders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchReports} className="gap-1.5">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> {t.refresh}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">{t.loadingReports}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
            <FlaskConical className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t.noReportsAvailable}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t.noReportsBookDesc}
            </p>
            <Button onClick={() => navigate("/")} className="bg-gradient-primary text-white gap-2">
              <FlaskConical className="w-4 h-4" /> {t.bookATest}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const reportsReady = order.items.filter((i) => i.hasReport).length;
              const totalItems = order.items.length;
              const isExpanded = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
                >
                  {/* Order Header — clickable to expand */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    className="w-full text-left p-5 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-foreground">
                          Order #{order._id.slice(-8)}
                        </span>
                        <span className={`${(statusLabel[order.orderStatus] || statusLabel.placed).cls} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
                          {(statusLabel[order.orderStatus] || statusLabel.placed).text}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {totalItems} test{totalItems !== 1 ? "s" : ""} &bull;{" "}
                        {reportsReady === totalItems ? (
                          <span className="text-emerald-600 font-medium">
                            {t.allReportsReady} {reportsReady} {t.reportsReady}
                          </span>
                        ) : reportsReady > 0 ? (
                          <span className="text-amber-600 font-medium">
                            {reportsReady}/{totalItems} {t.reportsReady}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{t.reportsPending}</span>
                        )}{" "}
                        &bull; {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded — individual test items */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/20">
                      {order.items.map((item) => (
                        <div
                          key={item.index}
                          className="flex items-center gap-4 px-5 py-4 border-b border-border/50 last:border-0"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              item.hasReport
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {item.hasReport ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {item.itemType}
                              {item.hasReport && item.reportUploadedAt && (
                                <> &bull; {t.uploaded} {new Date(item.reportUploadedAt).toLocaleDateString()}</>
                              )}
                            </p>
                          </div>

                          {item.hasReport ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleDownload(order._id, item.index, item.reportFileName)
                              }
                              disabled={downloading === `${order._id}-${item.index}`}
                              className="bg-gradient-primary text-white gap-1.5 rounded-lg shadow-sm"
                            >
                              {downloading === `${order._id}-${item.index}` ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              {t.download}
                            </Button>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {t.pending}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyReports;
