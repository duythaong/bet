export const ERC20ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const ERC721ABI = [
  {
    inputs: [{ internalType: "bytes32", name: "key_", type: "bytes32" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const GAMEABI = [
  {
    inputs: [{ internalType: "uint256[]", name: "epochs_", type: "uint256[]" }],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "epoch_", type: "uint256" },
      { internalType: "uint256", name: "amount_", type: "uint256" },
    ],
    name: "betHigh",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "epoch_", type: "uint256" },
      { internalType: "uint256", name: "amount_", type: "uint256" },
    ],
    name: "betLow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentEpoch",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
