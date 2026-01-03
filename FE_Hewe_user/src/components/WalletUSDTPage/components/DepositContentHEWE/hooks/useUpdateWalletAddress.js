import { useSelector } from "react-redux";
import { useModal } from "../../../../../hooks";
import { useEffect, useState } from "react";
import { requestUpdateWalletAddressAPI } from "../../../../../services/userService";
import { message } from "antd";

export const useUpdateWalletAddress = () => {
  const { profile } = useSelector((state) => state.userReducer);
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const [addressWallet, setAddressWallet] = useState("");
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const isDisabledBtnUpdate = addressWallet === "";

  const handleRequestUpgradeAddress = async () => {
    if (addressWallet === "") return;

    if (isPendingUpdate) return;

    setIsPendingUpdate(true);
    try {
      const res = await requestUpdateWalletAddressAPI({
        address: addressWallet,
      });

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

  useEffect(() => {
    if (profile && !profile?.walletAddress) {
      handleOpenModal();
    }
  }, [profile]);

  return {
    isOpen,
    isDisabledBtnUpdate,
    isPendingUpdate,
    addressWallet,
    handleCloseModal,
    handleRequestUpgradeAddress,
    handleChangeAddressWallet,
  };
};
