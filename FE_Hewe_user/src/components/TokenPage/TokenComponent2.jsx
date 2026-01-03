import { writeContract } from "@wagmi/core";
import React from "react";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyToken from "../../data/MyToken.json";
import { network } from "../../data/port";
import getWeb3 from "../../function/getWeb3";

export default function TokenComponent2() {
  const { address } = useSelector((state) => state.walletReducer);

  const listPackage = [
    {
      id: 1,
      amountUSD: 20,
      amountVND: 500000,
      amountHEWE: 40000,
      isBonus: false,
      amountBonus: 0,
      commissionPercent: 5,
      name: "A20",
    },
    {
      id: 2,
      amountUSD: 40,
      amountVND: 1000000,
      amountHEWE: 80000,
      isBonus: false,
      amountBonus: 0,
      commissionPercent: 5,
      name: "A40",
    },
    {
      id: 3,
      amountUSD: 100,
      amountVND: 2500000,
      amountHEWE: 200000,
      isBonus: false,
      amountBonus: 0,
      commissionPercent: 10,
      name: "A100",
    },
    {
      id: 4,
      amountUSD: 500,
      amountVND: 12500000,
      amountHEWE: 1000000,
      isBonus: true,
      amountBonus: 25,
      commissionPercent: 10,
      name: "A500",
    },
    {
      id: 5,
      amountUSD: 1000,
      amountVND: 25000000,
      amountHEWE: 2000000,
      isBonus: true,
      amountBonus: 50,
      commissionPercent: 10,
      name: "A1,000",
    },
    {
      id: 6,
      amountUSD: 10000,
      amountVND: 250000000,
      amountHEWE: 20000000,
      isBonus: true,
      amountBonus: 500,
      commissionPercent: 10,
      name: "A10,000",
    },
  ];

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };
  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };
  async function buyToken(amountUSDT) {
    try {
      const web3 = await getWeb3();
      if (!web3) {
        showErrorMessage("Web3 provider is not found");
        return;
      }

      // check kết nối ví
      if (!address) {
        showErrorMessage("Please connect your wallet");
        return;
      }

      const walletAdmin = `0x53F31019919A5EE226722AED4F4F444d7AB2F8D0`;
      const amountString = (amountUSDT * 1e18).toLocaleString("fullwide", {
        useGrouping: false,
      });
      const contractToken = new web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[network].address,
        {
          from: address,
        }
      );
      const balanceUsdt = await contractToken.methods
        .balanceOf(`${address}`)
        .call();
      if (amountUSDT > balanceUsdt / 1e18)
        return showErrorMessage(`Insufficient balance`);
      await writeContract({
        address: MyToken.networks[network].address,
        abi: MyToken.abi,
        functionName: "transfer",
        args: [walletAdmin, amountString],
      });
      showSuccessMessage(`"Buy token successfully"`);
    } catch (error) {
      console.log(error);
      showErrorMessage(error.message);
    }
  }

  return (
    <>
      <div className="token-component-container">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
        sapiente tempora veritatis qui recusandae quo. Inventore aspernatur
        rerum fugiat, fuga cum veritatis natus, excepturi animi recusandae magni
        dolorem dolorum temporibus?
      </div>

      <ToastContainer />
    </>
  );
}
