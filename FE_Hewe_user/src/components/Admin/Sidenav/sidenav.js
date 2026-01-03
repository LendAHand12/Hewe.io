import { Bank, Coins, HandCoins, House, List, SignOut, Swap, Wallet, X } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import logo from "../../../assets/admin/logo.svg";
import relogo from "../../../assets/admin/reslogo.svg";
import "./sidenav.scss";

const Sidenav = () => {
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/");
    toast.success("logout successfully");
  };
  const location = useLocation();
  const [toggle, setToggle] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    setToggle(!toggle);
  };

  const isActive = (path) => {
    return location.pathname + location.search === path ? "active" : "";
  };

  const [show, setShow] = useState(true);
  const handleopen = () => {
    setShow(!show);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        setShow(false);
      } else {
        setShow(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <button onClick={() => handleopen()} className="d-xl-none d-block tooglebtn1 ">
        <List size={32} />
      </button>
      {show && (
        <>
          <div className="sidenav">
            <div>
              <button onClick={() => handleopen()} className="d-xl-none d-block tooglebtnx">
                <X size={32} />
              </button>
              <div className="text-center d-xl-block d-none py-5 crp">
                <img src={logo} alt="img" />
              </div>
              <div className=" ps-2 d-xl-none d-block py-3 crp">
                <img src={relogo} alt="img" />
              </div>
              <div className="mgside">
                <ul>
                  <li className={isActive("/adminDashboard")} onClick={() => history.push("/adminDashboard")}>
                    <div className="iconcont">
                      <House size={32} />
                    </div>
                    Dashboard
                  </li>

                  {/* <li className={isActive("/swapHewe")} onClick={() => history.push("/swapHewe")}>
                    <div className="iconcont">
                      <Swap size={32} />
                    </div>
                    Swap Token
                  </li> */}
                  {/* bỏ ngoài này, đưa vô trong collapsedContainer */}

                  <li className={isActive("/hewedb")} onClick={() => history.push("/hewedb")}>
                    <div className="iconcont">
                      <Swap size={32} />
                    </div>
                    HEWE DB
                  </li>

                  <li className={isActive("/commission")} onClick={() => history.push("/commission")}>
                    <div className="iconcont">
                      <HandCoins size={32} />
                    </div>
                    Commission
                  </li>

                  <div className={`dropdownMenuCustom ${toggle ? "opened" : ""}`}>
                    <li className="buttonInside" onClick={handleToggle}>
                      <div className="iconcont">
                        <Wallet size={32} />
                      </div>
                      Hewe Wallet <i className="iconInside fa-solid fa-caret-down"></i>
                    </li>

                    <div className="collapsedContainer">
                      <li className={isActive("/swapHewe")} onClick={() => history.push("/swapHewe")}>
                        <div className="iconcont">
                          <Swap size={32} />
                        </div>
                        Swap Token
                      </li>

                      <li
                        className={isActive("/depositUSDT?token=usdt")}
                        onClick={() => history.push("/depositUSDT?token=usdt")}
                      >
                        <div className="iconcont">
                          <Bank size={32} />
                        </div>
                        Deposit USDT
                      </li>
                      <li
                        className={isActive("/depositUSDT?token=usdt")}
                        onClick={() => history.push("/depositUSDT?token=hewe")}
                      >
                        <div className="iconcont">
                          <Bank size={32} />
                        </div>
                        Deposit HEWE
                      </li>
                      <li
                        className={isActive("/depositUSDT?token=amc")}
                        onClick={() => history.push("/depositUSDT?token=amc")}
                      >
                        <div className="iconcont">
                          <Bank size={32} />
                        </div>
                        Deposit AMC
                      </li>
                      <li className={isActive("/withdrawUSDT")} onClick={() => history.push("/withdrawUSDT")}>
                        <div className="iconcont">
                          <Bank size={32} />
                        </div>
                        Withdraw USDT
                      </li>
                      {/* <li
                        className={isActive("/withdrawToken?token=hewe")}
                        onClick={() =>
                          history.push("/withdrawToken?token=hewe")
                        }
                      >
                        <div className="iconcont">
                          <Coins size={32} />
                        </div>
                        Withdraw HEWE
                      </li>*/}
                      {/* <li
                        className={isActive("/withdrawToken?token=amc")}
                        onClick={() => history.push("/withdrawToken?token=amc")}
                      >
                        <div className="iconcont">
                          <Coins size={32} />
                        </div>
                        Withdraw AMC
                      </li> */}
                      {/* đang ẩn phần rút AMC. mở lại thì mở sidenav, chooseTab và component WithdrawContentAMC */}
                      {/* Đã ẩn ngày 30/8/2024 */}
                    </div>
                  </div>
                </ul>
              </div>
            </div>
            <div>
              <ul>
                <li onClick={() => logout()}>
                  <div className="iconcont">
                    <SignOut size={32} />
                  </div>
                  Log out
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidenav;
