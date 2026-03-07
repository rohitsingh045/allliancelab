import express from "express";
import Report from "../models/Report.js";
import { verifyToken } from "../lib/authHelpers.js";

const router = express.Router();

// Admin auth middleware
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const payload = verifyToken(authHeader.split(" ")[1]);
  if (!payload || payload.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  req.adminId = payload.userId;
  next();
}

// POST /api/reports/admin/upload - Admin uploads a report with unique ID
router.post("/admin/upload", adminAuth, async (req, res) => {
  try {
    const { uniqueId, patientName, patientPhone, testName, reportFile, reportFileName, notes } = req.body;

    if (!uniqueId || !uniqueId.trim()) {
      return res.status(400).json({ error: "Unique ID is required" });
    }
    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ error: "Patient name is required" });
    }
    if (!reportFile) {
      return res.status(400).json({ error: "Report file is required" });
    }

    // Check if uniqueId already exists
    const existing = await Report.findOne({ uniqueId: uniqueId.trim() });
    if (existing) {
      return res.status(409).json({ error: "A report with this Unique ID already exists" });
    }

    const report = await Report.create({
      uniqueId: uniqueId.trim(),
      patientName: patientName.trim(),
      patientPhone: patientPhone?.trim() || "",
      testName: testName?.trim() || "",
      reportFile,
      reportFileName: reportFileName || "report.pdf",
      notes: notes?.trim() || "",
      uploadedBy: req.adminId,
    });

    res.status(201).json({
      _id: report._id,
      uniqueId: report.uniqueId,
      patientName: report.patientName,
      patientPhone: report.patientPhone,
      testName: report.testName,
      reportFileName: report.reportFileName,
      notes: report.notes,
      createdAt: report.createdAt,
    });
  } catch (err) {
    console.error("Upload report error:", err);
    res.status(500).json({ error: "Failed to upload report" });
  }
});

// GET /api/reports/admin/all - Admin gets all uploaded reports (without file data for performance)
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const reports = await Report.find()
      .select("-reportFile")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Fetch reports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// DELETE /api/reports/admin/:id - Admin deletes a report
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

// GET /api/reports/download/:uniqueId - Public: anyone can fetch report by unique ID
router.get("/download/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;
    if (!uniqueId || !uniqueId.trim()) {
      return res.status(400).json({ error: "Unique ID is required" });
    }

    const report = await Report.findOne({ uniqueId: uniqueId.trim() });
    if (!report) {
      return res.status(404).json({ error: "No report found with this ID" });
    }

    res.json({
      uniqueId: report.uniqueId,
      patientName: report.patientName,
      testName: report.testName,
      reportFile: report.reportFile,
      reportFileName: report.reportFileName,
      uploadedAt: report.createdAt,
    });
  } catch (err) {
    console.error("Download report error:", err);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

export default router;
