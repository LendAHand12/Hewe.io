import { useEffect } from "react";
import { Table } from "../../..";
import { useListTable } from "../../../../hooks/useListTable";
import { usePagination } from "../../../../hooks/usePagination";
import { getHistoryDepositHEWEAPI } from "../../../../services/transferService";
import { Tag } from "antd";
import { convertTimeCreateAt } from "../../../../util/adminBizpointUtils";

const LIMIT = 10;

export const HistoryDepositHEWE = () => {
  const isMobileViewport = window.innerWidth < 768;
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
    service: getHistoryDepositHEWEAPI,
    defaultParamsPayload: {
      limit: limitPerRow,
      page: currentPage,
    },
    callbackSetTotalItem: handleSetTotalItems,
  });

  const handleGetHistoryDeposit = ({ page }) => {
    handleGetData({
      paramsQuery: { page, limit: LIMIT },
    });
  };

  const columns = !isMobileViewport
    ? [
        {
          title: "Total HEWE deposited",
          dataIndex: "amount",
          render: (value) => {
            return (
              <div className="center-flex-vertical">
                <span>{value}</span> HEWE
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
                  <div>Total HEWE deposited</div>
                  <div>
                    <div className="center-flex-vertical">
                      <span>{record.amount}</span> HEWE
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

  useEffect(() => {
    handleGetHistoryDeposit({ page: currentPage });
  }, [currentPage]);

  return (
    <>
      <Table
        className="tablebg customTableAntd"
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
    </>
  );
};
