import { Table } from "antd";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { axiosService } from "../../../util/service";

// Lịch sử giao dịch của tất cả user F1 của user đó
// Chỉ xem không có các hành động chỉnh sửa // Không phân trang

export default function HistoryTableF1({ roundDisplay }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const renderer = ({ days, hours, completed }) => {
    if (completed) return <></>;
    else
      return (
        <p>
          {days} days {hours} hours
        </p>
      );
  };

  const renderStatus = (record) => {
    if (record?.status == "inprocess") {
      return <p style={{ fontSize: 16, fontWeight: 600, color: "orange" }}>Active</p>;
    } else if (record?.status == "completed") {
      return <p style={{ fontSize: 16, fontWeight: 600, color: "green" }}>Completed</p>;
    } else if (record?.status == "extend") {
      return <p style={{ fontSize: 16, fontWeight: 600, color: "green" }}>Extended</p>;
    } else return <></>;
  };

  const columns = [
    {
      title: "Transaction Summary",
      render: (_, record) => {
        let endTimeMs = new Date(record?.endTime).getTime();

        return (
          <div className="summaryWrap">
            {/* <div className="summaryItemTable">
              <span>Transaction ID</span>
              <p>{record?.transactionId.split("-")[4]}</p>
            </div> */}

            <div className="summaryItemTable">
              <span>Email</span>
              <p>{record?.userEmail}</p>
            </div>

            <div className="summaryItemTable">
              <span>Price HEWE</span>
              <p>{record?.priceHewe}</p>
            </div>

            <div className="summaryItemTable">
              <span>Amount HEWE</span>
              <p>{roundDisplay(record?.hewe)}</p>
            </div>

            <div className="summaryItemTable">
              <span>Price AMC</span>
              <p>{record?.priceAmc}</p>
            </div>

            <div className="summaryItemTable">
              <span>Amount AMC</span>
              <p>{roundDisplay(record?.amc)}</p>
            </div>

            <div className="summaryItemTable">
              <span>Received USDT</span>
              <p>{roundDisplay(record?.receivedUSDT)}</p>
            </div>

            <div className="summaryItemTable">
              <span>Status</span>
              <p>{renderStatus(record)}</p>
            </div>

            {record?.status == "inprocess" && (
              <div className="summaryItemTable">
                <span>Time left</span>
                <Countdown date={endTimeMs} renderer={renderer} />
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const getData = async () => {
    setLoading(true);
    try {
      let res = await axiosService.get(`/v2/getTransactionHeweDB_F1User`);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="HeweDBMainJ24-table">
      <h4>Your F1 users' transactions</h4>

      {!data.length ? (
        <p style={{ marginTop: 20, color: "grey" }}>No transactions found</p>
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record) => record._id}
          size="middle"
          loading={loading}
          pagination={false}
          showHeader={false}
        />
      )}
    </div>
  );
}
