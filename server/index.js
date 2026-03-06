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

dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is busy, trying port ${+PORT + 1}...`);
    server.close();
    app.listen(+PORT + 1, () => {
      console.log(`Server running on port ${+PORT + 1}`);
    });
  } else {
    console.error(err);
  }
});
