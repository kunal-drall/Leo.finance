"use client";

import { useAccount, useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatAddress } from "@/lib/utils";

/**
 * Wallet Page
 * Shows wallet balance, transaction history, and PYUSD balance
 */
export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      type: "contribution",
      amount: 100,
      circle: "Monthly Savers",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 2,
      type: "payout",
      amount: 1000,
      circle: "Weekly Contributors",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 3,
      type: "contribution",
      amount: 25,
      circle: "Weekly Contributors",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "completed",
    },
  ];

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
            Connect your wallet to view your balance and transaction history.
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
        <h1 className="text-2xl font-bold md:text-3xl">Wallet</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your funds and view transaction history
        </p>
      </div>

      {/* Balance Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary to-primary-dark text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="h-5 w-5" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : "0 ETH"}
            </div>
            <p className="mt-2 text-sm text-white/80">
              {formatAddress(address || "")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary to-secondary-dark text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5" />
              PYUSD Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$0.00</div>
            <p className="mt-2 text-sm text-white/80">PayPal USD</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contributions
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125.00</div>
            <p className="text-xs text-muted-foreground">Across all circles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payouts
            </CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,000.00</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+$875.00</div>
            <p className="text-xs text-muted-foreground">Lifetime</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent contributions and payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tx.type === "contribution"
                        ? "bg-primary/10"
                        : "bg-success/10"
                    }`}
                  >
                    {tx.type === "contribution" ? (
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {tx.type === "contribution" ? "Contribution" : "Payout"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tx.circle} • {tx.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      tx.type === "contribution" ? "text-foreground" : "text-success"
                    }`}
                  >
                    {tx.type === "contribution" ? "-" : "+"}
                    {formatCurrency(tx.amount, "USD")}
                  </div>
                  <Badge variant="success" className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" fullWidth className="mt-4">
            View All Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
