import { X } from "lucide-react";

const SampleReportModal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-6 md:pt-12 overflow-y-auto pb-6">
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-heading font-bold text-primary">Sample Report — {report.title}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Patient / Specimen / Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="border border-border rounded-lg p-3 space-y-1">
              <h4 className="font-heading font-bold text-foreground mb-2">Patient Information</h4>
              <p><span className="text-muted-foreground">Name:</span> <span className="text-foreground">Dummy</span></p>
              <p><span className="text-muted-foreground">Age/Gender:</span> <span className="text-foreground">38 Y 0 M / Female</span></p>
              <p><span className="text-muted-foreground">UHID:</span> <span className="text-foreground">Dummy.000000</span></p>
            </div>
            <div className="border border-border rounded-lg p-3 space-y-1">
              <h4 className="font-heading font-bold text-foreground mb-2">Specimen Information</h4>
              <p><span className="text-muted-foreground">Visit ID:</span> <span className="text-foreground">Dummy0101</span></p>
              <p><span className="text-muted-foreground">Specimen:</span> <span className="text-foreground">{report.specimen}</span></p>
              <p><span className="text-muted-foreground">Status:</span> <span className="text-foreground">Final Report</span></p>
            </div>
            <div className="border border-border rounded-lg p-3 space-y-1">
              <h4 className="font-heading font-bold text-foreground mb-2">Client/Doctor Information</h4>
              <p><span className="text-muted-foreground">Client Name:</span> <span className="text-foreground">Dummy Client</span></p>
              <p><span className="text-muted-foreground">Client Code:</span> <span className="text-foreground">Dummy001</span></p>
              <p><span className="text-muted-foreground">Ref Doctor:</span> <span className="text-foreground">Self</span></p>
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-left px-4 py-2.5 font-semibold">Test Name</th>
                  <th className="text-center px-4 py-2.5 font-semibold">Result</th>
                  <th className="text-center px-4 py-2.5 font-semibold">Bio. Ref. Range</th>
                  <th className="text-center px-4 py-2.5 font-semibold">Unit</th>
                  <th className="text-center px-4 py-2.5 font-semibold">Method</th>
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
            <p>If Values are marked with *, they are critical values.</p>
            <p className="text-center font-semibold">*** End Of Report ***</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleReportModal;
