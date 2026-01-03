import React, { useEffect, useState } from "react";
import adminlogo from "../../../assets/admin/adminlogo.svg";
import "./style.scss";
import search from "../../../assets/admin/search.svg";
// import WalletConnect from "../../WalletConnect/WalletConnect";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { House } from "@phosphor-icons/react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId } from "wagmi";
const HeaderAdmin = () => {
  // console.log(account);
  const history = useHistory();
  const { address } = useAccount();
  const chainId = useChainId();

  const data = JSON.parse(localStorage.getItem("user"));
  const username = data?.data?.name;

  return (
    <>
      <section className="adminheader flex justify-between items-center w-full">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <div
              onClick={() => history.push("/adminDashboard")}
              className="d-xl-block d-none crp "
            >
              <div className="iconcont">
                <House size={32} />
              </div>
            </div>
            <div>
              <div className="d-flex align-items-center d-xl-none d-block ms-xl-0 ms-5 crp ">
                <div onClick={() => history.push("/adminDashboard")}>
                  <img src={adminlogo} alt="adminlogo" className="adminlogo" />
                </div>
                <h2 className="ps-3 d-sm-block d-none prcolor">HEWE</h2>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <div className="search d-none">
              <img src={search} alt="img" />
              <input type="text" name="" id="" className="border-0" />
            </div>
            {address && (
              <div style={{ marginRight: "4px" }}>
                {chainId == 97 || chainId == 56 ? "BSC " : "AMC "}
              </div>
            )}
            <div className="connectwbtn">
              <ConnectKitButton />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeaderAdmin;
