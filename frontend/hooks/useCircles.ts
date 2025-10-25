"use client";

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { leoCoreABI, LEO_CORE_ADDRESS } from "@/lib/contracts/leoCore";
import { leoCircleABI } from "@/lib/contracts/leoCircle";
import { CircleInfo, CircleState } from "@/types/circle";

/**
 * Hook to get user's circles
 */
export function useUserCircles() {
  const { address } = useAccount();

  const { data: circleIds, isLoading, error, refetch } = useReadContract({
    address: LEO_CORE_ADDRESS.localhost as `0x${string}`,
    abi: leoCoreABI,
    functionName: "getUserCircles",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    circleIds: circleIds as bigint[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get circle details
 */
export function useCircleInfo(circleAddress: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: circleAddress,
    abi: leoCircleABI,
    functionName: "getCircleInfo",
    query: {
      enabled: !!circleAddress,
    },
  });

  let circleInfo: CircleInfo | undefined;

  if (data && circleAddress) {
    const [state, currentRound, totalMembers, contributionAmount, startTime] = data as [
      number,
      bigint,
      bigint,
      bigint,
      bigint
    ];

    circleInfo = {
      id: 0, // Will be set by caller
      address: circleAddress,
      creator: "", // Will be fetched separately if needed
      contributionAmount,
      contributionFrequency: BigInt(0), // Will be fetched separately if needed
      maxMembers: 0, // Will be fetched separately if needed
      currentMembers: Number(totalMembers),
      state: state as CircleState,
      currentRound: Number(currentRound),
      startTime,
    };
  }

  return {
    circleInfo,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get circle members
 */
export function useCircleMembers(circleAddress: `0x${string}` | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: circleAddress,
    abi: leoCircleABI,
    functionName: "getMembers",
    query: {
      enabled: !!circleAddress,
    },
  });

  return {
    members: data as `0x${string}`[] | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to get member info in a circle
 */
export function useMemberInfo(
  circleAddress: `0x${string}` | undefined,
  memberAddress: `0x${string}` | undefined
) {
  const { data, isLoading, error } = useReadContract({
    address: circleAddress,
    abi: leoCircleABI,
    functionName: "getMemberInfo",
    args: memberAddress ? [memberAddress] : undefined,
    query: {
      enabled: !!circleAddress && !!memberAddress,
    },
  });

  let memberInfo;
  if (data) {
    const [isMember, hasPaid, hasReceivedPayout, totalContributed] = data as [
      boolean,
      boolean,
      boolean,
      bigint
    ];

    memberInfo = {
      isMember,
      hasPaid,
      hasReceivedPayout,
      totalContributed,
    };
  }

  return {
    memberInfo,
    isLoading,
    error,
  };
}

/**
 * Hook to get total circles count
 */
export function useTotalCircles() {
  const { data, isLoading, error } = useReadContract({
    address: LEO_CORE_ADDRESS.localhost as `0x${string}`,
    abi: leoCoreABI,
    functionName: "getTotalCircles",
  });

  return {
    totalCircles: data ? Number(data) : 0,
    isLoading,
    error,
  };
}
