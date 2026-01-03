import { Table } from "../../..";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DatePicker, Tag, Modal } from "antd";
import { useListTable, usePagination } from "../../../../hooks";
import { getHistoryCommissionAPI } from "../../../../services/commissionService";
import {
  convertTimeCreateAt,
  formatHewe,
} from "../../../../util/adminBizpointUtils";
import "./HistoryCommission.scss";
import { TreeData } from "./TreeData";

const LIMIT = 10;
const { RangePicker } = DatePicker;

const TOKENS = [
  { value: "", label: "Tất cả" },
  {
    value: "bizpoint",
    label: (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <img className="iconToken" />
        <div>BIZPOINT</div>
      </div>
    ),
  },
  {
    value: "usp",
    label: (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <img className="iconToken" />
        <div>USP</div>
      </div>
    ),
  },
  {
    value: "bcf",
    label: (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <img className="iconToken" />
        <div>BCF</div>
      </div>
    ),
  },
];

export const HistoryCommission = () => {
  const [open, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const isMobileViewport = window.innerWidth < 768;
  const [date, setDate] = useState({ timeStart: 1, timeEnd: 9999999999999 });
  const {
    x,
    y,
    currentPage,
    totalItems,
    limitPerRow,
    handleSetCurrentPage,
    handleSetTotalItems,
  } = usePagination({
    defaultPage: 1,
    limit: LIMIT,
  });
  const { data, loading, handleGetData } = useListTable({
    service: getHistoryCommissionAPI,
    defaultParamsPayload: {
      limit: limitPerRow,
      page: currentPage,
      timeStart: date.timeStart,
      timeEnd: date.timeEnd,
    },
    callbackSetTotalItem: handleSetTotalItems,
  });
  const { profile } = useSelector((state) => state.userReducer);

  console.log("profile", profile);

  const handleGetHistoryWithdraw = ({ page, from, to, timeStart, timeEnd }) => {
    handleGetData({
      paramsQuery: { page, from, to, timeStart, timeEnd, limit: LIMIT },
    });
  };

  const handleChangeDate = (dates) => {
    if (!dates) {
      handleSetCurrentPage(1);
      setDate({ timeStart: 1, timeEnd: 9999999999999 });
      return;
    }

    handleSetCurrentPage(1);
    setDate({
      timeStart: dates[0].startOf("d").valueOf(),
      timeEnd: dates[1].endOf("d").valueOf(),
    });
  };

  const renderStatus = (record) => {
    switch (record.status) {
      case "pending":
        return <Tag>Pending</Tag>;

      case "approved":
        return <Tag color="success">Approved</Tag>;

      case "rejected":
        return <Tag color="red">Rejected</Tag>;

      default:
        return null;
    }
  };

  const columns = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          User swap token
        </div>
      ),
      render: (_, record) => {
        return record.userEmail;
      },
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          Amount USDT receive
        </div>
      ),
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span>{formatHewe(record.amountTokenCommission)}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (value) => convertTimeCreateAt(value),
    },
  ];

  useEffect(() => {
    handleGetHistoryWithdraw({
      page: currentPage,
      timeStart: date.timeStart,
      timeEnd: date.timeEnd,
    });
  }, [currentPage, date.timeEnd, date.timeStart]);

  return (
    <div className="HistoryCommission">
      <Modal
        centered
        open={open}
        onClose={onClose}
        onCancel={onClose}
        title="HEWE DB REFERRAL PROGRAM"
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 600 }}>
              1. Affiliate Marketing / Referrer (commission recipient):
            </span>{" "}
            Currently using hewe.io service and have an account on hewe.io and
            have joined HEWE DB Program.
            <br />
            <span style={{ fontWeight: 600 }}>2. Referral Commission:</span> To
            qualify for referral commission Customer must fulfill the following
            conditions: 
          </div>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              textAlign: "left",
              border: "1px solid white",
              marginBottom: "16px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    fontWeight: 600,
                    fontSize: 20,
                    border: "1px solid white",
                    padding: 8,
                  }}
                  colSpan="2"
                >
                  Referral Commission
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: 600,
                    border: "1px solid white",
                    padding: 8,
                  }}
                >
                  Direct Referral
                </td>
                <td style={{ border: "1px solid white", padding: 8 }}>
                  <ol
                    style={{
                      margin: 0,
                      paddingLeft: 16,
                    }}
                  >
                    <li>
                      Successfully register an account on the HEWE.IO Website.
                    </li>
                    <li>
                      Complete the registration steps to join the HEWE DB
                      Program through the Referrer's referral link.
                    </li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: 600,
                    border: "1px solid white",
                    padding: 8,
                  }}
                >
                  Indirect Referral
                </td>
                <td style={{ border: "1px solid white", padding: 8 }}>
                  <div style={{ color: "red", fontWeight: 600 }}>
                    *Note: The person who you referral have referral someone
                    else is called an indirect referrer.
                  </div>
                  <ol
                    style={{
                      margin: 0,
                      paddingLeft: 16,
                    }}
                  >
                    <li>
                      Successfully register an account on the HEWE.IO Website.
                    </li>
                    <li>
                      Complete the registration steps to join the HEWE DB
                      Program through the Referrer's referral link.
                    </li>
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            style={{
              width: "100%",
              textAlign: "left",
              border: "1px solid white",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    fontWeight: 600,
                    fontSize: 20,
                    border: "1px solid white",
                    padding: 8,
                  }}
                  colSpan="2"
                >
                  Program Content
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: 600,
                    border: "1px solid white",
                    padding: 8,
                  }}
                >
                  Successfully introduced 1 person
                </td>
                <td style={{ border: "1px solid white", padding: 8 }}>
                  5% of total direct referrals purchase HEWE and AMC
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: 600,
                    border: "1px solid white",
                    padding: 8,
                  }}
                >
                  Successfully introduced 1 person indirectly
                </td>
                <td style={{ border: "1px solid white", padding: 8 }}>
                  1% of total indirect referrals purchase HEWE and AMC
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 16, fontWeight: 600, color: "red" }}>
            NOTE: Commissions are automatically sent to the Referrer’s wallet
            address registered on the hewe.io account.
          </div>
        </div>
      </Modal>
      <div className="header">
        <div className="titleContainer">
          <div className="title">
            Commission
            <i
              onClick={onOpen}
              class="fa-solid fa-circle-question"
              style={{
                cursor: "pointer",
                marginLeft: "8px",
              }}
            ></i>
          </div>
        </div>

        {/* <div>
          <RangePicker onChange={handleChangeDate} />
        </div> */}
      </div>

      <Table
        rowKey={(row) => row.id}
        columns={columns}
        x={x}
        y={y}
        totalItems={totalItems}
        data={data}
        currentPage={currentPage}
        isLoading={loading}
        onChangePage={handleSetCurrentPage}
        limit={limitPerRow}
        paginationPosition="bottomRight"
        scrollX={isMobileViewport ? 100 : 800}
      />

      {/* <div>
        <div className="titleContainer">
          <div className="title">Revenue</div>
        </div>

        <div>
          <span style={{ fontSize: 18 }}>{profile?.revenue || 0}</span> USDT
        </div>
      </div> */}

      <div className="nodeTree">
        <div className="titleContainer">
          <div className="title">System</div>
        </div>

        <div style={{ marginBottom: "4px" }}>
          <span style={{ fontWeight: 600, marginRight: "8px" }}>
            {profile?.name}
          </span>
          {/* <span>{profile?.email}</span> */}
        </div>
        {profile?._id && <TreeData userId={profile?._id} />}
      </div>
    </div>
  );
};
