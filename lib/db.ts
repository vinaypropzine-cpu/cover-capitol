// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; // Remove the '!' for a safer check

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is missing from .env.local");
  }

  await mongoose.connect(MONGODB_URI, {
    family: 4, // 👈 Keeping your IPv4 fix from research
  });
  console.log("✅ Database Connected Successfully");
}
