import { Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import instance from "../../axios";

const ROWS = 10;

export default function F1Data({ userId, userEmail }) {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const getData = async (limit, page) => {
    setLoading(true);
    try {
      const res = await instance.get(`/getHeweDBData_F1User?userId=${userId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setListData(res.data.data);
      // setTotal(res.data.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
      title: "User",
      render: (_, record) => {
        return (
          <div>
            <p>{record.userEmail}</p>
            <p>{record.userName}</p>
          </div>
        );
      },
    },
    {
      title: "HEWE",
      render: (_, record) => {
        return (
          <div>
            <p>HEWE: {roundDisplay(record.hewe)}</p>
            <p>Price: {record.priceHewe}</p>
            <p>USDT: {roundDisplay(record.usdthewe)}</p>
          </div>
        );
      },
    },
    {
      title: "AMC",
      render: (_, record) => {
        return (
          <div>
            <p>AMC: {roundDisplay(record.amc)}</p>
            <p>Price: {record.priceAmc}</p>
            <p>USDT: {roundDisplay(record.usdtamc)}</p>
          </div>
        );
      },
    },
    {
      title: "USDT",
      render: (_, record) => {
        return (
          <div>
            <p>Total: {roundDisplay(record.usdtamc + record.usdthewe)}</p>
            <p>Percent: {record.percent}%</p>
            <p>Received: {roundDisplay(record.receivedUSDT)}</p>
          </div>
        );
      },
    },
    {
      title: "Time",
      render: (_, record) => {
        return (
          <div>
            <p>Start: {dayjs(record.createdAt).format("DD/MM/YYYY")}</p>
            <p>End: {dayjs(record.endTime).format("DD/MM/YYYY")}</p>
            <p>Time left: {dayjs(record.endTime).diff(dayjs(), "days")} days</p>
          </div>
        );
      },
    },
    {
      title: "Status",
      render: (_, record) => {
        if (record.status === "inprocess")
          return <p style={{ color: "orange", fontWeight: "bold" }}>Active</p>;
        else if (record.status === "completed")
          return (
            <p style={{ color: "green", fontWeight: "bold" }}>Completed</p>
          );
      },
    },
  ];

  useEffect(() => {
    setPage(1);
    getData(ROWS, 1);
  }, []);

  return (
    <div>
      <h4>HEWE DB Transaction - User F1</h4>

      <div style={{ marginTop: 25 }}></div>

      <Table
        dataSource={listData}
        columns={columns}
        rowKey={(record) => record._id}
        size="middle"
        scroll={{ x: 900 }}
        loading={loading}
        // pagination={{
        //   position: ["topRight"],
        //   size: "default",
        //   total,
        //   current: page,
        //   onChange: (page) => {
        //     setPage(page);
        //     getData(ROWS, page);
        //   },
        //   showSizeChanger: false,
        //   showQuickJumper: false,
        //   pageSize: ROWS,
        // }}
        pagination={false}
      />
    </div>
  );
}
