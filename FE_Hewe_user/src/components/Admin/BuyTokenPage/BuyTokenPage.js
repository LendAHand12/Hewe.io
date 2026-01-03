import React from "react";
import Sidenav from "../Sidenav/sidenav";
import HeaderAdmin from "../header/header";
import BuyTokenV2 from "./BuyTokenV2";

const BuyTokenPage = () => {
  return (
    <>
      <HeaderAdmin />
      <div className="dashboards">
        <div className="d-flex row">
          <div className="col-xl-2 h-100">
            <Sidenav />
          </div>
          <div className="col-xl-10" style={{ height: "90vh", overflowY: "auto", minHeight: "unset" }}>
            {/* <TokenComponent /> */}
            <BuyTokenV2 type="connectWallet" />
          </div>
        </div>
      </div>
    </>
  );
};
export default BuyTokenPage;
