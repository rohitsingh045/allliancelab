import { Router } from "express";
import HealthPackage from "../models/HealthPackage.js";

const router = Router();

// GET all health packages
router.get("/", async (_req, res) => {
  try {
    const packages = await HealthPackage.find().sort({ price: 1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single package
router.get("/:id", async (req, res) => {
  try {
    const pkg = await HealthPackage.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create package
router.post("/", async (req, res) => {
  try {
    const pkg = await HealthPackage.create(req.body);
    res.status(201).json(pkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update package
router.put("/:id", async (req, res) => {
  try {
    const pkg = await HealthPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE package
router.delete("/:id", async (req, res) => {
  try {
    await HealthPackage.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
