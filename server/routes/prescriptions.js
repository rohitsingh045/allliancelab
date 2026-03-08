import express from "express";
import Prescription from "../models/Prescription.js";
import Notification from "../models/Notification.js";
import { authMiddleware } from "../lib/authHelpers.js";

const router = express.Router();

// POST /api/prescriptions — upload a prescription (logged-in user)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patientName, age, gender, phone, email, address, prescriptionImage, fileName, notes } = req.body;

    if (!patientName || !age || !gender || !phone || !prescriptionImage) {
      return res.status(400).json({ error: "Patient name, age, gender, phone, and prescription image are required" });
    }

    const prescription = await Prescription.create({
      user: req.userId,
      patientName,
      age: Number(age),
      gender,
      phone,
      email,
      address,
      prescriptionImage,
      fileName,
      notes,
    });

    // Notify admin about new prescription
    try {
      await Notification.create({
        recipient: "admin",
        type: "new_prescription",
        title: "New Prescription Uploaded",
        message: `${patientName} has uploaded a prescription.`,
        relatedId: prescription._id.toString(),
      });
    } catch (_) {}

    res.status(201).json(prescription);
  } catch (err) {
    console.error("Create prescription error:", err);
    res.status(500).json({ error: "Failed to upload prescription" });
  }
});

// GET /api/prescriptions/my — get current user's prescriptions
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

export default router;
