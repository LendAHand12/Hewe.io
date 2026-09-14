import { useEffect, useState } from "react";
import { IconCopy, IconToken, Modal, Table } from "../../..";
import { useListTable, usePagination } from "../../../../hooks";
import { getHistoryWithdrawHeweDepositAPI } from "../../../../services/transferService";
import {
  convertTimeCreateAt,
  hanldeCopy,
  renderStatusWithdrawHEWE,
} from "../../../../util/adminBizpointUtils";

const LIMIT = 10;

export const HistoryWithdrawHeweDeposit = ({
  isReloadData,
  setIsReloadData,
}) => {
  const isMobileViewport = window.innerWidth < 768;
  const [currentStatus, setCurrentStatus] = useState("");
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
    service: getHistoryWithdrawHeweDepositAPI,
    defaultParamsPayload: {
      limit: limitPerRow,
      page: currentPage,
      status: currentStatus,
    },
    callbackSetTotalItem: handleSetTotalItems,
  });

  const handleGetHistoryWithdraw = ({ page, currentStatus }) => {
    handleGetData({
      paramsQuery: { page, status: currentStatus, limit: LIMIT },
    });
  };

  const columns = !isMobileViewport
    ? [
        {
          title: "Network",
          dataIndex: "method",
        },
        {
          title: "Amount HEWE",
          dataIndex: "amount",
          render: (value) => {
            return (
              <div className="center-flex-vertical">
                <div>{value}</div>
                <IconToken token="HEWE" />
              </div>
            );
          },
        },
        {
          title: "Address",
          dataIndex: "address",
          render: (value) => {
            return (
              <div className="center-flex-vertical">
                <div>{value}</div>
                <IconCopy onCopy={hanldeCopy(value)} />
              </div>
            );
          },
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (value, record) => {
            return renderStatusWithdrawHEWE(value, record);
          },
        },
        {
          title: "Transaction Hash",
          dataIndex: "transactionHash",
          render: (value) => {
            return (
              <div className="center-flex-vertical">
                <div>{value || "-"}</div>
                {value && <IconCopy onCopy={hanldeCopy(value)} />}
              </div>
            );
          },
        },
        {
          title: "Time",
          render: (_, record) => convertTimeCreateAt(record.createdAt),
        },
      ]
    : [
        {
          title: <div className="titleTableMobile">Withdrawal information</div>,
          render: (_, record) => {
            return (
              <div className="center-flex-horizontal py-2">
                <div className="center-flex-vertical rowTableMobile">
                  <div>Network</div>
                  <div>{record.method}</div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Amount HEWE</div>
                  <div>
                    <div className="center-flex-vertical">
                      <div>{record.amount}</div>
                      <IconToken token="HEWE" />
                    </div>
                  </div>
                </div>

                <div className="center-flex-vertical rowTableMobile">
                  <div>Address</div>
                  <div>
                    <div className="center-flex-vertical">
                      <div>{record.address}</div>
                      <IconCopy onCopy={hanldeCopy(record.address)} />
                    </div>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Hash</div>
                  <div>
                    <div className="center-flex-vertical">
                      <div>{record.transactionHash || "-"}</div>
                      {record.transactionHash && (
                        <IconCopy onCopy={hanldeCopy(record.address)} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Time</div>
                  <div>{convertTimeCreateAt(record.createdAt)}</div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Status</div>
                  <div>{renderStatusWithdrawHEWE(record.status, record)}</div>
                </div>
              </div>
            );
          },
        },
      ];

  useEffect(() => {
    if (!isReloadData) {
      handleGetHistoryWithdraw({ page: currentPage, currentStatus });
    }
  }, [currentPage, currentStatus]);

  useEffect(() => {
    if (isReloadData) {
      handleGetHistoryWithdraw({ page: currentPage, currentStatus });
      setIsReloadData(false);
    }
  }, [isReloadData]);

  return (
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
  );
};
