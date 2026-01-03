import { useEffect, useState } from "react";
import axios from "../../../axios";
import { message } from "antd";

export const calcPercentBonus = (amountUSDT) => {
  let percent = 0;
  if (!amountUSDT) percent = 0;
  else if (amountUSDT < 1000) percent = 0;
  else if (amountUSDT <= 5000) percent = 0.01;
  else percent = 0.02;

  return percent;
};

export const useSellHewe = (userId, callbackGetProfile) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPendingSell, setIsPendingSell] = useState(false);
  const [hewePrice, setHewePrice] = useState(null);
  const [amcPrice, setAmcPrice] = useState(null);
  const [usdtInput, setUsdtInput] = useState("");
  const isDisabledBtn =
    usdtInput === "" || Number(usdtInput) == 0 || !hewePrice;
  const amountHeweReceive = hewePrice && usdtInput ? usdtInput / hewePrice : 0;
  const bonus =
    usdtInput && amcPrice
      ? (calcPercentBonus(usdtInput) * usdtInput) / amcPrice
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

  const handleSellTokenHewe = async () => {
    if (isPendingSell) return;

    setIsPendingSell(false);

    try {
      const res = await axios.post(
        "sellToken",
        {
          userId: userId,
          token: "hewe",
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
    amountHeweReceive,
    hewePrice,
    handleOpenModal,
    handleCloseModal,
    handleChangeUsdtInput,
    handleSellTokenHewe,
    usdtInput,
    bonus,
  };
};
