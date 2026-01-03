import React, { useEffect, useState } from "react";
import "./NewHeweDB.scss";
import { InputNumber, message } from "antd";
import instance from "../../axios";
import { Button } from "antd";
import NewHeweDBManage from "./NewHeweDBManage";

export default function NewHeweDB() {
  const [hewePrice, setHewePrice] = useState(0);
  const [amcPrice, setAmcPrice] = useState(0);

  const adminGetPricing = async (tokenCrypto) => {
    try {
      const res = await instance.get(`/adminGetPricing?token=${tokenCrypto}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (tokenCrypto === "hewe") setHewePrice(res.data.data);
      else if (tokenCrypto === "amc") setAmcPrice(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const adminUpdatePricing = async (tokenCrypto, newPrice) => {
    try {
      const res = await instance.post(
        `/adminUpdatePricing`,
        {
          token: tokenCrypto,
          newPrice,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      message.success(res.data.message);
      adminGetPricing(tokenCrypto);
    } catch (error) {
      console.log(error);
      message.error("Error");
    }
  };

  useEffect(() => {
    adminGetPricing("hewe");
    adminGetPricing("amc");
  }, []);

  return (
    <div className="newHeweDBPage">
      <h4>Update price</h4>

      <div style={{ display: "flex", gap: 15 }}>
        <div>
          <p>HEWE</p>
          <InputNumber
            style={{ width: 150, marginRight: 10 }}
            size="large"
            value={hewePrice}
            onChange={(num) => setHewePrice(num)}
            controls={false}
          />
          <Button
            size="large"
            type="primary"
            onClick={() => adminUpdatePricing("hewe", hewePrice)}
          >
            Update
          </Button>
        </div>

        <div>
          <p>AMC</p>
          <InputNumber
            style={{ width: 150, marginRight: 10 }}
            size="large"
            value={amcPrice}
            onChange={(num) => setAmcPrice(num)}
            controls={false}
          />
          <Button
            size="large"
            type="primary"
            onClick={() => adminUpdatePricing("amc", amcPrice)}
          >
            Update
          </Button>
        </div>
      </div>

      <div style={{ marginTop: 50 }}></div>

      <NewHeweDBManage />
    </div>
  );
}
