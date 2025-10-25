"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { leoCircleABI } from "@/lib/contracts/leoCircle";
import { parseEther } from "viem";

/**
 * Hook to join a circle
 */
export function useJoinCircle(circleAddress: `0x${string}` | undefined) {
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
 * Hook to contribute to a circle
 */
export function useContribute(circleAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const contribute = async () => {
    if (!circleAddress) return;

    writeContract({
      address: circleAddress,
      abi: leoCircleABI,
      functionName: "contribute",
    });
  };

  return {
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
export function useStartCircle(circleAddress: `0x${string}` | undefined) {
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
