import React from "react";
import Sidenav from "../Sidenav/sidenav";
import HeaderAdmin from "../header/header";
import HeweDBMain from "./HeweDBMain";

const HeweDBPage = () => {
  return (
    <>
      <HeaderAdmin />
      <div className="dashboards">
        <div className="d-flex row">
          <div className="col-xl-3 h-100">
            <Sidenav />
          </div>

          <div
            className="col-xl-9"
            style={{ height: "100svh", overflowY: "scroll" }}
          >
            <HeweDBMain />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeweDBPage;
