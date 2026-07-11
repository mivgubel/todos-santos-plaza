// Direcciones y ABIs mínimos para mUSD (mock USDC, 6 decimales) y NFT en Sepolia.
// El usuario debe definir estas variables en el entorno (.env / secrets):
//   VITE_PRIVY_APP_ID  -> App ID de Privy
//   VITE_MUSD_ADDRESS  -> Dirección del contrato mockUSD
//   VITE_NFT_ADDRESS   -> Dirección del contrato NFT

export const PRIVY_APP_ID =
  (import.meta.env.VITE_PRIVY_APP_ID as string | undefined) ?? "";

export const MUSD_ADDRESS =
  ((import.meta.env.VITE_MUSD_ADDRESS as string | undefined) ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const NFT_ADDRESS =
  ((import.meta.env.VITE_NFT_ADDRESS as string | undefined) ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";
export const FAUCET_AMOUNT = "500"; // mUSD entregados por el faucet

export const musdAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

export const nftAbi = [
  {
    type: "function",
    name: "price",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "MAX_SUPPLY",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "buyNFT",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;
