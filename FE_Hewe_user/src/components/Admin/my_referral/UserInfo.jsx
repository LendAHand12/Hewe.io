import { Descriptions } from "antd";
import { useSelector } from "react-redux";

export const UserInfo = () => {
  const { profile } = useSelector((state) => state.userReducer);

  if (!profile) {
    return null;
  }

  return (
    <div>
      <div className="titleContainer">
        <div className="title">User Info</div>
      </div>

      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
        <Descriptions.Item label="Username">{profile?.name}</Descriptions.Item>
        <Descriptions.Item label="USDT">
          {profile?.usdtBalance.toFixed(4)}
        </Descriptions.Item>
        <Descriptions.Item label="HEWE">
          <div>{profile?.heweBalance.toFixed(4)}</div>
        </Descriptions.Item>
        <Descriptions.Item label="HEWE Deposit">
          <div>{profile?.heweDeposit.toFixed(4)}</div>
        </Descriptions.Item>
        <Descriptions.Item label="AMC">
          <div>{profile?.amcBalance.toFixed(4)}</div>
        </Descriptions.Item>
        <Descriptions.Item label="Revenue">
          {profile?.revenue} USDT
        </Descriptions.Item>
        <Descriptions.Item label="Revenue F1">
          {profile?.revenueF1} USDT
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
