import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
