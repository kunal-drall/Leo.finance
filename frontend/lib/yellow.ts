"use client";

/**
 * Yellow Network Integration - Nitrolite Protocol
 * Session-based, off-chain transactions with on-chain settlement
 *
 * Yellow Network enables:
 * - Gas-free instant transactions (off-chain state channels)
 * - Session-based wallet allowances
 * - On-chain settlement when session ends
 * - Web2 speed with Web3 security
 *
 * Architecture:
 * 1. User deposits funds & creates session with spending allowance
 * 2. All transactions happen instantly off-chain (no gas!)
 * 3. When session ends, final state settles on-chain
 *
 * Documentation: https://yellow.com
 * Note: Yellow SDK not yet available on npm. This is a mock implementation
 * ready for integration when SDK releases.
 */

export interface YellowSessionConfig {
  chainId: number;
  userAddress: string;
  contractAddress: string;
  allowance?: bigint; // Max amount user can spend in this session
  duration?: number; // Session duration in seconds
}

export interface YellowSessionState {
  sessionId: string;
  balance: bigint; // Off-chain balance
  spent: bigint; // Amount spent in session
  allowance: bigint; // Max spending limit
  transactionCount: number; // Number of off-chain txs
  startTime: number;
  expiresAt: number;
}

export interface GaslessTransactionParams {
  to: string;
  data: string;
  value?: bigint;
}

/**
 * Yellow Network Session Manager
 * Manages off-chain state channel for instant, gas-free transactions
 */
export class YellowSession {
  private config: YellowSessionConfig;
  private sessionId: string | null = null;
  private state: YellowSessionState | null = null;

  constructor(config: YellowSessionConfig) {
    this.config = config;
  }

  /**
   * Initialize Yellow Network session
   *
   * Steps (will be implemented with Yellow SDK):
   * 1. User signs message to authorize session
   * 2. Deposit funds to state channel
   * 3. Set spending allowance
   * 4. Receive session ID
   */
  async initialize(): Promise<string> {
    try {
      // TODO: Replace with actual Yellow SDK call when available
      // import { YellowClient } from '@yellow-network/sdk';
      // const client = new YellowClient();
      // const session = await client.createSession({
      //   chainId: this.config.chainId,
      //   userAddress: this.config.userAddress,
      //   allowance: this.config.allowance,
      //   duration: this.config.duration || 3600, // 1 hour default
      // });
      // this.sessionId = session.id;
      // this.state = session.state;

      // Mock implementation for development
      this.sessionId = `yellow-session-${Date.now()}`;
      this.state = {
        sessionId: this.sessionId,
        balance: 0n,
        spent: 0n,
        allowance: this.config.allowance || 1000000n, // 1 PYUSD default
        transactionCount: 0,
        startTime: Date.now(),
        expiresAt: Date.now() + (this.config.duration || 3600) * 1000,
      };

      console.log("[Yellow] Session initialized:", {
        sessionId: this.sessionId,
        allowance: this.state.allowance.toString(),
        expiresAt: new Date(this.state.expiresAt).toISOString(),
      });

      return this.sessionId;
    } catch (error) {
      console.error("[Yellow] Failed to initialize session:", error);
      throw new Error("Failed to initialize Yellow Network session");
    }
  }

  /**
   * Execute instant, gas-free transaction off-chain
   *
   * This happens in the state channel - instant and free!
   * Actual on-chain settlement happens when session closes.
   */
  async executeGasless(params: GaslessTransactionParams): Promise<string> {
    if (!this.sessionId || !this.state) {
      throw new Error("Session not initialized. Call initialize() first.");
    }

    // Check if session expired
    if (Date.now() > this.state.expiresAt) {
      throw new Error("Session expired. Please create a new session.");
    }

    // Check spending limit
    const amount = params.value || 0n;
    if (this.state.spent + amount > this.state.allowance) {
      throw new Error("Transaction exceeds session allowance");
    }

    try {
      // TODO: Replace with actual Yellow SDK call
      // const txResult = await client.executeOffChain({
      //   sessionId: this.sessionId,
      //   to: params.to,
      //   data: params.data,
      //   value: params.value,
      // });

      // Mock off-chain transaction
      const txHash = `0x${Math.random().toString(16).substring(2)}`;

      // Update session state (off-chain)
      this.state.spent += amount;
      this.state.transactionCount += 1;

      console.log("[Yellow] Off-chain transaction executed:", {
        txHash,
        amount: amount.toString(),
        spent: this.state.spent.toString(),
        remaining: (this.state.allowance - this.state.spent).toString(),
        txCount: this.state.transactionCount,
      });

      return txHash;
    } catch (error) {
      console.error("[Yellow] Failed to execute gasless transaction:", error);
      throw new Error("Failed to execute gasless transaction");
    }
  }

  /**
   * Get current session state
   */
  async getSessionStatus(): Promise<YellowSessionState | null> {
    if (!this.state) {
      return null;
    }

    // TODO: Fetch latest state from Yellow Network
    return { ...this.state };
  }

  /**
   * Settle session on-chain and close
   *
   * This is where all off-chain transactions get finalized on-chain.
   * Only one on-chain transaction needed, no matter how many off-chain txs!
   */
  async close(): Promise<string | null> {
    if (!this.sessionId || !this.state) {
      return null;
    }

    try {
      // TODO: Replace with actual Yellow SDK settlement
      // const settlement = await client.settleSession({
      //   sessionId: this.sessionId,
      // });
      // // This submits ONE on-chain transaction that finalizes
      // // ALL the off-chain transactions from this session
      // return settlement.txHash;

      console.log("[Yellow] Settling session on-chain:", {
        sessionId: this.sessionId,
        totalSpent: this.state.spent.toString(),
        transactionCount: this.state.transactionCount,
        savings: `${this.state.transactionCount - 1} gas fees saved!`,
      });

      // Mock settlement transaction
      const settlementTxHash = `0x${Math.random().toString(16).substring(2)}`;

      this.sessionId = null;
      this.state = null;

      return settlementTxHash;
    } catch (error) {
      console.error("[Yellow] Failed to close session:", error);
      throw error;
    }
  }

  /**
   * Get remaining allowance
   */
  getRemainingAllowance(): bigint {
    if (!this.state) return 0n;
    return this.state.allowance - this.state.spent;
  }

  /**
   * Check if session is active
   */
  isActive(): boolean {
    if (!this.state) return false;
    return Date.now() < this.state.expiresAt;
  }
}

/**
 * Create Yellow Network session
 */
export function createYellowSession(config: YellowSessionConfig): YellowSession {
  return new YellowSession(config);
}

/**
 * Estimate gas savings with Yellow Network
 *
 * Example: 10 contributions in a circle
 * - Traditional: 10 on-chain txs = ~$50 in gas
 * - Yellow Network: 10 off-chain txs + 1 settlement = ~$5 in gas
 * - Savings: 90%!
 */
export async function estimateGasSavings(
  standardGasPrice: bigint,
  transactionCount: number
): Promise<{
  traditionalCost: bigint;
  yellowCost: bigint;
  totalSavings: bigint;
  savingsPercent: number;
}> {
  const avgGasPerTx = 150000n;

  // Traditional: pay gas for every transaction
  const traditionalGas = avgGasPerTx * BigInt(transactionCount);
  const traditionalCost = traditionalGas * standardGasPrice;

  // Yellow Network: only pay for settlement
  const yellowGas = avgGasPerTx; // Only 1 settlement tx
  const yellowCost = yellowGas * standardGasPrice;

  const totalSavings = traditionalCost - yellowCost;
  const savingsPercent = transactionCount > 1
    ? Math.round((Number(totalSavings) / Number(traditionalCost)) * 100)
    : 0;

  return {
    traditionalCost,
    yellowCost,
    totalSavings,
    savingsPercent,
  };
}

/**
 * Check if Yellow Network is available for chain
 */
export function isYellowNetworkAvailable(chainId: number): boolean {
  // Supported chains (will be updated when Yellow Network launches)
  const supportedChains = [
    1, // Ethereum Mainnet
    11155111, // Ethereum Sepolia
    84532, // Base Sepolia
    8453, // Base Mainnet
  ];

  return supportedChains.includes(chainId);
}

/**
 * Format time remaining in session
 */
export function formatSessionTime(expiresAt: number): string {
  const now = Date.now();
  const remaining = Math.max(0, expiresAt - now);

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
