/**
 * LeoCore Contract ABI (simplified)
 */
export const leoCoreABI = [
  {
    inputs: [],
    name: "getTotalCircles",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserCircles",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "circles",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFeeBps",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minContribution",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "circleAddress", type: "address" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "contributionAmount", type: "uint256" },
      { internalType: "uint256", name: "duration", type: "uint256" },
    ],
    name: "registerCircle",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "circleId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "circleAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "contributionAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    name: "CircleCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "circleId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "CircleJoined",
    type: "event",
  },
] as const;

/**
 * LeoCore Contract Address
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Run: cd contracts && npx hardhat run scripts/deploy.ts --network baseSepolia
 * 2. Copy the deployed address from console output
 * 3. Replace the baseSepolia address below
 * 4. Commit and push the change
 *
 * Your deployment credentials are configured in contracts/.env
 */
export const LEO_CORE_ADDRESS = {
  // Ethereum Sepolia Testnet
  sepolia: "0x0000000000000000000000000000000000000000",

  // Base Sepolia Testnet (DEPLOY HERE)
  baseSepolia: "0x0000000000000000000000000000000000000000", // TODO: Replace with deployed address

  // Base Mainnet (Production)
  base: "0x0000000000000000000000000000000000000000",

  // Local Hardhat Network
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
} as const;
