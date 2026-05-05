/**
 * POST /api/auth/reset-password
 *
 * Consumes a reset token and sets a new password.
 * Token is single-use — cleared after successful reset.
 *
 * Body: { token, password }
 */
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Session } from "@/lib/models/Session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { token, password } = req.body as { token?: string; password?: string };
  if (!token || !password) {
    return res.status(400).json({ error: "token and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  await connectDB();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExp: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired reset token" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await Promise.all([
    User.findByIdAndUpdate(user._id, {
      passwordHash,
      $unset: { resetToken: 1, resetTokenExp: 1 },
    }),
    // Invalidate all existing sessions for security
    Session.updateMany({ userEmail: user.email }, { isValid: false }),
  ]);

  return res.status(200).json({ ok: true, message: "Password reset successfully. Please log in." });
}
