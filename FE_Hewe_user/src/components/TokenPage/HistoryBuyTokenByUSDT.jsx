import { DatePicker, Radio, Tag } from "antd";
import { useEffect, useState } from "react";
import { Table, IconToken } from "..";
import { useListTable, usePagination } from "../../hooks";
import { getBuyByUSDTHistoryAPI } from "../../services/swapService";
import "./HistoryBuyTokenByUSDT.scss";
import {
  formatHewe,
  convertTimeCreateAt,
  formatVND,
} from "../../util/adminBizpointUtils";

const LIMIT = 10;
const { RangePicker } = DatePicker;

export const HistoryBuyTokenByUSDT = ({ isReloadData, setIsReloadData }) => {
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
    service: getBuyByUSDTHistoryAPI,
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
      title: "Name package",
      dataIndex: "packageName",
    },
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
      title: "Amount HEWE bonus",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {formatVND(record.amountBonus, false)}
            <IconToken token="HEWE" />
          </div>
        );
      },
    },
    {
      title: "Amount USDT",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {formatHewe(record.amountUSDT)} <IconToken token="USDT" />
          </div>
        );
      },
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (value) => convertTimeCreateAt(value),
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
    <div className="HistoryBuyTokenByUSDT">
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
