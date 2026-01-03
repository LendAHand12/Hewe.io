import { useEffect, useState } from "react";
import axios from "../../../axios";
import { message } from "antd";
import { calcPercentBonus } from "./useSellHewe";

export const useSellAmc = (userId, callbackGetProfile) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPendingSell, setIsPendingSell] = useState(false);
  const [hewePrice, setHewePrice] = useState(null);
  const [amcPrice, setAmcPrice] = useState(null);
  const [usdtInput, setUsdtInput] = useState("");
  const isDisabledBtn = usdtInput === "" || Number(usdtInput) == 0 || !amcPrice;
  const amountAmcReceive = amcPrice && usdtInput ? usdtInput / amcPrice : 0;
  const bonus =
    usdtInput && hewePrice
      ? (calcPercentBonus(usdtInput) * usdtInput) / hewePrice
      : 0;

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const handleChangeUsdtInput = (value) => {
    setUsdtInput(value);
  };

  const handleGetHewePrice = async () => {
    try {
      const res = await axios.get("adminGetPricing?token=hewe", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setHewePrice(res.data.data);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleGetAmcPrice = async () => {
    try {
      const res = await axios.get("adminGetPricing?token=amc", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setAmcPrice(res.data.data);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleSellTokenAmc = async () => {
    if (isPendingSell) return;

    setIsPendingSell(false);

    try {
      const res = await axios.post(
        "sellToken",
        {
          userId: userId,
          token: "amc",
          amountUSDT: usdtInput,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      handleCloseModal();
      message.success(res.data.message);
      setIsPendingSell(false);

      if (typeof callbackGetProfile === "function") {
        callbackGetProfile();
      }
    } catch (error) {
      setIsPendingSell(false);
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetHewePrice();
    handleGetAmcPrice();
  }, []);

  return {
    isDisabledBtn,
    isPendingSell,
    isOpenModal,
    amountAmcReceive,
    amcPrice,
    handleOpenModal,
    handleCloseModal,
    handleChangeUsdtInput,
    handleSellTokenAmc,
    usdtInput,
    bonus,
  };
};
