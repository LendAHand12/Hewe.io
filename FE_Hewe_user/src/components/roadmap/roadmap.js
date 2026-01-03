import React from "react";
import "./style.scss";
import Header from "../HomePage/Header";
import Roadicon from "../../assets/admin/roadicon.png";
import Footer from "../HomePage/Footer";
const Roadmap = () => {
  return (
    <>
      <Header />
      <section className="road">
        <h2>
          <span>Road</span> to
        </h2>
        <h2 className="amchain">AMCHAIN</h2>
        <div className="d-flex justify-content-center">
          <img src={Roadicon} alt="" className="roadicon" />
        </div>
        <div className="d-sm-flex d-none justify-content-center w-100">
          <div className="roadcont">
            <div className="d-flex">
              <div className="left-side mt-5">
                <div className="d-flex">
                  <div className="left d-flex text-right">
                    <div className="text-end pe-3">
                      <h4>April 2020</h4>
                      <h3>
                        Research <br /> Commencement:
                      </h3>
                      <p>
                        Our journey began with extensive research into
                        developing our blockchain network, setting the stage for
                        innovation.
                      </p>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="round"></div>
                        <div className="line"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="left d-flex text-right">
                    <div className="text-end pe-3">
                      <h4>December 2023</h4>
                      <h3>AmChain Completion:</h3>
                      <p>
                        After years of dedicated effort and refinement, we
                        achieved a significant milestone - the completion of our
                        groundbreaking blockchain network, AmChain.
                      </p>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="round"></div>
                        <div className="line"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="left d-flex text-right">
                    <div className="text-end pe-3">
                      <h4>April 2024</h4>
                      <h3>First Presales:</h3>
                      <p>
                        Building on the excitement of our launch, we initiated
                        our first presales, inviting early supporters to join us
                        on our journey.
                      </p>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="round"></div>
                        <div className="line"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="left d-flex text-right">
                    <div className="text-end pe-3">
                      <h4>May 2024</h4>
                      <h3>Exchange Listing:</h3>
                      <p>
                        We listed HEWE on exchanges, enhancing accessibility and
                        liquidity for our growing community.
                      </p>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="round"></div>
                        <div className="line"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="left d-flex text-right">
                    <div className="text-end pe-3">
                      <h4>July 2024</h4>
                      <h3>Visa and Master Crypto Card Launch:</h3>
                      <p>
                        In a significant move towards mainstream adoption, we
                        launched our Visa and Master Crypto Card, enabling
                        seamless integration of digital assets into everyday
                        transactions.
                      </p>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="round"></div>
                        <div className="line"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="left d-flex text-right">
                    <div className="text-end pe-3">
                      <h4>August 2024</h4>
                      <h3>Event in Dubai:</h3>
                      <p>
                        Continuing our global expansion, we hosted an event in
                        Dubai, showcasing our vision and engaging with
                        stakeholders in the region.
                      </p>
                    </div>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="round"></div>
                        <div className="line"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* left side end */}
              <div className="center-line">
                <div className="dot"></div>
                <div className="lines"></div>
                <div className="line"></div>
                <div className="dot"></div>
              </div>

              {/* right side */}
              <div className="rightside">
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>February 2021</h4>
                      <h3>Development Initiation:</h3>
                      <p>
                        With a solid foundation established, we commenced
                        development, laying the groundwork for our vision to
                        come to fruition.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>March 2024</h4>
                      <h3>Official Launch:</h3>
                      <p>
                        A monumental moment as we unveiled AmChain to the world,
                        accompanied by the introduction of our native token,
                        HEWE, ushering in a new era of decentralized
                        possibilities.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>May 2024</h4>
                      <h3>Second Presales:</h3>
                      <p>
                        Continuing to expand our community, we launched our
                        second round of presales, offering more individuals the
                        opportunity to participate in our ecosystem.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>June 2024</h4>
                      <h3>Event in India:</h3>
                      <p>
                        As part of our global outreach, we hosted an event in
                        India, fostering partnerships and expanding our presence
                        in key markets.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>August 2024</h4>
                      <h3>Native Wallet Launch:</h3>
                      <p>
                        We introduced our native wallet, offering enhanced
                        security and usability for managing digital assets
                        within the AmChain ecosystem.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>February 2025 </h4>
                      <h3>HEWE Walking App Launch:</h3>
                      <p>
                        Closing out the year with a major milestone, we launched
                        the HEWE Walking App, revolutionizing the way users earn
                        and interact with HEWE tokens through physical activity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* for mobile responsive */}

        <div className="d-sm-none d-block justify-content-center w-100">
          <div className="roadcont">
            <div className="d-flex">
              <div className="center-line">
                <div className="dot"></div>
                <div className="lines"></div>
                <div className="line"></div>
                <div className="dot"></div>
              </div>

              <div className="rightside">
                <div className="d-flex">
                  <div className="right d-flex text-right">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>April 2020</h4>
                      <h3>
                        Research <br /> Commencement:
                      </h3>
                      <p>
                        Our journey began with extensive research into
                        developing our blockchain network, setting the stage for
                        innovation.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>February 2021</h4>
                      <h3>Development Initiation:</h3>
                      <p>
                        With a solid foundation established, we commenced
                        development, laying the groundwork for our vision to
                        come to fruition.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-right">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>December 2023</h4>
                      <h3>AmChain Completion:</h3>
                      <p>
                        After years of dedicated effort and refinement, we
                        achieved a significant milestone - the completion of our
                        groundbreaking blockchain network, AmChain.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>March 2024</h4>
                      <h3>Official Launch:</h3>
                      <p>
                        A monumental moment as we unveiled AmChain to the world,
                        accompanied by the introduction of our native token,
                        HEWE, ushering in a new era of decentralized
                        possibilities.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-right">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>April 2024</h4>
                      <h3>First Presales:</h3>
                      <p>
                        Building on the excitement of our launch, we initiated
                        our first presales, inviting early supporters to join us
                        on our journey.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>May 2024</h4>
                      <h3>Second Presales:</h3>
                      <p>
                        Continuing to expand our community, we launched our
                        second round of presales, offering more individuals the
                        opportunity to participate in our ecosystem.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="right d-flex text-right">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>May 2024</h4>
                      <h3>Exchange Listing:</h3>
                      <p>
                        We listed HEWE on exchanges, enhancing accessibility and
                        liquidity for our growing community.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>June 2024</h4>
                      <h3>Event in India:</h3>
                      <p>
                        As part of our global outreach, we hosted an event in
                        India, fostering partnerships and expanding our presence
                        in key markets.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="right d-flex text-right">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>August 2024</h4>
                      <h3>Native Wallet Launch:</h3>
                      <p>
                        We introduced our native wallet, offering enhanced
                        security and usability for managing digital assets
                        within the AmChain ecosystem.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>August 2024</h4>
                      <h3>Event in Dubai:</h3>
                      <p>
                        Continuing our global expansion, we hosted an event in
                        Dubai, showcasing our vision and engaging with
                        stakeholders in the region.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="right d-flex text-right">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>September 2024</h4>
                      <h3>Visa and Master Crypto Card Launch:</h3>
                      <p>
                        In a significant move towards mainstream adoption, we
                        launched our Visa and Master Crypto Card, enabling
                        seamless integration of digital assets into everyday
                        transactions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="right d-flex text-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="line"></div>
                        <div className="round"></div>
                      </div>
                    </div>
                    <div className="text-start ps-3">
                      <h4>February 2025 </h4>
                      <h3>HEWE Walking App Launch:</h3>
                      <p>
                        Closing out the year with a major milestone, we launched
                        the HEWE Walking App, revolutionizing the way users earn
                        and interact with HEWE tokens through physical activity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
<h2>Road to</h2>;

export default Roadmap;
