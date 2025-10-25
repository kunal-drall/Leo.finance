import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, mainnet, base, baseSepolia } from "wagmi/chains";

/**
 * Wagmi configuration for Leo Finance
 * Supports: Ethereum Mainnet, Sepolia Testnet, Base, Base Sepolia
 */
export const config = getDefaultConfig({
  appName: "Leo Finance",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia, base, baseSepolia],
  ssr: true, // Enable server-side rendering
});
