import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NavBar, ButtomNavbar } from "@/components";
import { DepotProvider } from "@/context/DepotContext";

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  // Routes where the general layout should be hidden
  const hideLayout =
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/merchant") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/bulk-dealer") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/station-manager") ||
    pathname === "/" ||
    pathname === "/landing" ||
    pathname === "/landingPage";

  return (
    <DepotProvider>
      <div className="flex flex-col min-h-screen">
        {!hideLayout && <NavBar />}

        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        {!hideLayout && <ButtomNavbar />}
      </div>
    </DepotProvider>
  );
}
