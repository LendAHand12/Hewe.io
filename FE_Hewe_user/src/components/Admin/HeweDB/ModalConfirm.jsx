import { Modal } from "antd";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { showAlert } from "../../../function/showAlert";
import { axiosService } from "../../../util/service";

export default function ModalConfirm({
  open,
  setOpen,
  v,
  round,
  roundDisplay,
  setV,
  handleGetProfile,
  setK,
}) {
  let realPercent = v.percent / 100;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);

  const createTransaction = async (usdt, percent, year) => {
    try {
      if (loading) return;
      if (!executeRecaptcha) return;

      let trueCondition =
        (usdt * 2 >= 2000 && year === 1 && percent === 20) ||
        (usdt * 2 >= 2000 && year === 2 && percent === 30) ||
        (usdt * 2 < 2000 && year === 1 && percent === 10) ||
        (usdt * 2 < 2000 && year === 2 && percent === 20);

      if (!trueCondition) {
        showAlert("error", "Invalid percent");
        return;
      }

      setLoading(true);

      await executeRecaptcha("createTransactionHeweDB").then(async (token) => {
        let res = await axiosService.post("/v2/createTransactionHeweDB", {
          usdt,
          percent,
          year,
          gRec: token,
        });
        showAlert("success", res.data.message);
        setOpen(false);
        setV({
          amountHEWE: undefined,
          amountUSDT: undefined,
          amountAMC: undefined,
          percent: 10,
          year: 1,
        });
        handleGetProfile();
        setK((prev) => prev + 1);
      });
    } catch (error) {
      console.error(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onOk={() => createTransaction(v.amountUSDT, v.percent, v.year)}
      centered
      okButtonProps={{
        size: "large",
        style: { color: "black", fontWeight: 600 },
        loading: loading,
      }}
      cancelButtonProps={{ size: "large" }}
      destroyOnClose
      okText="Confirm"
      cancelText="Cancel"
      title="Confirm your transaction"
      className="HeweDBMainJ24-modal"
      maskClosable={false}
      width={450}
    >
      <div className="summary">
        <h5>You will pay</h5>
        <div className="summary-item">
          <span>Amount HEWE</span>
          <p>{roundDisplay(v.amountHEWE)}</p>
        </div>

        <div className="summary-item">
          <span>Amount AMC</span>
          <p>{roundDisplay(v.amountAMC)}</p>
        </div>

        <div style={{ marginTop: 15 }}></div>

        <h5>Loan Qualifying</h5>
        <div className="summary-item">
          <span>Amount USDT</span>
          <p>{roundDisplay(v.amountUSDT * 2 * realPercent)}</p>
        </div>

        <div style={{ marginTop: 15 }}></div>

        <h5>Transaction Summary</h5>
        <div className="summary-item">
          <span>Loan Acceptance</span>
          <p>{v.percent}%</p>
        </div>

        <div className="summary-item">
          <span>Duration Terms</span>
          <p>{v.year === 1 ? "1 year" : "2 years"}</p>
        </div>
      </div>
    </Modal>
  );
}
