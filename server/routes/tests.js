import express from "express";
import Test from "../models/Test.js";

const router = express.Router();

// GET /api/tests - Get all tests
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const tests = await Test.find(filter).sort({ name: 1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tests/categories - Get all unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Test.distinct("category");
    res.json(["All", ...categories]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tests/:id - Get single test
router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tests - Create a test
router.post("/", async (req, res) => {
  try {
    const test = new Test(req.body);
    const saved = await test.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/tests/:id - Update a test
router.put("/:id", async (req, res) => {
  try {
    const updated = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Test not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tests/:id - Delete a test
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Test.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Test not found" });
    res.json({ message: "Test deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
