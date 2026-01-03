import { useState } from "react";

export const usePagination = ({ defaultPage, limit = 10 }) => {
  const [currentPage, setCurrentPage] = useState(defaultPage || 1);
  const [totalItems, setTotalItems] = useState(0);
  const [limitPerRow, setLimitPerRow] = useState(limit);
  const x = totalItems !== 0 ? (currentPage - 1) * limit + 1 : 0;
  const y = x + limit - 1 > totalItems ? totalItems : x + limit - 1;

  const handleSetCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleSetTotalItems = (total) => {
    setTotalItems(total);
  };

  const handleSetLimitPerRow = (_, size) => {
    setLimitPerRow(size);
    setCurrentPage(1);
  };

  return {
    x,
    y,
    currentPage,
    totalItems,
    limitPerRow,
    handleSetCurrentPage,
    handleSetTotalItems,
    handleSetLimitPerRow,
  };
};
