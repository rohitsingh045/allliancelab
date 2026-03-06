import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Prescription from "../models/Prescription.js";
import { createToken, verifyToken } from "../lib/authHelpers.js";

const router = express.Router();

// Middleware: verify admin token (checks role in User model)
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

// GET /api/admin/me - uses unified User model
router.get("/me", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.adminId).select("-passwordHash -salt");
    if (!user || user.role !== "admin") return res.status(404).json({ error: "Admin not found" });
    res.json({ admin: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/admin/orders - get all orders
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email phone").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Admin orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PATCH /api/admin/orders/:id - update order status
router.patch("/orders/:id", adminAuth, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true }).populate("user", "name email phone");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// GET /api/admin/users/suggest?phone=xxx - autocomplete suggestions
router.get("/users/suggest", adminAuth, async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone || phone.trim().length < 1) {
      return res.json([]);
    }

    const phoneRegex = { $regex: phone.trim(), $options: "i" };

    // Search users by their profile phone
    const usersByProfile = await User.find({
      phone: phoneRegex,
      role: { $ne: "admin" },
    })
      .select("name email phone")
      .limit(10);

    // Also search orders by delivery phone and get those user IDs
    const orderMatches = await Order.find({ phone: phoneRegex })
      .select("user phone")
      .limit(20);

    const orderUserIds = [...new Set(orderMatches.map((o) => o.user?.toString()).filter(Boolean))];
    const profileUserIds = usersByProfile.map((u) => u._id.toString());
    const extraIds = orderUserIds.filter((id) => !profileUserIds.includes(id));

    const extraUsers = extraIds.length > 0
      ? await User.find({ _id: { $in: extraIds }, role: { $ne: "admin" } }).select("name email phone").limit(10)
      : [];

    const allUsers = [...usersByProfile, ...extraUsers];

    // For users found via orders, show the order phone if their profile phone is empty
    const results = allUsers.map((u) => {
      let displayPhone = u.phone;
      if (!displayPhone) {
        const orderMatch = orderMatches.find((o) => o.user?.toString() === u._id.toString());
        if (orderMatch) displayPhone = orderMatch.phone;
      }
      return { id: u._id, name: u.name, email: u.email, phone: displayPhone || "" };
    });

    res.json(results);
  } catch (err) {
    res.json([]);
  }
});

// GET /api/admin/users/search?phone=xxx - search user by phone number
router.get("/users/search", adminAuth, async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone || phone.trim().length < 1) {
      return res.status(400).json({ error: "Please enter a mobile number to search" });
    }

    const phoneRegex = { $regex: phone.trim(), $options: "i" };

    // Search users by their profile phone
    const usersByProfile = await User.find({
      phone: phoneRegex,
      role: { $ne: "admin" },
    })
      .select("-passwordHash -salt")
      .sort({ createdAt: -1 })
      .limit(20);

    // Also search orders by delivery phone and get associated users
    const orderMatches = await Order.find({ phone: phoneRegex }).select("user phone").limit(50);
    const orderUserIds = [...new Set(orderMatches.map((o) => o.user?.toString()).filter(Boolean))];
    const profileUserIds = usersByProfile.map((u) => u._id.toString());
    const extraIds = orderUserIds.filter((id) => !profileUserIds.includes(id));

    const extraUsers = extraIds.length > 0
      ? await User.find({ _id: { $in: extraIds }, role: { $ne: "admin" } })
          .select("-passwordHash -salt")
          .sort({ createdAt: -1 })
          .limit(20)
      : [];

    const allUsers = [...usersByProfile, ...extraUsers];

    // For each user, fetch their orders
    const results = await Promise.all(
      allUsers.map(async (user) => {
        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
        // Show order phone if user profile phone is empty
        let displayPhone = user.phone;
        if (!displayPhone && orders.length > 0) {
          displayPhone = orders[0].phone;
        }
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: displayPhone || "",
          role: user.role,
          createdAt: user.createdAt,
          totalOrders: orders.length,
          orders,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ error: "Failed to search users" });
  }
});

// GET /api/admin/stats - dashboard stats
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const pendingOrders = await Order.countDocuments({ orderStatus: "placed" });
    const recentOrders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5);

    res.json({
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      recentOrders,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// PATCH /api/admin/orders/:orderId/items/:itemIndex/report - upload report for a specific order item
router.patch("/orders/:orderId/items/:itemIndex/report", adminAuth, async (req, res) => {
  try {
    const { reportFile, reportFileName } = req.body;
    if (!reportFile) return res.status(400).json({ error: "Report file is required" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const idx = parseInt(req.params.itemIndex);
    if (idx < 0 || idx >= order.items.length) return res.status(400).json({ error: "Invalid item index" });

    order.items[idx].reportFile = reportFile;
    order.items[idx].reportFileName = reportFileName || "report.pdf";
    order.items[idx].reportUploadedAt = new Date();
    await order.save();

    const updated = await Order.findById(order._id).populate("user", "name email phone");
    res.json(updated);
  } catch (err) {
    console.error("Upload report error:", err);
    res.status(500).json({ error: "Failed to upload report" });
  }
});

// DELETE /api/admin/orders/:orderId/items/:itemIndex/report - remove report
router.delete("/orders/:orderId/items/:itemIndex/report", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const idx = parseInt(req.params.itemIndex);
    if (idx < 0 || idx >= order.items.length) return res.status(400).json({ error: "Invalid item index" });

    order.items[idx].reportFile = undefined;
    order.items[idx].reportFileName = undefined;
    order.items[idx].reportUploadedAt = undefined;
    await order.save();

    const updated = await Order.findById(order._id).populate("user", "name email phone");
    res.json(updated);
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

// GET /api/admin/prescriptions - get all prescriptions
router.get("/prescriptions", adminAuth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    console.error("Admin prescriptions error:", err);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

// PATCH /api/admin/prescriptions/:id - update prescription status
router.patch("/prescriptions/:id", adminAuth, async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminRemarks !== undefined) update.adminRemarks = adminRemarks;
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("user", "name email phone");
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });
    res.json(prescription);
  } catch (err) {
    console.error("Update prescription error:", err);
    res.status(500).json({ error: "Failed to update prescription" });
  }
});

export default router;
