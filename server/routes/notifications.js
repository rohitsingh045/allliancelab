import express from "express";
import Notification from "../models/Notification.js";
import { authMiddleware, verifyToken } from "../lib/authHelpers.js";

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

// GET /api/notifications/user - Get notifications for logged-in user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: "user",
      recipientId: req.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error("Fetch user notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// GET /api/notifications/admin - Get notifications for admin
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: "admin",
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error("Fetch admin notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// GET /api/notifications/user/unread-count - Get unread count for user
router.get("/user/unread-count", authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: "user",
      recipientId: req.userId,
      read: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

// GET /api/notifications/admin/unread-count - Get unread count for admin
router.get("/admin/unread-count", adminAuth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: "admin",
      read: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

// PATCH /api/notifications/:id/read - Mark a notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// PATCH /api/notifications/mark-all-read/user - Mark all user notifications as read
router.patch("/mark-all-read/user", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: "user", recipientId: req.userId, read: false },
      { read: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

// PATCH /api/notifications/mark-all-read/admin - Mark all admin notifications as read
router.patch("/mark-all-read/admin", adminAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: "admin", read: false },
      { read: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

export default router;
