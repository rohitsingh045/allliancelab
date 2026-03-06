import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  itemType: { type: String, enum: ["test", "package"], required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  reportFile: { type: String },
  reportFileName: { type: String },
  reportUploadedAt: { type: Date },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "sample_collected", "processing", "completed", "cancelled"],
      default: "placed",
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
