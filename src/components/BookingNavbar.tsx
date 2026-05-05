"use client";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function BookingNavbar() {
  return (
    <nav
      className="w-full h-40 flex items-center justify-between px-6 md:px-40 text-white font-semibold"
    >
      {/* Left - Logo */}
      <div className="text-2xl md:text-4xl">Logo</div>

      {/* Right Section */}
      <div className="flex items-center gap-8 text-lg">
        <Link href="/home">

        <button className="hover:text-gray-300 md:text-4xl transition">Log out</button>
        </Link>

        <div className="flex items-center gap-2">
          <FaUser size={20} />
          <span className="md:text-4xl">User</span>
        </div>
      </div>
    </nav>
  );
}
