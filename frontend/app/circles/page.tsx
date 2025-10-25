"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Search, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleCard } from "@/components/circles/circle-card";
import { CircleState } from "@/types/circle";
import { useTotalCircles } from "@/hooks/useCircles";

/**
 * Circles Browse/Discovery Page
 * Browse and join available circles
 */
export default function CirclesPage() {
  const { isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const { totalCircles, isLoading } = useTotalCircles();

  // Mock circles data (in production, fetch from contract)
  const mockCircles = [
    {
      id: 1,
      name: "Monthly Savers",
      contributionAmount: BigInt(100 * 1e18),
      frequency: "Monthly",
      members: 5,
      maxMembers: 10,
      state: CircleState.Pending,
      progress: 0,
      address: "0x0000000000000000000000000000000000000001",
    },
    {
      id: 2,
      name: "Weekly Contributors",
      contributionAmount: BigInt(25 * 1e18),
      frequency: "Weekly",
      members: 8,
      maxMembers: 12,
      state: CircleState.Active,
      progress: 66,
      address: "0x0000000000000000000000000000000000000002",
    },
    {
      id: 3,
      name: "Crypto Savers",
      contributionAmount: BigInt(200 * 1e18),
      frequency: "Monthly",
      members: 10,
      maxMembers: 10,
      state: CircleState.Active,
      progress: 40,
      address: "0x0000000000000000000000000000000000000003",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Browse Savings Circles
            </h1>
            <p className="mt-1 text-muted-foreground">
              Discover and join circles to start saving together
            </p>
          </div>
          {isConnected && (
            <Link href="/circles/create">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Create Circle
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalCircles}</div>
              <p className="text-sm text-muted-foreground">Total Circles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {mockCircles.filter((c) => c.state === CircleState.Pending).length}
              </div>
              <p className="text-sm text-muted-foreground">Open to Join</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {mockCircles.filter((c) => c.state === CircleState.Active).length}
              </div>
              <p className="text-sm text-muted-foreground">Active Circles</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search circles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filter Tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
          All Circles
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
          Pending
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
          Active
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
          Monthly
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
          Weekly
        </Badge>
      </div>

      {/* Circles Grid */}
      <div>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : mockCircles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCircles.map((circle) => (
              <CircleCard key={circle.id} {...circle} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="mb-2 text-lg font-semibold">No circles found</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Try adjusting your search or create a new circle.
              </p>
              {isConnected && (
                <Link href="/circles/create">
                  <Button>Create Circle</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
