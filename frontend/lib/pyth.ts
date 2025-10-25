"use client";

import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

/**
 * Pyth Oracle Configuration
 * Real-time price feeds for PYUSD and other assets
 */

// Pyth Network price feed IDs
export const PRICE_FEED_IDS = {
  // PYUSD/USD price feed
  PYUSD_USD: "0x" + "0".repeat(64), // Replace with actual Pyth price feed ID

  // ETH/USD price feed
  ETH_USD: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",

  // BTC/USD price feed (example)
  BTC_USD: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
} as const;

/**
 * Initialize Pyth Price Service Connection
 */
export function createPythConnection() {
  return new EvmPriceServiceConnection("https://hermes.pyth.network");
}

/**
 * Get latest price for a feed
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
 */
export async function getPYUSDPrice() {
  try {
    // For now, return 1.0 as PYUSD is pegged to USD
    // In production, use actual Pyth price feed
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
 * Get ETH price in USD
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
 * Subscribe to price updates
 */
export function subscribeToPriceUpdates(
  priceId: string,
  callback: (price: { price: number; conf: number; publishTime: number }) => void
) {
  const connection = createPythConnection();

  // Subscribe to price updates
  connection.subscribePriceFeedUpdates([priceId], (priceFeed) => {
    const price = priceFeed.getPriceUnchecked();
    callback({
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
