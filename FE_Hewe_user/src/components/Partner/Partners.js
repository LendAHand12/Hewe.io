import React from "react";
import "./style.scss";
import img1 from "../../assets/svg/fuse.svg";
import img2 from "../../assets/svg/heco.svg";
import img3 from "../../assets/svg/near.svg";
import img4 from "../../assets/svg/solana.svg";
import img5 from "../../assets/svg/solana1.svg";

function Partners() {
  return (
    <div className="partner">
      <div className="headingcont">
        <h2>Partners</h2>
      </div>
      <div className="position-relative">
        <div className="maincont">
          <div>
            <img src={img1} alt="img" />
          </div>
          <div>
            <img src={img2} alt="img" />
          </div>
          <div>
            <img src={img3} alt="img" />
          </div>
          <div>
            <img src={img4} alt="img" />
          </div>
          <div>
            <img src={img5} alt="img" />
          </div>
        </div>
        <div className="showdowcont"></div>
      </div>
    </div>
  );
}

export default Partners;
