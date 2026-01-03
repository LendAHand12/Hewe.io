import React from "react";
import "./style.scss";
import chart from "../../assets/images/img/graph.png";

const TokenomicsHome = () => {
  return (
    <>
      <section className="Tokenomics">
        <div className="headingcont">
          <h2>Tokenomics</h2>
        </div>

        <div className="text-center">
          <img src={chart} alt="" className="img-fluid" />
        </div>
      </section>
    </>
  );
};

export default TokenomicsHome;
