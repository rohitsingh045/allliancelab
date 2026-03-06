import express from "express";
import Order from "../models/Order.js";
import { authMiddleware } from "../lib/authHelpers.js";

const router = express.Router();

// POST /api/orders - create a new order (authenticated users)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod, paymentStatus, address, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (!address || !phone) {
      return res.status(400).json({ error: "Address and phone are required" });
    }

    const order = new Order({
      user: req.userId,
      items,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentStatus || "pending",
      orderStatus: "placed",
      address,
      phone,
    });

    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// GET /api/orders/my - get orders for logged-in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/my-reports - get orders that have reports uploaded for logged-in user
router.get("/my-reports", authMiddleware, async (req, res) => {
  try {
    // Find all orders for this user where at least one item has a report
    const orders = await Order.find({
      user: req.userId,
      "items.reportFile": { $exists: true, $ne: null },
    }).sort({ createdAt: -1 });

    const results = orders.map((order) => ({
      _id: order._id,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      items: order.items.map((item, idx) => ({
        index: idx,
        itemId: item.itemId,
        name: item.name,
        itemType: item.itemType,
        hasReport: !!item.reportFile,
        reportFileName: item.reportFileName,
        reportUploadedAt: item.reportUploadedAt,
      })),
    }));

    res.json(results);
  } catch (err) {
    console.error("Fetch reports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// GET /api/orders/:orderId/items/:itemIndex/report - download a specific report
router.get("/:orderId/items/:itemIndex/report", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.userId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const idx = parseInt(req.params.itemIndex);
    if (idx < 0 || idx >= order.items.length) return res.status(400).json({ error: "Invalid item" });

    const item = order.items[idx];
    if (!item.reportFile) return res.status(404).json({ error: "No report available" });

    res.json({ reportFile: item.reportFile, reportFileName: item.reportFileName });
  } catch (err) {
    console.error("Download report error:", err);
    res.status(500).json({ error: "Failed to download report" });
  }
});

export default router;
