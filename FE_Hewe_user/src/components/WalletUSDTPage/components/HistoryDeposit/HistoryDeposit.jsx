import { useEffect, useMemo, useState } from "react";
import { IconCopy, IconUSDT, Modal, Table } from "../../..";
import { useListTable } from "../../../../hooks/useListTable";
import { usePagination } from "../../../../hooks/usePagination";
import { getHistoryDepositUSDTAPI } from "../../../../services/transferService";
import { Descriptions, Tag } from "antd";
import {
  hanldeCopy,
  renderStatusWithdrawUSDT,
  convertTimeCreateAt,
} from "../../../../util/adminBizpointUtils";
import { useModal } from "../../../../hooks/useModal";

const LIMIT = 10;

export const HistoryDeposit = () => {
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
    service: getHistoryDepositUSDTAPI,
    defaultParamsPayload: {
      limit: limitPerRow,
      page: currentPage,
      status: currentStatus,
    },
    callbackSetTotalItem: handleSetTotalItems,
  });
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const [currentTransactionFocus, setCurrentTransactionFocus] = useState(null);

  const handleGetHistoryDeposit = ({ page, currentStatus }) => {
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
          dataIndex: "coinKey",
        },
        {
          title: "Total USDT deposited",
          dataIndex: "amount",
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
          title: "Status",
          dataIndex: "status",
          render: () => {
            return <Tag color="success">Success</Tag>;
          },
        },
        {
          title: "Time",
          dataIndex: "createdAt",
          render: (value) => {
            return convertTimeCreateAt(value);
          },
        },
      ]
    : [
        {
          title: <div className="titleTableMobile">Deposit information</div>,
          render: (_, record) => {
            return (
              <div className="center-flex-horizontal py-2">
                <div className="center-flex-vertical rowTableMobile">
                  <div>Network</div>
                  <div>{record.coinKey}</div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Total USDT deposited</div>
                  <div>
                    <div className="center-flex-vertical">
                      <div>{record.amount}</div>
                      <IconUSDT />
                    </div>
                  </div>
                </div>
                <div className="center-flex-vertical rowTableMobile">
                  <div>Status</div>
                  <div>
                    <Tag color="success">Success</Tag>
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
    handleGetHistoryDeposit({ page: currentPage, currentStatus });
  }, [currentPage, currentStatus]);

  return (
    <>
      <Table
        className="tablebg"
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
        title="Chi tiết lịch sử nạp"
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
