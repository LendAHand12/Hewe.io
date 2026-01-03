import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import arrow from "../../../assets/admin/bluearrow.png";
import copy from "../../../assets/admin/copy.png";
import img1 from "../../../assets/admin/referral.png";
import axios from "../../../axios";
import "./style.scss";
const My_Referral = () => {
  const [responseData, setResponseData] = useState(null);
  const data = JSON.parse(localStorage.getItem("amchain"));
  const referralLinks = data?.referralDetails?.referralLink;
  const [totalReward, setTotalReward] = useState();
  const fetchData = async () => {
    try {
      const response = await axios.get(`/getTransaction?referralLink=${referralLinks}`);
      const totalrewardresponse = await axios.get(`/getTotalReward?referralLink=${referralLinks}`);
      setTotalReward(totalrewardresponse?.data?.data);
      // console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   console.log(responseData?.data);
  //   console.log(totalReward);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLinks);
    setCopySuccess(true);
    toast.success("Copied Successfully");
    setTimeout(() => setCopySuccess(false), 1000);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Invitation to join");
    const body = encodeURIComponent(`Join us using this referral link: ${referralLinks}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  return (
    <div>
      <div className="transdetail">
        <div className="p-5">
          <div className="flex justify-between">
            <div>
              <h4>Total Earned via Referral</h4>
              <div></div>
              <h3>
                ${totalReward?.ReceivedPrice} / HEWE {totalReward?.ReceivedHewePrice}
              </h3>
            </div>
            <div>
              <img src={img1} alt="" />
            </div>
          </div>

          <div className="invitedlink">
            <label htmlFor="">Invite Link</label>

            <div className="flex items-center mt-4">
              <div className="btn2wrap me-5">
                <div className="link">{referralLinks}</div>
              </div>
              <div className="btn2wrap me-5">
                <button className="flex items-center" onClick={copyToClipboard}>
                  Copy Link <img src={copy} className="ms-3" alt="img" />
                </button>
              </div>
              {/* <h3 className="me-5">or</h3> */}
              {/* <div className="btn2wrap me-5">
                <button className="flex items-center" onClick={handleSendEmail}>
                  <img src={email} className="me-3" alt="img" />
                  Invite by email
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="transtablecont">
        <div className="flex justify-between">
          <h5>Your Referral</h5>
          <button className="flex allbtn">
            View All <img src={arrow} alt="" />
          </button>
        </div>

        <table className="w-full bg-white">
          <tr>
            <th>Email</th>
            <th>Referral via</th>
            <th>Invest</th>
            <th>Received $ </th>
            <th>Received HEWE </th>
          </tr>
          {responseData?.data?.map((item, index) => {
            return (
              <>
                <tr>
                  <td>{item?.email}</td>
                  <td>Link</td>
                  <td>${item?.transactionMoney}</td>
                  <td>${item?.rewardPriceReferrer}</td>
                  <td>{item?.hewe}</td>
                </tr>
              </>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default My_Referral;
