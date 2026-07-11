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

export const DIST_ADDRESS =
  ((import.meta.env.VITE_DIST_ADDRESS as string | undefined) ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";
export const FAUCET_AMOUNT = "2000"; // mUSD que entrega faucet() por llamada (fijo on-chain)

// Imagen del NFT (misma metadata para toda la colección).
const NFT_IMAGE_CID =
  "bafybeigs7prcwvioopdett22aheqp2tnbx5glqlrgguxfrnscoqkt75aki";
export const NFT_IMAGE = `https://${NFT_IMAGE_CID}.ipfs.dweb.link?filename=nft.jpeg`;
// Gateway alterno (sirve bytes crudos) por si dweb.link devuelve su página de service-worker.
export const NFT_IMAGE_FALLBACK = `https://${NFT_IMAGE_CID}.ipfs.w3s.link?filename=nft.jpeg`;

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
    name: "faucet",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
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
    name: "totalMinted",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "maxSupply",
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
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

export const distAbi = [
  {
    type: "function",
    name: "withdrawableDividendOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    // Total histórico que la cuenta ya ha reclamado (cobrado).
    type: "function",
    name: "withdrawnOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;
