import { Tabs } from "antd";
import "./ChooseTab.scss";
import { WithdrawContent } from "../index.js";
import { useSelector } from "react-redux";
import { IconUSDT } from "../../../IconUSDT/IconUSDT.jsx";
import { formatHewe } from "../../../../util/format.js";
import { IconToken } from "../../../IconToken/IconToken.jsx";

export const ChooseTab = () => {
  const { profile } = useSelector((state) => state?.userReducer);

  const TAB_ITEMS = [
    {
      label: "Withdraw",
      key: "2",
      children: <WithdrawContent />,
    },
  ];

  return (
    <div className={`tabContainer`}>
      <Tabs
        defaultActiveKey="1"
        items={TAB_ITEMS}
        tabBarExtraContent={
          <div className="center-flex-vertical" style={{ fontWeight: 600 }}>
            <span style={{ fontWeight: 700 }}>Balance:</span>{" "}
            {profile?.usdtBalance || 0} <IconToken token="USDT" />
          </div>
        }
      />
    </div>
  );
};
