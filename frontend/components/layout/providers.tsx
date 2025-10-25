"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/config/wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";

/**
 * Web3 Providers Wrapper
 * Configures Wagmi, React Query, and RainbowKit for wallet connections
 */
export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({
              accentColor: "#6366F1",
              accentColorForeground: "white",
              borderRadius: "large",
            }),
            darkMode: darkTheme({
              accentColor: "#6366F1",
              accentColorForeground: "white",
              borderRadius: "large",
            }),
          }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
