import express from "express";
import SampleReport from "../models/SampleReport.js";

const router = express.Router();

// GET /api/sample-reports - Get all sample reports
router.get("/", async (req, res) => {
  try {
    const reports = await SampleReport.find().populate("test");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/sample-reports/by-test/:testId - Get sample report for a specific test
router.get("/by-test/:testId", async (req, res) => {
  try {
    const report = await SampleReport.findOne({
      test: req.params.testId,
    }).populate("test");
    if (!report)
      return res.status(404).json({ message: "Sample report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/sample-reports/:id - Get single sample report
router.get("/:id", async (req, res) => {
  try {
    const report = await SampleReport.findById(req.params.id).populate("test");
    if (!report)
      return res.status(404).json({ message: "Sample report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/sample-reports - Create a sample report
router.post("/", async (req, res) => {
  try {
    const report = new SampleReport(req.body);
    const saved = await report.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
