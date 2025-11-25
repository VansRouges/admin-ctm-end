import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["monospace", "Courier New"],
});

export const metadata: Metadata = {
  title: "CTM Admin Dashboard - Copy Trading Markets",
  description: "Administrative dashboard for managing users, transactions, and operations on the Copy Trading Markets crypto investment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-black">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
