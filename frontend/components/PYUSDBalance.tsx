"use client";

import { formatUnits } from "viem";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Loader2 } from "lucide-react";
import { usePYUSDBalance } from "@/hooks/usePYUSD";
import { PYUSD_METADATA } from "@/lib/config/tokens";

interface PYUSDBalanceProps {
  showIcon?: boolean;
  className?: string;
}

/**
 * Component to display user's PYUSD balance
 * Automatically updates when balance changes
 */
export function PYUSDBalance({ showIcon = true, className = "" }: PYUSDBalanceProps) {
  const { data: balance, isLoading, isError } = usePYUSDBalance();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading balance...</span>
      </div>
    );
  }

  if (isError || balance === undefined) {
    return (
      <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
        {showIcon && <Wallet className="h-4 w-4" />}
        <span className="text-sm">--</span>
      </div>
    );
  }

  const formattedBalance = formatUnits(balance, PYUSD_METADATA.decimals);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Wallet className="h-4 w-4 text-primary" />}
      <div className="flex items-baseline gap-1">
        <span className="font-semibold">{formattedBalance}</span>
        <span className="text-sm text-muted-foreground">{PYUSD_METADATA.symbol}</span>
      </div>
    </div>
  );
}

/**
 * Card variant for displaying PYUSD balance
 */
export function PYUSDBalanceCard({ className = "" }: { className?: string }) {
  const { data: balance, isLoading } = usePYUSDBalance();

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              {isLoading ? (
                <div className="flex items-center gap-2 mt-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : balance !== undefined ? (
                <p className="text-2xl font-bold">
                  {formatUnits(balance, PYUSD_METADATA.decimals)}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    {PYUSD_METADATA.symbol}
                  </span>
                </p>
              ) : (
                <p className="text-2xl font-bold text-muted-foreground">--</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
