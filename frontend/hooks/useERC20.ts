"use client";

import { erc20Abi, zeroAddress, type Address } from "viem";
import { useReadContract, useReadContracts, useSimulateContract, useWriteContract } from "wagmi";

/**
 * Custom hook to fetch ERC20 token information
 * @param address - The address of the ERC20 token
 * @returns Token information (decimals, name, symbol)
 */
export function useToken(address: Address | undefined) {
  const result = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: address || zeroAddress,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: address || zeroAddress,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: address || zeroAddress,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
    query: {
      enabled: Boolean(address),
      staleTime: Infinity,
    },
  });

  return {
    ...result,
    data: result.data && {
      decimals: result.data[0],
      name: result.data[1],
      symbol: result.data[2],
    },
  };
}

/**
 * Get the token balance for a specific account
 * @param token - The address of the token contract
 * @param account - The address of the account
 * @returns The token balance
 */
export function useTokenBalance(
  token: Address | undefined,
  account: Address | undefined
) {
  return useReadContract({
    address: token || zeroAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account || zeroAddress],
    query: {
      enabled: Boolean(token) && Boolean(account),
    },
  });
}

/**
 * Get the allowance of a token for a specific account and spender
 * @param token - The address of the token contract
 * @param account - The address of the token owner
 * @param spender - The address of the spender
 * @returns The allowance amount
 */
export function useAllowance(
  token: Address | undefined,
  account: Address | undefined,
  spender: Address | undefined
) {
  return useReadContract({
    address: token || zeroAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account || zeroAddress, spender || zeroAddress],
    query: {
      enabled: Boolean(token) && Boolean(account) && Boolean(spender),
    },
  });
}

/**
 * Simulate the approve function of an ERC20 token
 * @param token - The address of the ERC20 token
 * @param spender - The address of the spender
 * @param amount - The amount to approve
 * @returns Simulation result
 */
export function useSimulateApprove(
  token: Address | undefined,
  spender: Address | undefined,
  amount: bigint | undefined
) {
  return useSimulateContract({
    address: token || zeroAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender || zeroAddress, amount || 0n],
    query: {
      enabled: Boolean(token) && Boolean(spender) && amount !== undefined && amount > 0n,
    },
  });
}

/**
 * Write contract hook for token approval
 * Use this with useSimulateApprove to approve token spending
 */
export function useApprove() {
  return useWriteContract();
}

/**
 * Check if a token needs approval for a specific amount
 * @param token - The token address
 * @param account - The owner address
 * @param spender - The spender address
 * @param amount - The amount to check
 * @returns Whether approval is needed
 */
export function useNeedsApproval(
  token: Address | undefined,
  account: Address | undefined,
  spender: Address | undefined,
  amount: bigint | undefined
) {
  const allowance = useAllowance(token, account, spender);

  return {
    ...allowance,
    needsApproval:
      allowance.data !== undefined &&
      amount !== undefined &&
      allowance.data < amount,
  };
}
