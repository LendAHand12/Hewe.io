import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { axiosService } from "../../../util/service";

const ROWS = 10;

export default function HistoryV2({ type }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);

  const round = (value) =>
    Number(value)
      .toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .replaceAll(",", "");

  const columns = [
    {
      title: "Token",
      render: (_, record) => record?.tokenBuy,
      width: 100,
    },
    {
      title: "Amount USDT",
      render: (_, record) => round(record?.amountUSDT),
      width: 150,
    },
    {
      title: "Amount Token",
      render: (_, record) => {
        if (record?.tokenBuy === "AMC") return round(record?.amountAmc) + " AMC";
        else if (record?.tokenBuy === "HEWE") return round(record?.amountHewe) + " HEWE";
        else return "";
      },
      width: 200,
    },
    {
      title: "Bonus",
      render: (_, record) => {
        if (!record?.amountBonus) return <></>;
        else return round(record?.amountBonus) + " " + record?.tokenBonus;
      },
      width: 200,
    },
    {
      title: "Status",
      render: (_, record) => (
        <Tag color="green">
          <span style={{ fontWeight: 600 }}>Success</span>
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Time",
      render: (_, record) => new Date(record.createdAt).toLocaleString(),
      width: 150,
    },
  ];

  const columnsTypeConnectWallet = [
    {
      title: "Token",
      render: (_, record) => record?.tokenBuy?.toUpperCase(),
      width: 100,
    },
    {
      title: "Amount USDT",
      render: (_, record) => round(record?.amountUSDT),
      width: 150,
    },
    {
      title: "Status",
      render: (_, record) => (
        <Tag color="green">
          <span style={{ fontWeight: 600 }}>Success</span>
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Transaction Hash",
      render: (_, record) => record?.transactionHash,
      width: 200,
    },
    {
      title: "Time",
      render: (_, record) => new Date(record.createdAt).toLocaleString(),
      width: 150,
    },
  ];

  const getData = async (limit, page) => {
    setLoading(true);
    try {
      let res = await axiosService.get(`/v2/buyTokenV2History?limit=${limit}&page=${page}&type=${type}`);
      setData(res.data.data.array);
      setTotal(res.data.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrent(1);
    getData(ROWS, 1);
  }, []);

  return (
    <div className="HistoryBuyTokenV2J24">
      <h4>Transaction History</h4>

      <Table
        dataSource={data}
        columns={type === "connectWallet" ? columnsTypeConnectWallet : columns}
        rowKey={(record) => record._id}
        size="middle"
        scroll={{ x: 900 }}
        loading={loading}
        pagination={{
          position: ["topRight"],
          size: "default",
          total,
          current,
          onChange: (page) => {
            setCurrent(page);
            getData(ROWS, page);
          },
          showSizeChanger: false,
          showQuickJumper: false,
          pageSize: ROWS,
        }}
      />
    </div>
  );
}
