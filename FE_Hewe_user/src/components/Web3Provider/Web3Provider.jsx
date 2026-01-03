import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
// import { bsc, bscTestnet } from "wagmi/chains";
import { DOMAIN } from "../../util/service";
import { bscChain, bscTestnetChain } from "../../data/bscChain.ts";
// import { mainnet } from "wagmi/chains";
// import { amcCustomChain } from "./customChain";
import USDTTokenJson from "../../contracts/USDT.json";
import HEWETokenJson from "../../contracts/HEWE.json";
import { defineChain, numberToHex } from "viem";

export const IS_DOMAIN_PRODUCT =
  DOMAIN === "https://hewe.io/api/user/" ? true : false;

const chain = IS_DOMAIN_PRODUCT ? bscChain : bscTestnetChain;
export const BSC_CHAIN_ID = chain.id;

export const network = IS_DOMAIN_PRODUCT ? 56 : 97;

export const USDTToken = USDTTokenJson;
export const usdtAddress = USDTToken.networks[network].address;

export const HEWEToken = HEWETokenJson;
export const heweAddress = HEWEToken.networks[999999].address;

export const heweChain = defineChain({
  id: 999999,
  name: "AmChain",
  nativeCurrency: { name: "AMC", symbol: "AMC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://node1.amchain.net"] },
  },
  blockExplorers: {
    default: { name: "AmChain Explorer", url: "https://explorer.amchain.net/" },
  },
});

console.log("HERE", chain, heweChain);

export const config = createConfig(
  getDefaultConfig({
    chains: [chain, heweChain],
    transports: {
      [chain.id]: http(chain.rpcUrls.default.http[0]),
      [heweChain.id]: http(heweChain.rpcUrls.default.http[0]),
    },
    walletConnectProjectId: "9e580cc438a1b04ff55f174f88b7ac51",
    appName: "HEWE",
    appDescription: "HEWE",
    appUrl: "https://hewe.io",
  })
);

export const HEWE_CHAIN_ID = heweChain.id;

export const configHEWE = createConfig(
  getDefaultConfig({
    chains: [heweChain],
    transports: {
      [heweChain.id]: http(heweChain.rpcUrls.default.http[0]),
    },
    walletConnectProjectId: "9e580cc438a1b04ff55f174f88b7ac51",
    appName: "HEWE",
    appDescription: "HEWE",
    appUrl: "https://hewe.io",
  })
);
