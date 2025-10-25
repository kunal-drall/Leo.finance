"use client";

import { useState, useEffect } from "react";
import { getPYUSDPrice, getETHPrice, subscribeToPriceUpdates, PRICE_FEED_IDS } from "@/lib/pyth";

interface PriceData {
  price: number;
  conf: number;
  publishTime: number;
}

/**
 * Hook to get and subscribe to PYUSD price
 */
export function usePYUSDPrice() {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchAndSubscribe = async () => {
      try {
        // Get initial price
        const data = await getPYUSDPrice();
        setPriceData(data);
        setIsLoading(false);

        // Subscribe to updates (uncomment when Pyth feed is available)
        // unsubscribe = subscribeToPriceUpdates(
        //   PRICE_FEED_IDS.PYUSD_USD,
        //   (update) => {
        //     setPriceData(update);
        //   }
        // );
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchAndSubscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    price: priceData?.price,
    confidence: priceData?.conf,
    publishTime: priceData?.publishTime,
    isLoading,
    error,
  };
}

/**
 * Hook to get and subscribe to ETH price
 */
export function useETHPrice() {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchAndSubscribe = async () => {
      try {
        // Get initial price
        const data = await getETHPrice();
        setPriceData(data);
        setIsLoading(false);

        // Subscribe to updates
        unsubscribe = subscribeToPriceUpdates(
          [PRICE_FEED_IDS.ETH_USD],
          (update) => {
            setPriceData(update);
          }
        );
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchAndSubscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    price: priceData?.price,
    confidence: priceData?.conf,
    publishTime: priceData?.publishTime,
    isLoading,
    error,
  };
}
