import { DatePicker, Radio, Tag } from "antd";
import { useEffect, useState } from "react";
import { Table, IconToken } from "..";
import { useListTable, usePagination } from "../../hooks";
import { getBuyByVNDHistoryAPI } from "../../services/swapService";
import "./HistoryBuyToken.scss";
import {
  formatHewe,
  convertTimeCreateAt,
  formatVND,
} from "../../util/adminBizpointUtils";

const LIMIT = 10;
const { RangePicker } = DatePicker;

export const HistoryBuyToken = ({ isReloadData, setIsReloadData }) => {
  const isMobileViewport = window.innerWidth < 768;
  const [tokens, setTokens] = useState({ from: "", to: "" });
  const [date, setDate] = useState({ timeStart: 1, timeEnd: 9999999999999 });
  const {
    x,
    y,
    currentPage,
    totalItems,
    limitPerRow,
    handleSetCurrentPage,
    handleSetTotalItems,
  } = usePagination({ defaultPage: 1, limit: LIMIT });
  const { data, loading, handleGetData } = useListTable({
    service: getBuyByVNDHistoryAPI,
    defaultParamsPayload: {
      limit: limitPerRow,
      page: currentPage,
      from: tokens.from,
      to: tokens.to,
      timeStart: date.timeStart,
      timeEnd: date.timeEnd,
    },
    callbackSetTotalItem: handleSetTotalItems,
  });

  const handleGetHistoryWithdraw = ({ page, from, to, timeStart, timeEnd }) => {
    handleGetData({
      paramsQuery: { page, from, to, timeStart, timeEnd, limit: LIMIT },
    });
  };

  const columns = [
    {
      title: "Amount HEWE",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {formatVND(record.amountHewe, false)}
            <IconToken token="HEWE" />
          </div>
        );
      },
    },
    {
      title: "Amount VND",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {formatVND(record.amountVnd, false)} VND
          </div>
        );
      },
    },
    {
      title: "Bank",
      render: (_, record) => {
        const bankObj = JSON.parse(record.bankData);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div>{bankObj.bankName}</div>
            <div>{bankObj.bankAccountNumber}</div>
            <div>{bankObj.bankAccountOwner}</div>
          </div>
        );
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (value) => convertTimeCreateAt(value),
    },
    {
      title: "Status",
      render: (_, record) => {
        switch (record.status) {
          case "pending":
            return <Tag>Pending</Tag>;

          case "userConfirmed":
            return <Tag color="blue">Confirmed</Tag>;

          case "userCanceled":
            return <Tag color="red">Canceled</Tag>;

          case "adminConfirmed":
            return <Tag color="success">Admin confirmed</Tag>;

          case "adminRejected":
            return <Tag color="red">Admin rejected</Tag>;

          default:
            return null;
        }
      },
    },
  ];

  useEffect(() => {
    if (!isReloadData) {
      handleGetHistoryWithdraw({
        page: currentPage,
        from: tokens.from,
        to: tokens.to,
        timeStart: date.timeStart,
        timeEnd: date.timeEnd,
      });
    }
  }, [currentPage, tokens.from, tokens.to, date.timeEnd, date.timeStart]);

  useEffect(() => {
    if (isReloadData) {
      handleGetHistoryWithdraw({
        page: currentPage,
        from: tokens.from,
        to: tokens.to,
        timeStart: date.timeStart,
        timeEnd: date.timeEnd,
      });
      setIsReloadData(false);
    }
  }, [isReloadData]);

  return (
    <div className="historyBuyTokenContainer">
      <div className="header">
        <div className="titleContainer">
          <div className="title">History buy HEWE</div>
        </div>

        {/* <div>
          <RangePicker onChange={handleChangeDate} />
        </div> */}
      </div>

      <Table
        rowKey={(row) => row.id}
        columns={columns}
        x={x}
        y={y}
        totalItems={totalItems}
        data={data}
        currentPage={currentPage}
        isLoading={loading}
        onChangePage={handleSetCurrentPage}
        limit={limitPerRow}
        paginationPosition="bottomRight"
        scrollX={isMobileViewport ? 100 : 800}
      />
    </div>
  );
};
