import React, { useEffect, useState, useRef } from "react";
import { Table, Tag, Typography, Input } from "antd";
import dayjs from "dayjs";
import instance from "../../axios";
import { API_URL } from "../../constants/Statics";

const { Text } = Typography;

export default function GetListUpdateHeweDBPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const isSearchMode = useRef(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await instance.get(
        `${API_URL}/getListUpdateHeweDB?limit=1000&page=1&keyword=${keyword}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setData(res.data.data.array || []);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      fetchLogs();
      isSearchMode.current = false;
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [keyword]);

  const columns = [
    {
      title: "User",
      dataIndex: "userName",
      width: 200,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div style={{ fontSize: 12, color: "#888" }}>{record.email}</div>
        </div>
      ),
    },

    {
      title: "Balance",
      children: [
        {
          title: "Trước",
          dataIndex: "oldBalance",
          render: (v) => <Text>{v.toFixed(2)}</Text>,
        },
        {
          title: "Sau",
          dataIndex: "newBalance",
          render: (v) => <Text>{v.toFixed(2)}</Text>,
        },
        {
          title: "Chênh lệch",
          dataIndex: "diffBalance",
          render: (v) => <Tag color="blue">{v.toFixed(2)}</Tag>,
        },
      ],
    },
    {
      title: "Thời gian",
      children: [
        {
          title: "Old End",
          dataIndex: "oldEndTime",
          render: (v) => dayjs(v).format("DD/MM/YYYY"),
        },
        {
          title: "New End",
          dataIndex: "newEndTime",
          render: (v) => dayjs(v).format("DD/MM/YYYY"),
        },
        {
          title: "Cập nhật",
          dataIndex: "updatedAt",
          render: (v) => dayjs(v).format("HH:mm DD/MM/YYYY"),
        },
      ],
    },
    {
      title: "Years Added",
      dataIndex: "yearsAdded",
      align: "center",
      width: 120,
    },
  ];

  return (
    <div className="UserDetailPage">
      <div style={{ padding: 24, overflowX: "auto" }}>
        <h2 style={{ marginBottom: 16 }}>Lịch sử cập nhật HEWE DB</h2>
        <Input
          placeholder="Tìm kiếm theo email hoặc user"
          style={{ maxWidth: 350, marginBottom: 16 }}
          value={keyword}
          onChange={(e) => {
            isSearchMode.current = true;
            setKeyword(e.target.value);
          }}
        />
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          bordered
          pagination={false}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}
