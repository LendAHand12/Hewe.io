import { Tag, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { convertTimeCreateAt } from "../../utils/format";
import { convertUnitTimestamp } from "../../utils/convertUnixTimestamp";
import { Link } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import { URL } from "../../constants/Statics";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getListDataAPI = ({
  limit,
  page,
  keyword,
  tokenFilter,
  timeStart,
  timeEnd,
}) => {
  return axios.get(
    `${URL}/api/user/v2/getPublicHistoryTransactionChart?limit=${limit}&page=${page}&keyword=${keyword}&timeStart=1&timeEnd=9999999999999`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useTransactionOrder = () => {
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

  const handleRetchData = () => {
    return handleGetListData({
      limit: LIMIT,
      page: currentPage,
      keyword,
      tokenFilter,
    });
  };

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
      title: "Date",
      dataIndex: "createdAt",
      render: (value) => new Date(value).toLocaleString("vi-VN"),
    },
    {
      title: "Side",
      dataIndex: "type",
      render: (value) => {
        return (
          <div style={{ color: value === "buy" ? "#00B746" : "#EF403C" }}>
            {value === "buy" ? "Buy" : "Sell"}
          </div>
        );
      },
    },
    {
      title: "Price",
      render: (_, record) => {
        return `$${record.price.toFixed(2)}`;
      },
    },
    {
      title: "Amount USDT",
      dataIndex: "amountUsdt",
      render: (value) => value.toFixed(2),
    },
    {
      title: "Amount HEWE",
      dataIndex: "amountHewe",
      render: (value) => value.toFixed(2),
    },
    {
      title: "Other",
      dataIndex: "transactionHash",
      render: (value, record) => {
        const linkNavigate =
          record.type === "buy"
            ? `https://bscscan.com/tx/${value}`
            : `https://explorer.amchain.net/transactions_detail/${value}`;

        return (
          <a href={linkNavigate} target="_blank" rel="noopener noreferrer">
            <div style={{ color: "green", textDecoration: "underline" }}>
              TxID
            </div>
          </a>
        );
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
    handleRetchData,
  };
};
