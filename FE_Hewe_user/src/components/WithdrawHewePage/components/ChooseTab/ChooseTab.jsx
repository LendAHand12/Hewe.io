import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { roundDisplay } from "../../../../function/round.js";
import { WithdrawContent } from "../index.js";
import { WithdrawContentAMC } from "../WithdrawContent/WithdrawContentAMC.jsx";
import "./ChooseTab.scss";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.js";

export const ChooseTab = () => {
  const { profile } = useSelector((state) => state?.userReducer);
  const { search } = useLocation();
  const queryKey = new URLSearchParams(search).get("token") || "hewe";
  const [activeTab, setActiveTab] = useState(queryKey.toUpperCase());
  const history = useHistory();

  useEffect(() => {
    setActiveTab(queryKey.toUpperCase());
  }, [queryKey]);

  const TAB_ITEMS = [
    // {
    //   label: "Withdraw HEWE",
    //   key: "HEWE",
    //   children: <WithdrawContent />, // rút HEWE
    // },
    // {
    //   label: "Withdraw AMC",
    //   key: "AMC",
    //   children: <WithdrawContentAMC />, // rút AMC
    // },
  ];

  const renderExtraContent = () => {
    if (window.innerWidth <= 768) return null;

    if (activeTab == "1") {
      return (
        <div className="center-flex-vertical" style={{ fontWeight: 600 }}>
          <span style={{ fontWeight: 700 }}></span> {roundDisplay(profile?.heweBalance || 0)} HEWE
        </div>
      );
    } else if (activeTab == "2") {
      return (
        <div className="center-flex-vertical" style={{ fontWeight: 600 }}>
          <span style={{ fontWeight: 700 }}></span> {roundDisplay(profile?.amcBalance || 0)} AMC
        </div>
      );
    }
  };

  return (
    <div className={`tabContainer`}>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          history.push(`withdrawToken?token=${key}`);
        }}
        items={TAB_ITEMS}
        tabBarExtraContent={renderExtraContent()}
      />
    </div>
  );
};
