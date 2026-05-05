import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import BottomNavbar from "@/components/ButtomNavbar";
import tower from "@/../public/tower.jpg";
import { HoneypotField, useHoneypot } from "@/lib/security/honeypot";
import { useRateLimit } from "@/hooks/useRateLimit";
import { sanitizeString } from "@/lib/security/sanitize";
import { api } from "@/lib/db-client";

type Step = "request" | "sent";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const { isBot } = useHoneypot(formRef);
  const rateLimit = useRateLimit({ maxAttempts: 3, windowMs: 300_000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isBot()) return;
    if (!rateLimit.attempt()) {
      const mins = Math.ceil(rateLimit.remainingMs / 60_000);
      setError(`Too many requests. Please wait ${mins} minute(s).`);
      return;
    }
    const safeEmail = sanitizeString(email).toLowerCase().trim();
    setLoading(true);

    // Always advances to "sent" regardless of outcome — prevents email enumeration
    await api.auth.forgotPassword(safeEmail);

    setLoading(false);
    setStep("sent");
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat overflow-hidden relative"
      style={{ backgroundImage: `url(${tower.src})` }}
    >
      <Head><title>Forgot Password | e-Nergy</title></Head>
      <NavBar />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card Container */}
      <div className="relative flex w-[90%] max-w-6xl h-[70vh] bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border-4 border-primary z-10 mt-[-2rem]">
        {/* Left Image Section */}
        <div className="relative w-1/2 hidden md:block">
          <Image src={tower} alt="tower" fill className="object-cover" priority />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white bg-black p-2 text-center text-2xl md:text-3xl font-bold drop-shadow-lg rounded-lg">
              {step === "request" ? "Reset Password" : "Check Your Email"}
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 md:p-16">
          {step === "request" ? (
            <>
              {/* Lock icon */}
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5M5 10.5h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1z"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
                Forgot Password?
              </h2>
              <p className="text-sm text-gray-500 text-center mb-8 max-w-xs">
                No worries! Enter your registered email and we&apos;ll send you
                a link to reset your password.
              </p>

              <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
                <HoneypotField />
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-full bg-gray-200 py-3 px-5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-700">
                Remembered it?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </>
          ) : (
            /* ── Confirmation Step ── */
            <>
              {/* Envelope icon */}
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
                Email Sent!
              </h2>
              <p className="text-sm text-gray-500 text-center mb-2 max-w-xs">
                We&apos;ve sent a password reset link to
              </p>
              <p className="font-semibold text-primary text-center mb-6 text-sm break-all">
                {email}
              </p>
              <p className="text-xs text-gray-400 text-center mb-8 max-w-xs">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setStep("request")}
                  className="text-primary font-semibold hover:underline"
                >
                  try another email
                </button>
                .
              </p>

              <Link
                href="/auth/login"
                className="w-full max-w-sm block text-center rounded-full bg-primary text-white py-3 font-semibold hover:opacity-90 transition"
              >
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}
