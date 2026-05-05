import Link from "next/link";
import Head from "next/head";

export default function LandingPage() {
  return (
    <>
      <Head><title>e-Nergy | Nigerian Petroleum Platform</title></Head>
    <div
      className="relative min-h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/tower.jpg')" }}
    >
      {/* overlay layer to darken the background */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:justify-between w-full max-w-3xl space-y-8 md:space-y-0 md:space-x-8 text-white p-8 rounded-lg">
        <div className="flex-1 flex flex-col items-center text-center space-y-2">
          <p className="text-lg md:text-xl font-medium">Welcome to e-Nergy</p>
          <h1 className="text-2xl md:text-5xl font-bold">Click here to explore</h1>
          <Link href="/home">
          <button className="px-20 py-3 text-2xl bg-[#00FFE1] bg-opacity-80 cursor-pointer rounded-3xl shadow font-semibold text-black hover:bg-opacity-100 transition">
            Go to e-Nergy
          </button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}