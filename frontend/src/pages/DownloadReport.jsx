import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search, AlertCircle, CheckCircle2, RefreshCw, User, FlaskConical, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DownloadReport = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

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
    // Open in new tab for viewing
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Download Your Report</h1>
          <p className="text-muted-foreground">
            Enter the unique Report ID provided to you to view and download your test report.
          </p>
        </div>

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
            <p>Don't have a Report ID? Contact us at our diagnostic centre or call our helpline.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DownloadReport;
