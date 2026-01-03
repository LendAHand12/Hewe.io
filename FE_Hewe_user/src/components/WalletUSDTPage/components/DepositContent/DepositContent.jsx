import "./DepositContent.scss";
import { Button } from "../../../Button/Button";
import { InfoIcon } from "../../../InfoIcon/InfoIcon";
import { ChooseTagToken, HistoryDeposit } from "..";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { hanldeCopy } from "../../../../util/adminBizpointUtils";
import { getWalletUSDTAPI } from "../../../../services/transferService";
import QRCode from "react-qr-code";

export const DepositContent = () => {
  const [currentTag, setCurrentTag] = useState(null);
  const [isPendingGetWallet, setIsPendingGetWallet] = useState(false);
  const [address, setAddress] = useState(null);

  const handleGetWallet = async () => {
    getWalletUSDTAPI({ token: "", symbol: currentTag })
      .then((res) => {
        setAddress(res.data.data.address);
        setIsPendingGetWallet(false);
      })
      .catch(() => {
        setIsPendingGetWallet(false);
      });
  };

  const handleChooseTag = (tag) => () => {
    setIsPendingGetWallet(true);
    setCurrentTag(tag);
  };

  useEffect(() => {
    currentTag && handleGetWallet();
  }, [currentTag]);

  return (
    <div className="depositContentContainer">
      <div className="formTransaction">
        <div className="switch">
          <p>Choose a network to start</p>
          <ChooseTagToken
            currentTag={currentTag}
            onChooseTag={handleChooseTag}
          />
        </div>

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
                  You must deposit at least 5 USDT to be credited. Every
                  transaction is less 5 USDT will not be refunded
                </div>
              </div>
              <div className="note">
                <InfoIcon />{" "}
                <div className="center-flex-vertical text-white">
                  This deposit address only accepts USDT. Do not deposit other
                  coins this address
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="listHistoryDepositContainer">
        <div className="title text-white">History deposit</div>
        <HistoryDeposit />
      </div>
    </div>
  );
};
