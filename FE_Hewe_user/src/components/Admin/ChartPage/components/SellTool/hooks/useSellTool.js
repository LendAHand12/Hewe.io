import { useState } from "react";
import { useSelector } from "react-redux";

export const useSellTool = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { walletSellPool } = useSelector((state) => state.chartReducer);

  const handleOpenModal = () => setIsOpenModal(true);

  const handleCloseModal = () => setIsOpenModal(false);

  return { isOpenModal, walletSellPool, handleOpenModal, handleCloseModal };
};
