import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;