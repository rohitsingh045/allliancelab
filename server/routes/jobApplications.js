import express from "express";
import JobApplication from "../models/JobApplication.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: admin only
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ error: "Forbidden" });
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// POST /api/job-applications — public (anyone can apply)
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, position, experience, message } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
    if (!phone?.trim()) return res.status(400).json({ error: "Phone is required" });
    if (!position) return res.status(400).json({ error: "Position is required" });

    const application = await JobApplication.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      position,
      experience: experience?.trim() || "",
      message: message?.trim() || "",
    });
    res.status(201).json({ success: true, id: application._id });
  } catch (err) {
    console.error("Job application error:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// GET /api/job-applications — admin only
router.get("/", adminAuth, async (req, res) => {
  try {
    const apps = await JobApplication.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// PATCH /api/job-applications/:id — update status (admin only)
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// DELETE /api/job-applications/:id — admin only
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await JobApplication.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete application" });
  }
});

export default router;
