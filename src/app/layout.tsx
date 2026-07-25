import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forge — AI Website Builder",
  description: "Build websites with AI. Ship in seconds. The modern platform that combines AI generation, visual editing, and export freedom.",
  keywords: ["AI website builder", "Forge", "web design", "AI generation", "visual editor", "export", "deploy"],
  authors: [{ name: "Forge" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Forge — AI Website Builder",
    description: "Build websites with AI. Ship in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forge — AI Website Builder",
    description: "Build websites with AI. Ship in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
