import "./DepositContentAMC.scss";
import { Button } from "../../../Button/Button";
import { InfoIcon } from "../../../InfoIcon/InfoIcon";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { hanldeCopy } from "../../../../util/adminBizpointUtils";
import { getWalletAMCAPI } from "../../../../services/transferService";
import QRCode from "react-qr-code";
import { HistoryDepositAMC } from "../HistoryDepositAMC/HistoryDepositAMC";

export const DepositContentAMC = () => {
  const [currentTag, setCurrentTag] = useState("BEP20");
  const [isPendingGetWallet, setIsPendingGetWallet] = useState(false);
  const [address, setAddress] = useState(null);

  const handleGetWallet = async () => {
    getWalletAMCAPI({ token: "", symbol: currentTag })
      .then((res) => {
        setAddress(res.data.data.address);
        setIsPendingGetWallet(false);
      })
      .catch(() => {
        setIsPendingGetWallet(false);
      });
  };

  useEffect(() => {
    currentTag && handleGetWallet();
  }, [currentTag]);

  return (
    <div className="DepositContentAMC">
      <div className="formTransaction">
        {currentTag !== null && (
          <>
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
                  You must deposit at least 5 AMC to be credited. Every
                  transaction is less 5 AMC will not be refunded
                </div>
              </div>
              <div className="note">
                <InfoIcon />{" "}
                <div className="center-flex-vertical text-white">
                  This deposit address only accepts AMC. Do not deposit other
                  coins this address
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="listHistoryDepositContainer">
        <div className="title text-white">History deposit</div>
        <HistoryDepositAMC />
      </div>
    </div>
  );
};
