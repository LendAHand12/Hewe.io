import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyToken from "../../data/Bep20.json";
import { network } from "../../data/port";
import getWeb3 from "../../function/getWeb3";
import "./style.scss";
import BEP20 from "../../assets/img/logoBEP20.png";
import AMC20 from "../../assets/img/logoAMC.png";
import { writeContract } from "@wagmi/core";
import { showAlert } from "../../function/showAlert";
export default function SwapComponent() {
  const { address } = useSelector((state) => state.walletReducer);
  const [amountBEP20, setAmountBep20] = useState(0);
  const listPackage = [
    {
      id: 1,
      amountUSD: 20,
      amountVND: 500000,
      amountHEWE: 40000,
      isBonus: false,
      amountBonus: 0,
      commissionPercent: 5,
      name: "BASIC",
    },
    {
      id: 2,
      amountUSD: 40,
      amountVND: 1000000,
      amountHEWE: 80000,
      isBonus: false,
      amountBonus: 0,
      commissionPercent: 5,
      name: "STANDARD",
    },
    {
      id: 3,
      amountUSD: 100,
      amountVND: 2500000,
      amountHEWE: 200000,
      isBonus: false,
      amountBonus: 0,
      commissionPercent: 10,
      name: "VIP",
    },
    {
      id: 4,
      amountUSD: 500,
      amountVND: 12500000,
      amountHEWE: 1000000,
      isBonus: true,
      amountBonus: 50000,
      commissionPercent: 10,
      name: "PREMIUM",
    },
    {
      id: 5,
      amountUSD: 1000,
      amountVND: 25000000,
      amountHEWE: 2000000,
      isBonus: true,
      amountBonus: 100000,
      commissionPercent: 10,
      name: "GOLD",
    },
    {
      id: 6,
      amountUSD: 10000,
      amountVND: 250000000,
      amountHEWE: 20000000,
      isBonus: true,
      amountBonus: 2000000,
      commissionPercent: 10,
      name: "DIAMOND",
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
  async function buyToken() {
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
      const amountString = (amountBEP20 * 1e18).toLocaleString("fullwide", {
        useGrouping: false,
      });
      const contractToken = new web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[network].address,
        {
          from: address,
        }
      );
      const balanceBep20 = await contractToken.methods
        .balanceOf(`${address}`)
        .call();
      // const balanceAdminBep20 = await contractToken.methods.balanceOf(`${walletAdmin}`).call()
      if (amountBEP20 > balanceBep20 / 1e18)
        return showErrorMessage(`Insufficient balance`);
      // if(amountBEP20> balanceAdminBep20/1e18) return showErrorMessage(`The system is under maintenance, please wait a moment`)
      // await contractToken.methods.transfer(walletAdmin, amountString).send()
      await writeContract({
        address: MyToken.networks[network].address,
        abi: MyToken.abi,
        functionName: "transfer",
        args: [walletAdmin, amountString],
      });
      setAmountBep20("");
      showSuccessMessage(`"Swap token successfully"`);
    } catch (error) {
      console.log(error);
      showErrorMessage(error.message);
    }
  }

  return (
    <>
      <div className="token-component-container tokenInitial">
        <div className="token-package">
          <div className="package-name">SWAP BEP20 TO AMC20</div>
          {/* <div className="commission">
                COMMISSION: <span>{item.commissionPercent}</span>%
              </div> */}
          <div>
            <div className="title">
              <img src={BEP20} alt="" width="20px" />
              <span className="title">BEP20</span>
            </div>
            <div className="form">
              <input
                type="text"
                value={amountBEP20}
                onChange={(e) => {
                  setAmountBep20(e.target.value);
                }}
                placeholder="0.00"
              />
              <button
                onClick={async () => {
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
                  const contractToken = new web3.eth.Contract(
                    MyToken.abi,
                    MyToken.networks[network].address,
                    {
                      from: address,
                    }
                  );
                  const balance = await contractToken.methods
                    .balanceOf(address)
                    .call();
                  setAmountBep20(balance / 1e18);
                }}
              >
                Max
              </button>
            </div>
          </div>
          <div>
            <div className="title">
              <img src={AMC20} alt="" width="20px" />
              <span className="title">AMC20</span>
            </div>
            <div className="form">
              <input
                type="text"
                value={amountBEP20}
                onChange={(e) => {
                  setAmountBep20(e.target.value);
                }}
                placeholder="0.00"
              />
            </div>
          </div>
          <button onClick={() => buyToken(1)}>Swap</button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
