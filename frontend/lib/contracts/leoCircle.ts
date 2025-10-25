/**
 * LeoCircle Contract ABI (simplified)
 */
export const leoCircleABI = [
  {
    inputs: [],
    name: "getCircleInfo",
    outputs: [
      { internalType: "enum LeoCircle.CircleState", name: "_state", type: "uint8" },
      { internalType: "uint256", name: "_currentRound", type: "uint256" },
      { internalType: "uint256", name: "_totalMembers", type: "uint256" },
      { internalType: "uint256", name: "_contributionAmount", type: "uint256" },
      { internalType: "uint256", name: "_startTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_member", type: "address" }],
    name: "getMemberInfo",
    outputs: [
      { internalType: "bool", name: "_isMember", type: "bool" },
      { internalType: "bool", name: "_hasPaid", type: "bool" },
      { internalType: "bool", name: "_hasReceivedPayout", type: "bool" },
      { internalType: "uint256", name: "_totalContributed", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMembers",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "joinCircle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startCircle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "creator",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contributionAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contributionFrequency",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxMembers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "member", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "MemberJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "member", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "round", type: "uint256" },
    ],
    name: "ContributionMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "recipient", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "round", type: "uint256" },
    ],
    name: "PayoutDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum LeoCircle.CircleState",
        name: "newState",
        type: "uint8",
      },
    ],
    name: "CircleStateChanged",
    type: "event",
  },
] as const;
