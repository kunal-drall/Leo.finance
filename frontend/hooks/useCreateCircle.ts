"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, Address } from "viem";
import { LEO_CORE_ADDRESS } from "@/lib/contracts/leoCore";
import { usePYUSDAddress, usePYUSDBalance, usePYUSDNeedsApproval } from "./usePYUSD";
import { useSimulateApprove } from "./useERC20";

export interface CircleCreationParams {
  contributionAmount: string; // in PYUSD
  contributionFrequency: number; // in days
  maxMembers: number;
}

export type CircleCreationStep =
  | "idle"
  | "checking_balance"
  | "needs_approval"
  | "approving"
  | "approval_confirmed"
  | "creating"
  | "created"
  | "error";

export interface CircleCreationState {
  step: CircleCreationStep;
  error?: string;
  txHash?: string;
  circleAddress?: Address;
}

/**
 * Hook for creating a circle with PYUSD payment integration
 * Handles the full flow: balance check → approval → creation
 */
export function useCreateCircle() {
  const { address: userAddress, chainId } = useAccount();
  const pyusdAddress = usePYUSDAddress();
  const pyusdBalance = usePYUSDBalance();

  const [state, setState] = useState<CircleCreationState>({
    step: "idle",
  });

  // For approval
  const { writeContract: writeApprove, data: approvalTxHash } = useWriteContract();
  const approvalReceipt = useWaitForTransactionReceipt({ hash: approvalTxHash });

  // For circle creation
  const { writeContract: writeCreate, data: createTxHash } = useWriteContract();
  const createReceipt = useWaitForTransactionReceipt({ hash: createTxHash });

  /**
   * Start the circle creation process
   */
  const createCircle = useCallback(
    async (params: CircleCreationParams) => {
      if (!userAddress) {
        setState({
          step: "error",
          error: "Wallet not connected",
        });
        return;
      }

      try {
        // Parse contribution amount (PYUSD has 6 decimals)
        const contributionAmountWei = parseUnits(params.contributionAmount, 6);

        // Check balance
        setState({ step: "checking_balance" });

        if (!pyusdBalance.data || pyusdBalance.data < contributionAmountWei) {
          setState({
            step: "error",
            error: `Insufficient PYUSD balance. You need ${params.contributionAmount} PYUSD`,
          });
          return;
        }

        // TODO: In a real implementation, we would:
        // 1. Check if approval is needed for the LeoCore contract
        // 2. If needed, request approval
        // 3. Wait for approval confirmation
        // 4. Create the circle via LeoCore contract

        setState({
          step: "needs_approval",
        });

        // For now, just set to idle after checks
        // The actual implementation would continue here
        console.log("Circle creation params validated:", {
          contributionAmountWei: contributionAmountWei.toString(),
          contributionFrequency: params.contributionFrequency * 86400, // Convert days to seconds
          maxMembers: params.maxMembers,
          pyusdAddress,
        });

        setState({
          step: "idle",
          error: "Circle creation not yet implemented. Contract interaction coming soon!",
        });
      } catch (error: any) {
        setState({
          step: "error",
          error: error.message || "Failed to create circle",
        });
      }
    },
    [userAddress, pyusdBalance.data, pyusdAddress]
  );

  /**
   * Reset the creation flow
   */
  const reset = useCallback(() => {
    setState({ step: "idle" });
  }, []);

  return {
    createCircle,
    reset,
    state,
    isLoading:
      state.step === "checking_balance" ||
      state.step === "approving" ||
      state.step === "creating",
    isSuccess: state.step === "created",
    isError: state.step === "error",
  };
}
