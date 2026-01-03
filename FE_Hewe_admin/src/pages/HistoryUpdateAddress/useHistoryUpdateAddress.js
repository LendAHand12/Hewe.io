import { Tag, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { convertTimeCreateAt } from "../../utils/format";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getListDataAPI = ({ limit, page, keyword, tokenFilter }) => {
  return axios.get(
    `/getHistoryUpdateAddress?limit=${limit}&page=${page}&keyword=${keyword}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useHistoryUpdateAddress = () => {
  const [keyword, setKeyword] = useState("");
  const {
    x,
    y,
    currentPage,
    totalItems,
    limitPerRow,
    handleSetCurrentPage,
    handleSetTotalItems,
    handleSetLimitPerRow,
  } = usePagination({ defaultPage: 1, limit: LIMIT });
  const { data, loading, handleGetData } = useListTable({
    service: getListDataAPI,
    callbackSetTotalItem: handleSetTotalItems,
    defaultParamsPayload: {
      limit: LIMIT,
      page: 1,
      keyword: "",
    },
  });
  const { inputValue, debounceValue, handleSearch } = useSearch({
    initialValue: "",
    callbackFn: () => handleSetCurrentPage(1),
  });
  const [inputHash, setInputHash] = useState("");
  const [inputReason, setInputReason] = useState("");
  const isSearchMode = useRef(false);

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    handleSetCurrentPage(1);
    setKeyword(e.target.value);
  };

  const handleChangeTokenFilter = (e) => {
    handleSetCurrentPage(1);
  };

  const handleGetListData = useCallback(({ limit = LIMIT, page, keyword }) => {
    handleGetData({
      paramsQuery: { limit, page, keyword },
    });
  }, []);

  const handleChangeInputHash = (e) => {
    const value = e.target.value;
    setInputHash(value);
  };

  const handleChangeInputReason = (e) => {
    const value = e.target.value;
    setInputReason(value);
  };

  const columns = [
    {
      title: "User",
      render: (_, record) => {
        return (
          <div>
            <div>{record.userName}</div>
            <div>{record.userEmail}</div>
          </div>
        );
      },
    },
    {
      title: "Address",
      render: (_, record) => {
        return (
          <div>
            <div>Old: {record.oldAddress}</div>
            <div>New: {record.newAddress}</div>
          </div>
        );
      },
    },

    {
      title: "Time",
      render: (_, record) => {
        return convertTimeCreateAt(record.createdAt);
      },
    },
  ];

  useEffect(() => {
    if (!isSearchMode.current) {
      handleGetListData({
        page: currentPage,
        keyword: keyword,
      });
    }
  }, [currentPage]);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      handleGetListData({
        page: currentPage,
        keyword: keyword,
      });
      isSearchMode.current = false;
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [keyword]);

  return {
    x,
    y,
    totalItems,
    currentPage,
    data,
    loading,
    columns,
    limitPerRow,
    inputValue,
    inputHash,
    inputReason,
    keyword,
    handleChangeKeyword,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    handleChangeInputReason,
    handleChangeInputHash,
  };
};
