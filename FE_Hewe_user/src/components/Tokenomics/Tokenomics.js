import React from "react";
import "./style.scss";
import Header from "../HomePage/Header";
import chart from "../../assets/images/img/graph.png";
import Footer1 from "../HomePage/Footer1";

const Tokenomics = () => {
  return (
    <>
      <Header />
      <section className="Tokenomics tmt-10">
        <div className="headingcont">
          <h2>Tokenomics</h2>
        </div>

        <div className="text-center">
          <img src={chart} alt="" className="img-fluid" />
        </div>
      </section>
      <Footer1 />
    </>
  );
};

export default Tokenomics;
