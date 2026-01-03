import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-vertical-timeline-component/style.min.css";
import Footer from "./Footer";
import Header from "./Header";
import socket from "../../util/socket";

// img
import Bannerimg from "../../assets/images/banner/banner1.png";
import MerryChristmas from "../../assets/images/banner/merryChristmas.jpg";
import s1 from "../../assets/images/banner/s1.png";
import ring from "../../assets/images/img/rings.png";
import joinbottom from "../../assets/images/join/joinbottom.png";
import joinleft from "../../assets/images/join/joinleft.png";
import joinright from "../../assets/images/join/joinright.png";
import buccetcoin from "../../assets/images/new/bukket_coin.png";
import coin from "../../assets/images/new/coin.png";
import coins from "../../assets/images/new/coins.png";
import card1 from "../../assets/images/newcard/one.png";
import card3 from "../../assets/images/newcard/three.png";
import card2 from "../../assets/images/newcard/two.png";
import Aboutus from "../Aboutus/Aboutus";
import Partners from "../Partner/Partners";
import Journey from "../Roadmapnew/Roadmap";
import TokenomicsHome from "../Tokenomics/Tokenomichome";
import Human from "../human/Human";
import NewSwap from "../NewSwap/NewSwap";
import Statistics from "../statistics/statistics";
import { Copybtn } from "../svg";
import { NewsDataHome } from "../newsData/NewsData";
import { Alert } from "antd";

export default function HomeHeader() {
  const swapRef = useRef(null);
  const scrollToSwap = () => {
    const elementPosition = swapRef.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - 100;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const isLogin =
      !!localStorage.getItem("user") && !!localStorage.getItem("token");

    if (isLogin) {
      setTimeout(() => {
        alert(
          "Notice: Customers who buy HEWE and AMC on this hewe.io page can only use this HEWE and AMC to deposit on the digital bank (DB) on this hewe.io page, THANK YOU!"
        );
      }, 1000);
    }
  }, []);

  return (
    <section className="home-page">
      <Header isUsedOnHomePage={true} onSwapClick={scrollToSwap} />
      <div className="homepage">
        <div className="relative">
          <Banner />
          <Statistics />
          <div ref={swapRef}>
            <NewSwap />
          </div>
          <StartBuying />
          <Aboutus />
          <Journey />
          <TokenomicsHome />
          <Human />
          <Partners />
          {/* <New /> */}
          {/* <New /> */}
          {/* <Join /> */}
          {/* <Faq /> */}
          <Footer />
        </div>
      </div>
    </section>
  );
}

const Banner = () => {
  const history = useHistory();
  const isLogin =
    !!localStorage.getItem("user") && !!localStorage.getItem("token");

  const Login = () => {
    if (!isLogin) {
      history.push("/login");
    } else {
      history.push("/adminDashboard");
    }
  };

  return (
    <div>
      {/* <img src={MerryChristmas} alt="" className="img-fluid bannerimg merry" /> */}
      <section className="banner">
        <div>
          <img src={Bannerimg} alt="" className="img-fluid bannerimg" />
        </div>
        <div className="content-section d-flex items-center">
          <div className="content-section1 d-flex items-center">
            <div className="col-lg-6 col-md-5 handsection"></div>
            <div className="col-lg-6 col-md-7 text-section z-10">
              <div className="relative">
                <h1>HEWE</h1>
              </div>
              <h3 className="mt-2">Health & Wealth</h3>
              <p>
                Health & Wealth (HEWE) challenges AND rewards individuals to
                lead active lives through enjoying the pleasures of walking;
                earning HEWE tokens along the way. Become a part of our global
                HEWE community simply by walking to become a healthier, and
                wealthier you.
              </p>

              {/* <div className="mt-xl-5 mt-3 flex">
                <button
                  onClick={() => {
                    window.open("https://amchain.ameritecps.com/");
                  }}
                >
                  Buy Token
                </button>
              </div> */}
            </div>
          </div>
          <div className="content-section2">{/* <Statistics /> */}</div>
        </div>
        <div>
          <img src={s1} alt="img" className="s1" />
        </div>
      </section>
    </div>
  );
};

const StartBuying = () => {
  let [HEWE_RATE, setHEWE_RATE] = useState(0);
  let [AMC_RATE, setAMC_RATE] = useState(0);

  useEffect(() => {
    socket.on("newPrice", (data) => {
      setAMC_RATE(Number(data.priceAMC));
      setHEWE_RATE(Number(data.priceHEWE));
    });

    return () => {
      socket.off("newPrice");
    };
  }, []);
  return (
    <>
      <section className="start_buying position-relative">
        <div className="d-flex start_buying_cont">
          <div className="start_buying_bodyupper">
            <div className="start_buying_bodyinner">
              <div className="start_buying_body d-lg-flex w-100 align-items-center">
                <div className="col-lg-5">
                  <div className="">
                    <h2>Start Swap</h2>
                    <p>Earn while you walk.</p>
                    <p>Secure transactions with AI.</p>
                    <p>Shop and spend with ease.</p>
                  </div>
                </div>
                <div className="col-lg-7 refside">
                  <div className="inputref">
                    <input
                      type="text"
                      className="w-full border-0"
                      placeholder="0xe8415D460fE26636CC487fE20A5a87849055C952"
                      value="0xe8415D460fE26636CC487fE20A5a87849055C952"
                      disabled="true"
                    />
                    <div
                      className="flex items-center copy"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        var copyText = `0xe8415D460fE26636CC487fE20A5a87849055C952`;

                        // Copy the text inside the text field
                        navigator.clipboard.writeText(copyText);

                        toast.success(`Copied to Clipboard`);
                      }}
                    >
                      <Copybtn className="ms-3" />
                    </div>
                  </div>
                  <div className="">
                    <div>
                      <p className="mb-0">CURRENT PRICE</p>
                      <h3>HEWE {HEWE_RATE}</h3>
                      <h3>AMC {AMC_RATE}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const New = () => {
  return (
    <section className="new relative">
      <div className="headingcont">
        <h2>Updates From the Hewe</h2>
      </div>
      <NewsDataHome />

      <div>
        <img src={ring} alt="" className="rings" />
      </div>
    </section>
  );
};

const Join = () => {
  const history = useHistory();

  return (
    <>
      <section className="join">
        <div className="text-center heading">
          <h2>
            Join the HEWE <span>Ecosystem</span>
          </h2>
          <p>Get started in 3 steps to dive into the world of HEWE.</p>
        </div>

        <div className="d-md-flex flex-wrap d-block justify-center">
          <div className="col-md-6 ">
            <div className="pe-md-3">
              <div className="joincardwrap ">
                <div className="joincard flex align-items-center">
                  <div>
                    <h3>Wallet Description</h3>
                    <p>
                      Introducing our native wallet, ensuring top-tier security
                      for your digital assets. With advanced encryption, your
                      AMC Coin and HEWE stay secure. Seamlessly integrated with
                      platforms like MetaMask, offering smooth access.
                      Experience heightened security and convenience with our
                      wallet.
                    </p>
                    <div className="custom-btn-wrap1 mt-8">
                      <button className="custom-btn">Coming Soon</button>
                    </div>
                  </div>

                  <div>
                    <img src={buccetcoin} alt="" className="absimg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 ">
            <div className="ps-md-3">
              <div className="joincardwrap">
                <div className="joincard flex align-items-center">
                  <div>
                    <h3>HEWE Description</h3>
                    <p>
                      Introducing Hewe: the catalyst for health and wealth
                      revolution. With AmChain blockchain and AI integration,
                      every step yields rewards. Join us in reshaping banking,
                      healthcare, and transactions. Experience limitless
                      possibilities with Hewe.(User can purchase HEWE from this
                      section as well)
                    </p>
                    <div className="custom-btn-wrap1  mt-8">
                      <button
                        className="custom-btn"
                        onClick={() => {
                          history.push("/login");
                        }}
                      >
                        Get HEWE
                      </button>
                    </div>
                  </div>

                  <div>
                    <img src={coin} alt="" className="absimg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="">
              <div className="joincardwrap">
                <div className="joincard2  items-center justify-between">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="joincardwrapcont">
                        <h3>Explorer Description</h3>
                        <p>
                          Introducing Hewe Explorer, your window into the world
                          of blockchain transparency and trust. Our AMC Smart
                          Chain explorer offers real-time insights into all
                          transactions, akin to tracking a package in transit.
                          Powered by decentralized nodes, it ensures
                          fraud-resistant validation, providing a tamper-proof
                          system you can rely on. Experience the power of
                          transparency with Hewe Explorer.{" "}
                        </p>
                        <div
                          className="custom-btn-wrap1 mt-4"
                          onClick={() => {
                            window.open(
                              `https://explorer.amchain.net`,
                              "_blank"
                            );
                          }}
                        >
                          <button className="custom-btn">Go To Explorer</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="h-100">
                        <img
                          src={coins}
                          alt=""
                          className="d-none h-100 w-100 d-lg-block"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <img src={joinleft} alt="" className="joinleft hidden sm:block" />
          <img src={joinright} alt="" className="joinright hidden sm:block" />
          <img src={joinbottom} alt="" className="joinbottom hidden sm:block" />
        </div>
      </section>
    </>
  );
};
