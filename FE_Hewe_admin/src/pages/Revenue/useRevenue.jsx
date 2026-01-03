import { Tag, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { convertTimeCreateAt } from "../../utils/format";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getListDataAPI = ({ limit, page, keyword, network, rangeDate }) => {
  const startDay = rangeDate[0] ? rangeDate[0].startOf("day").valueOf() : 1;
  const endDay = rangeDate[1] ? rangeDate[1].endOf("day").valueOf() : 9999999999999;

  return axios.get(
    `/getHistoryRevenue?limit=${limit}&page=${page}&keyword=${keyword}&timeStart=${startDay}&timeEnd=${endDay}`,
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

export const useRevenue = () => {
  const [network, setNetwork] = useState("BEP20");
  const [keyword, setKeyword] = useState("");
  const isSearchMode = useRef(false);

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
  const [rangeDate, setRangeDate] = useState([null, null]);

  const handleChangeRangeDate = (dates) => {
    console.log("dates", dates);

    setRangeDate(dates);
  };

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    handleSetCurrentPage(1);
    setKeyword(e.target.value);
  };

  const handleChangeNetwork = (e) => {
    handleSetCurrentPage(1);
    setNetwork(e.target.value);
  };

  const handleGetListData = useCallback(({ limit = LIMIT, page, keyword, network, rangeDate }) => {
    handleGetData({
      paramsQuery: { limit, page, keyword, network, rangeDate: rangeDate },
    });
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
        keyword: debounceValue,
        network,
        rangeDate,
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
        keyword: debounceValue,
        network,
        rangeDate,
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
      title: "Người giao dịch",
      render: (_, record) => {
        return (
          <div>
            <div>{record.userName}</div>
          </div>
        );
      },
    },
    {
      title: "Email người giao dịch",
      render: (_, record) => {
        return (
          <div>
            <div>{record.userEmail}</div>
          </div>
        );
      },
    },
    {
      title: "Người nhận giao dịch",
      render: (_, record) => {
        return (
          <div>
            <div>{record.revenueUserName}</div>
          </div>
        );
      },
    },
    {
      title: "Email người nhận giao dịch",
      render: (_, record) => {
        return (
          <div>
            <div>{record.revenueUserEmail}</div>
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "6px" }}>
            <div>{record.amountUSDT}</div> USDT
          </div>
        );
      },
    },
    {
      title: "Thời gian",
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
        network: network,
        rangeDate,
      });
    }
  }, [currentPage, network, rangeDate]);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      handleGetListData({
        page: currentPage,
        keyword: keyword,
        network: network,
        rangeDate,
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
    network,
    keyword,
    rangeDate,
    handleChangeRangeDate,
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
    handleChangeNetwork,
  };
};
