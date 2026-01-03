import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { useCallback, useEffect, useState } from "react";
import axios from "../../axios";
import { convertTimeCreateAt, formatHewe } from "../../utils/format";
import { Button, Image, Tag, message } from "antd";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getListDataAPI = ({ limit, page }) => {
  return axios.get(`/getAllTransactionsBuyBCFVND?limit=${limit}&page=${page}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

const requestApproveAPI = ({ transactionId }) => {
  return axios.post(
    `confirmTransactionsBuyBCFVND`,
    { transactionId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const requestRejectAPI = ({ transactionId }) => {
  return axios.post(
    `rejectTransactionsBuyBCFVND`,
    { transactionId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const useBuyHeweByVND = () => {
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
      const res = await requestApproveAPI({ transactionId: dataFocus._id });

      message.success(res.data.message);
      handleCloseModalApprove();
      setIsPendingReview(false);
      handleGetListData({ page: currentPage, limit: LIMIT });
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingReview(false);
    }
  };

  const handleRequestReject = async () => {
    if (isPendingReview) return;

    setIsPendingReview(true);

    try {
      const res = await requestRejectAPI({ transactionId: dataFocus._id });

      message.success(res.data.message);
      handleCloseModalReject();
      setIsPendingReview(false);
      handleGetListData({ page: currentPage, limit: LIMIT });
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingReview(false);
    }
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
      title: "Amount hewe",
      render: (_, record) => {
        return (
          <div>
            <div>{formatHewe(record.amountHewe)}</div>
          </div>
        );
      },
    },
    {
      title: "Amount VND",
      render: (_, record) => {
        return (
          <div>
            <div>{formatHewe(record.amountVnd)}</div>
          </div>
        );
      },
    },
    {
      title: "Message",
      render: (_, record) => {
        return (
          <div>
            <div>{record.message}</div>
          </div>
        );
      },
    },
    {
      title: "Bill",
      render: (_, record) => {
        return <Image src={record.billImage} className="imageAntdContainer" />;
      },
    },
    {
      title: "Bank",
      render: (_, record) => {
        const bankData = JSON.parse(record.bankData);
        return (
          <div>
            <div>{bankData.bankName}</div>
            <div>{bankData.bankAccountNumber}</div>
            <div>{bankData.bankAccountOwner}</div>
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

          case "userConfirmed":
            return <Tag color="blue">User confirmed</Tag>;

          case "userCanceled":
            return <Tag color="red">User canceled</Tag>;

          case "adminConfirmed":
            return <Tag color="success">Admin confirmed</Tag>;

          case "adminRejected":
            return <Tag color="red">Admin rejected</Tag>;

          default:
            return null;
        }
      },
    },
    {
      title: "",
      render: (_, record) => {
        switch (record.status) {
          case "userConfirmed":
            return (
              <div style={{ display: "flex", gap: "6px" }}>
                <Button type="primary" onClick={handleClickBtnApprove(record)}>
                  Approved
                </Button>
                <Button danger onClick={handleClickBtnReject(record)}>
                  Reject
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
    handleGetListData({ page: currentPage, keyword: debounceValue });
  }, [currentPage, debounceValue]);

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
    handleCloseModalApprove,
    handleCloseModalReject,
    handleRequestApprove,
    handleRequestReject,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
  };
};
