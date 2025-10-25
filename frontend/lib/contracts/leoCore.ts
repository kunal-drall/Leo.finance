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
 * LeoCore Contract Address (replace with deployed address)
 */
export const LEO_CORE_ADDRESS = {
  sepolia: "0x0000000000000000000000000000000000000000",
  baseSepolia: "0x0000000000000000000000000000000000000000",
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Hardhat default
} as const;
