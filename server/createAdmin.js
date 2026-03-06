import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const ADMIN_EMAIL = "admin@alliance.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Admin";

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    // If user exists but is not admin, upgrade to admin
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`Upgraded existing user "${ADMIN_EMAIL}" to admin role.`);
    } else {
      console.log(`Admin "${ADMIN_EMAIL}" already exists.`);
    }
  } else {
    const { salt, hash } = User.hashPassword(ADMIN_PASSWORD);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash: hash,
      salt,
      role: "admin",
    });
    console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
