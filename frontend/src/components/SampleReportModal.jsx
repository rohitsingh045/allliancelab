import { X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import QRCode from "react-qr-code";

const SampleReportModal = ({ report, onClose }) => {
  const { t } = useLang();
  if (!report) return null;

  // Generate a mock URL or real URL to open this specific report based on its ID
  const reportUrl = `${window.location.origin}/download-report?id=${report._id || 'sample'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-6 md:pt-12 overflow-y-auto pb-6">
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-bold text-primary mb-2">{t.sampleReportTitle} — {report.title}</h2>
            <p className="text-sm text-muted-foreground">Scan QR to view/download this specific report directly</p>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg border border-border shadow-sm">
              <QRCode 
                value={reportUrl} 
                size={100} 
                fgColor="#000000" 
                bgColor="#ffffff"
                level="H"
              />
            </div>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Patient / Specimen / Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="border border-border rounded-lg p-3 space-y-1">
              <h4 className="font-heading font-bold text-foreground mb-2">{t.patientInformation}</h4>
              <p><span className="text-muted-foreground">{t.name}:</span> <span className="text-foreground">Dummy</span></p>
              <p><span className="text-muted-foreground">{t.ageGender}:</span> <span className="text-foreground">38 Y 0 M / Female</span></p>
              <p><span className="text-muted-foreground">{t.uhid}:</span> <span className="text-foreground">Dummy.000000</span></p>
            </div>
            <div className="border border-border rounded-lg p-3 space-y-1">
              <h4 className="font-heading font-bold text-foreground mb-2">{t.specimenInformation}</h4>
              <p><span className="text-muted-foreground">{t.visitId}:</span> <span className="text-foreground">Dummy0101</span></p>
              <p><span className="text-muted-foreground">{t.specimen}:</span> <span className="text-foreground">{report.specimen}</span></p>
              <p><span className="text-muted-foreground">{t.status}:</span> <span className="text-foreground">{t.finalReport}</span></p>
            </div>
            <div className="border border-border rounded-lg p-3 space-y-1">
              <h4 className="font-heading font-bold text-foreground mb-2">{t.clientDoctorInformation}</h4>
              <p><span className="text-muted-foreground">{t.clientName}:</span> <span className="text-foreground">Dummy Client</span></p>
              <p><span className="text-muted-foreground">{t.clientCode}:</span> <span className="text-foreground">Dummy001</span></p>
              <p><span className="text-muted-foreground">{t.refDoctor}:</span> <span className="text-foreground">Self</span></p>
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-left px-4 py-2.5 font-semibold">{t.testName}</th>
                  <th className="text-center px-4 py-2.5 font-semibold">{t.result}</th>
                  <th className="text-center px-4 py-2.5 font-semibold">{t.bioRefRange}</th>
                  <th className="text-center px-4 py-2.5 font-semibold">{t.unit}</th>
                  <th className="text-center px-4 py-2.5 font-semibold">{t.method}</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row, idx) =>
                  row.isHeader ? (
                    <tr key={idx} className="bg-secondary">
                      <td colSpan={5} className="px-4 py-2 font-heading font-bold text-foreground">
                        {row.name}
                      </td>
                    </tr>
                  ) : (
                    <tr key={idx} className={`border-t border-border ${idx % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}>
                      <td className={`px-4 py-2 text-foreground ${row.isBold ? "font-bold" : ""}`}>{row.name}</td>
                      <td className={`px-4 py-2 text-center text-foreground ${row.isBold ? "font-bold" : ""}`}>{row.result}</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{row.range}</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{row.unit}</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{row.method}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{t.criticalValuesNote}</p>
            <p className="text-center font-semibold">*** {t.endOfReport} ***</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleReportModal;
