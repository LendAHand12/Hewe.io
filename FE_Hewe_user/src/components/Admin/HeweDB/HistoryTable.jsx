import { Button, Input, Modal, Radio, Table } from "antd";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { showAlert } from "../../../function/showAlert";
import { axiosService } from "../../../util/service";

const ROWS = 10;

export default function HistoryTable({
  roundDisplay,
  handleGetProfile,
  round,
  HEWE_RATE,
  AMC_RATE,
}) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(undefined);
  const [value4, setValue4] = useState(1); // duration terms for renew
  const [openStopModal, setOpenStopModal] = useState(false);
  const [stopReason, setStopReason] = useState("");

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
      return (
        <p style={{ fontSize: 16, fontWeight: 600, color: "orange" }}>Active</p>
      );
    } else if (record?.status == "completed") {
      return (
        <p style={{ fontSize: 16, fontWeight: 600, color: "green" }}>
          Completed
        </p>
      );
    } else if (record?.status == "stopped") {
      return (
        <p style={{ fontSize: 16, fontWeight: 600, color: "red" }}>Stopped</p>
      );
    } else if (record?.status == "extend") {
      return (
        <p style={{ fontSize: 16, fontWeight: 600, color: "green" }}>
          Extended
        </p>
      );
    } else return <></>;
  };

  const renderStopRequest = (stopRequest) => {
    if (stopRequest.status === "pending")
      return <span style={{ color: "orange" }}>Waiting for admin approval</span>;
    if (stopRequest.status === "approved")
      return (
        <span style={{ color: "#1677ff" }}>
          Approved - interest {roundDisplay(stopRequest.interestUSDT)} USDT will
          be sent to you
        </span>
      );
    if (stopRequest.status === "completed")
      return (
        <span style={{ color: "green" }}>
          Completed - interest {roundDisplay(stopRequest.interestUSDT)} USDT
          paid
        </span>
      );
    return <></>;
  };

  const columns = [
    {
      title: "Transaction Summary",
      render: (_, record) => {
        let endTimeMs = new Date(record?.endTime).getTime();

        return (
          <div className="summaryWrap">
            <div className="summaryItemTable">
              <span>Transaction ID</span>
              <p>{record?.transactionId.split("-")[4]}</p>
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

            {record?.stopRequest && record.stopRequest.status !== "rejected" && (
              <div className="summaryItemTable">
                <span>Stop request</span>
                <p>{renderStopRequest(record.stopRequest)}</p>
              </div>
            )}

            {record?.status == "inprocess" && (
              <div className="summaryItemTable">
                <span>Time left</span>
                <Countdown date={endTimeMs} renderer={renderer} />
              </div>
            )}
          </div>
        );
      },
      width: "85%",
    },
    {
      title: "",
      render: (_, record) => {
        let endTime = new Date(record?.endTime).getTime();
        let isShowButton = Date.now() > endTime;
        // đang có yêu cầu ngưng sớm chờ admin xử lý
        let hasOpenStopRequest = record?.stopRequest?.status === "pending";

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              paddingInline: 10,
            }}
          >
            {/* ẨN nút Renew - giữ lại code để bật lại khi cần, không xoá */}
            {/* {record?.status == "inprocess" && isShowButton && (
              <Button
                onClick={() => {
                  setSelectedTransaction(record);
                  setOpenModal2(true);
                }}
                size="large"
              >
                Renew
              </Button>
            )} */}

            {record?.status == "inprocess" &&
              isShowButton &&
              !hasOpenStopRequest && (
                <Button
                  onClick={() => {
                    setSelectedTransaction(record);
                    setOpenModal(true);
                  }}
                  size="large"
                >
                  Withdraw
                </Button>
              )}

            {record?.status == "inprocess" && !hasOpenStopRequest && (
              <Button
                danger
                onClick={() => {
                  setSelectedTransaction(record);
                  setStopReason("");
                  setOpenStopModal(true);
                }}
                size="large"
              >
                Stop early
              </Button>
            )}
          </div>
        );
      },
      width: "15%",
    },
  ];

  const getData = async (limit, page) => {
    setLoading(true);
    try {
      let res = await axiosService.get(
        `/v2/getTransactionHeweDB?limit=${limit}&page=${page}`
      );
      setData(res.data.data.array);
      setTotal(res.data.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const complete = async (transactionId) => {
    try {
      if (loading) return;
      if (!executeRecaptcha) return;

      setLoading(true);

      await executeRecaptcha("completeTransactionHeweDB").then(
        async (token) => {
          let res = await axiosService.post(`/v2/completeTransactionHeweDB`, {
            transactionId,
            gRec: token,
          });
          showAlert("success", res.data.message);
          setCurrent(1);
          getData(ROWS, 1);
          handleGetProfile();
        }
      );
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const requestStop = async (transactionId, reason) => {
    try {
      if (loading) return;
      if (!executeRecaptcha) return;

      setLoading(true);

      await executeRecaptcha("requestStopHeweDB").then(async (token) => {
        let res = await axiosService.post(`/v2/requestStopHeweDB`, {
          transactionId,
          reason,
          gRec: token,
        });
        showAlert("success", res.data.message);
        setCurrent(1);
        getData(ROWS, 1);
      });
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const extend = async (transactionId, year) => {
    try {
      if (loading) return;
      if (!year || year < 1 || year > 2) {
        showAlert("error", "Please select a valid duration term");
        return;
      }
      if (!executeRecaptcha) return;

      setLoading(true);

      await executeRecaptcha("extendTransactionHeweDB").then(async (token) => {
        let res = await axiosService.post(`/v2/extendTransactionHeweDB`, {
          transactionId,
          year,
          gRec: token,
        });
        showAlert("success", res.data.message);
        setCurrent(1);
        getData(ROWS, 1);
        handleGetProfile();
      });
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const calcExtendUSDT = () => {
    if (!selectedTransaction) return 0;
    let { hewe, amc, percent, receivedUSDT } = selectedTransaction;

    let newUSDTHEWE = hewe * HEWE_RATE;
    let newUSDTAMC = amc * AMC_RATE;
    let totalUSDTAfter = round(newUSDTHEWE + newUSDTAMC);

    let newReceivedUSDTPercent;
    if (totalUSDTAfter < 2000) {
      newReceivedUSDTPercent = value4 === 1 ? 10 : 20; // 10% cho 1 năm, 20% cho 2 năm
    } else {
      newReceivedUSDTPercent = value4 === 1 ? 20 : 30; // 20% cho 1 năm, 30% cho 2 năm
    }

    let newReceivedUSDT = round(
      totalUSDTAfter * (newReceivedUSDTPercent / 100)
    );

    let diff = newReceivedUSDT - receivedUSDT;

    return {
      totalUSDTAfter,
      newReceivedUSDT,
      newReceivedUSDTPercent,
      receivedUSDT,
      diff,
    };
  };

  useEffect(() => {
    setCurrent(1);
    getData(ROWS, 1);
  }, []);

  return (
    <div className="HeweDBMainJ24-table">
      <h4>Your transaction</h4>

      {!data.length ? (
        <p style={{ marginTop: 20, color: "grey" }}>
          You do not have any transaction yet
        </p>
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record) => record._id}
          size="middle"
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
          showHeader={false}
        />
      )}

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => {
          setOpenModal(false);
          complete(selectedTransaction?.transactionId);
        }}
        centered
        okButtonProps={{
          size: "large",
          style: { color: "black", fontWeight: 600 },
          loading: loading,
        }}
        cancelButtonProps={{ size: "large" }}
        destroyOnClose
        okText="Confirm Finish"
        cancelText="Cancel"
        title="Withdraw HEWE DB transaction"
        className="HeweDBMainJ24-modal"
        maskClosable={false}
      >
        <div className="summary">
          <h5>You have to pay</h5>
          <div className="summary-item">
            <span>Amount USDT</span>
            <p>{roundDisplay(selectedTransaction?.receivedUSDT)}</p>
          </div>

          <div style={{ marginTop: 15 }}></div>

          <h5>You will receive</h5>
          <div className="summary-item">
            <span>Amount HEWE</span>
            <p>{roundDisplay(selectedTransaction?.hewe)}</p>
          </div>
          <div className="summary-item">
            <span>Amount AMC</span>
            <p>{roundDisplay(selectedTransaction?.amc)}</p>
          </div>
        </div>
      </Modal>

      <Modal
        open={openStopModal}
        onCancel={() => setOpenStopModal(false)}
        onOk={() => {
          setOpenStopModal(false);
          requestStop(selectedTransaction?.transactionId, stopReason);
        }}
        centered
        okButtonProps={{
          size: "large",
          style: { color: "black", fontWeight: 600 },
          loading: loading,
        }}
        cancelButtonProps={{ size: "large" }}
        destroyOnClose
        okText="Send request"
        cancelText="Cancel"
        title="Stop HEWE DB transaction early"
        className="HeweDBMainJ24-modal"
        maskClosable={false}
      >
        <div className="summary">
          <p style={{ marginBottom: 15 }}>
            Your request will be sent to admin for approval. After approval, the
            admin will calculate and send your interest separately.
          </p>
          <div className="summary-item">
            <span>Amount HEWE</span>
            <p>{roundDisplay(selectedTransaction?.hewe)}</p>
          </div>
          <div className="summary-item">
            <span>Amount AMC</span>
            <p>{roundDisplay(selectedTransaction?.amc)}</p>
          </div>
          <div className="summary-item">
            <span>Received USDT</span>
            <p>{roundDisplay(selectedTransaction?.receivedUSDT)}</p>
          </div>
          <div style={{ marginTop: 15 }}>
            <span>Reason (optional)</span>
            <Input.TextArea
              rows={3}
              maxLength={500}
              value={stopReason}
              onChange={(e) => setStopReason(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={openModal2}
        onCancel={() => setOpenModal2(false)}
        onOk={() => {
          setOpenModal2(false);
          extend(selectedTransaction?.transactionId, value4);
        }}
        centered
        okButtonProps={{
          size: "large",
          style: { color: "black", fontWeight: 600 },
          loading: loading,
        }}
        cancelButtonProps={{ size: "large" }}
        destroyOnClose
        okText={`Confirm Renew ${value4 == 1 ? "1 year" : "2 years"}`}
        cancelText="Cancel"
        title="Renew HEWE DB transaction"
        className="HeweDBMainJ24-modal"
        maskClosable={false}
      >
        <div className="summary">
          <h5>Duration Terms</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <span>Select duration terms</span>
            <Radio.Group
              options={[
                {
                  label: "1 year",
                  value: 1,
                },
                {
                  label: "2 years",
                  value: 2,
                },
              ]}
              value={value4}
              onChange={({ target: { value } }) => {
                setValue4(value);
              }}
              optionType="button"
              buttonStyle="solid"
              size="large"
            />
          </div>

          <h5>Transaction Summary</h5>
          <div className="summary-item">
            <span>Amount HEWE</span>
            <p>{roundDisplay(selectedTransaction?.hewe)}</p>
          </div>

          <div className="summary-item">
            <span>Amount AMC</span>
            <p>{roundDisplay(selectedTransaction?.amc)}</p>
          </div>

          <div className="summary-item">
            <span>Amount USDT</span>
            <p>{calcExtendUSDT().totalUSDTAfter}</p>
          </div>

          <div className="summary-item">
            <span>Loan Acceptance</span>
            <p>
              {calcExtendUSDT().newReceivedUSDTPercent}% (
              {calcExtendUSDT().newReceivedUSDT} USDT)
            </p>
          </div>

          <div className="summary-item">
            <span>You will receive</span>
            <p>{roundDisplay(calcExtendUSDT().diff)}</p>
          </div>

          <div className="summary-item">
            <span>Duration Terms</span>
            <p>{value4 == 1 ? "1 year" : "2 years"}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
