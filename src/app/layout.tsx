import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "@fontsource/bebas-neue";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { SiteFooter } from "@/components/footer";
import { MobileNav, SiteHeader } from "@/components/shell";
import { creator } from "@/lib/config/creator";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: { default: "Itachi's Corner — Where Truth Meets Dialogue", template: "%s · Itachi's Corner" },
  description: `Da'wah, learning and thoughtful dialogue. ${creator.disclosure}`,
  applicationName: "Itachi's Corner",
  openGraph: {
    title: "Itachi's Corner — Where Truth Meets Dialogue",
    description: `Every question opens a new sky. ${creator.disclosure}`,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B0A14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-scroll-behavior="smooth">
      <body className="min-h-dvh">
        <SiteHeader />
        <div className="concept-disclosure">
          <p className="shell py-2">
            {creator.disclosure}{" "}
            <Link href="/about" className="text-cream/75 underline underline-offset-2 hover:text-cream">Learn more</Link>
          </p>
        </div>
        <main id="main" className="relative">
          {children}
        </main>
        <SiteFooter />
        <MobileNav />
      </body>
    </html>
  );
}
