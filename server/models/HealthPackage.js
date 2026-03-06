import mongoose from "mongoose";

const healthPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    parameters: { type: Number, required: true },
    reportTime: { type: String, default: "Same Day" },
    prerequisites: { type: String, default: "Detailed Clinical History" },
  },
  { timestamps: true }
);

const HealthPackage = mongoose.model("HealthPackage", healthPackageSchema);
export default HealthPackage;
