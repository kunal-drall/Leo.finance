"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useChainId } from "wagmi";
import {
  createYellowSession,
  YellowSession,
  GaslessTransactionParams,
  isYellowNetworkAvailable,
} from "@/lib/yellow";

/**
 * Hook to manage Yellow Network session for gasless transactions
 */
export function useYellowNetwork(contractAddress?: string) {
  const { address } = useAccount();
  const chainId = useChainId();
  const [session, setSession] = useState<YellowSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if Yellow Network is available on current chain
  useEffect(() => {
    setIsAvailable(isYellowNetworkAvailable(chainId));
  }, [chainId]);

  /**
   * Initialize Yellow Network session
   */
  const initializeSession = useCallback(async () => {
    if (!address || !contractAddress) {
      setError(new Error("Wallet not connected or contract address missing"));
      return;
    }

    if (!isAvailable) {
      setError(new Error("Yellow Network not available on this chain"));
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const yellowSession = createYellowSession({
        chainId,
        userAddress: address,
        contractAddress,
      });

      await yellowSession.initialize();
      setSession(yellowSession);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsInitializing(false);
    }
  }, [address, contractAddress, chainId, isAvailable]);

  /**
   * Execute gasless transaction
   */
  const executeGasless = useCallback(
    async (params: GaslessTransactionParams): Promise<string> => {
      if (!session) {
        throw new Error("Session not initialized. Call initializeSession() first.");
      }

      return await session.executeGasless(params);
    },
    [session]
  );

  /**
   * Close session
   */
  const closeSession = useCallback(async () => {
    if (session) {
      await session.close();
      setSession(null);
    }
  }, [session]);

  return {
    session,
    isAvailable,
    isInitializing,
    error,
    initializeSession,
    executeGasless,
    closeSession,
  };
}
