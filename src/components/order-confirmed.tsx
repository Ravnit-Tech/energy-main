import { useRouter } from "next/router";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import tower from "@/../public/tower.jpg";

export default function OrderConfirmed() {
  const router = useRouter();
  const { ref, company } = router.query;

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${tower.src})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <NavBar />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-6 pt-24">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-4 border-orange-500 p-10 max-w-lg w-full text-center space-y-6">

          {/* Success icon */}
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-10 h-10">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Payment Successful!</h1>
            <p className="text-gray-500 text-sm mt-2">
              Your order has been confirmed and is now being processed.
            </p>
          </div>

          {/* Order details box */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-5 text-left space-y-3">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Order Summary</p>

            {company && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Company</span>
                <span className="font-semibold text-gray-800">{company}</span>
              </div>
            )}

            {ref && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Reference</span>
                <span className="font-mono font-semibold text-orange-600 text-xs break-all">{ref}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-teal-600">✓ Confirmed</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Next Steps</span>
              <span className="font-semibold text-gray-800 text-right">Team contacts you within 48hrs</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            A confirmation has been recorded for your order. Please save your payment reference
            number for your records. Our team will reach out to coordinate delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/buynow"
              className="px-6 py-2 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600 transition"
            >
              Place Another Order
            </Link>
            <Link
              href="/"
              className="px-6 py-2 border-2 border-orange-500 text-orange-500 text-sm font-bold rounded hover:bg-orange-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center gap-6 py-4 text-white text-sm">
        <Link href="/contact" className="hover:text-orange-300 transition font-medium">Contact</Link>
        <span className="opacity-40">|</span>
        <Link href="/privacy" className="hover:text-orange-300 transition font-medium">Privacy Policy</Link>
        <span className="opacity-40">|</span>
        <Link href="/about" className="hover:text-orange-300 transition font-medium">About Us</Link>
      </footer>
    </div>
  );
}
