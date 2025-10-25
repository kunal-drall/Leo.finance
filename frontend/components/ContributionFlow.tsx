"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits, Address } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { usePYUSDAddress, usePYUSDBalance, usePYUSDNeedsApproval } from "@/hooks/usePYUSD";
import { useSimulateApprove } from "@/hooks/useERC20";
import { leoCircleABI } from "@/lib/contracts/leoCircle";
import { toast } from "@/hooks/use-toast";

interface ContributionFlowProps {
  circleAddress: Address;
  contributionAmount: bigint;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Component that handles the PYUSD approval + contribution flow
 * Shows the user each step clearly
 */
export function ContributionFlow({
  circleAddress,
  contributionAmount,
  onSuccess,
  onError,
}: ContributionFlowProps) {
  const { address: userAddress } = useAccount();
  const pyusdAddress = usePYUSDAddress();
  const pyusdBalance = usePYUSDBalance();

  // Check if approval is needed
  const needsApproval = usePYUSDNeedsApproval(circleAddress, contributionAmount);

  // Approval transaction
  const simulateApprove = useSimulateApprove(
    pyusdAddress,
    circleAddress,
    contributionAmount
  );
  const {
    writeContract: writeApprove,
    data: approvalTxHash,
    isPending: isApprovePending,
  } = useWriteContract();
  const approvalReceipt = useWaitForTransactionReceipt({ hash: approvalTxHash });

  // Contribution transaction
  const {
    writeContract: writeContribute,
    data: contributeTxHash,
    isPending: isContributePending,
  } = useWriteContract();
  const contributeReceipt = useWaitForTransactionReceipt({
    hash: contributeTxHash,
  });

  // Track overall state
  const [step, setStep] = useState<
    "idle" | "approving" | "approved" | "contributing" | "success" | "error"
  >("idle");

  // Check if user has enough balance
  const hasEnoughBalance = pyusdBalance.data
    ? pyusdBalance.data >= contributionAmount
    : false;

  // Handle approval success
  useEffect(() => {
    if (approvalReceipt.isSuccess) {
      setStep("approved");
      toast({
        title: "Approval Confirmed",
        description: "PYUSD approved! Now you can contribute.",
      });

      // After approval, automatically trigger contribution
      setTimeout(() => {
        handleContribute();
      }, 1000);
    }
  }, [approvalReceipt.isSuccess]);

  // Handle contribution success
  useEffect(() => {
    if (contributeReceipt.isSuccess) {
      setStep("success");
      toast({
        title: "Contribution Successful!",
        description: "Your contribution has been recorded.",
      });
      onSuccess?.();
    }
  }, [contributeReceipt.isSuccess]);

  // Handle errors
  useEffect(() => {
    if (approvalReceipt.isError || contributeReceipt.isError) {
      setStep("error");
      const errorMsg =
        approvalReceipt.error?.message ||
        contributeReceipt.error?.message ||
        "Transaction failed";
      toast({
        title: "Transaction Failed",
        description: errorMsg,
        variant: "destructive",
      });
      onError?.(errorMsg);
    }
  }, [approvalReceipt.isError, contributeReceipt.isError]);

  const handleApprove = async () => {
    if (!simulateApprove.data) return;

    setStep("approving");
    try {
      writeApprove(simulateApprove.data.request);
    } catch (error: any) {
      setStep("error");
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleContribute = async () => {
    setStep("contributing");
    try {
      writeContribute({
        address: circleAddress,
        abi: leoCircleABI,
        functionName: "contribute",
      });
    } catch (error: any) {
      setStep("error");
      toast({
        title: "Contribution Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Insufficient balance
  if (!hasEnoughBalance) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-destructive">
            <XCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Insufficient PYUSD Balance</p>
              <p className="text-sm text-muted-foreground">
                You need {formatUnits(contributionAmount, 6)} PYUSD to
                contribute
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state
  if (step === "success") {
    return (
      <Card className="border-success/50 bg-success/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-success">
            <CheckCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Contribution Successful!</p>
              <p className="text-sm text-muted-foreground">
                Your contribution has been recorded on-chain
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (step === "error") {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 text-destructive">
            <XCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Transaction Failed</p>
              <p className="text-sm text-muted-foreground">
                Please try again or contact support if the issue persists
              </p>
            </div>
          </div>
          <Button onClick={() => setStep("idle")} variant="outline" className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Approval needed
  if (needsApproval.needsApproval && step === "idle") {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Approval Required</p>
              <p className="text-sm text-muted-foreground mb-4">
                Before contributing, you need to approve the circle contract to spend your PYUSD.
                This is a one-time transaction.
              </p>
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount to approve:</span>
                  <span className="font-semibold">
                    {formatUnits(contributionAmount, 6)} PYUSD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleApprove}
            disabled={isApprovePending || !simulateApprove.isSuccess}
            className="w-full"
            size="lg"
          >
            {isApprovePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve PYUSD
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Approving state
  if (step === "approving" || approvalReceipt.isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="font-semibold">Approving PYUSD...</p>
              <p className="text-sm text-muted-foreground">
                Please confirm the transaction in your wallet
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Contributing state
  if (step === "contributing" || contributeReceipt.isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="font-semibold">Processing Contribution...</p>
              <p className="text-sm text-muted-foreground">
                Waiting for transaction confirmation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ready to contribute (already approved)
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contribution amount:</span>
            <span className="font-semibold">
              {formatUnits(contributionAmount, 6)} PYUSD
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your balance:</span>
            <span className="font-semibold">
              {pyusdBalance.data ? formatUnits(pyusdBalance.data, 6) : "0"} PYUSD
            </span>
          </div>
        </div>
        <Button
          onClick={handleContribute}
          disabled={isContributePending}
          className="w-full"
          size="lg"
        >
          {isContributePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Contribute {formatUnits(contributionAmount, 6)} PYUSD
        </Button>
      </CardContent>
    </Card>
  );
}
