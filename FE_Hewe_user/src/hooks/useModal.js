import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleToggletModal = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    handleCloseModal,
    handleOpenModal,
    handleToggletModal,
  };
};
