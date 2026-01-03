import { Button, Descriptions, InputNumber, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom";
import instance from "../../axios";
import { Modal } from "../../components/AntdComponent";
import { ADMIN_EMAIL } from "../../constants/Statics";
import F1Data from "./F1Data";
import F1List from "./F1List";
import HeweDBData from "./HeweDBData";
import { HistoryOfUser } from "./HistoryOfUser";
import ModalAddress from "./ModalAddress";
import { TreeData } from "./TreeData";
import "./UserDetail.scss";
import { useSearchUserByKeyword } from "./hooks/useSearchUserByKeyword";
import { useSellAmc } from "./hooks/useSellAmc";
import { useSellHewe } from "./hooks/useSellHewe";
import DrawerChangeBranch from "./DrawerChangeBranch";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function UserDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { value, options, onSelect, onChange } = useSearchUserByKeyword();
  const history = useHistory();

  const [openDrawer, setOpenDrawer] = useState(false);

  const location = useLocation();

  const handleGetProfileUser = async () => {
    try {
      const res = await instance.get(`getProfileUserId?userId=${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setProfile(res.data.data);
    } catch (error) {}
  };

  const {
    amountHeweReceive,
    hewePrice,
    handleSellTokenHewe,
    bonus: bonusAMC,
    isDisabledBtn: isDisabledBtnHewe,
    isPendingSell: isPendingSellHewe,
    isOpenModal: isOpenModalHewe,
    handleOpenModal: handleOpenModalHewe,
    handleCloseModal: handleCloseModalHewe,
    handleChangeUsdtInput: handleChangeUsdtInputHewe,
    usdtInput: usdtInputHewe,
  } = useSellHewe(id, handleGetProfileUser);

  const {
    amountAmcReceive,
    amcPrice,
    handleSellTokenAmc,
    bonus: bonusHewe,
    isDisabledBtn: isDisabledBtnAmc,
    isPendingSell: isPendingSellAmc,
    isOpenModal: isOpenModalAmc,
    handleOpenModal: handleOpenModalAmc,
    handleCloseModal: handleCloseModalAmc,
    handleChangeUsdtInput: handleChangeUsdtInputAmc,
    usdtInput: usdtInputAmc,
  } = useSellAmc(id, handleGetProfileUser);

  const hdGetAddress = async () => {
    if (localStorage.getItem("email") !== ADMIN_EMAIL) return;

    try {
      const res = await instance.post(
        "extractKey",
        {
          userId: id,
          type: "USDT.BEP20",
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setModalData(res.data);
      setOpen(true);
    } catch (error) {
      console.log(error);
      message.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleGetProfileUser();
  }, [location.pathname]);

  return (
    <div className="UserDetailPage" key={location.pathname}>
      <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <Link to="/adminPanel/user-management">
            <div style={{ textDecoration: "underline" }}>Back</div>
          </Link>

          <Button onClick={() => setOpenDrawer(true)}>
            Đổi người giới thiệu
          </Button>
        </div>

        {profile && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Email">
              <b>{profile.userData.email}</b>
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              <b>{profile.userData.name}</b>
            </Descriptions.Item>
            <Descriptions.Item label="References">
              {profile?.parentData ? (
                <u
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history.push(
                      "/adminPanel/user-management/" + profile?.parentData._id
                    );
                    window.location.reload();
                  }}
                >
                  {profile?.parentData.email}
                </u>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="USDT">
              {profile.userData.usdtBalance?.toFixed(4)}
            </Descriptions.Item>
            <Descriptions.Item label="HEWE">
              <div>
                {profile.userData.heweBalance?.toFixed(4)}
                <Button
                  style={{ marginLeft: "8px" }}
                  onClick={handleOpenModalHewe}
                >
                  Sell HEWE
                </Button>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="HEWE Deposit">
              <div>{profile.userData.heweDeposit?.toFixed(4)}</div>
            </Descriptions.Item>
            <Descriptions.Item label="AMC">
              <div>
                {profile.userData.amcBalance?.toFixed(4)}
                <Button
                  style={{ marginLeft: "8px" }}
                  onClick={handleOpenModalAmc}
                >
                  Sell AMC
                </Button>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Revenue">
              {profile.userData.revenue}
            </Descriptions.Item>
            <Descriptions.Item label="Revenue F1">
              {profile.userData.revenueF1}
            </Descriptions.Item>
            {localStorage.getItem("email") === ADMIN_EMAIL ? (
              <Descriptions.Item label="Wallet address">
                <Button onClick={() => hdGetAddress()}>Show</Button>
              </Descriptions.Item>
            ) : null}
          </Descriptions>
        )}

        {profile && <F1List listDataF1={profile.f1ArrayData} />}

        {/* lịch sử hewedb của bản thân user */}
        <HeweDBData
          userId={id}
          // key={location.pathname + Math.random()}
          userEmail={profile?.userData?.email}
        />

        {/* lịch sử hewedb của F1 của user */}
        <F1Data
          userId={id}
          // key={location.pathname + Math.random()}
          userEmail={profile?.userData?.email}
        />

        <HistoryOfUser userId={id} />

        <div>
          <h4 style={{ marginBottom: "16px" }}>System</h4>
          <TreeData userId={id} />
        </div>
      </div>

      <Modal
        isDisabledBtn={isDisabledBtnHewe}
        isOpen={isOpenModalHewe}
        onCancel={handleCloseModalHewe}
        onConfirm={handleSellTokenHewe}
        confirmLoading={isPendingSellHewe}
        title="Sell HEWE"
      >
        <div className="modalSellToken">
          <div className="formItem">
            <div className="label">Amount USDT</div>
            <InputNumber
              style={{ width: "100%" }}
              value={usdtInputHewe}
              onChange={handleChangeUsdtInputHewe}
            />
          </div>

          <div className="result">
            <div>Amount HEWE</div>
            <div>{amountHeweReceive?.toFixed(2)}</div>
          </div>

          <div className="result">
            <div>Price</div>
            <div>{hewePrice}</div>
          </div>

          <div className="result">
            <div>Bonus AMC</div>
            <div>{bonusAMC?.toFixed(2)}</div>
          </div>
        </div>
      </Modal>

      <Modal
        isDisabledBtn={isDisabledBtnAmc}
        isOpen={isOpenModalAmc}
        onCancel={handleCloseModalAmc}
        onConfirm={handleSellTokenAmc}
        confirmLoading={isPendingSellAmc}
        title="Sell AMC"
      >
        <div className="modalSellToken">
          <div className="formItem">
            <div className="label">Amount USDT</div>
            <InputNumber
              style={{ width: "100%" }}
              value={usdtInputAmc}
              onChange={handleChangeUsdtInputAmc}
            />
          </div>

          <div className="result">
            <div>Amount AMC</div>
            <div>{amountAmcReceive?.toFixed(2)}</div>
          </div>

          <div className="result">
            <div>Price</div>
            <div>{amcPrice}</div>
          </div>

          <div className="result">
            <div>Bonus HEWE</div>
            <div>{bonusHewe?.toFixed(2)}</div>
          </div>
        </div>
      </Modal>

      <ModalAddress {...{ open, setOpen, modalData, setModalData }} />

      <DrawerChangeBranch {...{ openDrawer, setOpenDrawer, id, profile }} />
    </div>
  );
}
