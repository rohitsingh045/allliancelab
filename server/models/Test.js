import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    parameters: { type: Number, required: true },
    reportTime: { type: String, required: true },
    prerequisites: { type: String, required: true },
    category: { type: String, required: true },
    sampleReportUrl: { type: String },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", testSchema);
export default Test;
