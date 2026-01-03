import { CopySimple } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import DashbaordData from "../dashboard/dashbaord";
import HeaderAdmin from "../header/header";
import Sidenav from "../Sidenav/sidenav";
import "../style/style.scss";
import { Button, Input, Modal } from "antd";
import { axiosService } from "../../../util/service";
import { showAlert } from "../../../function/showAlert";
import { useProfile } from "../../../hooks";

const DashBoardPage = () => {
  const data = JSON.parse(localStorage.getItem("user"));
  const username = data?.data?.name;
  const { profile } = useSelector((state) => state.userReducer);
  const { handleGetProfile } = useProfile();

  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      toast.error("please login first");
      history.push("/");
    }

    handleGetProfile();
  }, []);

  const [copySuccess, setCopySuccess] = useState(false);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const copyref = (e) => {
    navigator.clipboard.writeText(e);
    setCopySuccess(true);
    toast.success("Copied Successfully");
  };

  const handleConfirmChange = async (value) => {
    try {
      let res = await axiosService.post("updateWalletAddressUser", {
        address: value,
      });
      showAlert("success", "Wallet address updated successfully");
      setOpen(false);
      handleGetProfile();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  return (
    <>
      <div className="dashboards">
        <div className="d-flex row">
          <div className="col-xl-3 h-100">
            <Sidenav />
          </div>
          <div className="col-xl-9 position-relative">
            <HeaderAdmin />
            <div className="row adminboardcontt">
              <div className="col-xl-8 h-100 p-2">
                <DashbaordData />
              </div>
              <div className="col-xl-4 pt-2 ps-2 pe-4 h-100  border-1">
                {/* <div className="d-xl-block  align-items-center referalcont  p-2">
                  <div className="mb-2">
                    <h3>Quick Referral</h3>
                    <p className="mb-0">Referral Code</p>
                  </div>
                  <div className="d-xl-block d-flex">
                    <div className="codehere">
                      <p className="py-2 mb-0">
                        {data?.referralDetails?.referralCode}
                      </p>
                      <button
                        className="copybtn"
                        onClick={() =>
                          copyref(data?.referralDetails?.referralCode)
                        }
                      >
                        <CopySimple size={20} weight="fill" /> Copy
                      </button>
                    </div>
                  </div>
                </div> */}

                <div
                  className=" d-xl-block  align-items-center referalcont  p-2"
                  style={{ marginTop: "16px" }}
                >
                  <div className="mb-2">
                    <h4>Wallet address</h4>
                    <p
                      className="mt-3"
                      style={{ color: "#fff", wordBreak: "break-all" }}
                    >
                      {profile?.walletAddress
                        ? profile?.walletAddress
                        : "Not updated"}
                    </p>

                    <p className="" style={{ color: "#fff" }}>
                      {profile?.walletAddress && profile?.timeWalletAddress ? (
                        <span>
                          Updated at:{" "}
                          {new Date(
                            profile?.timeWalletAddress
                          ).toLocaleString()}
                        </span>
                      ) : (
                        <></>
                      )}
                    </p>

                    <Button
                      size="large"
                      onClick={() => {
                        setInput(profile?.walletAddress);
                        setOpen(true);
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => handleConfirmChange(input)}
          title="Update your main wallet address"
          centered
          destroyOnClose
          okButtonProps={{
            size: "large",
            style: { color: "black", fontWeight: 600 },
          }}
          cancelButtonProps={{ size: "large" }}
          okText="Confirm"
          cancelText="Cancel"
          maskClosable={false}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            size="large"
          />
        </Modal>
      </div>
    </>
  );
};

export default DashBoardPage;
