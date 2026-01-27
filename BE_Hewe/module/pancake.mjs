import { readContract, configureChains, createConfig } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import BigNumber from "bignumber.js";

// Polyfill fetch và các lớp liên quan
// Thư viện @wagmi/core có dùng viem, viem có dùng fetch, mà nodejs 16 không có sẵn fetch nên sẽ bị lỗi
// từ nodejs 18 trở lên thì đã có sẵn, mà dự án này không thể nâng lên nodejs 18 được, bắt buộc phải dùng nodejs 16 nên cần polyfill
// nhớ cài thêm node-fetch@2 và thêm đoạn code polyfill này vào đầu file là sẽ hết lỗi
if (typeof fetch === "undefined") {
  const fetchPkg = await import("node-fetch");
  global.fetch = fetchPkg.default;
  global.Request = fetchPkg.Request;
  global.Response = fetchPkg.Response;
  global.Headers = fetchPkg.Headers;
}

// không xét isMainnet vì cái này luôn là mainnet

// địa chỉ của AMC trên pancake
const TOKEN_CONTRACT_ADDRESS = "0xfdc91ade8a93f020281efb13bfcd245a3c03c11f";
// địa chỉ của USDT mainnet
const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
// pancake contract address
const PANCAKE_CONTRACT_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
// PANCAKE_ABI
// BSC_TESTNET -> không dùng
// BSC_MAINNET -> không dùng
const constants = await import("../constants/index.js");
const { PANCAKE_ABI, BSC_MAINNET } = constants.default || constants;

const myChain = [BSC_MAINNET];
const { chains, publicClient } = configureChains(myChain, [publicProvider()]);
createConfig({ chains, publicClient });

async function getAmoutOutFunc(amount, addressIn, addressTo) {
  const amountIn = amount.toLocaleString("fullwide", { useGrouping: false });

  const arrayAddress = [addressIn, addressTo];
  arrayAddress.push();

  const a = await readContract({
    address: PANCAKE_CONTRACT_ADDRESS,
    abi: PANCAKE_ABI,
    functionName: "getAmountsOut",
    args: [amountIn, arrayAddress],
  });

  const myNumberA = Number(new BigNumber(a[0]));
  const myNumberB = Number(new BigNumber(a[1]));
  a[0] = myNumberA;
  a[1] = myNumberB;

  return a;
}

async function getPricePancake() {
  const amount = 1 * 1e18;
  const percent = 0.00050042795059511036;

  let a = await getAmoutOutFunc(amount, TOKEN_CONTRACT_ADDRESS, USDT_CONTRACT_ADDRESS);
  a[1] = a[1] - a[1] * percent;

  return a[1] / 1e18;
}

export { getPricePancake };
