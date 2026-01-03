import {
  switchChain,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAccount, useBalance, useChainId } from "wagmi";
import {
  BSC_CHAIN_ID,
  config,
  HEWE_CHAIN_ID,
  heweAddress,
  HEWEToken,
  usdtAddress,
  USDTToken,
} from "../../../Web3Provider/Web3Provider";
import { toast } from "react-toastify";

export const useOrderTransaction = () => {
  const [isPendingOrder, setIsPendingOrder] = useState(false);
  const { walletBuyPool, walletSellPool } = useSelector(
    (state) => state.chartReducer
  );
  const { address } = useAccount();
  const chainId = useChainId();
  const balance = useBalance({
    address: address,
    chainId: chainId,
  });

  const handleGetWalletPoolBySide = (side) => {
    if (!address || !walletBuyPool || !walletSellPool) {
      if (!address) {
        toast.error("Please connect wallet first");
      }

      if (!walletBuyPool || !walletSellPool) {
        toast.error("Can not get wallet");
      }

      return null;
    }

    return side === "buy" ? walletBuyPool : walletSellPool;
  };

  const handleRequestOrder = (side, amount, callback) => async () => {
    if (Number(amount) === 0) return;

    if (isPendingOrder) return;

    const walletPool = handleGetWalletPoolBySide(side);

    if (!walletPool) return;

    setIsPendingOrder(true);

    try {
      let hash;
      if (side === "buy") {
        if (chainId != BSC_CHAIN_ID) {
          await switchChain(config, { chainId: BSC_CHAIN_ID });

          setIsPendingOrder(false);
          return;
        }

        const amountBN = amount * 1e18;
        const amountString = amountBN.toLocaleString("fullwide", {
          useGrouping: false,
        });

        hash = await writeContract(config, {
          abi: USDTToken.abi,
          address: usdtAddress,
          functionName: "transfer",
          args: [walletPool, amountString],
        });
      } else {
        if (chainId != HEWE_CHAIN_ID) {
          await switchChain(config, { chainId: HEWE_CHAIN_ID });

          setIsPendingOrder(false);
          return;
        }

        const amountBN = amount * 1e18;
        const amountString = amountBN.toLocaleString("fullwide", {
          useGrouping: false,
        });

        hash = await writeContract(config, {
          abi: HEWEToken.abi,
          address: heweAddress,
          functionName: "transfer",
          args: [walletPool, amountString],
        });
      }

      await waitForTransactionReceipt(config, { hash });

      toast.success("Transfer success");
      setIsPendingOrder(false);

      if (typeof callback === "function") {
        callback();
      }
    } catch (error) {
      setIsPendingOrder(false);

      if (error.message.includes("User denied transaction signature")) {
        toast.error("User denied transaction signature");
      } else if (error.message.includes("transfer amount exceeds balance")) {
        toast.error("Insufficient balance USDT");
      } else {
        toast.error(error.shortMessage);
        console.log(error.message);
      }
    }
  };

  return { isPendingOrder, handleRequestOrder };
};
