import React from "react";
import "./style.scss";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Aboutus = () => {
  const isLogin =
    !!localStorage.getItem("user") && !!localStorage.getItem("token");

  const history = useHistory();

  const Login = () => {
    if (!isLogin) {
      history.push("/login");
    } else {
      history.push("/adminDashboard");
    }
  };
  return (
    <>
      <section className="aboutus mb-5">
        <div className="headingcont">
          <h2>about us</h2>
        </div>
        <div className="d-flex justify-content-center pt-5">
          <p>
            Welcome to the exciting world of decentralized finance and
            blockchain innovation! Here at AmChain and HEWE, we are committed to
            reshaping the way that financial services and technology operate
            within the realm of cryptocurrency. With a strong focus on health,
            security, and accessibility, we are propelling ourselves forward by
            introducing a range of solutions designed to meet the dynamic
            demands of the global digital economy. Join us as we redefine the
            future of finance and technology!
          </p>
        </div>
        {/* <div className="custom-btn d-flex justify-content-center mt-5">
          <button
            onClick={() => {
              window.open("https://amchain.ameritecps.com/");
            }}
          >
            Buy Token
          </button>
        </div> */}
      </section>
    </>
  );
};

export default Aboutus;
