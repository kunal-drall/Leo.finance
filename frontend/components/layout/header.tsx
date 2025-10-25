"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Header component with wallet connection
 * Responsive design: mobile hamburger menu, desktop full navigation
 */
export function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ paddingTop: "var(--safe-top, 0px)" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="hidden sm:inline-block font-bold text-xl">
            Leo Finance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/circles"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Circles
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Wallet Connect Button */}
        <div className="flex items-center space-x-2">
          <ConnectButton
            chainStatus="icon"
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
