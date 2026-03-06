import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// GET /api/bookings - Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bookings - Create a booking
router.post("/", async (req, res) => {
  try {
    const { name, phone, city } = req.body;
    if (!name || !phone || !city) {
      return res
        .status(400)
        .json({ message: "Name, phone, and city are required" });
    }
    const booking = new Booking({ name, phone, city });
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/bookings/:id - Update booking status
router.put("/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Booking not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
