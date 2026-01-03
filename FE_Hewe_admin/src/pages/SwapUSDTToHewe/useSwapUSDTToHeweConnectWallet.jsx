import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { convertTimeCreateAt, formatHewe } from "../../utils/format";
import { Button, Image, Tag, message } from "antd";
import { round } from "./useSwapUSDTToHewe";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getListDataAPI = ({ limit, page, type, keyword, filterToken }) => {
  return axios.get(
    `/getSwapHistory?limit=${limit}&page=${page}&type=${type}&keyword=${keyword}&token=${filterToken}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const requestApproveAPI = ({ transactionId, transactionHash }) => {
  return axios.post(
    `approveWithdrawHewe`,
    { transactionId, transactionHash },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const requestRejectAPI = ({ transactionId, reason }) => {
  return axios.post(
    `rejectWithdrawHewe`,
    { transactionId, reason },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const useSwapUSDTToHeweConnectWallet = ({ type }) => {
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
  const {
    isOpen: isOpenModalApprove,
    handleOpenModal: handleOpenModalApprove,
    handleCloseModal: handleCloseModalApprove,
  } = useModal();
  const {
    isOpen: isOpenModalReject,
    handleOpenModal: handleOpenModalReject,
    handleCloseModal: handleCloseModalReject,
  } = useModal();
  const [dataFocus, setDataFocus] = useState(null);
  const [isPendingReview, setIsPendingReview] = useState(false);
  const [inputHash, setInputHash] = useState("");
  const [inputReason, setInputReason] = useState("");
  const [filterToken, setFilterToken] = useState("hewe");
  const [keyword, setKeyword] = useState("");
  const isSearchMode = useRef(false);

  const handleChangeFilterToken = (e) => {
    setFilterToken(e.target.value);
    handleSetCurrentPage(1);
  };

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    setKeyword(e.target.value);
    handleSetCurrentPage(1);
  };

  const handleGetListData = useCallback(
    ({ limit = LIMIT, page, keyword, filterToken }) => {
      handleGetData({
        paramsQuery: { limit, page, keyword, type, filterToken },
      });
    },
    []
  );

  const handleClickBtnApprove = (data) => () => {
    setDataFocus(data);
    handleOpenModalApprove();
  };

  const handleClickBtnReject = (data) => () => {
    setDataFocus(data);
    handleOpenModalReject();
  };

  const handleRequestApprove = async () => {
    if (isPendingReview) return;

    if (inputHash === "") {
      message.error("Enter hash");
      return;
    }

    setIsPendingReview(true);

    try {
      const res = await requestApproveAPI({
        transactionId: dataFocus._id,
        transactionHash: inputHash,
      });

      message.success(res.data.message);
      handleCloseModalApprove();
      setIsPendingReview(false);
      handleGetListData({
        page: currentPage,
        limit: LIMIT,
        filterToken: filterToken,
        keyword: keyword,
      });
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingReview(false);
    }
  };

  const handleRequestReject = async () => {
    if (isPendingReview) return;

    if (inputReason === "") {
      message.error("Enter reason reject");
      return;
    }

    setIsPendingReview(true);

    try {
      const res = await requestRejectAPI({
        transactionId: dataFocus._id,
        reason: inputReason,
      });

      message.success(res.data.message);
      handleCloseModalReject();
      setIsPendingReview(false);
      handleGetListData({
        page: currentPage,
        limit: LIMIT,
        filterToken: filterToken,
        keyword: keyword,
      });
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingReview(false);
    }
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
      title: "User",
      render: (_, record) => {
        return (
          <div>
            <div>{record.userEmail}</div>
          </div>
        );
      },
      width: 100,
    },
    {
      title: "Token",
      render: (_, record) => record?.tokenBuy?.toUpperCase(),
      width: 100,
    },
    {
      title: "Amount USDT",
      render: (_, record) => round(record?.amountUSDT),
      width: 150,
    },
    {
      title: "Status",
      render: (_, record) => (
        <Tag color="green">
          <span style={{ fontWeight: 600 }}>Success</span>
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Transaction Hash",
      render: (_, record) => record?.transactionHash,
      width: 200,
    },
    {
      title: "Time",
      render: (_, record) => new Date(record.createdAt).toLocaleString(),
      width: 150,
    },
  ];

  useEffect(() => {
    if (isSearchMode.current) return;
    handleGetListData({
      page: currentPage,
      keyword: keyword,
      filterToken: filterToken,
    });
  }, [currentPage, filterToken]);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      handleGetListData({
        page: currentPage,
        keyword: keyword,
        filterToken: filterToken,
      });
      isSearchMode.current = false;
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [keyword]);

  useEffect(() => {
    if (!isOpenModalApprove && inputHash !== "") {
      setInputHash("");
    }

    if (!isOpenModalReject && inputReason !== "") {
      setInputHash("");
    }
  }, [isOpenModalApprove, isOpenModalReject]);

  return {
    x,
    y,
    totalItems,
    currentPage,
    isPendingReview,
    data,
    loading,
    columns,
    limitPerRow,
    inputValue,
    isOpenModalApprove,
    isOpenModalReject,
    dataFocus,
    inputHash,
    inputReason,
    filterToken,
    keyword,
    handleChangeFilterToken,
    handleChangeKeyword,
    handleCloseModalApprove,
    handleCloseModalReject,
    handleRequestApprove,
    handleRequestReject,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    handleChangeInputReason,
    handleChangeInputHash,
  };
};
