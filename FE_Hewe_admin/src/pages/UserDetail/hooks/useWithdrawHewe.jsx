import { useModal } from "../../../hooks";
import { useEffect, useState } from "react";
import axios from "../../../axios";
import { convertTimeCreateAt, formatHewe } from "../../../utils/format";
import { Button, Tag, message } from "antd";

const token = localStorage.getItem("token");

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

export const useWithdrawHewe = (callbackGetData) => {
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

      if (typeof callbackGetData === "function") {
        callbackGetData();
      }
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

      if (typeof callbackGetData === "function") {
        callbackGetData();
      }
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

          case "approved":
            return <Tag color="success">Approved</Tag>;

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
    if (!isOpenModalApprove && inputHash !== "") {
      setInputHash("");
    }

    if (!isOpenModalReject && inputReason !== "") {
      setInputHash("");
    }
  }, [isOpenModalApprove, isOpenModalReject]);

  return {
    isPendingReview,
    columns,
    isOpenModalApprove,
    isOpenModalReject,
    dataFocus,
    inputHash,
    inputReason,
    handleCloseModalApprove,
    handleCloseModalReject,
    handleRequestApprove,
    handleRequestReject,
    handleChangeInputReason,
    handleChangeInputHash,
    handleClickBtnApprove,
    handleClickBtnReject,
  };
};
