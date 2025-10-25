"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Plus, Wallet, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCard } from "@/components/circles/circle-card";
import { useUserCircles, useCircleInfo } from "@/hooks/useCircles";
import { CircleState } from "@/types/circle";

/**
 * Dashboard Page
 * Shows user's circles and quick stats
 */
export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { circleIds, isLoading } = useUserCircles();

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-4 text-2xl font-bold md:text-3xl">
            Connect Your Wallet
          </h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Connect your wallet to view your dashboard, manage your circles, and
            start saving together.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your savings circles and track your progress
          </p>
        </div>
        <Link href="/circles/create">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Create Circle
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Circles
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {circleIds?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Circles you're participating in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contributed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              Across all circles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              No upcoming payouts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Circles Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Your Circles</h2>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : circleIds && circleIds.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {circleIds.map((circleId, index) => (
              <DashboardCircleCard key={index} circleId={Number(circleId)} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No circles yet</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Create your first circle or join an existing one to start
                saving together.
              </p>
              <div className="flex gap-3">
                <Link href="/circles/create">
                  <Button>Create Circle</Button>
                </Link>
                <Link href="/circles">
                  <Button variant="outline">Browse Circles</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * Circle Card for Dashboard
 * Loads circle data and displays it
 */
function DashboardCircleCard({ circleId }: { circleId: number }) {
  // For now, use mock data since we don't have circle addresses yet
  // In production, you'd fetch the circle address from LeoCore contract

  return (
    <CircleCard
      id={circleId}
      name={`Savings Circle #${circleId}`}
      contributionAmount={BigInt(100 * 1e18)}
      frequency="Monthly"
      members={3}
      maxMembers={10}
      state={CircleState.Active}
      progress={30}
      address={`0x${circleId.toString().padStart(40, "0")}`}
    />
  );
}
