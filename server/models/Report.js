import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, required: true, unique: true, trim: true },
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, trim: true },
    testName: { type: String, trim: true },
    reportFile: { type: String, required: true },
    reportFileName: { type: String, default: "report.pdf" },
    notes: { type: String, trim: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
