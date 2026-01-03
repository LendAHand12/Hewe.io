import "./DepositContentHEWE.scss";
import { Button } from "../../../Button/Button";
import { InfoIcon } from "../../../InfoIcon/InfoIcon";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { hanldeCopy } from "../../../../util/adminBizpointUtils";
import { getWalletHEWEAPI } from "../../../../services/transferService";
import QRCode from "react-qr-code";
import { HistoryDepositHEWE } from "../HistoryDepositHEWE/HistoryDepositHEWE";

export const DepositContentHEWE = () => {
  const [isPendingGetWallet, setIsPendingGetWallet] = useState(false);
  const [address, setAddress] = useState(null);

  const handleGetWallet = async () => {
    getWalletHEWEAPI()
      .then((res) => {
        setAddress(res.data.data);
        setIsPendingGetWallet(false);
      })
      .catch(() => {
        setIsPendingGetWallet(false);
      });
  };

  useEffect(() => {
    handleGetWallet();
  }, []);

  return (
    <div className="DepositContentHEWE">
      <div className="formTransaction">
        <div className="qrCode">
          {isPendingGetWallet || !address ? (
            <div className="spin">
              <Spin />
            </div>
          ) : (
            <>
              <QRCode value={address} size={200} />
              <div className="address text-white">{address}</div>
              <Button
                onClick={hanldeCopy(address)}
                style={{ maxWidth: "150px" }}
              >
                Copy address
              </Button>
            </>
          )}
        </div>

        <div className="description">
          <div className="note">
            <InfoIcon />{" "}
            <div className="center-flex-vertical" style={{ color: "red" }}>
              Attention: AMC and HEWE on www.hewe.io are restricted to the
              holding program only. Please be aware that withdrawals are not
              allowed.
            </div>
          </div>
          <div className="note">
            <InfoIcon />{" "}
            <div className="center-flex-vertical text-white">
              This deposit address only accepts HEWE. Do not deposit other coins
              this address
            </div>
          </div>
        </div>
      </div>
      <div className="listHistoryDepositContainer">
        <div className="title text-white">History deposit</div>
        <HistoryDepositHEWE />
      </div>
    </div>
  );
};
