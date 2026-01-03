import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyToken from "../../data/MyToken.json";
import { network } from "../../data/port";
import getWeb3 from "../../function/getWeb3";
import { writeContract } from "@wagmi/core";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../Modal/Modal";
import { Button, message } from "antd";
import { useHistory } from "react-router-dom";
import { BuyToken } from "../UserPage/components";
import tokenimg from "../../assets/admin/token.svg";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import carddesign from "../../assets/admin/cardesg.png";
import { axiosService } from "../../util/service";
import { HistoryBuyTokenByUSDT } from "./HistoryBuyTokenByUSDT";
import { useProfile } from "../../hooks";

export default function TokenComponent() {
  const { dispatch } = useDispatch();
  const { address } = useSelector((state) => state.walletReducer);
  const {
    isOpen: isOpenModalNotif,
    handleCloseModal: handleCloseModalNotif,
    handleOpenModal: handleOpenModalNotif,
  } = useModal();
  const {
    isOpen: isOpenModalTransaction,
    handleCloseModal: handleCloseModalTransaction,
    handleOpenModal: handleOpenModalTransaction,
  } = useModal();
  const [packageSelected, setPackageSelected] = useState({
    amountVND: null,
    namePackage: null,
  });
  const history = useHistory();
  const [dataTransaction, setDataTransaction] = useState(null);
  const [isPendingCancel, setIsPendingCancel] = useState(false);
  const [isPendingCheck, setIsPendingCheck] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { profile } = useSelector((state) => state.userReducer);

  const handleViewHistoryTransaction = () => {
    // history.push("/user/history-buy-token");
  };

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

  // ------------data------------------

  const userData = JSON.parse(localStorage.getItem("user"));

  async function buyToken(amountUSD, amountHEWE) {
    try {
      if (!address) {
        showErrorMessage("Please connect your wallet");
        return;
      }

      const walletAdmin = `0x53F31019919A5EE226722AED4F4F444d7AB2F8D0`;
      const amountString = (amountUSD * 1e18).toLocaleString("fullwide", {
        useGrouping: false,
      });

      let writecontractdata = await writeContract({
        address: MyToken.networks[network].address,
        abi: MyToken.abi,
        functionName: "transfer",
        args: [walletAdmin, amountString],
      });

      setTimeout(() => {
        postData(writecontractdata, amountUSD, amountHEWE);

        showSuccessMessage(`"Buy token successfully"`);
      }, 15000);
    } catch (error) {
      console.log(error);
      showErrorMessage(error.message);
    }
  }

  const postData = async (e, amountUSD, amountHEWE) => {
    const web3 = await getWeb3();

    let transaction = await web3.eth.getTransaction(
      e.hash,
      function (err, result) {
        console.log(result, "result");
      }
    );
    console.log(transaction);

    console.log(e);
    let transactionValue = {
      email: userData?.data?.email,
      from: transaction.from,
      to: transaction.to,
      amount_hewe: amountHEWE,
      amount_usd: amountUSD,
      hash: e.hash,
    };

    try {
      const { data } = await axiosService.post(
        "TokenTransactionHistroy",
        transactionValue
      );
      console.log("TokenTransactionHistroy", data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModalNotifMdw = () => {
    handleCloseModalNotif();
    setDataTransaction(null);
  };

  const handleContinuePreviousTransaction = async () => {
    handleCloseModalNotifMdw();
    handleOpenModalTransaction();
  };

  const handleCheckIfHaveTransaction = async (amountHEWE) => {
    if (isPendingCheck) return;

    setIsPendingCheck(true);

    await axiosService
      .post("checkTransaction")
      .then((res) => {
        if (!res.data.data) {
          setIsPendingCheck(false);
          handleOpenModalTransaction();
          return;
        }

        setDataTransaction(res.data.data);
        setIsPendingCheck(false);

        // Trường hợp đã tồn tại 1 giao dịch nhưng khác với gói hiện tại
        if (amountHEWE !== res.data.data.amountHewe) {
          handleOpenModalNotif();
        } else {
          handleOpenModalTransaction();
        }
      })
      .catch((error) => {
        // Trường hợp chưa có giao dịch mua nào trước đó
        setIsPendingCheck(false);

        if (error.response.data.message === "User is not transaction") {
          handleOpenModalTransaction();
        } else {
          toast.error(error.response.data.message);
        }
      });
  };

  const handleClickBtnBuyTokenByVND =
    (amountUSD, amountHEWE, namePackage, amountBonus) => () => {
      setPackageSelected({
        amountUSD,
        namePackage: namePackage,
        amountHEWE: amountHEWE,
        amountBonus: amountBonus || 0,
      });
      handleCheckIfHaveTransaction(amountHEWE);
    };

  const handleCancelPreviousTransaction = async (idTransaction, token) => {
    try {
      const res = await axiosService.post("cancelBuyHeweByVND", {
        transactionId: idTransaction,
        gRec: token,
      });

      showSuccessMessage(res.data.message);
      handleCloseModalNotif();
      handleOpenModalTransaction();
      setIsPendingCancel(false);
    } catch (error) {
      showErrorMessage(error.response.data.message);
      setIsPendingCancel(false);
    }
  };

  const handleVerifyRecaptchaCancel = (idTransaction) => async () => {
    if (!executeRecaptcha) {
      return;
    }

    if (isPendingCancel) return;

    setIsPendingCancel(true);

    await executeRecaptcha("cancelTransaction").then((token) =>
      handleCancelPreviousTransaction(idTransaction, token)
    );
  };

  const [isPendingBuyByUSDT, setIsPendingBuyByUSDT] = useState(false);
  const { handleGetProfile } = useProfile();
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const [currentPackage, setCurrentPackage] = useState({
    packageName: null,
    amountUSDT: null,
  });
  const { listPackage } = useSelector((state) => state.userReducer);

  useEffect(() => {
    console.log("listPackage has changed:", listPackage);
  }, [listPackage]);

  console.log("listPackage");

  const handleClickBtnBuyByUSDT = (amountUSDT, packageName) => () => {
    handleOpenModal();
    setCurrentPackage({ amountUSDT, packageName });
  };

  const handleRequestBtnBuyTokenByUSDT = async (
    amountUSDTPackage,
    namePackage,
    token
  ) => {
    if (profile.usdtBalance < amountUSDTPackage) {
      toast.error("Insufficiency USDT balance");
      return;
    }

    try {
      const res = await axiosService.post("buyPackageHeweByUSDT", {
        packageName: namePackage,
        gRec: token,
      });

      message.success(res.data.message);
      setIsPendingBuyByUSDT(false);
      handleGetProfile();
      handleCloseModal();
    } catch (error) {
      setIsPendingBuyByUSDT(false);
      message.error(error.response.data.message);
    }
  };

  const handleRecaptchaVerify = async () => {
    if (isPendingBuyByUSDT) return;

    setIsPendingBuyByUSDT(true);

    if (!executeRecaptcha) {
      return;
    }

    await executeRecaptcha("buyByUSDT").then((token) => {
      handleRequestBtnBuyTokenByUSDT(
        currentPackage.amountUSDT,
        currentPackage.packageName,
        token
      );
    });
  };

  return (
    <div className="token-component-container-wrap">
      <div className="cardcontainer">
        <div className="token-component-container">
          {listPackage.map((item, index) => {
            return (
              <div className="token-package" key={index}>
                <div className="cardcont tablebg">
                  <div>
                    <div>
                      <img
                        src={tokenimg}
                        alt=""
                        className="img-fluid carddesing"
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <h5 className="package-name">{item.name}</h5>
                    </div>
                  </div>
                  <div>
                    <div className="infocont mt-3">
                      <p className="name pe-3 prcolor">usdt</p>
                      <p className="value">
                        {item.amountUSD.toLocaleString("en-US")}
                      </p>
                    </div>
                    <div className="infocont">
                      <p className="name prcolor pe-3">hewe</p>
                      <p className="value">
                        {item.amountHEWE.toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      buyToken(item.amountUSD, item.amountHEWE);
                    }}
                  >
                    {address ? "Buy token" : "Connect wallet"}
                  </button>
                  <button
                    onClick={handleClickBtnBuyByUSDT(item.amountUSD, item.name)}
                  >
                    Buy by USDT
                  </button>
                </div>

                {item.isBonus && (
                  <div className="bonuscont">
                    <span className="">
                      + {item.amountBonus.toLocaleString("en-US")} HEWE
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="my-3 text-center">
        <button
          onClick={() => window.open("/how-to-buy", "_blank")}
          className="btn33"
        >
          Having Trouble buying HEWE?
        </button>
      </div>

      {/* <HistoryBuyToken /> */}
      <HistoryBuyTokenByUSDT />

      <div
        style={{
          margin: "0 auto",
          marginTop: "50px",
          maxWidth: "1400px",
          padding: "30px",
        }}
      >
        {/* <HistoryBuyTokenUser /> */}
      </div>

      <Modal
        title="Buy token by VND"
        onCancel={handleCloseModalTransaction}
        isShowFooter={false}
        isOpen={isOpenModalTransaction}
        // destroyOnClose={true}
        isCentered={false}
      >
        <BuyToken
          namePackage={packageSelected.namePackage}
          amountBonus={packageSelected.amountBonus}
          amountHEWE={packageSelected.amountHEWE}
          onCloseModalWhenCancel={handleCloseModalTransaction}
        />
      </Modal>

      <Modal
        title="Buy token by USDT"
        isOpen={isOpen}
        onCancel={handleCloseModal}
        onConfirm={handleRecaptchaVerify}
        confirmLoading={isPendingBuyByUSDT}
      >
        <div>
          Confirm by package {currentPackage.packageName} with{" "}
          {currentPackage.amountUSDT} USDT
        </div>
      </Modal>

      {dataTransaction && (
        <Modal
          className="Ok"
          isOpen={isOpenModalNotif}
          title="Buy token by VND"
          onCancel={handleCloseModalNotifMdw}
          isShowFooter={false}
          destroyOnClose={true}
          isCentered={false}
        >
          <div className="modalNotifContainer">
            <div className="title">You have had a previous transaction.</div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div className="btnsCustom">
                <button onClick={handleContinuePreviousTransaction}>
                  Continue previous transaction
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
}
