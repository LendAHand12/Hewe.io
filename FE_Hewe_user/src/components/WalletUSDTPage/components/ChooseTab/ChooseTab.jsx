import { Input, Tabs } from "antd";
import "./ChooseTab.scss";
import { DepositContent, WithdrawContent } from "..";
import { useSelector } from "react-redux";
import { IconUSDT } from "../../../IconUSDT/IconUSDT";
import { formatHewe } from "../../../../util/format.js";
import { DepositContentAMC } from "../DepositContentAMC/DepositContentAMC.jsx";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
import { useHistory } from "react-router-dom/cjs/react-router-dom.js";
import { DepositContentHEWE } from "../DepositContentHEWE/DepositContentHEWE.jsx";
import { useUpdateWalletAddress } from "../DepositContent/hooks/useUpdateWalletAddress.js";
import { Modal } from "../../../Modal/Modal.jsx";
import { useProfile } from "../../../../hooks/useProfile.js";
import { Button } from "../../../Button/Button.jsx";

export const ChooseTab = () => {
  const { profile } = useSelector((state) => state?.userReducer);
  const { search } = useLocation();
  const queryKey = new URLSearchParams(search).get("token") || "usdt";
  const [tabKey, setTabKey] = useState(queryKey.toUpperCase());
  const history = useHistory();
  const [isShowTabHewe, setIsShowTabHewe] = useState(false);

  const {
    isOpen,
    isPendingUpdate,
    isDisabledBtnUpdate,
    addressWallet,
    handleCloseModal,
    handleOpenModal,
    handleChangeAddressWallet,
    handleRequestUpgradeAddress,
  } = useUpdateWalletAddress();

  const handleChangeTabKey = (key) => {
    setTabKey(key);
    history.push(`depositUSDT?token=${key}`);
  };

  console.log("isShowTabHewe", isShowTabHewe);

  useEffect(() => {
    if (profile && !profile?.walletAddress) {
      setIsShowTabHewe(false);
    } else {
      setIsShowTabHewe(true);
    }
  }, [profile]);

  useEffect(() => {
    setTabKey(queryKey.toUpperCase());
  }, [queryKey]);

  const renderTabExtra = useMemo(() => {
    switch (tabKey) {
      case "USDT":
        return (
          <div
            className="center-flex-vertical prcolor"
            style={{ fontWeight: 600 }}
          >
            <span style={{ fontWeight: 700 }}>Balance:</span>{" "}
            {formatHewe(profile?.usdtBalance || 0)} <IconUSDT />
          </div>
        );

      case "AMC":
        return (
          <div
            className="center-flex-vertical prcolor"
            style={{ fontWeight: 600 }}
          >
            <span style={{ fontWeight: 700 }}>Balance:</span>{" "}
            {formatHewe(profile?.amcBalance || 0)} AMC
          </div>
        );

      case "HEWE":
        return (
          <div
            className="center-flex-vertical prcolor"
            style={{ fontWeight: 600 }}
          >
            <span style={{ fontWeight: 700 }}>Balance:</span>{" "}
            {formatHewe(profile?.heweBalance || 0)} HEWE
          </div>
        );

      default:
        break;
    }
  }, [tabKey, profile]);

  const renderExtra = renderTabExtra;

  const TAB_ITEMS = [
    {
      label: "Deposit USDT",
      key: "USDT",
      // children: <DepositContent />, // USDT
      children: (
        <>
          <div
            style={{
              display: "flex",
              marginBottom: "10px",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            {renderExtra}
          </div>
          <DepositContent />
        </>
      ),
    },
    {
      label: "Deposit HEWE",
      key: "HEWE",
      children: (
        // profile?.email === "nguyenpierre68@gmail.com" ||
        // profile?.email === "sonyadang72@gmail.com" ? (
        //   isShowTabHewe ? (
        //     <DepositContentHEWE />
        //   ) : (
        //     <div
        //       style={{
        //         display: "flex",
        //         alignItems: "center",
        //         gap: "16px",
        //         flexDirection: "column",
        //         maxWidth: "400px",
        //         margin: "0 auto",
        //       }}
        //     >
        //       <div>You need update address before deposit HEWE</div>
        //       <Button onClick={handleOpenModal}>Update address</Button>
        //     </div>
        //   )
        // ) : (
        //   <div
        //     style={{ textAlign: "center", fontSize: "24px", marginTop: "12px" }}
        //   >
        //     Coming soon
        //   </div>
        // ),
        <>
          <div
            style={{
              display: "flex",
              marginBottom: "10px",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            {renderExtra}
          </div>
          <>
            {isShowTabHewe ? (
              <DepositContentHEWE />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexDirection: "column",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                <div>You need update address before deposit HEWE</div>
                <Button onClick={handleOpenModal}>Update address</Button>
              </div>
            )}
            
          </>
        </>
      ),
    },
    {
      label: "Deposit AMC",
      key: "AMC",
      // children: <DepositContentAMC />,
      children: (
        <>
          <div
            style={{
              display: "flex",
              marginBottom: "10px",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            {renderExtra}
          </div>
          <DepositContentAMC />
        </>
      ),
    },
  ];

  return (
    <div className={`tabContainer`}>
      <Tabs
        items={TAB_ITEMS}
        activeKey={tabKey}
        destroyInactiveTabPane
        defaultActiveKey="USDT"
        onChange={handleChangeTabKey}
        // tabBarExtraContent={renderExtra}
      />

      <Modal
        title="Update your main wallet address to receive commissions"
        isOpen={isOpen}
        onCancel={handleCloseModal}
        onConfirm={handleRequestUpgradeAddress}
        isDisabledBtn={isDisabledBtnUpdate}
      >
        <Input
          value={addressWallet}
          onChange={handleChangeAddressWallet}
          size="large"
        />
      </Modal>
    </div>
  );
};
