import { Button, Tag, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { convertTimeCreateAt, formatHewe } from "../../utils/format";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getListDataAPI = ({ limit, page, keyword }) => {
  return axios.get(`/getAllTransactionsWithdrawHewe?limit=${limit}&page=${page}&keyword=${keyword}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

const getListDataAPI_WR_AMC = ({ limit, page, keyword }) => {
  return axios.get(`/getAllTransactionsWithdrawAMC?limit=${limit}&page=${page}&keyword=${keyword}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
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

const requestApproveAPI_WR_AMC = ({ transactionId, transactionHash }) => {
  return axios.post(
    `approveWithdrawAmc`,
    { transactionId, transactionHash },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const requestApproveAPI_WR_AMC_Auto = ({ transactionId }) => {
  return axios.post(
    `approveWithdrawAmcAutoTransfer`,
    { transactionId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const requestApproveAPI_WR_Hewe_Auto = ({ transactionId }) => {
  return axios.post(
    `approveWithdrawHeweAutoTransfer`,
    { transactionId },
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

const requestRejectAPI_WR_AMC = ({ transactionId, reason }) => {
  return axios.post(
    `rejectWithdrawAmc`,
    { transactionId, reason },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const useWithdrawHewe = () => {
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
  const [isLoadingAutoTransfer, setIsLoadingAutoTransfer] = useState(false);

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    setKeyword(e.target.value);
    handleSetCurrentPage(1);
  };

  const handleGetListData = useCallback(({ limit = LIMIT, page, keyword }) => {
    handleGetData({ paramsQuery: { limit, page, keyword } });
  }, []);

  const handleClickBtnApprove = (data) => () => {
    setDataFocus(data);
    handleOpenModalApprove();
  };

  const handleClickBtnApproveAuto = (data) => async () => {
    let text = `DUYỆT RÚT HEWE\nTự động chuyển ${data.amount} HEWE\ncho người dùng ${data.userEmail}\ntại địa chỉ ${data.address}`;
    if (window.confirm(text)) {
      setIsLoadingAutoTransfer(true);
      try {
        const res = await requestApproveAPI_WR_Hewe_Auto({
          transactionId: data._id,
        });

        message.success(res.data.message);
        handleGetListData({ page: currentPage, limit: LIMIT, keyword: keyword });
      } catch (error) {
        message.error(error.response.data.message);
      } finally {
        setIsLoadingAutoTransfer(false);
      }
    }
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
      handleGetListData({ page: currentPage, limit: LIMIT, keyword: keyword });
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
      handleGetListData({ page: currentPage, limit: LIMIT, keyword: keyword });
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
    },
    {
      title: "Method",
      render: (_, record) => {
        return (
          <div>
            <div>{record.method}</div>
          </div>
        );
      },
    },
    {
      title: "Amount hewe",
      render: (_, record) => {
        return (
          <div>
            <div>{formatHewe(record.amount)}</div>
          </div>
        );
      },
    },
    {
      title: "Address",
      render: (_, record) => {
        return (
          <div>
            <div>{record.address}</div>
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
    {
      title: "Status",
      render: (_, record) => {
        switch (record.status) {
          case "pending":
            return <Tag>Pending</Tag>;

          case "approved": {
            if (record.isAuto) return <Tag color="success">Approved (Auto)</Tag>;
            else return <Tag color="success">Approved</Tag>;
          }

          case "rejected":
            return <Tag color="red">Rejected</Tag>;

          default:
            return null;
        }
      },
    },
    {
      title: "",
      render: (_, record) => {
        switch (record.status) {
          case "pending":
            return (
              <div style={{ display: "flex", gap: "6px" }}>
                <Button type="primary" onClick={handleClickBtnApproveAuto(record)}>
                  Duyệt tự động
                </Button>
                <Button type="primary" onClick={handleClickBtnApprove(record)}>
                  Duyệt thủ công
                </Button>
                <Button danger onClick={handleClickBtnReject(record)}>
                  Từ chối
                </Button>
              </div>
            );

          default:
            break;
        }
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
    isLoadingAutoTransfer,
  };
};

export const useWithdrawAmc = () => {
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
    service: getListDataAPI_WR_AMC,
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
  const [isLoadingAutoTransfer, setIsLoadingAutoTransfer] = useState(false);

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    setKeyword(e.target.value);
    handleSetCurrentPage(1);
  };

  const handleGetListData = useCallback(({ limit = LIMIT, page, keyword }) => {
    handleGetData({ paramsQuery: { limit, page, keyword } });
  }, []);

  const handleClickBtnApprove = (data) => () => {
    setDataFocus(data);
    handleOpenModalApprove();
  };

  const handleClickBtnApproveAuto = (data) => async () => {
    let text = `DUYỆT RÚT AMC\nTự động chuyển ${data.amount} AMC\ncho người dùng ${data.userEmail}\ntại địa chỉ ${data.address}`;
    if (window.confirm(text)) {
      setIsLoadingAutoTransfer(true);
      try {
        const res = await requestApproveAPI_WR_AMC_Auto({
          transactionId: data._id,
        });

        message.success(res.data.message);
        handleGetListData({ page: currentPage, limit: LIMIT, keyword: keyword });
      } catch (error) {
        message.error(error.response.data.message);
      } finally {
        setIsLoadingAutoTransfer(false);
      }
    }
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
      const res = await requestApproveAPI_WR_AMC({
        transactionId: dataFocus._id,
        transactionHash: inputHash,
      });

      message.success(res.data.message);
      handleCloseModalApprove();
      setIsPendingReview(false);
      handleGetListData({ page: currentPage, limit: LIMIT, keyword: keyword });
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
      const res = await requestRejectAPI_WR_AMC({
        transactionId: dataFocus._id,
        reason: inputReason,
      });

      message.success(res.data.message);
      handleCloseModalReject();
      setIsPendingReview(false);
      handleGetListData({ page: currentPage, limit: LIMIT, keyword: keyword });
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
      render: (_, record) => record.userEmail,
    },
    {
      title: "Method",
      render: (_, record) => record.method,
    },
    {
      title: "Amount AMC",
      render: (_, record) => {
        return (
          <div>
            <div>{record.amount}</div>
          </div>
        );
      },
    },
    {
      title: "Address",
      render: (_, record) => {
        return (
          <div>
            <div>{record.address}</div>
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
    {
      title: "Status",
      render: (_, record) => {
        switch (record.status) {
          case "pending":
            return <Tag>Pending</Tag>;

          case "approved": {
            if (record.isAuto) return <Tag color="success">Approved (Auto)</Tag>;
            else return <Tag color="success">Approved</Tag>;
          }

          case "rejected":
            return <Tag color="red">Rejected</Tag>;

          default:
            return null;
        }
      },
    },
    {
      title: "",
      render: (_, record) => {
        switch (record.status) {
          case "pending":
            return (
              <div style={{ display: "flex", gap: "6px" }}>
                <Button type="primary" onClick={handleClickBtnApproveAuto(record)}>
                  Duyệt tự động
                </Button>
                <Button type="primary" onClick={handleClickBtnApprove(record)}>
                  Duyệt thủ công
                </Button>
                <Button danger onClick={handleClickBtnReject(record)}>
                  Từ chối
                </Button>
              </div>
            );

          default:
            break;
        }
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
    isLoadingAutoTransfer,
  };
};
