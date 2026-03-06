import express from "express";
import HealthCondition from "../models/HealthCondition.js";

const router = express.Router();

// GET /api/health-conditions - Get all conditions
router.get("/", async (req, res) => {
  try {
    const conditions = await HealthCondition.find()
      .select("slug label title description")
      .sort({ label: 1 });
    res.json(conditions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/health-conditions/:slug - Get single condition by slug
router.get("/:slug", async (req, res) => {
  try {
    const condition = await HealthCondition.findOne({
      slug: req.params.slug,
    }).populate("relatedTests");
    if (!condition)
      return res.status(404).json({ message: "Health condition not found" });
    res.json(condition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/health-conditions - Create a condition
router.post("/", async (req, res) => {
  try {
    const condition = new HealthCondition(req.body);
    const saved = await condition.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/health-conditions/:slug - Update a condition
router.put("/:slug", async (req, res) => {
  try {
    const updated = await HealthCondition.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Health condition not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/health-conditions/:slug - Delete a condition
router.delete("/:slug", async (req, res) => {
  try {
    const deleted = await HealthCondition.findOneAndDelete({
      slug: req.params.slug,
    });
    if (!deleted)
      return res.status(404).json({ message: "Health condition not found" });
    res.json({ message: "Health condition deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
