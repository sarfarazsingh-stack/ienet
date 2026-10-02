import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const title = "The Founder's Shadow: Depth to Defect";
const description =
  "An interactive declassified memorandum for Professor Joe Haslam, Scaleup Masterclass, IE Business School, by Sarfaraz Singh Wahad.";

const metadataBase = new URL(
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
);

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  applicationName: "The Founder's Shadow",
  authors: [{ name: "Sarfaraz Singh Wahad" }],
  keywords: [
    "Joe Haslam",
    "Scaleup Masterclass",
    "IE Business School",
    "AnterVid",
    "Sarfaraz Singh Wahad",
  ],
  openGraph: {
    title,
    description,
    type: "article",
    locale: "en_US",
    siteName: "The Founder's Shadow",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#030708",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="bg-abyss font-mono text-titanium antialiased">{children}</body>
    </html>
  );
}
