import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Web3Providers } from "@/components/layout/providers";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/mobile/bottom-nav";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Leo Finance - Decentralized Savings Circles",
  description:
    "Join gasless savings circles powered by blockchain. Save together, earn trust, and build financial freedom.",
  keywords: ["DeFi", "ROSCA", "Savings", "Web3", "PYUSD", "Gasless"],
  authors: [{ name: "Leo Finance Team" }],
  openGraph: {
    title: "Leo Finance - Decentralized Savings Circles",
    description: "Join gasless savings circles powered by blockchain",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Web3Providers>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <BottomNav />
            </div>
          </ToastProvider>
        </Web3Providers>
      </body>
    </html>
  );
}
