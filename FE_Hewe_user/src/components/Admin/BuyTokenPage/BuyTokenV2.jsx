import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { Button, InputNumber, Modal, Tabs } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import MyToken from "../../../data/MyToken.json";
// import { network } from "../../../data/port";
import { showAlert } from "../../../function/showAlert";
import { useProfile } from "../../../hooks";
import { axiosService } from "../../../util/service";
import { IconToken } from "../../IconToken/IconToken";
import HistoryV2 from "./HistoryV2";
// import { config } from "./config";
import socket from "../../../util/socket";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { config, network, USDTToken } from "../../Web3Provider/Web3Provider";
import { ChartVisualize } from "../ChartPageAMC/components/ChartVisualize/ChartVisualize";

// type = "api" | "connectWallet"

export default function BuyTokenV2({ type }) {
  const [tab, setTab] = useState("1");
  const [loading, setLoading] = useState(false);
  // const { address } = useSelector((state) => state.walletReducer);
  const { profile } = useSelector((state) => state.userReducer);
  const { handleGetProfile } = useProfile();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [open, setOpen] = useState(false);
  const [k, setK] = useState(0);
  const { address, isConnecting, isDisconnected } = useAccount();
  const [realtimeAMC, setRealtimeAMC] = useState(0);
  const location = useLocation();
  let [HEWE_RATE, setHEWE_RATE] = useState(0);
  let [AMC_RATE, setAMC_RATE] = useState(0);
  const isBuyByWallet = location.pathname === "/adminBuyToken";
  const feeHewe = 0;
  const feeAmc = 0.05;
  const isShowChartAMC = tab == 2 && isBuyByWallet;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      amount: undefined,
    },
  });

  const roundDown = (num) => Math.floor(num * 100) / 100;
  const roundDown4 = (num) => Math.floor(num * 10000) / 10000;
  const round = (value) =>
    Number(value)
      .toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .replaceAll(",", "");

  const roundDisplay = (value) =>
    Number(roundDown(value || 0))
      .toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .replaceAll(",", "");

  const calcBonus = () => {
    if (formik.values.amount === undefined) return 0;

    let percent = 0;
    if (formik.values.amount < 5000) percent = 0;
    else percent = 0.01;

    if (tab == 1) {
      // mua HEWE bonus HEWE
      // số USDT mua HEWE * tỷ lệ bonus -> quy đổi ra HEWE
      return (formik.values.amount * percent) / HEWE_RATE;
    } else if (tab == 2) {
      // mua AMC bonus AMC
      // số USDT mua AMC * tỷ lệ bonus -> quy đổi ra AMC
      return (formik.values.amount * percent) / AMC_RATE;
    } else return 0;
  };

  const calcAmountToken = () => {
    if (formik.values.amount === undefined) return 0;

    if (tab == 1) {
      // mua HEWE
      return formik.values.amount / HEWE_RATE;
    } else if (tab == 2) {
      // mua AMC
      const amountAMC = formik.values.amount / AMC_RATE;
      const finalAmountAMCReceived = amountAMC - (amountAMC * feeAmc) / 100;
      return finalAmountAMCReceived;
    } else return 0;
  };

  const tokenText = tab == 1 ? "HEWE" : "AMC";
  const tokenBonusText = tab == 1 ? "HEWE" : "AMC";

  async function buyToken(amountUSD, tokenBuy) {
    try {
      setLoading(true);

      if (!amountUSD) {
        showAlert("error", "Please enter amount USDT");
        return;
      }

      if (!address) {
        showAlert("error", "Please connect your wallet");
        return;
      }

      const walletAdmin =
        tokenBuy.toLowerCase() === "hewe"
          ? `0x53F31019919A5EE226722AED4F4F444d7AB2F8D0`
          : `0x1bc348842EDE5437d9f92dCF567d55FcB1634d6c`;
      const amountString = (amountUSD * 1e18).toLocaleString("fullwide", {
        useGrouping: false,
      });

      let hash = await writeContract(config, {
        address: USDTToken.networks[network].address,
        abi: USDTToken.abi,
        functionName: "transfer",
        args: [walletAdmin, amountString],
      });

      await waitForTransactionReceipt(config, {
        hash: hash,
      });

      showAlert("success", "Swap token successfully");
    } catch (error) {
      console.log(error.message);

      if (error.message.includes("transfer amount exceeds balance")) {
        showAlert(
          "error",
          "Insufficient balance USDT in your wallet " + address
        );
      } else {
        showAlert("error", error.shortMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  const processRecaptcha = async () => {
    if (loading) return;
    if (!executeRecaptcha) return;

    setLoading(true);
    await executeRecaptcha("buyTokenV2").then((token) => {
      handleBuy(token);
    });
  };

  const handleBuy = async (gRecToken) => {
    try {
      let res = await axiosService.post("/v2/buyTokenV2", {
        gRec: gRecToken,
        amountUSDT: formik.values.amount,
        token: tab == 1 ? "hewe" : "amc",
      });

      showAlert("success", res.data.message);
      setOpen(false);
      formik.setFieldValue("amount", undefined);
      setK((k) => k + 1);
      handleGetProfile();
    } catch (error) {
      console.log(error);
      setOpen(false);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (type === "connectWallet") {
      buyToken(formik.values.amount, tokenText);
    } else if (type === "api") {
      if (profile?.usdtBalance < formik.values.amount)
        return showAlert("error", "Insufficient balance");

      setOpen(true);
    }
  };

  const getPrice = async () => {
    try {
      let res1 = await axiosService.get(`/v2/getConfigPrice?token=hewe`);
      // let res2 = await axiosService.get(`/v2/getConfigPrice?token=amc`);
      setHEWE_RATE(Number(res1.data.data));
      // setAMC_RATE(Number(res2.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearInput = () => {
    formik.setFieldValue("amount", "");
  };

  useEffect(() => {
    getPrice();
  }, []);

  useEffect(() => {
    socket.on("newPrice", (data) => {
      setAMC_RATE(Number(data.priceAMC));
      setHEWE_RATE(Number(data.priceHEWE));
    });

    return () => {
      socket.off("newPrice");
    };
  }, []);

  return (
    <div className="BuyTokenV2J24">
      <div>
        <Tabs
          destroyInactiveTabPane={true}
          activeKey={tab}
          onChange={(tab) => {
            handleClearInput();
            setTab(tab);
          }}
          size="large"
          //   type="card"
          items={
            !isBuyByWallet
              ? [
                  {
                    key: "1",
                    label: "Swap HEWE",
                  },
                  {
                    key: "2",
                    label: "Swap AMC",
                  },
                ]
              : [
                  {
                    key: "1",
                    label: "Swap HEWE",
                  },
                  // {
                  //   key: "2",
                  //   label: "Swap AMC",
                  // },
                  // đang ẩn phần swap AMC bằng connect wallet
                ]
          }
        />
      </div>

      <div className="input-com2-wrap">
        <div className="input-com2">
          <div className="token-title">
            <div className="l">
              <IconToken token="USDT" /> <span>USDT</span>
            </div>

            {type === "api" && (
              <div className="r">
                <span>Available:</span>{" "}
                <span>{roundDisplay(profile?.usdtBalance)}</span>
              </div>
            )}
          </div>

          <InputNumber
            size="large"
            controls={false}
            style={{ width: "100%" }}
            placeholder={`Enter amount USDT to swap ${tokenText}`}
            value={formik.values.amount}
            disabled={
              !isBuyByWallet ? (tab == 2 ? AMC_RATE === 0 : false) : false
            }
            onChange={(value) => formik.setFieldValue("amount", value)}
            min={0}
            max={100_000_000}
          />
        </div>

        <div className="summary">
          <div className="summary-item">
            <span>Amount USDT</span>
            <p>{round(formik.values.amount || 0)}</p>
          </div>

          <div className="summary-item">
            <span>Amount {tokenText}</span>
            <p>{roundDown4(calcAmountToken())}</p>
          </div>

          <div className="summary-item">
            <span>Price</span>
            <p>{tab == 1 ? HEWE_RATE : AMC_RATE}</p>
          </div>

          {tab == 2 && (
            <div className="summary-item">
              <span>Fee</span>
              <p>{feeAmc}%</p>
            </div>
          )}

          {type == "api" && (
            <div className="summary-item">
              <span>Bonus</span>
              <p>
                {round(calcBonus())} {tokenBonusText}
              </p>
            </div>
          )}
        </div>

        <Button
          style={{ width: "100%", color: "black", fontWeight: 600 }}
          type="primary"
          size="large"
          onClick={() => handleClick()}
          disabled={
            !formik.values.amount ||
            (type === "api" && profile?.usdtBalance < formik.values.amount)
          }
          loading={loading}
        >
          Swap {tokenText}
        </Button>

        <div style={{ textAlign: "center", marginTop: 25 }}>
          <button
            onClick={() => window.open("/how-to-buy", "_blank")}
            className="btn33"
          >
            Having trouble swap HEWE?
          </button>
        </div>

        <Modal
          open={open}
          onOk={() => processRecaptcha(formik.values.amount)}
          onCancel={() => setOpen(false)}
          title={null}
          centered
          maskClosable={false}
          destroyOnClose
          okText="Confirm"
          className="modal-confirm-buy-token-V2J24"
          okButtonProps={{
            size: "large",
            loading: loading,
            style: { color: "black" },
          }}
          cancelButtonProps={{ size: "large" }}
        >
          <div>Please review your transaction before confirming</div>

          <div className="summary">
            <div className="summary-item">
              <span>Transaction</span>
              <p>Swap {tokenText}</p>
            </div>

            <div className="summary-item">
              <span>Amount USDT</span>
              <p>{round(formik.values.amount || 0)}</p>
            </div>

            <div className="summary-item">
              <span>Amount {tokenText}</span>
              <p>{roundDown4(calcAmountToken())}</p>
            </div>

            <div className="summary-item">
              <span>Price</span>
              <p>{tab == 1 ? HEWE_RATE : AMC_RATE}</p>
            </div>

            {tab == 2 && (
              <div className="summary-item">
                <span>Fee</span>
                <p>{feeAmc}%</p>
              </div>
            )}

            {type == "api" && (
              <div className="summary-item">
                <span>Bonus</span>
                <p>
                  {round(calcBonus())} {tokenBonusText}
                </p>
              </div>
            )}
          </div>
        </Modal>

        <ToastContainer />
      </div>

      {isShowChartAMC && (
        <div style={{ marginTop: "24px" }}>
          <ChartVisualize onlyShowChart={true} height={300} />
        </div>
      )}

      <HistoryV2 key={k} type={type} />
    </div>
  );
}
