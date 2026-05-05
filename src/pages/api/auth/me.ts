/**
 * GET /api/auth/me
 *
 * Returns the current user from the session token.
 * Used by the frontend to rehydrate auth state on page load.
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { StationManager } from "@/lib/models/StationManager";
import { getSessionUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const session = await getSessionUser(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();

  // Try regular user first, then station manager
  const user = await User.findById(session.userId).select("-passwordHash -emailVerifyCode -resetToken").lean();
  if (user) {
    return res.status(200).json({ user });
  }

  const sm = await StationManager.findById(session.userId).select("-passwordHash -resetToken").lean();
  if (sm) {
    return res.status(200).json({ user: { ...sm, role: "station_manager" } });
  }

  return res.status(404).json({ error: "User not found" });
}
