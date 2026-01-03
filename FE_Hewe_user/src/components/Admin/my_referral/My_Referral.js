import React, { useEffect, useState } from "react";
import img1 from "../../../assets/admin/MyReferral.svg";
import { axiosService } from "../../../util/service";
import { HistoryCommission } from "../../CommissionPage/components/HistoryCommission/HistoryCommission";
import "./style.scss";

import { Copy, Envelope } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { UserInfo } from "./UserInfo";
const My_Referral = () => {
  const [responseData, setResponseData] = useState(null);
  const data = JSON.parse(localStorage.getItem("user"));
  const referralLinks = data?.referralDetails?.referralLink;
  const referralCode = data?.referralDetails?.referralCode;
  const [totalReward, setTotalReward] = useState();
  const fetchData = async () => {
    try {
      const response = await axiosService.get(`/getTransaction?referralCode=${referralCode}`);
      const totalrewardresponse = await axiosService.get(`/getTotalReward?referralCode=${referralCode}`);
      setTotalReward(totalrewardresponse?.data?.data);
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(responseData?.data);
  console.log(totalReward);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLinks);
    setCopySuccess(true);
    toast.success("Copied Successfully");
    setTimeout(() => setCopySuccess(false), 1000);
  };
  const copyToClipboardCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopySuccess(true);
    toast.success("Copied Successfully");
    setTimeout(() => setCopySuccess(false), 1000);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Invitation to join");
    const body = encodeURIComponent(`Join us using this referral link: ${referralLinks}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSendEmailCode = () => {
    const subject = encodeURIComponent("Invitation to join");
    const body = encodeURIComponent(`Join us using this referral link: ${referralCode}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  return (
    <div className="transdetailcont">
      <div className="transdetail row">
        <div className="col-md-8" style={{ alignSelf: "start" }}>
          <div className="transdecont">
            <div className="d-flex align-items-center justify-between">
              <div>
                <h4>Total Earned via Referral</h4>
                <h3>
                  ${totalReward?.ReceivedPrice ? totalReward.ReceivedPrice.toFixed(2) : "0.00"} / HEWE{" "}
                  {totalReward?.ReceivedHewePrice ? totalReward.ReceivedHewePrice : ""}
                </h3>
              </div>
            </div>

            <div className="invitedlink">
              <label htmlFor="">Invite Link</label>

              <div className="flex items-center flex-wrap mt-2">
                <div className="btn2wrap me-3 my-2">
                  <div className="link">
                    {referralLinks}
                    <Copy size={32} className="prcolor ms-3" weight="fill" onClick={copyToClipboard} />
                  </div>
                </div>

                {/* <h3 className="me-3 my-2">or</h3>
                <div className="btn1wrap my-2 me-3">
                  <button
                    className="flex items-center"
                    onClick={handleSendEmail}
                  >
                    <Envelope
                      size={32}
                      weight="fill"
                      className="me-3 prcolor"
                    />
                    Invite by email
                  </button>
                </div> */}
              </div>
            </div>

            {/* <div className="invitedlink mt-3">
              <label htmlFor="">Referral Code</label>

              <div className="flex items-center flex-wrap mt-2">
                <div className="btn2wrap me-3 my-2">
                  <div className="link">
                    {referralCode}{" "}
                    <Copy size={32} className="prcolor ms-3" weight="fill" onClick={copyToClipboardCode} />
                  </div>
                </div>

                <h3 className="me-3 my-2">or</h3>
                <div className="btn1wrap my-2 me-3">
                  <button className="flex items-center" onClick={handleSendEmailCode}>
                    <Envelope size={32} weight="fill" className="me-3 prcolor" />
                    Invite by email
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="col-md-4">
          <img src={img1} alt="img" className="img-fluid" style={{ borderRadius: 25 }} />
        </div>
      </div>

      <div
        style={{
          marginTop: 50,
          color: "#fff",
          borderRadius: "6px",
        }}
      >
        <UserInfo />
      </div>

      <div style={{ marginTop: 50, paddingBottom: 120 }}>
        <HistoryCommission />
      </div>
    </div>
  );
};

export default My_Referral;
