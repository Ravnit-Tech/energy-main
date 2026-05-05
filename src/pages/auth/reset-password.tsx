import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import BottomNavbar from "@/components/ButtomNavbar";
import tower from "@/../public/tower.jpg";
import { HoneypotField, useHoneypot } from "@/lib/security/honeypot";
import { useRateLimit } from "@/hooks/useRateLimit";
import { api } from "@/lib/db-client";

type Step = "reset" | "success";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; // e.g. /reset-password?token=abc123

  const [step, setStep] = useState<Step>("reset");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { isBot } = useHoneypot(formRef);
  const rateLimit = useRateLimit({ maxAttempts: 5, windowMs: 60_000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isBot()) return;
    if (!rateLimit.attempt()) {
      setError(`Too many attempts. Please wait ${Math.ceil(rateLimit.remainingMs / 1000)}s.`);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token || typeof token !== "string") {
      setError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    setLoading(true);

    const result = await api.auth.resetPassword({ token, password });

    setLoading(false);

    if (result?.ok) {
      setStep("success");
    } else {
      setError("This reset link has expired or is invalid. Please request a new one.");
    }
  };

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.071-3.424M6.6 6.6A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411M3 3l18 18" />
      </svg>
    );

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat overflow-hidden relative"
      style={{ backgroundImage: `url(${tower.src})` }}
    >
      <Head><title>Reset Password | e-Nergy</title></Head>
      <NavBar />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card */}
      <div className="relative flex w-[90%] max-w-6xl h-[70vh] bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border-4 border-primary z-10 mt-[-2rem]">
        {/* Left Image */}
        <div className="relative w-1/2 hidden md:block">
          <Image src={tower} alt="tower" fill className="object-cover" priority />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white bg-black p-2 text-center text-2xl md:text-3xl font-bold drop-shadow-lg rounded-lg">
              {step === "reset" ? "New Password" : "All Done!"}
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 md:p-16">
          {step === "reset" ? (
            <>
              {/* Shield icon */}
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
                Set New Password
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
                Choose a strong password you haven&apos;t used before.
              </p>

              {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
                <HoneypotField />
                {/* New password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-full bg-gray-200 py-3 px-5 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>

                {/* Confirm password */}
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full rounded-full bg-gray-200 py-3 px-5 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>

                {/* Strength hint */}
                <p className="text-xs text-gray-400 px-2">
                  At least 8 characters. Mix uppercase, numbers & symbols for a stronger password.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-700">
                <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                  Back to Login
                </Link>
              </p>
            </>
          ) : (
            /* ── Success Step ── */
            <>
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border-2 border-green-400">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
                Password Reset!
              </h2>
              <p className="text-sm text-gray-500 text-center mb-8 max-w-xs">
                Your password has been updated successfully. You can now log in with your new password.
              </p>

              <Link
                href="/auth/login"
                className="w-full max-w-sm block text-center rounded-full bg-primary text-white py-3 font-semibold hover:opacity-90 transition"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}
