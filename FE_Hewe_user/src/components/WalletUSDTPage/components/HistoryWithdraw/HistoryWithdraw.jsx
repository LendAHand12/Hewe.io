import { useEffect, useMemo, useState } from "react";
import { IconCopy, IconUSDT, Modal, Table } from "../../..";
import { useListTable, usePagination } from "../../../../hooks";
import { getHistoryWithdrawUSDTAPI } from "../../../../services/transferService";
import {
  convertTimeCreateAt,
  hanldeCopy,
  renderStatusWithdrawUSDT,
} from "../../../../util/adminBizpointUtils";
import { Button, Descriptions } from "antd";
import { useModal } from "../../../../hooks";

const LIMIT = 10;

export const HistoryWithdraw = ({ isReloadData, setIsReloadData }) => {
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
  } = usePagination({ defaultPage: 1, limit: LIMIT });
  const { data, loading, handleGetData } = useListTable({
    service: getHistoryWithdrawUSDTAPI,
    defaultParamsPayload: {
      limit: limitPerRow,
      page: currentPage,
      status: currentStatus,
    },
    callbackSetTotalItem: handleSetTotalItems,
  });
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const [currentTransactionFocus, setCurrentTransactionFocus] = useState(null);

  const handleGetHistoryWithdraw = ({ page, currentStatus }) => {
    handleGetData({
      paramsQuery: { page, status: currentStatus, limit: LIMIT },
    });
  };

  const handleViewDetailHistory = (data) => () => {
    handleOpenModal();
    setCurrentTransactionFocus(data);
  };

  const handleCloseModalMiddleware = () => {
    handleCloseModal();
    setCurrentTransactionFocus(null);
  };

  const columns = !isMobileViewport
    ? [
        {
          title: "Network",
          dataIndex: "method",
        },
        {
          title: "Total USDT withdrawn",
          dataIndex: "amountWithdraw",
          render: (value, record) => {
            return (
              <div className="center-flex-vertical">
                <div>{value}</div>
                <IconUSDT />
              </div>
            );
          },
        },
        {
          title: "Fee",
          dataIndex: "amountFee",
          render: (value) => {
            return (
              <div className="center-flex-vertical">
                <div>{value}</div>
                <IconUSDT />
              </div>
            );
          },
        },
        {
          title: "Total USDT withdrawn received",
          dataIndex: "amountWithdraw",
          render: (value, record) => {
            return (
              <div className="center-flex-vertical">
                <div>{record.amountWithdraw - record.amountFee}</div>
                <IconUSDT />
              </div>
            );
          },
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (value) => {
            return renderStatusWithdrawUSDT(value);
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
          title: "TxID",
          render: (_, record) => {
            if (record.status === "APPROVED")
              return (
                <div className="center-flex-vertical">
                  <div>{record.note}</div>
                  <IconCopy onCopy={hanldeCopy(record.note)} />
                </div>
              );
          },
        },
        {
          title: "Time",
          render: (_, record) => convertTimeCreateAt(record.createdAt),
        },
        // {
        //   render: (_, record) => {
        //     return (
        //       <Button onClick={handleViewDetailHistory(record)}>Detail</Button>
        //     );
        //   },
        // },
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
                  <div>Total USDT withdrawn</div>
                  <div>
                    <div className="center-flex-vertical">
                      <div>{record.amountWithdraw}</div>
                      <IconUSDT />
                    </div>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Fee</div>
                  <div>
                    <div className="center-flex-vertical">
                      <div>{record.amountFee}</div>
                      <IconUSDT />
                    </div>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Total USDT withdrawn received</div>
                  <div>
                    <div className="center-flex-vertical">
                      <div>{record.amountWithdraw - record.amountFee}</div>
                      <IconUSDT />
                    </div>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Status</div>
                  <div>{renderStatusWithdrawUSDT(record.status)}</div>
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
                  <div>TxID</div>
                  <div>
                    <div className="center-flex-vertical">
                      <div>{record.note}</div>
                      <IconCopy onCopy={hanldeCopy(record.note)} />
                    </div>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Time</div>
                  <div>{convertTimeCreateAt(record.createdAt)}</div>
                </div>
              </div>
            );
          },
        },
      ];

  const descriptionWithdrawInfo = useMemo(() => {
    return [
      {
        key: "0",
        label: `Trạng thái`,
        children: (
          <div>
            <span>
              {renderStatusWithdrawUSDT(currentTransactionFocus?.status)}
            </span>
          </div>
        ),
      },
      {
        key: "1",
        label: `Tổng USDT rút`,
        children: (
          <div className="center-flex-vertical">
            <span>{currentTransactionFocus?.amountWithdraw}</span>
            <IconUSDT />
          </div>
        ),
      },
      {
        key: "3",
        label: `Phí`,
        children: (
          <div className="center-flex-vertical">
            <span>{currentTransactionFocus?.amountFee}</span>
            <IconUSDT />
          </div>
        ),
      },
      {
        key: "realAmount",
        label: `Tổng USDT rút nhận được`,
        children: (
          <div className="center-flex-vertical">
            <span>
              {currentTransactionFocus?.amountWithdraw -
                currentTransactionFocus?.amountFee}
            </span>
            <IconUSDT />
          </div>
        ),
      },
      {
        key: "4",
        label: `Mạng`,
        children: (
          <div>
            <span>{currentTransactionFocus?.method}</span>
          </div>
        ),
      },
      {
        key: "5",
        label: `Địa chỉ ví`,
        children: (
          <div className="center-flex-vertical">
            <div>{currentTransactionFocus?.address}</div>
            <IconCopy onCopy={hanldeCopy(currentTransactionFocus?.address)} />
          </div>
        ),
      },
      {
        key: "reason",
        label: `Lý do`,
        children: (
          <div>
            <span>{currentTransactionFocus?.note || "-"}</span>
          </div>
        ),
      },
    ];
  }, [isOpen]);

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
    <>
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

      <Modal
        isOpen={isOpen}
        onCancel={handleCloseModalMiddleware}
        isShowFooter={false}
        title="Chi tiết lịch sử rút"
        width={700}
      >
        <div style={{ marginTop: "8px" }}>
          <Descriptions
            items={descriptionWithdrawInfo}
            size="small"
            bordered
            column={1}
          />
        </div>
      </Modal>
    </>
  );
};
