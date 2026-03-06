import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    // Store prescription as base64 data-URI (small files) so no file-upload library needed
    prescriptionImage: { type: String, required: true },
    fileName: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewed", "tests_assigned", "rejected"],
      default: "pending",
    },
    adminRemarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
