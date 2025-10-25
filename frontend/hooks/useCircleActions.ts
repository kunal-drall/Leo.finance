"use client";

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { leoCircleABI } from "@/lib/contracts/leoCircle";
import { Address } from "viem";
import { usePYUSDAddress, usePYUSDNeedsApproval } from "./usePYUSD";
import { useSimulateApprove } from "./useERC20";

/**
 * Hook to join a circle
 * Note: Joining doesn't require payment, just adds you to the member list
 */
export function useJoinCircle(circleAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const joinCircle = async () => {
    if (!circleAddress) return;

    writeContract({
      address: circleAddress,
      abi: leoCircleABI,
      functionName: "joinCircle",
    });
  };

  return {
    joinCircle,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to contribute to a circle with PYUSD
 * This handles the ERC20 payment flow
 */
export function useContribute(
  circleAddress: Address | undefined,
  contributionAmount: bigint | undefined
) {
  const { address: userAddress } = useAccount();
  const pyusdAddress = usePYUSDAddress();

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
    data: approvalHash,
    isPending: isApprovePending,
  } = useWriteContract();
  const approvalReceipt = useWaitForTransactionReceipt({ hash: approvalHash });

  // Contribution transaction
  const {
    writeContract: writeContribute,
    data: hash,
    isPending,
    error,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async () => {
    if (!simulateApprove.data) {
      throw new Error("Unable to simulate approval");
    }

    writeApprove(simulateApprove.data.request);
  };

  const contribute = async () => {
    if (!circleAddress) return;

    writeContribute({
      address: circleAddress,
      abi: leoCircleABI,
      functionName: "contribute",
    });
  };

  return {
    // Approval state
    needsApproval: needsApproval.needsApproval,
    approve,
    isApprovePending,
    approvalHash,
    isApprovalConfirming: approvalReceipt.isLoading,
    isApprovalSuccess: approvalReceipt.isSuccess,

    // Contribution state
    contribute,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook to start a circle (creator only)
 */
export function useStartCircle(circleAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const startCircle = async () => {
    if (!circleAddress) return;

    writeContract({
      address: circleAddress,
      abi: leoCircleABI,
      functionName: "startCircle",
    });
  };

  return {
    startCircle,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
