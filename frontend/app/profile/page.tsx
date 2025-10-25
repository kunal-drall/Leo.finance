"use client";

import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  User,
  Wallet,
  Settings,
  LogOut,
  Shield,
  Award,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAddress } from "@/lib/utils";

/**
 * Profile Page
 * User profile, trust score, and settings
 */
export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-4 text-2xl font-bold md:text-3xl">
            Connect Your Wallet
          </h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Connect your wallet to view your profile and trust score.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account and view your trust score
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold sm:mb-0">
              {address?.slice(2, 4).toUpperCase()}
            </div>
            <div className="sm:ml-6 flex-1">
              <h2 className="text-xl font-bold">
                {formatAddress(address || "")}
              </h2>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Address
                    </>
                  )}
                </button>
                <Badge variant="success">Verified</Badge>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => disconnect()}
              className="mt-4 sm:mt-0"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Score */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Trust Score
          </CardTitle>
          <CardDescription>
            Your on-chain reputation based on circle participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-primary">750</div>
                <p className="text-sm text-muted-foreground">Excellent</p>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-primary text-2xl font-bold text-primary">
                A+
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Circles Completed</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">On-time Contributions</span>
                <span className="font-semibold">100%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-semibold">Jan 2025</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="mb-3 flex items-center gap-2 font-semibold">
                <Award className="h-4 w-4 text-secondary" />
                Achievements
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Early Adopter</Badge>
                <Badge variant="success">Perfect Record</Badge>
                <Badge variant="default">Active Saver</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Circles
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Currently participating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Saved
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250</div>
            <p className="text-xs text-muted-foreground">Lifetime contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Rank</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Top 5%</div>
            <p className="text-xs text-muted-foreground">Among all users</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left transition-colors hover:border-primary">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Manage email and push notifications
                </div>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </button>

            <button className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left transition-colors hover:border-primary">
              <div>
                <div className="font-medium">Privacy</div>
                <div className="text-sm text-muted-foreground">
                  Control who can see your profile
                </div>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </button>

            <button className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left transition-colors hover:border-primary">
              <div>
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-muted-foreground">
                  Download your transaction history
                </div>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
