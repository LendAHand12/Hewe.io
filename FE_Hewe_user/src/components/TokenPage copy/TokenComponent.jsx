import React from "react";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyToken from "../../data/MyToken.json";
import { network } from "../../data/port";
import getWeb3 from "../../function/getWeb3";

export default function TokenComponent() {
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
      await contractToken.methods.transfer(walletAdmin, amountString).send();
    } catch (error) {
      console.log(error);
      showErrorMessage(error.message);
    }
  }

  return (
    <>
      <div className="token-component-container">
        {listPackage.map((item, index) => {
          return (
            <div key={index} className="token-package">
              <div className="package-name">{item.name}</div>
              <div className="usd-price">
                <span className="u1">$</span>
                <span className="u2">
                  {item.amountUSD.toLocaleString("en-US")}
                </span>
              </div>
              <div className="vnd-price">
                <span className="u2">
                  {item.amountVND.toLocaleString("en-US")}
                </span>
                <span className="u1">đ</span>
              </div>
              <div className="hewe-price">
                <span className="u1">HEWE</span>
                <span className="u2">
                  {item.amountHEWE.toLocaleString("en-US")}
                </span>
                {item.isBonus && (
                  <div>
                    <span className="uBonus">
                      + {item.amountBonus.toLocaleString("en-US")}
                    </span>
                  </div>
                )}
              </div>
              <div className="commission">
                COMMISSION: <span>{item.commissionPercent}</span>%
              </div>

              <button onClick={() => buyToken(item.amountUSD)}>
                Get this package
              </button>
            </div>
          );
        })}
      </div>

      <ToastContainer />
    </>
  );
}
