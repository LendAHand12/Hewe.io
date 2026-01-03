import { Button, message } from "antd";
import { PurchasedPackage } from "../PurchasedPackage/PurchasedPackage";
import "./Step2.scss";
import { useState } from "react";
import { axiosService } from "../../../../util/service";

export const Step2 = ({
  onNextStep,
  dataTransaction,
  onCloseModalWhenCancel,
}) => {
  const [loadings, setLoadings] = useState({ confirm: false, cancel: false });

  const handleRequestConfirm = async () => {
    if (loadings.cancel) {
      return;
    }

    setLoadings({ ...loadings, confirm: true });

    try {
      const res = await axiosService.post(
        "api/depositVND/verifyTransactionDepositVnd",
        { idTransaction: dataTransaction.id }
      );

      message.success(res.data.message);
      onNextStep();
      setLoadings({ ...loadings, confirm: false });
    } catch (error) {
      message.error(error.response.data.message);
      setLoadings({ ...loadings, confirm: false });
    }
  };

  const handleRequestCancel = async () => {
    if (loadings.confirm) {
      return;
    }

    setLoadings({ ...loadings, cancel: true });

    try {
      const res = await axiosService.post(
        "api/depositVND/cancelTransactionDepositVnd",
        { idTransaction: dataTransaction.id }
      );

      message.success(res.data.message);
      // onNextStep();
      onCloseModalWhenCancel();
      setLoadings({ ...loadings, cancel: false });
    } catch (error) {
      message.error(error.response.data.message);
      setLoadings({ ...loadings, cancel: false });
    }
  };

  return (
    <div className="step2Container">
      {/* <div className="header">
        <h2 className="titleContainer">Confirm transaction</h2>
      </div> */}

      <PurchasedPackage dataTransaction={dataTransaction} />
      <div className="btnsStep2">
        <Button
          loading={loadings.confirm}
          type="primary"
          onClick={handleRequestConfirm}
        >
          Confirm money transfer
        </Button>
        <Button
          loading={loadings.cancel}
          type="danger"
          onClick={handleRequestCancel}
        >
          Cancel transaction
        </Button>
      </div>
    </div>
  );
};
