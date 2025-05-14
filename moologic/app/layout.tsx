import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"; // ✅ Import the new Providers wrapper
import { store } from "@/redux/store"; // ✅ Import the store

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MooLogic - Dairy Farm Management",
  description: "Comprehensive dairy farm management system",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* ✅ Wrap everything inside the Providers component */}
      </body>
    </html>
  );
}
