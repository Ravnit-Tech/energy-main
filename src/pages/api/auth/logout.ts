/**
 * POST /api/auth/logout
 *
 * Invalidates the current session and clears the cookie.
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { Session } from "@/lib/models/Session";
import { extractToken, verifyToken, clearTokenCookie } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = extractToken(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload?.sessionId) {
      await connectDB();
      await Session.findByIdAndUpdate(payload.sessionId, { isValid: false });
    }
  }

  clearTokenCookie(res);
  return res.status(200).json({ ok: true });
}
