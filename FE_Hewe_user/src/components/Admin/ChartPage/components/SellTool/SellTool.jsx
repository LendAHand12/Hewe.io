import { InputNumber, Select, Spin } from "antd";
import "./SellTool.scss";
import { useRef, useState } from "react";
import {
  CURRENCY_OPTIONS,
  preprocessTotalTransaction,
} from "../BuyTool/BuyTool";
import { useSelector } from "react-redux";
import { useOrderTransaction } from "../../hooks/useOrderTransaction";
import { useSellTool } from "./hooks/useSellTool";
import { Modal } from "../../../../Modal/Modal";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import { useCalculateUsdtReceived } from "../../hooks/useCalculateUsdtReceived";
import { roundedNumber } from "../../utils/roundedNumber";

export const SellTool = ({ callbackCloseTools }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("HEWE");
  const { currentCandle } = useSelector((state) => state.chartReducer);
  const totalTransaction = preprocessTotalTransaction(
    currentCandle,
    currency,
    amount,
    "sell"
  );
  const inputAmountRef = useRef(null);
  const { isPendingOrder, handleRequestOrder } = useOrderTransaction();
  const { isOpenModal, walletSellPool, handleOpenModal, handleCloseModal } =
    useSellTool();

  const {
    finalUsdtReceived,
    isDisabledBtn,
    message,
    isError,
    isWarning,
    isNotError,
  } = useCalculateUsdtReceived({ totalTransaction });

  const handleClearData = () => {
    setAmount("");

    if (typeof callbackCloseTools === "function") {
      callbackCloseTools();
    }
  };

  const handleChangeCurrency = (value) => {
    setCurrency(value);
  };

  const handleChangeAmount = (value) => {
    setAmount(value);
  };

  const handleFocusAmount = () => {
    inputAmountRef?.current.classList.add("focused");
  };

  const handleBlurAmount = () => {
    inputAmountRef?.current.classList.remove("focused");
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletSellPool);
    toast.info("Copied!");
  };

  return (
    <div className="BuyTool toolContainer">
      <div className="formControls">
        {/* <div className="formItem disabled">
          <div className="label">Price</div>

          <InputNumber
            controls={false}
            className="inputInside"
            placeholder="Market"
            readOnly
          />
          <div className="currency">USDT</div>
        </div> */}

        <div className="formItem" ref={inputAmountRef}>
          <div className="label needBorder">Amount</div>
          <InputNumber
            controls={false}
            className="inputInside"
            value={amount}
            onChange={handleChangeAmount}
            onFocus={handleFocusAmount}
            onBlur={handleBlurAmount}
          />
          <div className="currency">
            {" "}
            <Select
              value={currency}
              onChange={handleChangeCurrency}
              options={CURRENCY_OPTIONS}
            />
          </div>
        </div>

        {/* {currentCandle && (
          <div className="totalTransaction">
            <div className="label">Total HEWE sell</div>
            <div className="value">
              {roundedNumber(totalTransaction / currentCandle.close)} HEWE
            </div>
          </div>
        )} */}

        <div className="totalTransaction">
          <div className="label">Total transactions</div>
          <div className="value">{roundedNumber(totalTransaction)} USDT</div>
        </div>

        <div className="totalTransaction">
          <div className="label">Est. received</div>
          <div className="value">
            {finalUsdtReceived > 0 ? roundedNumber(finalUsdtReceived) : "--"}{" "}
            USDT
          </div>
        </div>

        {isError && (
          <div style={{ color: "red", fontSize: "12px", fontStyle: "italic" }}>
            {message}
          </div>
        )}

        {isWarning && (
          <div
            style={{ color: "orange", fontSize: "12px", fontStyle: "italic" }}
          >
            {message}
          </div>
        )}

        {isNotError && (
          <div
            style={{
              color: "rgb(0, 183, 70)",
              fontSize: "12px",
              fontStyle: "italic",
            }}
          >
            {message}
          </div>
        )}

        <div
          className={`btnTransaction sell ${isDisabledBtn ? "disabled" : ""}`}
          // onClick={handleRequestOrder("sell", amount, handleClearData)}
          onClick={() => {
            if (isDisabledBtn) return;

            handleOpenModal();
          }}
        >
          {isPendingOrder ? <Spin /> : "Sell HEWE"}
        </div>
      </div>

      <Modal
        title="Sell HEWE token"
        isOpen={isOpenModal}
        onCancel={handleCloseModal}
        isShowFooter={false}
      >
        {walletSellPool && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div>Please transfer HEWE to this wallet address</div>
            <div
              style={{
                background: "#fff",
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              <QRCode value={walletSellPool} size={200} />
            </div>
            <div style={{ cursor: "pointer" }} onClick={handleCopyAddress}>
              {walletSellPool} <i class="fa-solid fa-copy"></i>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
