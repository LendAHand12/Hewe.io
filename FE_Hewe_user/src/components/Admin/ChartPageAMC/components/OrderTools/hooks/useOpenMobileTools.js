import { useState } from "react";

export const useOpenMobileTools = () => {
  const [isOpenTools, setIsOpenTools] = useState(false);
  const [side, setSide] = useState(null);

  const handleOpenTools = (side) => () => {
    setIsOpenTools(true);
    setSide(side);
  };

  const handleCloseTools = () => {
    setIsOpenTools(false);
    setSide(null);
  };

  return {
    side,
    isOpenTools,
    handleCloseTools,
    handleOpenTools,
  };
};
