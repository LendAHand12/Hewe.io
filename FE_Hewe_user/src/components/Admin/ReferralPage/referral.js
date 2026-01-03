import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Sidenav from "../Sidenav/sidenav";
import My_Referral from "../my_referral/My_Referral";
import HeaderAdmin from "../header/header";

const ReferralPage = () => {
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      toast.error("please login first");
      history.push("/");
    }
  }, []);

  return (
    <>
      <div className="dashboards">
        <div className="d-flex row">
          <div className="col-xl-3 h-100">
            <Sidenav />
          </div>
          <div className="col-xl-9  myrefpage overflow-y-scroll px-4">
            <HeaderAdmin />
            <div className="adminboardcontt">
              <My_Referral />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralPage;
