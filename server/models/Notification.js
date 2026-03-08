import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "new_order",
        "order_status_update",
        "new_prescription",
        "prescription_status_update",
        "new_booking",
        "booking_status_update",
        "report_uploaded",
        "admin_report_uploaded",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedId: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, recipientId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
