/**
 * MongoDB connection singleton for Next.js.
 *
 * On Sliplane the app runs as a persistent Node.js process (next start),
 * so we maintain one connection across all requests rather than
 * reconnecting on every API call.
 *
 * Set MONGODB_URI in:
 *   - Local dev:   .env.local
 *   - Production:  Sliplane dashboard → Environment Variables
 *
 * Format: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/pnb
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined. Add it to .env.local (dev) or Sliplane dashboard (prod).");
}

// Module-level cache — survives hot reloads in development
let cached = global as typeof global & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.mongoose!.conn) {
    return cached.mongoose!.conn;
  }

  if (!cached.mongoose!.promise) {
    cached.mongoose!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,        // max 10 concurrent connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  cached.mongoose!.conn = await cached.mongoose!.promise;
  return cached.mongoose!.conn;
}
