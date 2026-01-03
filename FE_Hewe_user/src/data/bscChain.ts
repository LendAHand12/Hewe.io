export const bscChain = {
  id: 0x38,
  name: "Smart Chain",
  network: "0x38",
  nativeCurrency: {
    decimals: 18,
    name: "Smart Chain",
    symbol: "BNB",
  },
  rpcUrls: {
    public: { http: ["https://bsc-dataseed.binance.org/"] },
    default: { http: ["https://bsc-dataseed.binance.org/"] },
  },
};

export const bscTestnetChain = {
  id: 0x61, // 97 thập phân
  name: "BSC Testnet",
  network: "0x61",
  nativeCurrency: {
    decimals: 18,
    name: "Smart Chain Testnet",
    symbol: "tBNB",
  },
  rpcUrls: {
    public: { http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"] },
    default: { http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"] },
  },
};
