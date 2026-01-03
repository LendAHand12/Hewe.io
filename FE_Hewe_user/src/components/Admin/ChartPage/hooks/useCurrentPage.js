import { useState } from "react";

export const useCurrentPage = (initialPage) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleChangeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    handleChangeCurrentPage,
  };
};
