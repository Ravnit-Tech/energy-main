import React from 'react'
import Link from 'next/link'

function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center py-3 sm:py-4 border-t border-gray-300 bg-black/40 backdrop-blur">
      <Link
        href="/contact"
        className="flex-1 text-center text-white font-bold text-sm sm:text-lg md:text-2xl hover:underline transition"
      >
        Contact
      </Link>
      <span className="w-px h-5 sm:h-6 bg-gray-300 mx-1 sm:mx-2" />
      <Link
        href="/privacy-policy"
        className="flex-1 text-center text-white font-bold text-sm sm:text-lg md:text-2xl hover:underline transition"
      >
        Privacy Policy
      </Link>
      <span className="w-px h-5 sm:h-6 bg-gray-300 mx-1 sm:mx-2" />
      <Link
        href="/about"
        className="flex-1 text-center text-white font-bold text-sm sm:text-lg md:text-2xl hover:underline transition"
      >
        About Us
      </Link>
    </nav>
  )
}

export default BottomNavbar
