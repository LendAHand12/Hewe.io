import { Button } from "antd";
import { PurchasedPackage } from "../PurchasedPackage/PurchasedPackage";
import "./Step4.scss";
import { useHistory } from "react-router-dom";

export const Step4 = ({ dataTransaction }) => {
  const history = useHistory();

  const handleViewHistoryTransaction = () => {
    history.push("/user/history-buy-token");
  };

  return (
    <div className="step4Container">
      {/* <div className="header">
        <h2 className="titleContainer">Wait for admin to approve</h2>
      </div> */}

      <PurchasedPackage dataTransaction={dataTransaction} />

      <div className="notifSuccessContainer">
        <div className="notifIcon">
          <i className="fa-regular fa-circle-check"></i>
        </div>

        <div className="notifContent">
          <div className="title">Done - Awaiting</div>
          <div className="subTitle">
            The system will censor your transaction and will update your account
            balance soon. Thank you for your transaction.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button danger type="primary" onClick={handleViewHistoryTransaction}>
          View history transactions
        </Button>
      </div>
    </div>
  );
};
