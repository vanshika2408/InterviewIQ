import mongoose from "mongoose";
import env from "./env.js";

export async function connectDB() {
  // Reuse existing database connection if already connected (vital for Vercel Serverless)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = env.mongoUri || process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI environment variable is missing!");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Never call process.exit(1) in serverless environment to prevent FUNCTION_INVOCATION_FAILED crashes
  }
}
