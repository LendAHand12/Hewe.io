import { useSelector } from "react-redux";
import { roundedNumber } from "../utils/roundedNumber";
import { useMemo } from "react";

const calculatePriceHewePriceExpected = (
  poolUsdt,
  poolHewe,
  totalTransaction,
  currentPrice
) => {
  if (!poolUsdt || !poolHewe || !currentPrice) return 0;

  const totalHewe = totalTransaction / currentPrice;

  return (poolUsdt - totalTransaction) / (poolHewe + totalHewe);
};

const calculatePercentageSlippage = (hewePriceRealtime, hewePriceExpected) => {
  if (!hewePriceRealtime || !hewePriceExpected) return 0;

  return Math.abs(
    ((hewePriceRealtime - hewePriceExpected) / hewePriceExpected) * 100
  );
};

const renderStatusSlippage = (percentageSlippage) => {
  if (percentageSlippage >= 30) {
    return {
      message: `Slippage Tolerance: ${percentageSlippage} % - Can not sell ...`,
      errorCode: 100,
    };
  } else if (percentageSlippage >= 5 && percentageSlippage < 30) {
    return {
      message: `Slippage Tolerance: ${percentageSlippage} % - Warning sell ...`,
      errorCode: 200,
    };
  } else {
    return {
      message: `Slippage Tolerance: ${percentageSlippage} %`,
      errorCode: 0,
    };
  }
};

const calculateFinalUsdtReceived = (
  totalTransaction,
  percentageSlippage,
  currentPrice
) => {
  if (!currentPrice) return 0;

  const valueUSDT =
    totalTransaction - (totalTransaction * percentageSlippage) / 100;

  return roundedNumber(valueUSDT);
};

const renderIsDisabledStatusBtn = (
  totalTransaction,
  statusSlippageErrorCode
) => {
  if (totalTransaction === 0 || statusSlippageErrorCode === 100) {
    return true;
  }

  return false;
};

export const useCalculateUsdtReceived = ({ totalTransaction }) => {
  const { usdtPool, hewePool, currentCandle } = useSelector(
    (state) => state.chartReducer
  );
  const priceHeweExpected = useMemo(
    () =>
      calculatePriceHewePriceExpected(
        usdtPool,
        hewePool,
        totalTransaction,
        currentCandle?.close || 0
      ),
    [totalTransaction, currentCandle?.close, usdtPool, hewePool]
  );

  const percentageSlippage = useMemo(
    () =>
      calculatePercentageSlippage(currentCandle?.close || 0, priceHeweExpected),
    [priceHeweExpected, currentCandle?.close]
  );

  const { message, errorCode } = useMemo(
    () => renderStatusSlippage(percentageSlippage),
    [percentageSlippage]
  );

  const isDisabledBtn = useMemo(
    () => renderIsDisabledStatusBtn(totalTransaction, errorCode),
    [totalTransaction, errorCode]
  );

  const finalUsdtReceived = useMemo(
    () =>
      calculateFinalUsdtReceived(
        totalTransaction,
        percentageSlippage,
        currentCandle?.close || 0
      ),
    [totalTransaction, percentageSlippage, currentCandle?.close]
  );

  const isError = errorCode === 100;
  const isWarning = errorCode === 200;
  const isNotError = errorCode === 0;

  return {
    finalUsdtReceived,
    isDisabledBtn,
    message,
    isError,
    isWarning,
    isNotError,
  };
};
