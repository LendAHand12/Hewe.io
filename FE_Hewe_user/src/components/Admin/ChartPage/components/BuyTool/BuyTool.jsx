import { InputNumber, Select, Spin } from "antd";
import "./BuyTool.scss";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { roundedNumber } from "../../utils/roundedNumber";
import { useOrderTransaction } from "../../hooks/useOrderTransaction";
import { useCalculateHeweReceived } from "../../hooks/useCalculateHeweReceived";

export const CURRENCY_OPTIONS = [
  { value: "USDT", label: "USDT" },
  { value: "HEWE", label: "HEWE" },
];

// currency always USDT
export const preprocessTotalTransaction = (
  currentCandle,
  currency,
  amount,
  side
) => {
  if (!currentCandle || Number(amount) === 0) return 0;

  if (currency === "USDT") return Number(amount);

  const calculate = amount * currentCandle.close;

  return Number(calculate);
};

export const BuyTool = ({ callbackCloseTools }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const { currentCandle } = useSelector((state) => state.chartReducer);
  const totalTransaction = preprocessTotalTransaction(
    currentCandle,
    currency,
    amount,
    "buy"
  );
  const inputAmountRef = useRef(null);
  const { isPendingOrder, handleRequestOrder } = useOrderTransaction();

  const {
    finalHeweReceived,
    isDisabledBtn,
    message,
    isError,
    isWarning,
    isNotError,
  } = useCalculateHeweReceived({ totalTransaction });

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
            <Select
              value={currency}
              onChange={handleChangeCurrency}
              options={CURRENCY_OPTIONS}
            />
          </div>
        </div>

        <div className="totalTransaction">
          <div className="label">Total transactions</div>
          <div className="value">{roundedNumber(totalTransaction)} USDT</div>
        </div>

        <div className="totalTransaction">
          <div className="label">Est. received</div>
          <div className="value">
            {finalHeweReceived > 0 ? roundedNumber(finalHeweReceived) : "--"}{" "}
            HEWE
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
          className={`btnTransaction buy ${isDisabledBtn ? "disabled" : ""}`}
          onClick={() => {
            if (isDisabledBtn) return;

            handleRequestOrder("buy", totalTransaction, handleClearData)();
          }}
        >
          {isPendingOrder ? <Spin /> : "Buy HEWE"}
        </div>
      </div>
    </div>
  );
};
