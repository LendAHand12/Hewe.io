import React, { useState } from "react";
import "./style.css";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { toast } from "react-toastify";

const DashbaordData = ({ account }) => {
  console.log(account);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopySuccess(true);
    toast.success("Copied Successfully");
    setTimeout(() => setCopySuccess(false), 1000);
  };

  const address = account;

  const shortAddress = address?.slice(0, 4) + "..." + address?.slice(-4);

  return (
    <>
      <section className="dashboard">
        <div className="dashbody">
          {account != null && (
            <>
              <div className="address">
                <div className="px-4">{shortAddress}</div>
                <button onClick={copyToClipboard}>
                  {copySuccess ? "Copied!" : "Copy"}
                </button>
              </div>
            </>
          )}

          <div className="flex justify-between">
            <h2>
              MY TOKENS VALUE <br /> <span>$10,000.00</span>
            </h2>
            <div>
              <DotsThreeVertical size={32} />
            </div>
          </div>

          <div className="mt-6">
            <table class="table-auto w-full">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Symbol</th>
                  <th>Last Price</th>
                  <th>24H Change</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashbaordData;
