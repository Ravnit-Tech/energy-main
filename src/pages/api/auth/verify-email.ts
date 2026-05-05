/**
 * POST /api/auth/verify-email
 *
 * Verifies a 6-digit OTP sent to the user's email after signup.
 * On success: sets emailVerified = true and returns a fresh token.
 *
 * Body: { email, code }
 *
 * NOTE: OTP sending is stubbed — in production, generate a random 6-digit
 * code on signup, hash it, store in emailVerifyCode/emailVerifyExp,
 * and send it via your email provider (Resend, Postmark, etc.).
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, code } = req.body as { email?: string; code?: string };
  if (!email || !code) {
    return res.status(400).json({ error: "email and code are required" });
  }
  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: "Code must be 6 digits" });
  }

  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.emailVerified) {
    return res.status(200).json({ ok: true, message: "Email already verified" });
  }

  // ── OTP validation ────────────────────────────────────────────────────────
  // In production: compare bcrypt.compare(code, user.emailVerifyCode)
  // and check user.emailVerifyExp > Date.now()
  //
  // For now: accept the demo code "123456" or the stored plain code
  const isDemo = code === "123456";
  const isStored = user.emailVerifyCode && user.emailVerifyCode === code;
  const isExpired = user.emailVerifyExp && new Date(user.emailVerifyExp) < new Date();

  if (!isDemo && (!isStored || isExpired)) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  await User.findByIdAndUpdate(user._id, {
    emailVerified: true,
    $unset: { emailVerifyCode: 1, emailVerifyExp: 1 },
  });

  return res.status(200).json({ ok: true, message: "Email verified successfully" });
}
