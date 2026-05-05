"use client";
import Image from "next/image";
import { tower } from "../../public";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden border-4 border-orange-500">
        {/* Left Image Section */}
        <div className="relative w-1/2 hidden md:block">
          <Image
            src={tower}
            alt="tower"
            fill
            className="object-cover"
          />
          {/* Curved Divider */}
          <div className="absolute right-0 top-0 h-full w-20 bg-white [clip-path:polygon(100%_0,0_50%,100%_100%)]"></div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
          <h2 className="text-3xl font-semibold mb-8 text-center">Sign Up</h2>
          <form className="w-full max-w-sm space-y-5">
            <input
              type="text"
              placeholder="Enter name"
              className="w-full rounded-full bg-gray-200 py-3 px-5 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Enter email"
              className="w-full rounded-full bg-gray-200 py-3 px-5 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Enter password"
              className="w-full rounded-full bg-gray-200 py-3 px-5 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-full bg-gray-200 py-3 px-5 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-orange-500 text-white py-3 font-semibold hover:bg-orange-600 transition"
            >
              Sign up
            </button>
          </form>

          <p className="mt-6 text-sm text-center">
            Have an account?{" "}
            <a href="#" className="font-semibold text-black">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
