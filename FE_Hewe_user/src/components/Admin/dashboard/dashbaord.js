import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { axiosService } from "../../../util/service";
import My_Referral from "../my_referral/My_Referral";
import "./style.scss";

const DashbaordData = () => {
  const history = useHistory();
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log(userData?.data?.email);

  const [data, setData] = useState();

  const fetchData = async () => {
    try {
      const response = await axiosService.get(`/getTokenTransactionHistory?email=${userData?.data?.email}`);
      setData(response?.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [copySuccess, setCopySuccess] = useState(false);

  const copyhash = (e) => {
    navigator.clipboard.writeText(e);
    setCopySuccess(true);
    toast.success("Copied Successfully");
  };
  const copyFrom = (e) => {
    navigator.clipboard.writeText(e);
    setCopySuccess(true);
    toast.success("Copied Successfully");
  };

  const copyTo = (e) => {
    navigator.clipboard.writeText(e);
    setCopySuccess(true);
    toast.success("Copied Successfully");
  };

  function numberToHex(number) {
    return "0x" + number.toString(16).padStart(2, "0");
  }

  const handleAddNetwork = async () => {
    try {
      const AMCHAIN_CONFIG = {
        chainId: numberToHex(999999), // '0x89'
        chainName: "AmChain",
        nativeCurrency: { name: "AMC", symbol: "AMC", decimals: 18 },
        rpcUrls: ["https://node1.amchain.net"],
        blockExplorerUrls: ["https://explorer.amchain.net/"],
      };

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [AMCHAIN_CONFIG],
      });

      toast.success("Add network success");
    } catch (error) {
      toast.error("Add network fail");
    }
  };

  return (
    <>
      <section className="dashboard">
        <div className="dashbody">
          <div className="d-flex justify-content-end w-100" style={{ gap: 10 }}>
            <button onClick={() => history.push("/adminBuyToken")} className="btn3-sds1">
              Connect wallet swap
            </button>

            <button onClick={handleAddNetwork} className="btn3-sds1">
              Add Network
            </button>
          </div>

          <My_Referral />
        </div>
      </section>
    </>
  );
};

export default DashbaordData;
