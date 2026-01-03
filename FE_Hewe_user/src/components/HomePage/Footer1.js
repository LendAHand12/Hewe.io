import React from "react";
import { useHistory } from "react-router-dom";
import img1 from "../../assets/images/footer/footer.png";
// import { Ftdoc, Ftinsta, Fttelegram, Ftwitter } from "../svg";
import img2 from "../../assets/images/footer/telegram.svg";
import img3 from "../../assets/images/footer/insta.svg";
import img4 from "../../assets/images/footer/x.svg";
import img5 from "../../assets/images/footer/doc.svg";
import "./footer.scss";
import f1 from "../../assets/svg/phool.svg";
export default function Footer1() {
  const history = useHistory();
  return (
    <footer className="text-center relative home-footer">
      <div className="heading">
        <div
          className="d-flex justify-content-center cursor-pointer"
          onClick={() => {
            window.open("https://x.com/heweofficial", "_blank");
          }}
        >
          <div className="btnhead">Join Community</div>
        </div>
      </div>
      <div className="fconts">
        <div>
          <h3>Join Us via</h3>
          <h2>telegram</h2>
          <div className="d-flex justify-content-center">
            <button
              onClick={() => {
                window.open("https://t.me/+7scBuSpxGZg2ZWFl", "_blank");
              }}
            >
              Join via Telegram
            </button>
          </div>
        </div>
        <div className="social-icon flex justify-center mt-5">
          <a href="https://www.instagram.com/heweofficial" target="_blank">
            <img src={img3} alt="" />
          </a>
          <a href="https://twitter.com/heweofficial" target="_blank">
            <img src={img4} alt="" />
          </a>
          <a href="https://t.me/+7scBuSpxGZg2ZWFl" target="_blank">
            <img src={img2} alt="" />
          </a>
          <a href="#" target="_blank">
            <img src={img5} alt="" />
          </a>
        </div>
        <ul className="flex justify-center list-none flex-wrap">
          <li onClick={() => history.push("/term")}>Terms and Conditions</li>
          <li onClick={() => history.push("/privacy")}>Privacy Policy</li>
          <li onClick={() => history.push("/contactus")}>Help & Support</li>
        </ul>
        <div>
          <p className="mb-5">
            Copyright@2024 Health & Wealth. All Rights Reserved
          </p>
        </div>
      </div>
      <div className="f1">
        <img src={f1} alt="img1" />
      </div>
    </footer>
  );
}
