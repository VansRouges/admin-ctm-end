import type { Metadata } from "next";
import "./globals.css";

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
      <body className="font-sans antialiased bg-black">
        {children}
      </body>
    </html>
  );
}
