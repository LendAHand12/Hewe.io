import { useFadedIn } from "../../../../../hooks/useFadedIn";
import { Table } from "../../../../Table/Table";
import { useGetListOrderTransaction } from "./hooks/useGetListOrderTransactions";
import "./OrderTransactions.scss";

export const OrderTransactions = () => {
  const { data } = useGetListOrderTransaction();
  const { domRef } = useFadedIn();

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) => new Date(value).toLocaleString("vi-VN"),
    },
    {
      title: "Side",
      dataIndex: "type",
      render: (value) => {
        return <div style={{ color: value === "buy" ? "#00B746" : "#EF403C" }}>{value === "buy" ? "Buy" : "Sell"}</div>;
      },
    },
    {
      title: "Price",
      render: (_, record) => {
        return `$${record.price.toFixed(8)}`;
      },
    },
    {
      title: "Amount USDT",
      dataIndex: "amountUsdt",
      render: (value) => value.toFixed(4),
    },
    {
      title: "Amount HEWE",
      dataIndex: "amountHewe",
      render: (value) => value.toFixed(4),
    },
    {
      title: "Other",
      dataIndex: "transactionHash",
      render: (value, record) => {
        const linkNavigate =
          record.type === "buy"
            ? `https://bscscan.com/tx/${value}`
            : `https://explorer.amchain.net/transactions_detail/${value}`;
        return (
          <a href={linkNavigate} target="_blank" rel="noopener noreferrer">
            <div style={{ color: "green", textDecoration: "underline" }}>TxID</div>
          </a>
        );
      },
    },
  ];

  return (
    <div className="OrderTransactions" ref={domRef}>
      <Table
        rowKey={(row) => row.id}
        columns={columns}
        data={data}
        paginationPosition="bottomRight"
        isShowPagination={false}
      />
    </div>
  );
};
