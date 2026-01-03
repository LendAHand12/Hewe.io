import { Tag, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { convertTimeCreateAt } from "../../utils/format";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getListDataAPI = ({ limit, page, keyword, tokenFilter }) => {
  return axios.get(
    `/historySetUserBalance?limit=${limit}&page=${page}&keyword=${keyword}&token=${tokenFilter}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useTransactionManagement = () => {
  const [tokenFilter, setTokenFilter] = useState("usdt");
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
    setTokenFilter(e.target.value);
  };

  const handleGetListData = useCallback(
    ({ limit = LIMIT, page, keyword, tokenFilter }) => {
      handleGetData({
        paramsQuery: { limit, page, keyword, tokenFilter },
      });
    },
    []
  );

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
      title: "Name",
      render: (_, record) => {
        return (
          <div>
            <div>{record.userName}</div>
          </div>
        );
      },
    },
    {
      title: "Email",
      render: (_, record) => {
        return (
          <div>
            <div>{record.userEmail}</div>
          </div>
        );
      },
    },

    {
      title: "Amount",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "6px" }}>
            <div>{record.amount}</div> {record.token.toUpperCase()}
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
        tokenFilter: tokenFilter,
      });
    }
  }, [currentPage, tokenFilter]);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      handleGetListData({
        page: currentPage,
        keyword: keyword,
        tokenFilter: tokenFilter,
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
    tokenFilter,
    keyword,
    handleChangeKeyword,
    handleChangeTokenFilter,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    handleChangeInputReason,
    handleChangeInputHash,
  };
};
