import React, { useEffect, useState } from "react";
import adminlogo from "../../../../assets/admin/adminlogo.png";
import "./style.scss";
import search from "../../../../assets/admin/search.svg";
import bell from "../../../../assets/admin/bell.svg";
import user from "../../../../assets/admin/user.png";
import dropdown from "../../../../assets/admin/dropdown.svg";
import { Copy } from "@phosphor-icons/react";

const HeaderAdmin = ({ connected, connect, account, chainId }) => {
  console.log(account);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopySuccess(true);
    // toast.success("Copied Successfully");
    setTimeout(() => setCopySuccess(false), 1000);
  };

  const address = account;

  const shortAddress = address?.slice(0, 4) + "..." + address?.slice(-4);

  return (
    <>
      <section className="adminheader flex justify-between items-center w-full">
        <div className="flex">
          <div className="flex items-center">
            <div>
              <img src={adminlogo} alt="adminlogo" />
            </div>
            <h2 className="ps-3">HEWE</h2>
          </div>
          <div className="lines"></div>
          <div>
            <h3>Welcome Jhon!</h3>
            <p>Hope you are healthy and happy today...</p>
          </div>
        </div>
        <div>
          <div className="flex  items-center">
            <div className="search">
              <img src={search} alt="img" />
              <input type="text" name="" id="" />
            </div>

            {account != null ? (
              <div className="address">
                <div className="px-4">{shortAddress}</div>
                <button onClick={copyToClipboard}>
                  <Copy size={32} />
                </button>
              </div>
            ) : (
              <div className="address" onClick={connect}>
                <button onClick={copyToClipboard}>Connect Wallet</button>
              </div>
            )}

            <div className="mx-3">
              <img src={bell} alt="" />
            </div>

            <div className="flex items-center">
              <img src={user} alt="" />
              <img src={dropdown} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeaderAdmin;
