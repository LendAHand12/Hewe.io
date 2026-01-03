import "./style.scss";
import React, { useEffect, useState } from "react";
import Header from "../HomePage/Header";
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId } from "wagmi";
import { Alert, Button, InputNumber, Tabs } from "antd";
import { useFormik } from "formik";
import { IconToken } from "../IconToken/IconToken";
import socket from "../../util/socket";
import { config, network, USDTToken } from "../Web3Provider/Web3Provider";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { showAlert } from "../../function/showAlert";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import { Copybtn } from "../svg";

const NewSwap = () => {
  const feeAmc = 0;
   const feeHewe = 0;
  const { address } = useAccount();
  const [tab, setTab] = useState("1");
  let [AMC_RATE, setAMC_RATE] = useState(0);
  let [HEWE_RATE, setHEWE_RATE] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addressRecevied, setRecevied] = useState('');
  const roundDown4 = (num) => Math.floor(num * 10000) / 10000;
  const round = (value) =>
    Number(value)
      .toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .replaceAll(",", "");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      amount: undefined,
    },
  });

  const calcAmountToken = () => {
    if (formik.values.amount === undefined) return 0;

    const amountAMC = formik.values.amount / AMC_RATE;
    const finalAmountAMCReceived = amountAMC - (amountAMC * feeAmc) / 100;
    return finalAmountAMCReceived;
  };
  const calcAmountTokenHewe = () => {
    if (formik.values.amount === undefined) return 0;

    const amountAMC = formik.values.amount / HEWE_RATE;
    const finalAmountAMCReceived = amountAMC - (amountAMC * feeHewe) / 100;
    return finalAmountAMCReceived;
  };
  async function buyToken(amountUSD) {
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

      const walletAdmin = "0xdF92C71f188c7b35b35F67C565EbA5e977Ce6DB8";
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

      showAlert("success", "Transfer successfully");
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
  async function buyTokenHewe(amountUSD) {
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

      const walletAdmin = "0x9C845DE6E2dc359da3A22bCe0c29fA4443714A15";
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

      showAlert("success", "Transfer successfully");
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
  const handleClick = () => {
    buyToken(formik.values.amount);
  };
  const handleClickHewe=()=>{
    buyTokenHewe(formik.values.amount)
  }
  useEffect(() => {
    socket.on("newPrice", (data) => {
      setAMC_RATE(Number(data.priceAMC));
      setHEWE_RATE(Number(data.priceHEWE));
    });

    return () => {
      socket.off("newPrice");
    };
  }, []);
useEffect(()=>{
  if(tab==2){
    setRecevied(`0xdF92C71f188c7b35b35F67C565EbA5e977Ce6DB8`)
  }else if(tab==3){
    setRecevied(`ssss`)
  }
},[tab])
  return (
    <div className="d-flex newSwap">
      <div className="newSwap_bodyupper">
        <div className="start_buying_bodyinner">
          <div className="start_buying_body ">
            <h2 style={{ padding: 0 }}>Swap</h2>
            <Tabs
              destroyInactiveTabPane={true}
              activeKey={tab}
              onChange={(tab) => {
                setTab(tab);
              }}
              size="large"
              items={[
                {
                  key: "1",
                  label: "USDT (BEP20) to AMC (AMC20)",
                },
                {
                  key: "2",
                  label: "AMC (AMC20) to AMC (BEP20)",
                },
                {
                  key: "3",
                  label: "USDT (BEP20) to HEWE (AMC20)",
                },
              ]}
            />

            {tab !== "2" ? (
              <>
                <div className="connectwbtn">
                  {!address && (
                    <p
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      Please connect your wallet before swapping
                    </p>
                  )}
                  <ConnectKitButton />
                </div>

                {address && (
                  <>
                    <div className="input-com2-wrap">
                      <div className="input-com2">
                        <div className="token-title">
                          <div className="l">
                            <IconToken token="USDT" /> <span>USDT</span>
                          </div>
                        </div>

                        <InputNumber
                          min={5}
                          size="large"
                          controls={false}
                          max={100_000_000}
                          style={{ width: "100%" }}
                          value={formik.values.amount}
                          placeholder={`Enter amount USDT (BEP20)`}
                          onChange={(value) =>
                            formik.setFieldValue("amount", value)
                          }
                        />
                      </div>

                      {tab == 1 && (
                        <>
                          <div className="summary">
                            <div className="summary-item">
                              <span>Amount USDT (BEP20)</span>
                              <p>{round(formik.values.amount || 0)}</p>
                            </div>
                            <div className="summary-item">
                              <span>Amount AMC (AMC20)</span>
                              <p>{roundDown4(calcAmountToken())}</p>
                            </div>
                            <div className="summary-item">
                              <span>Price</span>
                              <p>{AMC_RATE}</p>
                            </div>
                            <div className="summary-item">
                              <Alert
                                message="Attention: Minimum swap is 5 USDT. Any amount
                                below, we will not be responsible any lost."
                                type="warning"
                              />
                            </div>
                          </div>
                          <Button
                            style={{
                              width: "100%",
                              color: "black",
                              fontWeight: 600,
                            }}
                            type="primary"
                            size="large"
                            onClick={() => handleClick()}
                            disabled={
                              !formik.values.amount || formik.values.amount < 5
                            }
                            loading={loading}
                          >
                            Swap USDT
                          </Button>
                        </>
                      )}
                       {tab == 3 && (
                        <>
                          <div className="summary">
                            <div className="summary-item">
                              <span>Amount USDT (BEP20)</span>
                              <p>{round(formik.values.amount || 0)}</p>
                            </div>
                            <div className="summary-item">
                              <span>Amount HEWE (AMC20)</span>
                              <p>{roundDown4(calcAmountTokenHewe())}</p>
                            </div>
                            <div className="summary-item">
                              <span>Price</span>
                              <p>{HEWE_RATE}</p>
                            </div>
                            <div className="summary-item">
                              <Alert
                                message="Attention: Minimum swap is 5 USDT. Any amount
                                below, we will not be responsible any lost."
                                type="warning"
                              />
                            </div>
                          </div>
                          <Button
                            style={{
                              width: "100%",
                              color: "black",
                              fontWeight: 600,
                            }}
                            type="primary"
                            size="large"
                            onClick={() => handleClickHewe()}
                            disabled={
                              !formik.values.amount || formik.values.amount < 5
                            }
                            loading={loading}
                          >
                            Swap USDT
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div
                // style={{
                //   display: "flex",
                //   alignItems: "center",
                //   justifyContent: "center",
                //   flexDirection: "column",
                // }}
                className="w-100 align-items-center"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p
                  style={{ paddingBottom: 10, marginTop: 10 }}
                  className="w-100"
                >
                  Please transfer AMC (AMC20) to address or scan QR code{" "}
                  <div className=" refside">
                    <div
                      className="inputref"
                      style={{ marginBottom: 0, marginTop: 10 }}
                    >
                      <input
                        type="text"
                        className="w-full border-0"
                        placeholder={addressRecevied}
                        value={addressRecevied}
                        disabled="true"
                      />
                      <div
                        className="flex items-center copy"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          var copyText = addressRecevied;

                          // Copy the text inside the text field
                          navigator.clipboard.writeText(copyText);

                          toast.success(`Copied to Clipboard`);
                        }}
                      >
                        <Copybtn className="ms-3" />
                      </div>
                    </div>
                  </div>
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ background: "white", padding: "16px" }}>
                    <QRCode
                      value={addressRecevied}
                      size={200}
                    />
                  </div>
                </div>
                <Alert
                  style={{ marginTop: 20 }}
                  message="Attention: Minimum swap is 10 AMC. Any amount below, we will not be responsible any lost."
                  type="warning"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSwap;
