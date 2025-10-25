"use client";

import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

/**
 * Pyth Oracle Configuration - Pull Oracle Method
 *
 * Pyth uses a "pull" model where you:
 * 1. Fetch price updates from Hermes API
 * 2. Submit updates to on-chain Pyth contract via updatePriceFeeds()
 * 3. Read the updated price from the contract
 *
 * Documentation: https://docs.pyth.network/price-feeds/fetch-price-updates
 * Price Feed IDs: https://pyth.network/developers/price-feed-ids
 */

// Pyth Network price feed IDs
export const PRICE_FEED_IDS = {
  // PYUSD/USD price feed
  // Note: PYUSD price feed may not be available yet on Pyth
  // Using placeholder - update when official feed ID is available
  // For now, PYUSD is assumed to be pegged at 1.0 USD
  PYUSD_USD: "0x" + "0".repeat(64), // TODO: Replace with actual Pyth price feed ID

  // ETH/USD price feed (verified)
  ETH_USD: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",

  // BTC/USD price feed (verified)
  BTC_USD: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
} as const;

/**
 * Hermes API endpoint
 * Hermes is Pyth's price service that provides price updates
 */
export const HERMES_ENDPOINT = "https://hermes.pyth.network";

/**
 * Create Pyth connection to Hermes
 * This client fetches price updates from Hermes API
 */
export function createPythConnection() {
  return new EvmPriceServiceConnection(HERMES_ENDPOINT, {
    priceFeedRequestConfig: {
      // Request binary price updates for on-chain submission
      binary: true,
    },
  });
}

/**
 * Fetch latest price updates from Hermes (Step 1 of Pull Oracle)
 *
 * This fetches the price update data that can be submitted on-chain.
 * The returned data includes cryptographic proofs that validate the price.
 *
 * @param priceIds - Array of price feed IDs to fetch
 * @returns Price update data with proofs (hex-encoded)
 */
export async function fetchPriceUpdates(priceIds: string[]): Promise<string[]> {
  try {
    const connection = createPythConnection();

    // Get the latest price updates with proofs
    const priceUpdateData = await connection.getPriceFeedsUpdateData(priceIds);

    return priceUpdateData;
  } catch (error) {
    console.error("Failed to fetch price updates from Hermes:", error);
    throw error;
  }
}

/**
 * Get latest price from Hermes for display purposes
 *
 * Note: This is for display only. For on-chain usage, you must:
 * 1. Call fetchPriceUpdates() to get update data
 * 2. Submit to contract via updatePriceFeeds()
 * 3. Read from contract
 */
export async function getLatestPrice(priceId: string) {
  try {
    const connection = createPythConnection();
    const priceFeeds = await connection.getLatestPriceFeeds([priceId]);

    if (!priceFeeds || priceFeeds.length === 0) {
      throw new Error("No price feed data available");
    }

    const priceFeed = priceFeeds[0];
    const price = priceFeed.getPriceNoOlderThan(60); // 60 seconds max age

    if (!price) {
      throw new Error("Price data is stale");
    }

    return {
      price: Number(price.price) * Math.pow(10, price.expo),
      conf: Number(price.conf) * Math.pow(10, price.expo),
      publishTime: price.publishTime,
    };
  } catch (error) {
    console.error("Failed to fetch Pyth price:", error);
    throw error;
  }
}

/**
 * Subscribe to real-time price updates via Server-Sent Events (SSE)
 *
 * Hermes provides a streaming endpoint that continuously pushes updates.
 * Connection auto-closes after 24 hours; implement reconnection logic.
 *
 * @param priceIds - Array of price feed IDs to stream
 * @param callback - Function called with each new price update
 * @returns Unsubscribe function
 */
export function subscribeToPriceUpdates(
  priceIds: string[],
  callback: (price: {
    priceId: string;
    price: number;
    conf: number;
    publishTime: number;
  }) => void
) {
  const connection = createPythConnection();

  // Subscribe to price feed updates via SSE
  connection.subscribePriceFeedUpdates(priceIds, (priceFeed) => {
    const price = priceFeed.getPriceUnchecked();
    callback({
      priceId: priceFeed.id,
      price: Number(price.price) * Math.pow(10, price.expo),
      conf: Number(price.conf) * Math.pow(10, price.expo),
      publishTime: price.publishTime,
    });
  });

  // Return unsubscribe function
  return () => {
    connection.closeWebSocket();
  };
}

/**
 * Format price for display
 */
export function formatPythPrice(price: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

/**
 * Get PYUSD price in USD
 *
 * PYUSD is a stablecoin pegged 1:1 to USD, so it should always be ~$1.00
 */
export async function getPYUSDPrice() {
  try {
    // For now, return 1.0 as PYUSD is pegged to USD
    // In production, use actual Pyth price feed when available
    return {
      price: 1.0,
      conf: 0.001,
      publishTime: Date.now(),
    };

    // Uncomment when Pyth price feed ID is available:
    // return await getLatestPrice(PRICE_FEED_IDS.PYUSD_USD);
  } catch (error) {
    console.error("Failed to get PYUSD price:", error);
    // Fallback to 1.0 if price fetch fails
    return {
      price: 1.0,
      conf: 0.001,
      publishTime: Date.now(),
    };
  }
}

/**
 * Get ETH price in USD from Pyth
 */
export async function getETHPrice() {
  try {
    return await getLatestPrice(PRICE_FEED_IDS.ETH_USD);
  } catch (error) {
    console.error("Failed to get ETH price:", error);
    throw error;
  }
}

/**
 * Get BTC price in USD from Pyth
 */
export async function getBTCPrice() {
  try {
    return await getLatestPrice(PRICE_FEED_IDS.BTC_USD);
  } catch (error) {
    console.error("Failed to get BTC price:", error);
    throw error;
  }
}

/**
 * Fetch price updates for multiple feeds
 * Useful for batch operations
 */
export async function fetchMultiplePriceUpdates(priceIds: string[]) {
  try {
    const connection = createPythConnection();
    const priceFeeds = await connection.getLatestPriceFeeds(priceIds);

    return priceFeeds.map(feed => {
      const price = feed.getPriceUnchecked();
      return {
        id: feed.id,
        price: Number(price.price) * Math.pow(10, price.expo),
        conf: Number(price.conf) * Math.pow(10, price.expo),
        publishTime: price.publishTime,
      };
    });
  } catch (error) {
    console.error("Failed to fetch multiple price updates:", error);
    throw error;
  }
}
