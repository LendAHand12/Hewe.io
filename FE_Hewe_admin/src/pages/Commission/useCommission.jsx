import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { convertTimeCreateAt, formatHewe } from "../../utils/format";
import { Button, Tag, message } from "antd";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getListDataAPI = ({ limit, page, keyword }) => {
  return axios.get(
    `/getCommissionHistory?limit=${limit}&page=${page}&keyword=${keyword}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const requestApproveAPI = ({ transactionId, transactionHash }) => {
  return axios.post(
    `approveCommission`,
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
    `rejectCommission`,
    { transactionId, reason },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const useCommission = () => {
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
  const [keyword, setKeyword] = useState("");
  const isSearchMode = useRef(false);

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    setKeyword(e.target.value);
    handleSetCurrentPage(1);
  };

  const handleChangeInputHash = (e) => {
    const value = e.target.value;
    setInputHash(value);
  };

  const handleChangeInputReason = (e) => {
    const value = e.target.value;
    setInputReason(value);
  };

  const handleGetListData = useCallback(({ limit = LIMIT, page, keyword }) => {
    handleGetData({ paramsQuery: { limit, page, keyword } });
  }, []);

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

    setIsPendingReview(true);

    try {
      const res = await requestApproveAPI({
        transactionId: dataFocus._id,
        transactionHash: inputHash,
      });

      message.success(res.data.message);
      handleCloseModalApprove();
      setIsPendingReview(false);
      handleGetListData({ page: currentPage, limit: LIMIT, keyword });
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingReview(false);
    }
  };

  const handleRequestReject = async () => {
    if (isPendingReview) return;

    setIsPendingReview(true);

    try {
      const res = await requestRejectAPI({
        transactionId: dataFocus._id,
        reason: inputReason,
      });

      message.success(res.data.message);
      handleCloseModalReject();
      setIsPendingReview(false);
      handleGetListData({ page: currentPage, limit: LIMIT, keyword });
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingReview(false);
    }
  };

  const columns = [
    {
      title: "User buy token",
      render: (_, record) => {
        return (
          <div>
            <div>{record.userEmail}</div>
          </div>
        );
      },
    },
    {
      title: "User receive commission",
      render: (_, record) => {
        return (
          <div>
            <div>{record.commissionUserEmail}</div>
          </div>
        );
      },
    },
    {
      title: "Amount USDT",
      render: (_, record) => {
        return (
          <div>
            <div>{formatHewe(record.amountTokenCommission)}</div>
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
    if (isSearchMode.current) return;

    handleGetListData({ page: currentPage, keyword: keyword });
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
    keyword,
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
