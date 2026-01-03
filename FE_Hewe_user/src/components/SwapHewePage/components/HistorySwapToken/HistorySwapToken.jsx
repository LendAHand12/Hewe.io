import { DatePicker, Radio, Tag } from "antd";
import { useEffect, useState } from "react";
import { Table, IconToken } from "../../..";
import { useListTable, usePagination } from "../../../../hooks";
import { getSwapHistoryAPI } from "../../../../services/swapService";
import "./HistorySwapToken.scss";
import {
  formatHewe,
  convertTimeCreateAt,
} from "../../../../util/adminBizpointUtils";

const LIMIT = 10;
const { RangePicker } = DatePicker;

const TOKENS = [
  { value: "", label: "Tất cả" },
  {
    value: "bizpoint",
    label: (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <img className="iconToken" />
        <div>BIZPOINT</div>
      </div>
    ),
  },
  {
    value: "usp",
    label: (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <img className="iconToken" />
        <div>USP</div>
      </div>
    ),
  },
  {
    value: "bcf",
    label: (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <img className="iconToken" />
        <div>BCF</div>
      </div>
    ),
  },
];

export const HistorySwapToken = ({ isReloadData, setIsReloadData }) => {
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
  } = usePagination({
    defaultPage: 1,
    limit: LIMIT,
  });
  const { data, loading, handleGetData } = useListTable({
    service: getSwapHistoryAPI,
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

  const handleChangeDate = (dates) => {
    if (!dates) {
      handleSetCurrentPage(1);
      setDate({ timeStart: 1, timeEnd: 9999999999999 });
      return;
    }

    handleSetCurrentPage(1);
    setDate({
      timeStart: dates[0].startOf("d").valueOf(),
      timeEnd: dates[1].endOf("d").valueOf(),
    });
  };

  const handleChangeFromToken = (e, confirm) => {
    confirm();
    handleSetCurrentPage(1);
    setTokens({ ...tokens, from: e.target.value });
  };

  const handleChangeToToken = (e, confirm) => {
    confirm();
    handleSetCurrentPage(1);
    setTokens({ ...tokens, to: e.target.value });
  };

  const handleSelectFromToken = (value) => {
    handleSetCurrentPage(1);
    setTokens({ ...tokens, from: value });
  };

  const handleSelectToToken = (value) => {
    handleSetCurrentPage(1);
    setTokens({ ...tokens, to: value });
  };

  const typeOptions = TOKENS.map((type) => {
    return (
      <Radio value={type.value} key={type.label}>
        {type.label}
      </Radio>
    );
  });

  const columns = !isMobileViewport
    ? [
        {
          title: (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Swap USDT
            </div>
          ),
          dataIndex: "fromToken",
          render: (value, record) => {
            return (
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <span>{formatHewe(record.amountFrom)} </span>
                  <IconToken token="USDT" style={{ lineHeight: 1 }} />
                </div>
              </div>
            );
          },
        },
        {
          title: (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              To HEWE
            </div>
          ),
          dataIndex: "toToken",
          render: (value, record) => {
            return (
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <span>{formatHewe(record.amountTo)} </span>
                  <IconToken token="HEWE" style={{ lineHeight: 1 }} />
                </div>
              </div>
            );
          },
        },
        {
          title: "Time",
          dataIndex: "createdAt",
          render: (value) => convertTimeCreateAt(value),
        },
        {
          title: "Status",
          render: () => <Tag color="success">Success</Tag>,
        },
      ]
    : [
        {
          title: <div className="titleTableMobile">Swap information</div>,
          render: (_, record) => {
            return (
              <div className="center-flex-horizontal py-2">
                <div className="center-flex-vertical rowTableMobile">
                  <div>Swap</div>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <span>{record.amountFrom}</span>
                    <IconToken token="USDT" />
                    <span>{record.fromToken.toUpperCase()}</span>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>To</div>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <span>{record.amountTo}</span>
                    <span>{record.toToken.toUpperCase()}</span>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Time</div>
                  <div>{convertTimeCreateAt(record.createdAt)}</div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Status</div>
                  <div>
                    <Tag color="success" style={{ marginRight: "0" }}>
                      Success
                    </Tag>
                  </div>
                </div>
              </div>
            );
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
    <div className="historySwapTokenContainer">
      <div className="header">
        <div className="titleContainer">
          <div className="title">History swap HEWE</div>
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
