import React, { useEffect, useState } from "react";
import instance from "../../axios";
import { Table } from "antd";
import dayjs from "dayjs";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";

const ROWS = 10;

export default function F1List({ listDataF1 }) {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const history = useHistory();

  const roundDisplay = (value) => {
    if (Number.isInteger(value)) {
      return Number(value).toLocaleString("en-US").replaceAll(",", " ");
    } else
      return Number(value)
        .toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
        .replaceAll(",", " ");
  };

  const columns = [
    {
      title: "Username",
      render: (_, record) => record.name,
    },
    {
      title: "Email",
      render: (_, record) => (
        <u
          onClick={() => {
            history.push("/adminPanel/user-management/" + record._id);
            window.location.reload();
          }}
          style={{ cursor: "pointer" }}
        >
          {record.email}
        </u>
      ),
    },
    {
      title: "USDT",
      render: (_, record) => roundDisplay(record.usdtBalance),
    },
    {
      title: "HEWE",
      render: (_, record) => roundDisplay(record.heweBalance),
    },
    {
      title: "HEWE Deposit",
      render: (_, record) => roundDisplay(record.heweDeposit),
    },
    {
      title: "AMC",
      render: (_, record) => roundDisplay(record.amcBalance),
    },
    {
      title: "Revenue (USDT)",
      render: (_, record) => roundDisplay(record.revenue),
    },
    {
      title: "Revenue F1 (USDT)",
      render: (_, record) => roundDisplay(record.revenueF1),
    },
  ];

  return (
    <>
      <h4>List F1</h4>

      <Table
        dataSource={listDataF1}
        columns={columns}
        rowKey={(record) => record._id}
        size="middle"
        scroll={{ x: 900 }}
        loading={loading}
        pagination={false}
      />
    </>
  );
}
