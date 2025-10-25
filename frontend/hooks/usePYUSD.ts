"use client";

import { Address } from "viem";
import { useAccount, useChainId } from "wagmi";
import { getPYUSDAddress, PYUSD_METADATA } from "@/lib/config/tokens";
import { useToken, useTokenBalance, useAllowance, useNeedsApproval } from "./useERC20";

/**
 * Get the PYUSD contract address for the current chain
 */
export function usePYUSDAddress(): Address {
  const chainId = useChainId();
  return getPYUSDAddress(chainId);
}

/**
 * Get PYUSD token information
 */
export function usePYUSD() {
  const address = usePYUSDAddress();
  const tokenInfo = useToken(address);

  return {
    ...tokenInfo,
    address,
    metadata: PYUSD_METADATA,
  };
}

/**
 * Get PYUSD balance for the connected account
 */
export function usePYUSDBalance() {
  const { address: account } = useAccount();
  const pyusdAddress = usePYUSDAddress();

  return useTokenBalance(pyusdAddress, account);
}

/**
 * Get PYUSD allowance for a specific spender
 * @param spender - The address that can spend PYUSD
 */
export function usePYUSDAllowance(spender: Address | undefined) {
  const { address: account } = useAccount();
  const pyusdAddress = usePYUSDAddress();

  return useAllowance(pyusdAddress, account, spender);
}

/**
 * Check if PYUSD approval is needed for a specific amount and spender
 * @param spender - The address that will spend PYUSD
 * @param amount - The amount of PYUSD to spend
 */
export function usePYUSDNeedsApproval(
  spender: Address | undefined,
  amount: bigint | undefined
) {
  const { address: account } = useAccount();
  const pyusdAddress = usePYUSDAddress();

  return useNeedsApproval(pyusdAddress, account, spender, amount);
}
