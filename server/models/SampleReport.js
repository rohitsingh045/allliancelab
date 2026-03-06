import mongoose from "mongoose";

const reportRowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    result: { type: String, default: "" },
    range: { type: String, default: "" },
    unit: { type: String, default: "" },
    method: { type: String, default: "" },
    isHeader: { type: Boolean, default: false },
    isBold: { type: Boolean, default: false },
  },
  { _id: false }
);

const sampleReportSchema = new mongoose.Schema(
  {
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    title: { type: String, required: true },
    specimen: { type: String, required: true },
    rows: [reportRowSchema],
  },
  { timestamps: true }
);

const SampleReport = mongoose.model("SampleReport", sampleReportSchema);
export default SampleReport;
