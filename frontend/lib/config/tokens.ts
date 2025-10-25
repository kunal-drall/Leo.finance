/**
 * PYUSD Token Configuration
 * Official PYUSD contract addresses across different networks
 * Source: https://github.com/paxosglobal/pyusd-contract
 */

import { Address } from "viem";

export const PYUSD_ADDRESSES: Record<number, Address> = {
  // Ethereum Mainnet
  1: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",

  // Ethereum Sepolia Testnet
  11155111: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",

  // Base Sepolia (using Sepolia PYUSD for testing)
  84532: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",

  // Base Mainnet (TODO: Update when PYUSD launches on Base)
  8453: "0x0000000000000000000000000000000000000000",

  // Local development (using Sepolia address for forking)
  31337: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
} as const;

/**
 * Get PYUSD contract address for a given chain ID
 */
export function getPYUSDAddress(chainId: number | undefined): Address {
  if (!chainId || !(chainId in PYUSD_ADDRESSES)) {
    // Default to Sepolia for development
    return PYUSD_ADDRESSES[11155111];
  }
  return PYUSD_ADDRESSES[chainId];
}

/**
 * Token metadata
 */
export const PYUSD_METADATA = {
  name: "PayPal USD",
  symbol: "PYUSD",
  decimals: 6,
  description: "PayPal USD stablecoin pegged to the US Dollar",
} as const;
