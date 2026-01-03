import { Button, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { showAlert } from "../../function/showAlert";
import { axiosService } from "../../util/service";

export default function ExchangeRate() {
  const [rate, setRate] = useState(undefined);

  const handleChangeRate = (number) => {
    setRate(number);
  };

  const handleUpdateRate = () => {
    if (rate == null || rate == undefined) {
      showAlert("error", "Please input withdraw fee");
      return;
    }

    if (Number.isNaN(rate) || rate < 0) {
      showAlert("error", "Withdraw fee must be greater than 0");
      return;
    }

    updateFee(Number(rate) / 100, "FEEWITHDRAW");
  };

  const updateFee = async (amount, name) => {
    try {
      const response = await axiosService.post("api/admin/updateConfig", {
        amount,
        name,
      });
      showAlert("success", response.data.message);
      getFee();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const getFee = async () => {
    try {
      const response = await axiosService.post("api/moveToEarn/getCustom", {
        name: "FEEWITHDRAW",
      });
      const x = Number(response.data.data) * 100;
      setRate(x);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  useEffect(() => {
    getFee();
  }, []);

  return (
    <div className="withdrawfee-component">
      <div className="title-area">
        <h2 className="title">Update withdraw fee</h2>
      </div>

      <div className="withdrawfee-field">
        <InputNumber
          id="withdrawfee-field-input"
          style={{ width: 120 }}
          min={0}
          addonAfter="%"
          value={rate}
          onChange={handleChangeRate}
          controls={false}
        />

        <Button style={{ marginLeft: 25, width: 100 }} type="primary" onClick={handleUpdateRate}>
          Update
        </Button>
      </div>
    </div>
  );
}
