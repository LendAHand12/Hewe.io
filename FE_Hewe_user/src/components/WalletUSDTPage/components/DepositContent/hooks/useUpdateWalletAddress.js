import { useSelector } from "react-redux";
import { useModal, useProfile } from "../../../../../hooks";
import { useEffect, useState } from "react";
import { requestUpdateWalletAddressAPI } from "../../../../../services/userService";
import { message } from "antd";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

export const useUpdateWalletAddress = () => {
  const { profile } = useSelector((state) => state.userReducer);
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const [addressWallet, setAddressWallet] = useState("");
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const { handleGetProfile } = useProfile();

  const isDisabledBtnUpdate = addressWallet === "";

  const handleRequestUpgradeAddress = async () => {
    if (addressWallet === "") return;

    if (isPendingUpdate) return;

    setIsPendingUpdate(true);
    try {
      const res = await requestUpdateWalletAddressAPI({
        address: addressWallet,
      });
      await handleGetProfile();

      message.success(res.data.message);
      setIsPendingUpdate(false);
      handleCloseModal();
      setAddressWallet("");
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingUpdate(false);
    }
  };

  const handleChangeAddressWallet = (e) => {
    const value = e.target.value.trim();

    setAddressWallet(value);
  };

  // cap nhat dia chi vi nhan hoa hong

  console.log("window", window.location.href);

  useEffect(() => {
    if (
      profile &&
      !profile?.walletAddress &&
      !window.location.href.includes("depositUSDT")
    ) {
      handleOpenModal();
    }
  }, [profile]);

  return {
    isOpen,
    isDisabledBtnUpdate,
    isPendingUpdate,
    addressWallet,
    handleCloseModal,
    handleOpenModal,
    handleRequestUpgradeAddress,
    handleChangeAddressWallet,
  };
};
