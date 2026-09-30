import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Happy Farewell Seniors | Class of 2022-2027",
  description:
    "A cinematic farewell celebration honoring our seniors. Step into the memories, milestones, and heartfelt celebrations.",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Happy Farewell Seniors | Class of 2022-2027",
    description: "A cinematic farewell celebration honoring our seniors.",
    images: [{ url: "/college-logo.png" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#02040a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} dark h-full antialiased font-sans`}
    >
      <body className="min-h-full w-full bg-[#02040a] text-white select-none font-sans">
        {children}
      </body>
    </html>
  );
}
