import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RootOS | Private_Terminal",
  description: "Unauthorized access is strictly prohibited.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased bg-black text-zinc-400 font-mono`}>
        {/* GLOBAL SCANLINES */}
        <div className="fixed inset-0 pointer-events-none z-50 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.01)_0px,rgba(255,255,255,0.01)_1px,transparent_1px,transparent_3px)] opacity-50"></div>
        
        {/* SYSTEM AMBIENCE */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.5)_0%,rgba(0,0,0,1)_100%)]"></div>

        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}