"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import tower from "@/../public/tower.jpg";

// Mock credentials for demo
const MOCK_USERS = {
  bulkDealer: {
    email: "dealer@energy.ng",
    password: "dealer123",
    role: "Bulk Dealer",
  },
  merchant: {
    email: "merchant@energy.ng",
    password: "merchant123",
    role: "Merchant",
  },
};

export default function Login() {
  const router = useRouter();
  const [userType, setUserType] = useState<"Bulk Dealer" | "Merchant">("Bulk Dealer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleUserType = () => {
    setUserType((prev) => (prev === "Bulk Dealer" ? "Merchant" : "Bulk Dealer"));
    setError(""); // Clear errors when switching
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check credentials based on user type
    const mockUser = userType === "Bulk Dealer" ? MOCK_USERS.bulkDealer : MOCK_USERS.merchant;

    if (email === mockUser.email && password === mockUser.password) {
      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: mockUser.email,
          role: mockUser.role,
          name: mockUser.role === "Bulk Dealer" ? "John Dealer" : "Jane Merchant",
        })
      );

      // Redirect based on user type
      if (userType === "Bulk Dealer") {
        router.push("/bulk-dealer-dashboard");
      } else {
        router.push("/merchant-dashboard");
      }
    } else {
      setError("Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat overflow-hidden relative"
      style={{ backgroundImage: `url(${tower.src})` }}
    >
      <Head><title>Sign In | e-Nergy</title></Head>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Container */}
      <div className="relative flex w-[90%] max-w-6xl h-[70vh] bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border-4 border-orange-500 z-10 mt-10">
        
        {/* Left Image Section */}
        <div className="relative w-1/2 hidden md:block">
          <Image src={tower} alt="tower" fill className="object-cover" priority />
          {/* Centered dynamic greeting over the image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white bg-black/80 backdrop-blur-sm p-6 text-center text-2xl md:text-3xl font-bold drop-shadow-lg rounded-lg border-2 border-orange-500">
              Hi, {userType}
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 md:p-16">
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 mb-8 text-center">
            Sign in to access your e-Nergy account
          </p>

          {/* Toggle button */}
          <button
            onClick={toggleUserType}
            className="mb-6 text-center bg-orange-500 rounded-md px-6 py-2 text-white cursor-pointer hover:bg-orange-600 transition-all font-semibold"
            aria-pressed={userType === "Bulk Dealer" ? "true" : "false"}
          >
            Switch to {userType === "Bulk Dealer" ? "Merchant" : "Bulk Dealer"}
          </button>

          {/* Demo credentials hint */}
          <div className="w-full max-w-sm mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            <p className="font-bold mb-1">Demo Credentials:</p>
            <p className="font-mono">
              {userType === "Bulk Dealer" ? "dealer@energy.ng" : "merchant@energy.ng"}
            </p>
            <p className="font-mono">
              {userType === "Bulk Dealer" ? "dealer123" : "merchant123"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <input
              type="email"
              placeholder="Enter email"
              className="w-full rounded-full bg-gray-200 py-3 px-5 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Enter password"
              className="w-full rounded-full bg-gray-200 py-3 px-5 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Primary login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-orange-500 text-white py-3 font-semibold hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                `Login as ${userType}`
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-700">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-orange-500 hover:underline">
              sign up
            </Link>
            <br />
            <Link
              href="/forgot-password"
              className="text-sm text-orange-500 hover:underline mt-2 block text-center"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
