import { Button, Input, Modal, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import instance from "../../axios";
import { ButtonExportToExcel } from "../../components/ButtonExportToExcel/ButtonExportToExcel";
import { useExportExcel } from "../../hooks/useExportExcel";
import TransactionItem from "./ButtonUpdate";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

const ROWS = 10;

export default function NewHeweDBManage() {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const isSearchMode = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [sort, setSort] = useState("newest");

  const { isLoading: isPendingExportExcel, handleExportFileExcel } =
    useExportExcel({
      serviceGetData: () =>
        instance.get(
          `/getHeweDBData?limit=${total}&page=${page}&keyword=${keyword}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        ),
    });

  const handleClickExportBtn = () => {
    handleExportFileExcel({
      sheetName: "HEWE DB",
      headers: [
        { colName: "Email" },
        { colName: "Username" },
        { colName: "HEWE Amount" },
        { colName: "HEWE Price" },
        { colName: "USDT for HEWE" },
        { colName: "AMC Amount" },
        { colName: "AMC Price" },
        { colName: "USDT for AMC" },
        { colName: "USDT Total" },
        { colName: "Loan Acceptance (%)" },
        { colName: "USDT Received" },
        { colName: "Time Start" },
        { colName: "Time End" },
        { colName: "Time Left" },
        { colName: "Status" },
      ],

      onlyGetFieldData: [
        "userEmail",
        "userName",
        "hewe",
        "priceHewe",
        "usdthewe",
        "amc",
        "priceAmc",
        "usdtamc",
        "totalUSDT",
        "percent",
        "receivedUSDT",
        "createdAt",
        "endTime",
        "timeLeft",
        "status",
      ],
      preprocessColumnsData: {
        hewe: (record) => roundDisplay(record.hewe),
        priceHewe: (record) => record.priceHewe,
        usdthewe: (record) => roundDisplay(record.usdthewe),
        amc: (record) => roundDisplay(record.amc),
        priceAmc: (record) => record.priceAmc,
        usdtamc: (record) => roundDisplay(record.usdtamc),
        totalUSDT: (record) => roundDisplay(record.usdtamc + record.usdthewe),
        percent: (record) => record.percent,
        receivedUSDT: (record) => roundDisplay(record.receivedUSDT),
        createdAt: (record) => dayjs(record.createdAt).format("DD/MM/YYYY"),
        endTime: (record) => dayjs(record.endTime).format("DD/MM/YYYY"),
        timeLeft: (record) => dayjs(record.endTime).diff(dayjs(), "days"),
        status: (record) => {
          if (record.status === "inprocess") return "Active";
          else if (record.status === "completed") return "Completed";
        },
      },
    });
  };

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    setKeyword(e.target.value);
    setPage(1);
  };

  const getData = async (limit, page, sort) => {
    setLoading(true);
    try {
      const res = await instance.get(
        `/getHeweDBData?limit=${limit}&page=${page}&keyword=${keyword}&sortBy=${sort}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setListData(res.data.data.array);
      setTotal(res.data.data.total);
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
            <Tag color="green">{record.type?.toUpperCase()}</Tag>
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
        const diffInHours = dayjs(record.endTime).diff(dayjs(), "hour");
        const daysLeft = Math.floor(diffInHours / 24);
        const hoursLeft = diffInHours % 24;

        return (
          <div>
            <p>Start: {dayjs(record.createdAt).format("DD/MM/YYYY")}</p>
            <p>
              End: {dayjs(record.endTime).format("DD/MM/YYYY")}{" "}
              <TransactionItem record={record} getData={getData} />
            </p>
            <p>
              Time left: {daysLeft} days {hoursLeft} hours
            </p>
          </div>
        );
      },
    },
    {
      title: "Email",
      render: (_, record) => {
        if (!record.emailRecord) {
          return <></>;
        } else {
          return (
            <>
              <p>
                Email sent at{" "}
                {dayjs(record.emailRecord.createdAt).format("DD/MM/YYYY HH:mm")}
              </p>
              <Button
                onClick={() => {
                  setModalData(record.emailRecord);
                  setIsModalOpen(true);
                }}
              >
                See details
              </Button>
            </>
          );
        }
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
    getData(ROWS, 1, sort);
  }, []);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      getData(ROWS, 1, sort);
      isSearchMode.current = false;
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [keyword]);

  return (
    <>
     
      <h4>HEWE DB Transaction</h4>
      <NavLink to="/adminPanel/getListUpdateHeweDB">
        <Button type="primary">Xem danh sách cập nhật HEWE DB</Button>
      </NavLink>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "8px",
        }}
      >
        <div style={{ marginRight: 5 }}>
          <span>Sort by</span>{" "}
          <Select
            defaultValue="newest"
            style={{ width: 120 }}
            onChange={(value) => {
              setSort(value);
              setPage(1);
              getData(ROWS, 1, value);
            }}
            options={[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
            ]}
          />
        </div>
        <div style={{ marginRight: 5, width: "350px" }}>
          <Input
            style={{ maxWidth: "350px" }}
            value={keyword}
            onChange={handleChangeKeyword}
            placeholder="Search..."
          />
        </div>
        <ButtonExportToExcel
          loading={isPendingExportExcel}
          onExport={handleClickExportBtn}
        />
      </div>

      <Table
        dataSource={listData}
        columns={columns}
        rowKey={(record) => record._id}
        size="middle"
        scroll={{ x: 900 }}
        loading={loading}
        pagination={{
          position: ["topRight"],
          size: "default",
          total,
          current: page,
          onChange: (page) => {
            setPage(page);
            getData(ROWS, page, sort);
          },
          showSizeChanger: false,
          showQuickJumper: false,
          pageSize: ROWS,
        }}
      />

      <Modal
        title="Email Details"
        centered
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
          setModalData(null);
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setModalData(null);
        }}
        width={800}
      >
        <div>
          {modalData ? (
            <div
              dangerouslySetInnerHTML={{ __html: modalData.content }}
              id="email-content-details-modal"
            />
          ) : (
            <p>No email details available.</p>
          )}
        </div>
      </Modal>
    </>
  );
}
