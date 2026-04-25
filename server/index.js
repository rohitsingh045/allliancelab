import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import testRoutes from "./routes/tests.js";
import healthConditionRoutes from "./routes/healthConditions.js";
import sampleReportRoutes from "./routes/sampleReports.js";
import bookingRoutes from "./routes/bookings.js";
import healthPackageRoutes from "./routes/healthPackages.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import reportRoutes from "./routes/reports.js";
import notificationRoutes from "./routes/notifications.js";
import jobApplicationRoutes from "./routes/jobApplications.js";

dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Cached MongoDB connection for serverless environments
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/health-conditions", healthConditionRoutes);
app.use("/api/sample-reports", sampleReportRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/health-packages", healthPackageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/job-applications", jobApplicationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Alliance Health Hub API is running" });
});

// Only listen when not running on Vercel (serverless)
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
