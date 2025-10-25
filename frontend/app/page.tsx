import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Zap,
  Shield,
  Users,
  TrendingUp,
  Globe,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

/**
 * Leo Finance Landing Page
 * Mobile-first responsive design with hero section, features, and CTA
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-12 md:py-20 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Powered by Yellow Network & Pyth Oracle
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Save Together,
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Grow Together
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 text-base text-muted-foreground md:text-lg lg:text-xl">
              Join decentralized savings circles with gasless transactions.
              <br className="hidden md:block" />
              Build trust, save money, and achieve your financial goals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" fullWidth className="sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                fullWidth
                className="sm:w-auto"
              >
                How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8">
              <div>
                <div className="text-2xl font-bold text-primary md:text-3xl">
                  $0
                </div>
                <div className="text-xs text-muted-foreground md:text-sm">
                  Gas Fees
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary md:text-3xl">
                  100%
                </div>
                <div className="text-xs text-muted-foreground md:text-sm">
                  On-Chain
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary md:text-3xl">
                  24/7
                </div>
                <div className="text-xs text-muted-foreground md:text-sm">
                  Access
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-gradient-to-b from-primary/5 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
              Why Choose Leo Finance?
            </h2>
            <p className="text-muted-foreground md:text-lg">
              The future of community savings is here
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gasless Transactions</CardTitle>
                <CardDescription>
                  Zero gas fees powered by Yellow Network. Contribute without
                  worrying about transaction costs.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:border-secondary transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Trust Scoring</CardTitle>
                <CardDescription>
                  Build your on-chain reputation. Earn trust points and unlock
                  better circle opportunities.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:border-success transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Community Circles</CardTitle>
                <CardDescription>
                  Join or create savings circles with friends, family, or the
                  global community.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Automated Payouts</CardTitle>
                <CardDescription>
                  Smart contracts handle everything. Automatic contributions and
                  rotating payouts.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 hover:border-secondary transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Globe className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Real-Time Pricing</CardTitle>
                <CardDescription>
                  Powered by Pyth Oracle for accurate, real-time price feeds and
                  fair distributions.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 hover:border-success transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Secure & Transparent</CardTitle>
                <CardDescription>
                  All transactions on-chain. Audited smart contracts. Complete
                  transparency.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
              How It Works
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Get started in three simple steps
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Connect Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your Web3 wallet. Supports MetaMask, Rainbow, and
                  more.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Join or Create Circle
                </h3>
                <p className="text-muted-foreground">
                  Browse existing circles or create your own with custom terms.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Start Saving</h3>
                <p className="text-muted-foreground">
                  Make contributions and receive payouts automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="py-12 text-center">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
                Ready to Start Saving?
              </h2>
              <p className="mb-8 text-muted-foreground md:text-lg">
                Join thousands of users building financial freedom together.
              </p>
              <Button size="lg" className="group">
                Launch App
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
