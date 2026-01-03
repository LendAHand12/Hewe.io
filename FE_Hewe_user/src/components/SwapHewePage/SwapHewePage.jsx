import { useEffect, useState } from "react";
import "./SwapHewePage.scss";
import { FormSwapToken, HistorySwapToken } from "./components";
import { getSwapConfigAPI } from "../../services/swapService";
import { Result, Spin } from "antd";

export const SwapHewePage = () => {
  const [isReloadData, setIsReloadData] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [msg, setMsg] = useState("");
  const [swapConfig, setSwapConfig] = useState({ rate: 1, fee: 1 });

  const handleCheckAvailable = async () => {
    try {
      const res = await getSwapConfigAPI();

      if (res.data.data.canSwap) {
        setIsAvailable(true);
        setIsChecking(false);
        setSwapConfig({ rate: res.data.data.rate, fee: res.data.data.fee });

        return;
      }

      setMsg(res.data.data.message);
      setIsChecking(false);
    } catch (error) {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    handleCheckAvailable();
  }, []);

  return (
    <div className="SwapHewePage">
      {isChecking && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "50px 0",
          }}
        >
          <Spin />
        </div>
      )}

      {!isChecking && isAvailable && (
        <FormSwapToken
          setIsReloadData={setIsReloadData}
          swapConfig={swapConfig}
        />
      )}

      {!isChecking && !isAvailable && <Result status="warning" title={msg} />}

      <HistorySwapToken
        isReloadData={isReloadData}
        setIsReloadData={setIsReloadData}
      />
    </div>
  );
};
