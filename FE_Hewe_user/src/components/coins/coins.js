import React, { useState } from "react";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import "./style.scss";
import { Copy } from "@phosphor-icons/react";
import { toast } from "react-toastify";

const HowToBuy = () => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyhash = (e) => {
    navigator.clipboard.writeText(e);
    setCopySuccess(true);
    toast.success("Copied Successfully");
  };
  const copylink = (e) => {
    navigator.clipboard.writeText(e);
    setCopySuccess(true);
    toast.success("Copied Successfully");
  };
  return (
    <>
      <Header />
      <section className="coins">
        <div className="coinsbanner">
          <dic className="row align-items-center justify-content-center h-100">
            <div className="col-md-6">
              <div className="contentside">
                <h2>
                  The Synergy of AI and Blockchain: HEWE Coin <br /> Your
                  Pathway to Success!
                </h2>
                <h5>
                  Presale Round 1: Limited time offer to get HEWE before the
                  price goes up!
                </h5>
                {/* <p>AM CHAIN coin Pre-sale is ON and will end soon!!</p> */}
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/qcXXojSqPgQ?si=iCrBReqhfOF2XrFk"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </dic>
        </div>

        <div className="minimumsection">
          <div className="headings text-center">
            <h4>How to swap HEWE Token</h4>
          </div>
          <div className="cardcont">
            <div className="row">
              {/* step 1 */}
              <div className="col-xl-4 col-sm-6">
                <div className="cardsection">
                  <div className="cr">
                    <div className="mostouter">
                      <div className="outer">
                        <div className="middle">
                          <div className="inner">
                            <h3>01</h3>
                            <p>Step</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="leftcr">
                        <div className="innercr"></div>
                      </div>
                      <div className="rightcr">
                        <div className="innercr"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm-center text-section">
                    <h3 className="py-3">Set Up Your Wallet</h3>

                    <p className="text-white">
                      To begin with, ensure that you have MetaMask installed on
                      your browser before proceeding. If you haven't already,
                      create a MetaMask wallet. You can download a browser
                      extension or install mobile app for MetaMask.
                    </p>
                  </div>
                </div>
              </div>

              {/* step 2 */}
              <div className="col-xl-4 col-sm-6">
                <div className="cardsection">
                  <div className="cr">
                    <div className="mostouter crtwo">
                      <div className="outer">
                        <div className="middle">
                          <div className="inner innertwo">
                            <h3>02</h3>
                            <p>Step</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="leftcr leftcr2">
                        <div className="innercr"></div>
                      </div>
                      <div className="rightcr leftcr2">
                        <div className="innercr"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm-center text-section">
                    <h3 className="py-3">Connect to AmChain</h3>

                    <p className="text-white">
                      Once you have your MetaMask wallet ready, Click on the
                      network selection on top, (current network name should be
                      Ethereum). Click on “Add Network” on the bottom.
                    </p>
                  </div>
                </div>
              </div>

              {/* step 3 */}
              <div className="col-xl-4 col-sm-6">
                <div className="cardsection">
                  <div className="cr">
                    <div className="mostouter crthree">
                      <div className="outer">
                        <div className="middle">
                          <div className="inner innerthree">
                            <h3>03</h3>
                            <p>Step</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="leftcr leftcr3">
                        <div className="innercr"></div>
                      </div>
                      <div className="rightcr rightcr3">
                        <div className="innercr"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm-center text-section">
                    <h3 className="py-3">Enter the Details</h3>
                    <p className="text-white">
                      Choose "Custom Networks" and enter the AmChain network
                      details:
                      <div className="">
                        <strong>Network Name:</strong> AmChain <br />
                        <strong> RPC URL: </strong>
                        <div className="mb-0 linkk">
                          https://node1.amchain.net/{" "}
                          <button
                            onClick={() =>
                              copylink("https://node1.amchain.net/")
                            }
                            className="border-0 copybtn text-black ms-3"
                          >
                            <Copy size={22} />
                          </button>
                        </div>
                        <strong>Chain ID:</strong> 999999 <br />
                        <strong>Symbol:</strong> AMC <br />
                        <strong>Block Explorer URL: </strong>
                        <a href="https://explorer.amchain.net/" target="_blank">
                          https://explorer.amchain.net/
                        </a>{" "}
                      </div>
                      and Click on Add Button
                    </p>
                  </div>
                </div>
              </div>

              {/* step 4 */}
              <div className="col-xl-4 col-sm-6">
                <div className="cardsection">
                  <div className="cr">
                    <div className="mostouter crfour">
                      <div className="outer">
                        <div className="middle">
                          <div className="inner innerfour">
                            <h3>04</h3>
                            <p>Step</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="leftcr leftcr4">
                        <div className="innercr"></div>
                      </div>
                      <div className="rightcr rightcr4">
                        <div className="innercr"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm-center text-section">
                    <h3 className="py-3">Import HEWE to AmChain Network</h3>
                    <p className="text-white">
                      Click on the "Import Token" button. Enter the contract
                      address of the HEWE token. and follow the prompts to
                      import the HEWE token into your MetaMask wallet on the
                      AmChain network.
                    </p>
                    <p className="mb-0">
                      <strong>Contract Address</strong>
                    </p>
                    <p className="addres d-flex align-items-center justify-content-center">
                      0xe8415D460fE26636CC487fE20A5a87849055C952{" "}
                      <div>
                        <button
                          onClick={() =>
                            copyhash(
                              "0xe8415D460fE26636CC487fE20A5a87849055C952"
                            )
                          }
                          className="border-0 copybtn text-black ms-3"
                        >
                          <Copy size={22} />
                        </button>
                      </div>
                    </p>
                  </div>
                </div>
              </div>

              {/* step 5 */}
              <div className="col-xl-4 col-sm-6">
                <div className="cardsection">
                  <div className="cr">
                    <div className="mostouter crfive">
                      <div className="outer">
                        <div className="middle">
                          <div className="inner innerfive">
                            <h3>05</h3>
                            <p>Step</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="leftcr leftcr5">
                        <div className="innercr"></div>
                      </div>
                      <div className="rightcr rightcr5">
                        <div className="innercr"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm-center text-section">
                    <h3 className="py-3">Secure Your Crypto</h3>

                    <p className="text-white">
                      Switch to BNB Smart chain and Import USDT. If you already
                      have USDT in another wallet or exchange, you can transfer
                      it to your MetaMask wallet with a little BNB for
                      transaction fee or, you can buy BEP20-
                      <strong>USDT</strong> from{" "}
                      <a
                        href="https://onramp.money/"
                        target="_blank"
                        className="bold"
                      >
                        Onramp
                      </a>{" "}
                      or{" "}
                      <a
                        href="https://www.moonpay.com/en-gb"
                        target="_blank"
                        className="bold"
                      >
                        MoonPay
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* step 6 */}
              <div className="col-xl-4 col-sm-6">
                <div className="cardsection">
                  <div className="cr">
                    <div className="mostouter crsix">
                      <div className="outer">
                        <div className="middle">
                          <div className="inner innersix">
                            <h3>06</h3>
                            <p>Step</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="leftcr leftcr6">
                        <div className="innercr"></div>
                      </div>
                      <div className="rightcr leftcr6">
                        <div className="innercr"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm-center text-section">
                    <h3 className="py-3">Get BNB for Gas Fees</h3>

                    <p className="text-white">
                      Get BNB for Gas Fees, Ensure you have a small amount of
                      BNB (Binance Coin) in your MetaMask wallet to cover
                      transaction fees (gas costs).
                    </p>
                  </div>
                </div>
              </div>

              {/* step 7 */}
              {/* <div className="col-xl-4 col-sm-6">
                <div className="cardsection">
                  <div className="cr">
                    <div className="mostouter crthree">
                      <div className="outer">
                        <div className="middle">
                          <div className="inner">
                            <h3>07</h3>
                            <p>Step</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="leftcr leftcr3">
                        <div className="innercr"></div>
                      </div>
                      <div className="rightcr rightcr3">
                        <div className="innercr"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm-center text-section">
                    <h3 className="py-3">Lorem, ipsum dolor.</h3>
                    <p className="text-white">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Fugiat inventore quam, labore distinctio repellat
                      voluptatem iusto, aliquam quis commodi similique,
                      aspernatur eligendi!
                    </p>
                  </div>
                </div>
              </div> */}

              {/* step 8 */}
              {/*
               */}
            </div>
          </div>
          <div className="mt-5 text-white text-center heading">
            <h4 className="pt-4">
              BUY & Empower your journey with HEWE tokens on AmChain.
            </h4>
            <p>
              Once you successfully acquired <strong>HEWE</strong> tokens
              secured by AmChain, you can now use your tokens for various
              purposes within the <strong>HEWE</strong> ecosystem or hold them
              for potential future value appreciation.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default HowToBuy;
