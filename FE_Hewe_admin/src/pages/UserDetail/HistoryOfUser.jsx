import { Button, Input as InputAntd, message, Radio, Table, Tag } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import instance from "../../axios";
import { Modal as ModalAntd } from "../../components/AntdComponent";
import { convertTimeCreateAt, formatHewe } from "../../utils/format";
import { round } from "../SwapUSDTToHewe/useSwapUSDTToHewe";
import { useWithdrawAmc } from "./hooks/useWithdrawAmc";
import { useWithdrawHewe } from "./hooks/useWithdrawHewe";
import { useWithdrawUSDT } from "./hooks/useWithdrawUSDT";

const ROWS = 10;

const API_MAPPING = {
  deposit: "deposit",
  depositHEWE: "depositHEWE",
  depositAMC: "depositAMC",
  withdrawUSDT: "withdrawUSDT",
  withdrawHEWE: "withdrawHEWE",
  withdrawAMC: "withdrawAMC",
  buyTokenAPI: "buyTokenAPI",
  buyTokenConnectWallet: "buyTokenConnectWallet",
};

export const HistoryOfUser = ({ userId }) => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [currentOptionAPI, setCurrentOptionAPI] = useState(API_MAPPING.deposit);

  const handleGetData = async ({ p }) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await instance.get(`getDetailUserList?limit=10&page=${p}&userId=${userId}&list=${currentOptionAPI}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setListData(res.data.data.array);
      setTotal(res.data.data.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const callbackGetData = () => {
    handleGetData({ p: page });
  };

  const {
    isPendingReview,
    isOpenModalApprove,
    isOpenModalReject,
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
  } = useWithdrawUSDT(callbackGetData);

  const {
    isPendingReview: isPendingReviewWithdrawHewe,
    isOpenModalApprove: isOpenModalApproveWithdrawHewe,
    isOpenModalReject: isOpenModalRejectWithdrawHewe,
    inputHash: inputHashWithdrawHewe,
    inputReason: inputReasonWithdrawHewe,
    handleCloseModalApprove: handleCloseModalApproveWithdrawHewe,
    handleCloseModalReject: handleCloseModalRejectWithdrawHewe,
    handleRequestApprove: handleRequestApproveWithdrawHewe,
    handleRequestReject: handleRequestRejectWithdrawHewe,
    handleChangeInputReason: handleChangeInputReasonWithdrawHewe,
    handleChangeInputHash: handleChangeInputHashWithdrawHewe,
    handleClickBtnApprove: handleClickBtnApproveWithdrawHewe,
    handleClickBtnReject: handleClickBtnRejectWithdrawHewe,
  } = useWithdrawHewe(callbackGetData);

  const {
    isPendingReview: isPendingReviewWithdrawAmc,
    isOpenModalApprove: isOpenModalApproveWithdrawAmc,
    isOpenModalReject: isOpenModalRejectWithdrawAmc,
    inputHash: inputHashWithdrawAmc,
    inputReason: inputReasonWithdrawAmc,
    handleCloseModalApprove: handleCloseModalApproveWithdrawAmc,
    handleCloseModalReject: handleCloseModalRejectWithdrawAmc,
    handleRequestApprove: handleRequestApproveWithdrawAmc,
    handleRequestReject: handleRequestRejectWithdrawAmc,
    handleChangeInputReason: handleChangeInputReasonWithdrawAmc,
    handleChangeInputHash: handleChangeInputHashWithdrawAmc,
    handleClickBtnApprove: handleClickBtnApproveWithdrawAmc,
    handleClickBtnReject: handleClickBtnRejectWithdrawAmc,
  } = useWithdrawAmc(callbackGetData);

  const handleChangeOptionsAPI = (e) => {
    if (loading) {
      message.error("Please wait data response");
      return;
    }
    setPage(1);
    setTotal(0);
    setCurrentOptionAPI(e.target.value);
  };

  const columns = useMemo(() => {
    switch (currentOptionAPI) {
      case API_MAPPING.deposit:
        return [
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
            title: "Amount",
            render: (_, record) => {
              return (
                <div style={{ display: "flex", gap: "6px" }}>
                  <div>{record.amount}</div> USDT
                </div>
              );
            },
          },
          {
            title: "Hash",
            dataIndex: "transactionHash",
          },
          {
            title: "Time",
            render: (_, record) => {
              return convertTimeCreateAt(record.createdAt);
            },
          },
        ];

      case API_MAPPING.depositHEWE:
        return [
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
            title: "Amount",
            render: (_, record) => {
              return (
                <div style={{ display: "flex", gap: "6px" }}>
                  <div>{record.amount}</div> HEWE
                </div>
              );
            },
          },
          {
            title: "Hash",
            dataIndex: "transactionHash",
          },
          {
            title: "Time",
            render: (_, record) => {
              return convertTimeCreateAt(record.createdAt);
            },
          },
        ];

      case API_MAPPING.depositAMC:
        return [
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
            title: "Amount",
            render: (_, record) => {
              return (
                <div style={{ display: "flex", gap: "6px" }}>
                  <div>{record.amount}</div> AMC
                </div>
              );
            },
          },
          {
            title: "Hash",
            dataIndex: "transactionHash",
          },
          {
            title: "Time",
            render: (_, record) => {
              return convertTimeCreateAt(record.createdAt);
            },
          },
        ];

      case API_MAPPING.withdrawUSDT:
        return [
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
            title: "Amount USDT",
            render: (_, record) => {
              return (
                <div>
                  <div>{formatHewe(record.amount)}</div>
                </div>
              );
            },
          },
          {
            title: "Amount USDT receive",
            render: (_, record) => {
              return (
                <div>
                  <div>{formatHewe(record.amountReceive)}</div>
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

      case API_MAPPING.withdrawHEWE:
        return [
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
                      <Button type="primary" onClick={handleClickBtnApproveWithdrawHewe(record)}>
                        Approved
                      </Button>
                      <Button danger onClick={handleClickBtnRejectWithdrawHewe(record)}>
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

      case API_MAPPING.withdrawAMC:
        return [
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
                      <Button type="primary" onClick={handleClickBtnApproveWithdrawAmc(record)}>
                        Approved
                      </Button>
                      <Button danger onClick={handleClickBtnRejectWithdrawAmc(record)}>
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

      case API_MAPPING.buyTokenAPI:
        return [
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
            render: (_, record) => record?.tokenBuy,
            width: 100,
          },
          {
            title: "Amount USDT",
            render: (_, record) => round(record?.amountUSDT),
            width: 150,
          },
          {
            title: "Amount Token",
            render: (_, record) => {
              if (record?.tokenBuy === "AMC") return round(record?.amountAmc) + " AMC";
              else if (record?.tokenBuy === "HEWE") return round(record?.amountHewe) + " HEWE";
              else return "";
            },
            width: 200,
          },
          {
            title: "Bonus",
            render: (_, record) => {
              if (!record?.amountBonus) return <></>;
              else return round(record?.amountBonus) + " " + record?.tokenBonus;
            },
            width: 200,
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
            title: "Time",
            render: (_, record) => new Date(record.createdAt).toLocaleString(),
            width: 150,
          },
        ];

      case API_MAPPING.buyTokenConnectWallet:
        return [
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

      default:
        return [];
    }
  }, [currentOptionAPI]);

  useEffect(() => {
    console.log("run");
    handleGetData({ p: page });
  }, [page, currentOptionAPI]);

  return (
    <>
      <h4>History data</h4>

      <Radio.Group disabled={loading} value={currentOptionAPI} onChange={handleChangeOptionsAPI}>
        <Radio value={API_MAPPING.deposit}>Deposit USDT</Radio>
        <Radio value={API_MAPPING.depositHEWE}>Deposit HEWE</Radio>
        <Radio value={API_MAPPING.depositAMC}>Deposit AMC</Radio>
        <Radio value={API_MAPPING.withdrawUSDT}>Withdraw USDT</Radio>
        <Radio value={API_MAPPING.withdrawHEWE}>Withdraw HEWE</Radio>
        <Radio value={API_MAPPING.withdrawAMC}>Withdraw AMC</Radio>
        <Radio value={API_MAPPING.buyTokenAPI}>Buy token</Radio>
        <Radio value={API_MAPPING.buyTokenConnectWallet}>Buy token connect wallet</Radio>
      </Radio.Group>

      <Table
        dataSource={listData}
        columns={columns}
        rowKey={(record) => record._id}
        size="middle"
        scroll={{ x: 900 }}
        loading={loading}
        pagination={{
          position: ["topRight"],
          size: "default",
          total,
          current: page,
          onChange: (p) => {
            setPage(p);
          },
          showSizeChanger: false,
          showQuickJumper: false,
          pageSize: ROWS,
        }}
      />

      {/* withdraw usdt */}

      <ModalAntd
        title="Approve transaction"
        isOpen={isOpenModalApprove}
        onCancel={handleCloseModalApprove}
        loading={isPendingReview}
        onConfirm={handleRequestApprove}
      >
        <InputAntd
          style={{ margin: "12px 0" }}
          placeholder="Enter hash"
          value={inputHash}
          onChange={handleChangeInputHash}
        />
      </ModalAntd>

      <ModalAntd
        title="Reject transaction"
        isOpen={isOpenModalReject}
        onCancel={handleCloseModalReject}
        loading={isPendingReview}
        onConfirm={handleRequestReject}
        isDangerButton={true}
      >
        <InputAntd
          style={{ margin: "12px 0" }}
          placeholder="Enter reason reject"
          value={inputReason}
          onChange={handleChangeInputReason}
        />
      </ModalAntd>

      {/* withdraw hewe */}

      <ModalAntd
        title="Approve transaction"
        isOpen={isOpenModalApproveWithdrawHewe}
        onCancel={handleCloseModalApproveWithdrawHewe}
        loading={isPendingReviewWithdrawHewe}
        onConfirm={handleRequestApproveWithdrawHewe}
      >
        <InputAntd
          style={{ margin: "12px 0" }}
          placeholder="Enter hash"
          value={inputHashWithdrawHewe}
          onChange={handleChangeInputHashWithdrawHewe}
        />
      </ModalAntd>

      <ModalAntd
        title="Reject transaction"
        isOpen={isOpenModalRejectWithdrawHewe}
        onCancel={handleCloseModalRejectWithdrawHewe}
        loading={isPendingReviewWithdrawHewe}
        onConfirm={handleRequestRejectWithdrawHewe}
        isDangerButton={true}
      >
        <InputAntd
          style={{ margin: "12px 0" }}
          placeholder="Enter reason reject"
          value={inputReasonWithdrawHewe}
          onChange={handleChangeInputReasonWithdrawHewe}
        />
      </ModalAntd>

      {/* withdraw amc */}
      <ModalAntd
        title="Approve transaction"
        isOpen={isOpenModalApproveWithdrawAmc}
        onCancel={handleCloseModalApproveWithdrawAmc}
        loading={isPendingReviewWithdrawAmc}
        onConfirm={handleRequestApproveWithdrawAmc}
      >
        <InputAntd
          size="large"
          style={{ margin: "12px 0" }}
          placeholder="Enter hash"
          value={inputHashWithdrawAmc}
          onChange={handleChangeInputHashWithdrawAmc}
        />
      </ModalAntd>

      <ModalAntd
        title="Reject transaction"
        isOpen={isOpenModalRejectWithdrawAmc}
        onCancel={handleCloseModalRejectWithdrawAmc}
        loading={isPendingReviewWithdrawAmc}
        onConfirm={handleRequestRejectWithdrawAmc}
        isDangerButton={true}
      >
        <InputAntd
          size="large"
          style={{ margin: "12px 0" }}
          placeholder="Enter reason reject"
          value={inputReasonWithdrawAmc}
          onChange={handleChangeInputReasonWithdrawAmc}
        />
      </ModalAntd>
    </>
  );
};
