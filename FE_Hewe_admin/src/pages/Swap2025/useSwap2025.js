import { Button, Tag, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { useListTable, usePagination, useSearch } from "../../hooks";
import { convertTimeCreateAt } from "../../utils/format";

const LIMIT = 10;

const getListDataAPI = ({ limit, page, keyword, type }) => {
  return axios.get(
    `/getSwap2025List?type=${type}&limit=${limit}&page=${page}&keyword=${keyword}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const markTransactionAPI = ({ id, action, transactionHash }) => {
  return axios.post(
    `/markSwap2025Transaction`,
    { id, action, transactionHash },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useSwap2025 = () => {
  const [type, setType] = useState("USDT(BEP20)=>AMC(AMC20)");
  const [keyword, setKeyword] = useState("");
  const isSearchMode = useRef(false);
  const [approveModal, setApproveModal] = useState({ visible: false, record: null });
  const [transactionHash, setTransactionHash] = useState("");

  const {
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
      type: type,
    },
  });

  const handleChangeType = (e) => {
    handleSetCurrentPage(1);
    setType(e.target.value);
  };

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    handleSetCurrentPage(1);
    setKeyword(e.target.value);
  };

  const handleMarkTransaction = async (id, action, txHashInput) => {
    try {
      const payload = { id, action };
      if (action === "approve" && txHashInput) {
        payload.transactionHash = txHashInput;
      }
      await markTransactionAPI(payload);
      message.success(`Transaction ${action}ed successfully`);
      setApproveModal({ visible: false, record: null });
      setTransactionHash("");
      handleGetData({
        paramsQuery: {
          limit: limitPerRow,
          page: currentPage,
          keyword,
          type,
        },
      });
    } catch (error) {
      message.error("Failed to process transaction");
    }
  };

  const columns = [
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (text) => convertTimeCreateAt(text),
    },
    {
      title: type.includes("USDT") ? "Transfer USDT" : "Transfer AMC (AMC20)",
      render: (_, record) => (
        <div>
          <div>From: {record.fromAddress1}</div>
          <div>To: {record.toAddress1}</div>
          <div>
            Hash:{" "}
            <Button
              type="link"
              href={
                type.includes("USDT")
                  ? `https://bscscan.com/tx/${record.txHash1}`
                  : `https://explorer.amchain.net/transactions_detail/${record.txHash1}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </Button>
          </div>
          <div>
            Amount: {record.amount1} {record.token1}
          </div>
        </div>
      ),
    },
    ...(!type.includes("USDT")
      ? [
          {
            title: "Transfer AMC (BEP20)",
            render: (_, record) => {
              if (record.status !== "approved") return null;
              return (
                <div>
                  Hash:{" "}
                  <Button
                    type="link"
                    href={`https://bscscan.com/tx/${record.txHash2}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {record.txHash2}
                  </Button>
                </div>
              );
            },
          },
        ]
      : []),
    {
      title: type.includes("USDT") ? "Transfer AMC" : "Status",
      render: (_, record) => {
        if (type.includes("USDT")) {
          return (
            <div>
              <Tag color={record.status === "success" ? "green" : "red"}>
                {record.status === "success" ? "Success" : "Fail"}
              </Tag>
              <div>From: {record.fromAddress2}</div>
              <div>To: {record.toAddress2}</div>
              {record.status === "success" && (
                <div>
                  Hash:{" "}
                  <Button
                    type="link"
                    href={`https://explorer.amchain.net/transactions_detail/${record.txHash2}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </Button>
                </div>
              )}
              <div>
                Amount: {record.amount2} {record.token2}
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <Tag
                color={
                  record.status === "pending"
                    ? "orange"
                    : record.status === "approved"
                    ? "green"
                    : "red"
                }
              >
                {record.status === "pending"
                  ? "Pending"
                  : record.status === "approved"
                  ? "Approve"
                  : "Reject"}
              </Tag>
              {record.status === "pending" && (
                <div style={{ marginTop: "8px" }}>
                  <Button
                    onClick={() => setApproveModal({ visible: true, record })}
                    style={{ marginRight: "8px" }}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    onClick={() => handleMarkTransaction(record._id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          );
        }
      },
    },
  ];

  const handleGetListData = useCallback(
    ({ limit = LIMIT, page, keyword, type }) => {
      handleGetData({
        paramsQuery: { limit, page, keyword, type },
      });
    },
    []
  );

  useEffect(() => {
    if (!isSearchMode.current) {
      handleGetListData({
        page: currentPage,
        keyword: keyword,
        type: type,
      });
    }
  }, [currentPage, type]);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      handleGetListData({
        page: currentPage,
        keyword: keyword,
        type: type,
      });
      isSearchMode.current = false;
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [keyword]);

  return {
    type,
    keyword,
    totalItems,
    currentPage,
    data,
    loading,
    columns,
    limitPerRow,
    handleChangeType,
    handleChangeKeyword,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    approveModal,
    setApproveModal,
    transactionHash,
    setTransactionHash,
    handleMarkTransaction,
  };
};
