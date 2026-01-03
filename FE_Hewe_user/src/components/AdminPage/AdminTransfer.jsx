import { Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ROW_PER_TABLE } from "../../constant/constant";
import { axiosService } from "../../util/service";

export default function AdminTransfer() {
  const [data, setData] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  async function getTransferHistory(limit, page) {
    try {
      const response = await axiosService.post("api/crypto/getHistoryTransferAdmin", {
        limit: limit.toString(),
        page: page.toString(),
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  }

  const onPaginationChange = (page) => {
    setCurrent(page);
    getTransferHistory(ROW_PER_TABLE, page);
  };

  const columns = [
    {
      title: "No.",
      key: "No.",
      width: 80,
      render: (t, r, i) => {
        return <span>{(current - 1) * 10 + i + 1}</span>;
      },
    },
    {
      title: "From",
      key: "From",
      width: 250,
      dataIndex: "email",
    },
    {
      title: "To",
      key: "To",
      width: 250,
      dataIndex: "emailTo",
    },
    {
      title: "Amount",
      key: "Amount",
      dataIndex: "amount",
      width: 100,
    },
    {
      title: "Receive",
      key: "Receive",
      dataIndex: "receive",
      width: 100,
    },
    {
      title: "Time",
      key: "Time",
      dataIndex: "created_at",
      width: 250,
    },
  ];

  useEffect(() => {
    setCurrent(1);
    getTransferHistory(ROW_PER_TABLE, 1);
  }, []);

  return (
    <div className="admin-transfer">
      <div className="title-area">
        <h2 className="title">Transfer</h2>

        <Pagination
          defaultCurrent={1}
          total={totalRecord}
          current={current}
          onChange={onPaginationChange}
          showSizeChanger={false}
          showQuickJumper={false}
          showLessItems={true}
          className="pagination-box"
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{
          x: 1000,
        }}
      />
    </div>
  );
}
