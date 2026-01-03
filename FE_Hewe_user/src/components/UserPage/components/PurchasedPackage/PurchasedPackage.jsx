import { formatVND } from "../../../../util/formatVND";
import "./PurchasedPackage.scss";

export const PurchasedPackage = ({ dataTransaction }) => {
  if (!dataTransaction) {
    return null;
  }

  return (
    <div className="purchasedPackageContainer">
      <div className="titlePurchased">Transaction information</div>
      <div className="infoPurchased">
        <div className="row">
          <div className="label">Bank name:</div>
          <div className="value">{dataTransaction.name_banking_admin}</div>
        </div>

        <div className="row">
          <div className="label">Account number:</div>
          <div className="value">{dataTransaction.number_banking_admin}</div>
        </div>

        <div className="row">
          <div className="label">Account owner:</div>
          <div className="value">{dataTransaction.owner_banking_admin}</div>
        </div>

        <div className="row">
          <div className="label">Message:</div>
          <div className="value">{dataTransaction.code_unique}</div>
        </div>

        <div className="row">
          <div className="label">VND money:</div>
          <div className="value">
            {formatVND(Number(dataTransaction.amount))}
          </div>
        </div>

        <div className="row">
          <div className="label">HEWE received:</div>
          <div className="value">{dataTransaction.amountToken}</div>
        </div>

        {dataTransaction.coinBonus !== 0 && (
          <div className="row">
            <div className="label">AMC:</div>
            <div className="value">{dataTransaction.coinBonus}</div>
          </div>
        )}
        <div className="row">
          <div className="label">Address receive:</div>
          <div className="value">{dataTransaction.addressReceive}</div>
        </div>
      </div>
    </div>
  );
};
