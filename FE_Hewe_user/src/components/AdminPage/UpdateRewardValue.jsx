import { Button, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { showAlert } from "../../function/showAlert";
import { axiosService } from "../../util/service";

export default function UpdateRewardValue() {
  const [rate, setRate] = useState(undefined);

  const handleChangeRate = (number) => setRate(number);

  const handleUpdateRate = () => {
    if (rate == null || rate == undefined) {
      showAlert("error", "Please input reward value");
      return;
    }

    if (Number.isNaN(rate) || rate < 0) {
      showAlert("error", "Reward value must be greater than or equal to 0");
      return;
    }

    updateFee(rate, "REWARD");
  };

  const updateFee = async (amount, name) => {
    try {
      const response = await axiosService.post("api/admin/updateConfig", {
        amount,
        name,
      });
      showAlert("success", response.data.message);
      getValue();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const getValue = async () => {
    try {
      const response = await axiosService.post("api/moveToEarn/getCustom", {
        name: "REWARD",
      });
      setRate(Number(response.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getValue();
  }, []);

  return (
    <div className="update-reward-value-component">
      <div className="title-area">
        <h2 className="title">Update reward value</h2>
      </div>

      <div className="field">
        <InputNumber
          id="update-reward-value-input"
          style={{ width: 160 }}
          min={0}
          addonAfter="Token"
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
