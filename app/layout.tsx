"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FooterPlayer from "@/components/FooterPlayer";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <html lang="en" className={isDarkMode ? "dark" : ""} suppressHydrationWarning>
      <head>
        <title>NextPlay - Your Music Streaming App</title>
        <meta name="description" content="Stream music with NextPlay - powered by Deezer API" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`} suppressHydrationWarning>
        <Navbar />
        <main className="pb-32 min-h-screen">{children}</main>
        <FooterPlayer />
      </body>
    </html>
  );
}
