import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Headerlogo } from "../svg";
import { useAccount, useChainId } from "wagmi";

export default function Header({ isUsedOnHomePage, onSwapClick }) {
  // drawer
  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const closeDrawer = () => setOpen(false);

  const { address } = useAccount();
  const chainId = useChainId();

  const user = localStorage.getItem("user");
  let userObject;

  if (user) {
    userObject = JSON.parse(user);
  } else {
    userObject = {};
  }

  const dispatch = useDispatch();
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({
      type: "USER_LOGOUT",
    });
  };

  const [show, setIsShow] = useState(false);
  const togglebtn = () => {
    setIsShow(!show);
  };

  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className={scrollY > 100 ? "scrollheader" : "mainHeader"}>
        <div className="flex items-center justify-between h-full">
          <div className="basis-1/4 d-flex align-items-center">
            <button className="togglebtn" onClick={() => togglebtn()}>
              <span className="one"></span>
              <span className="two"></span>
              <span className="three"></span>
            </button>
            <div
              className="relative w-fit flex headlogo crp"
              onClick={() => history.push("/")}
            >
              <div>
                <Headerlogo />
              </div>
              <h3 className="ms-3">HEWE</h3>
            </div>
          </div>
          <div className="basis-1/2 h-full nav-section">
            <div className="flex items-center w-full h-full">
              <ul className="flex w-full justify-end mb-0">
                <li onClick={() => history.push("/tokenomics")}>Tokenomics</li>
                <li onClick={() => history.push("/our-team")}>Our Team</li>
                <li onClick={() => history.push("/road-map")}>Road Map</li>
                <li onClick={() => history.push("/news")}>News</li>
                <li
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/1MRS6YVdFaRZzqDt3_mMcGj-sU3C1ACkI/view`,
                      "_blank"
                    );
                  }}
                >
                  Whitepaper
                </li>
                <li
                  onClick={() => {
                    window.open(`http://cryptocard.hewe.io/`, "_blank");
                  }}
                >
                  Hewe Card
                </li>
                <li
                  onClick={() => {
                    if (isUsedOnHomePage) {
                      onSwapClick();
                    } else {
                      history.push("/swapV3");
                    }
                  }}
                >
                  Swap
                </li>
              </ul>
            </div>
          </div>
          <div className="basis-1/4 h-full d-flex align-items-center">
            {!isLogin ? (
              <ul className="d-flex align-items-center mb-0">
                <li className="headerbtn" onClick={() => Login()}>
                  Login
                </li>
                <li
                  className="headerbtn ms-3"
                  onClick={() => history.push("/signup")}
                >
                  Signup
                </li>
              </ul>
            ) : (
              <ul className="d-flex align-items-center mb-0">
                <li
                  className="headerbtn text-capitalize"
                  onClick={() => Login()}
                >
                  {userObject?.data?.name}
                </li>
              </ul>
            )}
          </div>
        </div>
        {show ? (
          <>
            <div className="resposivenav">
              <button className="togglebtn" onClick={() => togglebtn()}>
                <span className="one"></span>
                <span className="two"></span>
              </button>
              <div className="rescont">
                <div
                  className="relative w-fit flex headlogo"
                  onClick={() => history.push("/")}
                >
                  <div>
                    <Headerlogo />
                  </div>
                  <h3 className="ms-3">HEWE</h3>
                </div>
                <ul className="flex justify-content-center flex-col w-full mb-0">
                  <li onClick={() => history.push("/tokenomics")}>
                    Tokenomics
                  </li>
                  <li onClick={() => history.push("/our-team")}>Our Team</li>
                  <li onClick={() => history.push("/road-map")}>Road Map</li>
                  <li onClick={() => history.push("/news")}>News</li>

                  <li
                    onClick={() => {
                      window.open(
                        `https://drive.google.com/file/d/1MRS6YVdFaRZzqDt3_mMcGj-sU3C1ACkI/view`,
                        "_blank"
                      );
                    }}
                  >
                    Whitepaper
                  </li>
                  <li
                    onClick={() => {
                      window.open(`http://cryptocard.hewe.io/`, "_blank");
                    }}
                  >
                    Hewe Card
                  </li>
                  <li
                    onClick={() => {
                      if (isUsedOnHomePage) {
                        onSwapClick();
                      } else {
                        history.push("/swapV3");
                      }
                      togglebtn();
                    }}
                  >
                    Swap
                  </li>
                </ul>

                {!isLogin ? (
                  <div className="pb-5">
                    <div className="headerbtn" onClick={() => Login()}>
                      Login
                    </div>
                    <div
                      className="headerbtn ms-xl-3"
                      onClick={() => history.push("/signup")}
                    >
                      Signup
                    </div>
                  </div>
                ) : (
                  <div
                    className="headerbtn text-capitalize"
                    onClick={() => Login()}
                  >
                    {userObject?.data?.name}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </header>
    </>
  );
}
