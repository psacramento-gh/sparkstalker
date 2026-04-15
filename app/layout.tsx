import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { AppFrame } from "@/components/app-frame";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SparkStalker",
  description: "Resolve a public tether.me username to a SparkScan wallet page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-background font-sans text-foreground">
        <ThemeProvider>
          <TooltipProvider>
            <AppFrame>{children}</AppFrame>
            <Toaster richColors closeButton position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
