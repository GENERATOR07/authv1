import mongoose from "mongoose";
import { env } from "./env";

export async function connectToMongo() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}
