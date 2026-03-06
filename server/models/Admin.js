import mongoose from "mongoose";
import crypto from "crypto";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    name: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

adminSchema.statics.hashPassword = function (password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { salt, hash };
};

adminSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha512").toString("hex");
  return this.passwordHash === hash;
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
