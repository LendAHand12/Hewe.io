import { Tag } from "antd";
import { useEffect } from "react";
import { Button, Table } from "../../..";
import { useListTable, usePagination } from "../../../../hooks";
import { getMyTicketsAPI } from "../../../../services/ticketService";
import { convertTimeCreateAt } from "../../../../util/adminBizpointUtils";

const LIMIT = 10;

export const TicketList = ({ isReloadData, setIsReloadData, onSelectTicket, onClickCreate }) => {
  const {
    currentPage,
    totalItems,
    limitPerRow,
    handleSetCurrentPage,
    handleSetTotalItems,
  } = usePagination({ defaultPage: 1, limit: LIMIT });
  const { data, loading, handleGetData } = useListTable({
    service: getMyTicketsAPI,
    defaultParamsPayload: { limit: LIMIT, page: 1 },
    callbackSetTotalItem: handleSetTotalItems,
  });

  const handleGetTickets = ({ page }) => {
    handleGetData({ paramsQuery: { page, limit: LIMIT } });
  };

  useEffect(() => {
    if (!isReloadData) {
      handleGetTickets({ page: currentPage });
    }
  }, [currentPage]);

  useEffect(() => {
    if (isReloadData) {
      handleGetTickets({ page: currentPage });
      setIsReloadData(false);
    }
  }, [isReloadData]);

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) =>
        value === "open" ? (
          <Tag color="blue">Open</Tag>
        ) : (
          <Tag color="default">Closed</Tag>
        ),
    },
    {
      title: "Last activity",
      render: (_, record) => convertTimeCreateAt(record.lastMessageAt),
    },
    {
      title: "",
      render: (_, record) => (
        <Button className="prcolor" onClick={() => onSelectTicket(record._id)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: 600 }}>My Tickets</div>
        <Button className="prcolor" onClick={onClickCreate} style={{width: 'fit-content', padding: '0 24px'}}>
          + Create Ticket
        </Button>
      </div>

      <Table
        rowKey={(row) => row._id}
        columns={columns}
        totalItems={totalItems}
        data={data}
        currentPage={currentPage}
        isLoading={loading}
        onChangePage={handleSetCurrentPage}
        limit={limitPerRow}
        paginationPosition="bottomRight"
        scrollX={600}
      />
    </div>
  );
};
