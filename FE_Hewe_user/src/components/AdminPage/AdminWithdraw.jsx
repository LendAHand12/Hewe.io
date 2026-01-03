import { Button, Input, Modal, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ROW_PER_TABLE } from "../../constant/constant";
import { axiosService } from "../../util/service";
import { showAlert } from "../../function/showAlert";
import ExchangeRate from "./ExchangeRate";

export default function AdminWithdraw() {
  // for data
  const [data, setData] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);

  // for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [hashField, setHashField] = useState("");
  const showModal = (record) => {
    setIsModalVisible(true);
    setRecord(record);
    setHashField("");
  };
  const handleOk = () => {
    setIsModalVisible(false);
    confirmWithdraw(record.id, hashField);
    setRecord(null);
    setHashField("");
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setRecord(null);
    setHashField("");
  };

  // loading
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const confirmWithdraw = async (id, hash) => {
    setLoading1(true);

    try {
      const response = await axiosService.post("api/crypto/withdrawalConfirmation", {
        id,
        hash,
      });
      showAlert("success", response.data.message);
      getData(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading1(false);
    }
  };

  const cancelWithdraw = async (id) => {
    setLoading2(true);

    try {
      const response = await axiosService.post("api/crypto/cancelWidthdraw", {
        id,
      });
      showAlert("success", response.data.message);
      getData(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading2(false);
    }
  };

  async function getData(limit, page) {
    try {
      const response = await axiosService.post("api/crypto/getHistoryWidthdrawAdmin", {
        limit,
        page,
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  }

  const onPaginationChange = (page) => {
    setCurrent(page);
    getData(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    setCurrent(1);
    getData(ROW_PER_TABLE, 1);
  }, []);

  const columns = [
    {
      title: "User ID",
      key: "User ID",
      dataIndex: "userid",
      width: 100,
    },
    {
      title: "Email",
      key: "Email",
      dataIndex: "email",
      width: 220,
    },
    {
      title: "Symbol",
      key: "Symbol",
      dataIndex: "symbol",
      width: 120,
    },
    {
      title: "Network",
      key: "Network",
      dataIndex: "network",
      width: 120,
    },
    {
      title: "Withdrawal Address",
      key: "Withdrawal Address",
      dataIndex: "toAddress",
      width: 320,
    },
    {
      title: "Amount",
      key: "Amount",
      dataIndex: "amount",
      width: 120,
    },
    {
      title: "Network Fee",
      key: "Network Fee",
      width: 120,
      render: (_, { feeWidthdraw }) => {
        return feeWidthdraw.toFixed(1);
      },
    },
    {
      title: "Hash",
      key: "Hash",
      dataIndex: "hash",
      width: 300,
    },
    {
      title: "Amount Received",
      key: "Amount Received",
      dataIndex: "balanceWidthdraw",
      width: 180,
    },
    {
      title: "Time",
      key: "Time",
      dataIndex: "created_at",
      width: 180,
    },
    {
      title: "Status",
      key: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, { status }) => {
        if (status === 2) {
          return (
            <Tag color="orange">
              <strong>PENDING</strong>
            </Tag>
          );
        }
        if (status === 1) {
          return (
            <Tag color="green">
              <strong>SUCCESS</strong>
            </Tag>
          );
        }
        if (status === 0) {
          return (
            <Tag color="red">
              <strong>CANCEL</strong>
            </Tag>
          );
        }
      },
    },
    {
      title: "Action",
      key: "Action",
      width: 200,
      render: (_, record) => {
        if (record.status === 2) {
          return (
            <>
              <Button size="small" onClick={() => showModal(record)} loading={loading1}>
                Confirm
              </Button>
              <Button
                size="small"
                danger
                style={{ marginLeft: 8 }}
                onClick={() => cancelWithdraw(record.id)}
                loading={loading2}
              >
                Cancel
              </Button>
            </>
          );
        }
      },
    },
  ];

  return (
    <>
      <ExchangeRate />

      <div className="divider" style={{ marginBottom: 50 }}></div>

      <div className="admin-withdraw">
        <div className="title-area">
          <h2 className="title">Withdraw</h2>

          <Pagination
            defaultCurrent={1}
            total={totalRecord}
            current={current}
            onChange={onPaginationChange}
            showSizeChanger={false}
            showQuickJumper={false}
            className="pagination-box"
          />
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{
            x: 2100,
          }}
        />

        <Modal
          okText="Confirm"
          title="Confirm withdrawal"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
        >
          <div className="field">
            <label htmlFor="hsh">Hash</label>
            <Input
              type="text"
              size="large"
              id="hsh"
              name="hsh"
              value={hashField}
              onChange={(e) => setHashField(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
