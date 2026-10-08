import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import instance from "../../axios";

const { Text } = Typography;
const { TextArea } = Input;

const ROWS = 10;

const STATUS_TAG = {
  pending: { color: "orange", label: "Chờ duyệt" },
  approved: { color: "blue", label: "Đã duyệt - chờ trả lãi" },
  completed: { color: "green", label: "Hoàn thành" },
  rejected: { color: "red", label: "Từ chối" },
};

const roundDisplay = (value) =>
  Number(value || 0)
    .toLocaleString("en-US", { maximumFractionDigits: 2 })
    .replaceAll(",", " ");

export default function StopRequestsHeweDBPage() {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const isSearchMode = useRef(false);

  // modal: { type: "approve" | "reject" | "complete", record }
  const [modal, setModal] = useState(null);
  const [interest, setInterest] = useState(0);
  const [text, setText] = useState(""); // ghi chú (approve) / lý do (reject) / ghi chú (complete)
  const [hash, setHash] = useState("");

  const headers = { Authorization: localStorage.getItem("token") };

  const getData = async (limit, page, statusValue = status) => {
    setLoading(true);
    try {
      const res = await instance.get(
        `/getStopRequestsHeweDB?limit=${limit}&page=${page}&keyword=${keyword}&status=${statusValue}`,
        { headers }
      );
      setListData(res.data.data.array);
      setTotal(res.data.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(ROWS, 1);
  }, []);

  useEffect(() => {
    if (!isSearchMode.current) return;
    const timeout = setTimeout(() => {
      setPage(1);
      getData(ROWS, 1);
      isSearchMode.current = false;
    }, 500);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const openModal = (type, record) => {
    setModal({ type, record });
    setInterest(record.interestUSDT || 0);
    setText(type === "complete" ? record.adminNote || "" : "");
    setHash("");
  };

  const closeModal = () => setModal(null);

  const submit = async () => {
    if (!modal) return;
    const { type, record } = modal;

    let url = "";
    let body = { requestId: record._id };
    if (type === "approve") {
      if (interest === null || interest === undefined || interest < 0) {
        message.error("Vui lòng nhập số lãi hợp lệ");
        return;
      }
      url = "/approveStopRequestHeweDB";
      body = { ...body, interestUSDT: interest, adminNote: text };
    } else if (type === "reject") {
      if (!text.trim()) {
        message.error("Vui lòng nhập lý do từ chối");
        return;
      }
      url = "/rejectStopRequestHeweDB";
      body = { ...body, reason: text };
    } else {
      url = "/completeStopRequestHeweDB";
      body = { ...body, transactionHash: hash, adminNote: text };
    }

    setSubmitting(true);
    try {
      const res = await instance.post(url, body, { headers });
      message.success(res.data.message);
      closeModal();
      getData(ROWS, page);
    } catch (error) {
      console.log(error);
      message.error(error?.response?.data?.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "User",
      render: (_, r) => (
        <div>
          <Text strong>{r.userName}</Text>
          <div style={{ fontSize: 12, color: "#888" }}>{r.userEmail}</div>
        </div>
      ),
    },
    {
      title: "Giao dịch HEWE DB",
      render: (_, r) => (
        <div>
          <p>HEWE: {roundDisplay(r.hewe)}</p>
          <p>AMC: {roundDisplay(r.amc)}</p>
          <p>
            Đã nhận: {roundDisplay(r.receivedUSDT)} USDT ({r.percent}%)
          </p>
          <p style={{ fontSize: 12, color: "#888" }}>
            {dayjs(r.startTime).format("DD/MM/YYYY")} →{" "}
            {dayjs(r.endTime).format("DD/MM/YYYY")}
          </p>
        </div>
      ),
    },
    {
      title: "Lý do của user",
      dataIndex: "reason",
      width: 200,
      render: (v) => v || <span style={{ color: "#aaa" }}>-</span>,
    },
    {
      title: "Lãi trả riêng (USDT)",
      render: (_, r) =>
        r.status === "approved" || r.status === "completed" ? (
          <Text strong>{roundDisplay(r.interestUSDT)}</Text>
        ) : (
          <span style={{ color: "#aaa" }}>-</span>
        ),
    },
    {
      title: "Trạng thái",
      render: (_, r) => {
        const s = STATUS_TAG[r.status] || {};
        return (
          <div>
            <Tag color={s.color}>{s.label}</Tag>
            {r.status === "rejected" && r.rejectReason && (
              <div style={{ fontSize: 12, color: "#888" }}>
                Lý do: {r.rejectReason}
              </div>
            )}
            {r.adminNote && (
              <div style={{ fontSize: 12, color: "#888" }}>
                Ghi chú: {r.adminNote}
              </div>
            )}
            {r.transactionHash && (
              <div style={{ fontSize: 12, color: "#888" }}>
                Mã chuyển: {r.transactionHash}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Gửi lúc",
      render: (_, r) => dayjs(r.createdAt).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "",
      render: (_, r) => {
        if (r.status === "pending")
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Button type="primary" onClick={() => openModal("approve", r)}>
                Duyệt
              </Button>
              <Button danger onClick={() => openModal("reject", r)}>
                Từ chối
              </Button>
            </div>
          );
        if (r.status === "approved")
          return (
            <Button type="primary" onClick={() => openModal("complete", r)}>
              Hoàn thành yêu cầu
            </Button>
          );
        return null;
      },
    },
  ];

  const modalTitle = {
    approve: "Duyệt yêu cầu ngưng HEWE DB",
    reject: "Từ chối yêu cầu",
    complete: "Hoàn thành yêu cầu",
  };

  return (
    <div className="UserDetailPage">
      <div style={{ padding: 24, overflowX: "auto" }}>
        <h2 style={{ marginBottom: 16 }}>Yêu cầu ngưng HEWE DB sớm</h2>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Input
            placeholder="Tìm theo email hoặc user"
            style={{ maxWidth: 350 }}
            value={keyword}
            onChange={(e) => {
              isSearchMode.current = true;
              setKeyword(e.target.value);
            }}
          />
          <Select
            value={status}
            style={{ width: 200 }}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
              getData(ROWS, 1, value);
            }}
            options={[
              { value: "", label: "Tất cả trạng thái" },
              { value: "pending", label: "Chờ duyệt" },
              { value: "approved", label: "Đã duyệt - chờ trả lãi" },
              { value: "completed", label: "Hoàn thành" },
              { value: "rejected", label: "Từ chối" },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={listData}
          rowKey="_id"
          loading={loading}
          bordered
          scroll={{ x: 900 }}
          pagination={{
            position: ["topRight"],
            total,
            current: page,
            pageSize: ROWS,
            showSizeChanger: false,
            onChange: (p) => {
              setPage(p);
              getData(ROWS, p);
            },
          }}
        />
      </div>

      <Modal
        open={!!modal}
        title={modal ? modalTitle[modal.type] : ""}
        onCancel={closeModal}
        onOk={submit}
        confirmLoading={submitting}
        okText={
          modal?.type === "approve"
            ? "Duyệt"
            : modal?.type === "reject"
            ? "Từ chối"
            : "Xác nhận đã trả xong"
        }
        okButtonProps={{ danger: modal?.type === "reject" }}
        cancelText="Đóng"
        destroyOnClose
        maskClosable={false}
      >
        {modal && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <Text strong>{modal.record.userName}</Text>{" "}
              <Text type="secondary">({modal.record.userEmail})</Text>
              <div>
                HEWE {roundDisplay(modal.record.hewe)} · AMC{" "}
                {roundDisplay(modal.record.amc)} · Đã nhận{" "}
                {roundDisplay(modal.record.receivedUSDT)} USDT
              </div>
            </div>

            {modal.type === "approve" && (
              <>
                <div>
                  <p>Số lãi trả riêng cho user (USDT)</p>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    value={interest}
                    onChange={(v) => setInterest(v)}
                    controls={false}
                  />
                </div>
                <Text type="secondary">
                  Duyệt xong giao dịch HEWE DB sẽ chuyển sang trạng thái
                  "Stopped". Hệ thống không thay đổi số dư HEWE/AMC/USDT của
                  user; lãi do admin tự chuyển.
                </Text>
                <div>
                  <p>Ghi chú (không bắt buộc)</p>
                  <TextArea
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </>
            )}

            {modal.type === "reject" && (
              <div>
                <p>Lý do từ chối</p>
                <TextArea
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}

            {modal.type === "complete" && (
              <>
                <div>
                  Lãi đã duyệt:{" "}
                  <Text strong>{roundDisplay(modal.record.interestUSDT)} USDT</Text>
                </div>
                <div>
                  <p>Mã giao dịch / hash đã chuyển (không bắt buộc)</p>
                  <Input value={hash} onChange={(e) => setHash(e.target.value)} />
                </div>
                <div>
                  <p>Ghi chú (không bắt buộc)</p>
                  <TextArea
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
