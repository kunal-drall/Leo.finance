"use client";

import { use } from "react";
import { useAccount } from "wagmi";
import { ArrowLeft, Users, DollarSign, Calendar, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleState } from "@/types/circle";
import { formatCurrency, formatAddress } from "@/lib/utils";

interface CircleDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Circle Detail Page
 * Shows detailed information about a specific circle
 */
export default function CircleDetailPage({ params }: CircleDetailPageProps) {
  const { id } = use(params);
  const { address, isConnected } = useAccount();

  // Mock circle data (in production, fetch from contract)
  const circle = {
    id: parseInt(id),
    name: "Monthly Savers Club",
    description: "Save together, grow together. Monthly contributions for financial freedom.",
    contributionAmount: BigInt(100 * 1e18),
    frequency: "Monthly",
    maxMembers: 10,
    currentMembers: 5,
    state: CircleState.Active,
    currentRound: 2,
    totalRounds: 10,
    startTime: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    creator: "0x1234567890123456789012345678901234567890",
    members: [
      {
        address: "0x1234567890123456789012345678901234567890",
        hasPaid: true,
        hasReceivedPayout: true,
        totalContributed: BigInt(200 * 1e18),
      },
      {
        address: "0x2345678901234567890123456789012345678901",
        hasPaid: true,
        hasReceivedPayout: false,
        totalContributed: BigInt(200 * 1e18),
      },
      {
        address: "0x3456789012345678901234567890123456789012",
        hasPaid: false,
        hasReceivedPayout: false,
        totalContributed: BigInt(100 * 1e18),
      },
      {
        address: "0x4567890123456789012345678901234567890123",
        hasPaid: true,
        hasReceivedPayout: false,
        totalContributed: BigInt(200 * 1e18),
      },
      {
        address: "0x5678901234567890123456789012345678901234",
        hasPaid: true,
        hasReceivedPayout: false,
        totalContributed: BigInt(200 * 1e18),
      },
    ],
  };

  const progress = (circle.currentRound / circle.totalRounds) * 100;
  const isMember = circle.members.some((m) => m.address === address);
  const userMember = circle.members.find((m) => m.address === address);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:py-12">
      {/* Back Button */}
      <Link href="/circles" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Circles
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{circle.name}</h1>
            {circle.description && (
              <p className="mt-2 text-muted-foreground">{circle.description}</p>
            )}
          </div>
          <Badge variant="active">Active</Badge>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Round Progress</div>
              <div className="text-2xl font-bold">
                Round {circle.currentRound} of {circle.totalRounds}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Completion</div>
              <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
            </div>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Contribution Amount
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(Number(circle.contributionAmount) / 1e18, "USD")}
                </div>
                <p className="text-xs text-muted-foreground">per round</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Frequency</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{circle.frequency}</div>
                <p className="text-xs text-muted-foreground">contribution schedule</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pool Size</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    (Number(circle.contributionAmount) / 1e18) * circle.maxMembers,
                    "USD"
                  )}
                </div>
                <p className="text-xs text-muted-foreground">per payout</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Round</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 days</div>
                <p className="text-xs text-muted-foreground">until contribution due</p>
              </CardContent>
            </Card>
          </div>

          {/* Members List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members ({circle.currentMembers}/{circle.maxMembers})
              </CardTitle>
              <CardDescription>Active participants in this circle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {circle.members.map((member, index) => (
                  <div
                    key={member.address}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">
                          {formatAddress(member.address)}
                          {member.address === circle.creator && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Creator
                            </Badge>
                          )}
                          {member.address === address && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Contributed: {formatCurrency(Number(member.totalContributed) / 1e18, "USD")}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {member.hasPaid && (
                        <Badge variant="success" className="text-xs">
                          Paid
                        </Badge>
                      )}
                      {member.hasReceivedPayout && (
                        <Badge variant="default" className="text-xs">
                          Received
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isMember ? (
                <>
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <div className="text-sm text-muted-foreground">Total Contributed</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(Number(userMember?.totalContributed || BigInt(0)) / 1e18, "USD")}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">This Round:</span>
                      <span className="font-medium">
                        {userMember?.hasPaid ? (
                          <Badge variant="success" className="text-xs">Paid</Badge>
                        ) : (
                          <Badge variant="pending" className="text-xs">Pending</Badge>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payout Received:</span>
                      <span className="font-medium">
                        {userMember?.hasReceivedPayout ? "Yes" : "Not yet"}
                      </span>
                    </div>
                  </div>

                  {!userMember?.hasPaid && (
                    <Button fullWidth size="lg">
                      Contribute Now
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    {circle.currentMembers < circle.maxMembers
                      ? "Join this circle to start saving together!"
                      : "This circle is full"}
                  </p>
                  <Button
                    fullWidth
                    size="lg"
                    disabled={circle.currentMembers >= circle.maxMembers}
                  >
                    {circle.currentMembers < circle.maxMembers ? "Join Circle" : "Circle Full"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Circle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Circle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creator:</span>
                <span className="font-medium">{formatAddress(circle.creator)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started:</span>
                <span className="font-medium">
                  {new Date(circle.startTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract:</span>
                <span className="font-medium font-mono">{formatAddress(id)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
