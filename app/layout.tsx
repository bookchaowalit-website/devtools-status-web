import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// The font variable sits on <html>: the Dashboard shell tokens live on :root and read it from there.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Status | Bookchaowalit",
  description: "Three sample services with their state, uptime and open incidents. Authored values, no live probe.",
  keywords: ["status", "metrics"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL("https://status.bookchaowalit.com"),
  openGraph: {
    type: "website",
    title: "Status | Bookchaowalit",
    description: "Service status tiles with sample components.",
    siteName: "Bookchaowalit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
