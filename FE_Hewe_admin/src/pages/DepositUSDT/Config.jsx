import { Button, Descriptions, Input, message } from "antd";
import "./Config.scss";
import { useEffect, useState } from "react";
import axios from "../../axios";

export const Config = () => {
  const [addressUSDT, setAddressUSDT] = useState("");
  const [addressBNB, setAddressBNB] = useState("");
  const [privateKeyBNB, setPrivateKeyBNB] = useState("");
  const [amountBNB, setAmountBNB] = useState("");

  const handleGetKeyValue = async (key) => {
    try {
      const res = await axios.get(`getConfigValue?configKey=${key}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = res.data.data;

      switch (key) {
        case "admin_usdt_address":
          setAddressUSDT(data);
          break;

        case "admin_bnb_address":
          setAddressBNB(data);
          break;

        case "admin_bnb_key":
          setPrivateKeyBNB(data);
          break;

        case "admin_bnb_amount":
          setAmountBNB(data);
          break;

        default:
          break;
      }
    } catch (error) {}
  };

  const handleChangeFieldInput = (field) => (e) => {
    const value = e.target.value;

    switch (field) {
      case "admin_usdt_address":
        setAddressUSDT(value);
        break;

      case "admin_bnb_address":
        setAddressBNB(value);
        break;

      case "admin_bnb_key":
        setPrivateKeyBNB(value);
        break;

      case "admin_bnb_amount":
        setAmountBNB(value);
        break;

      default:
        break;
    }
  };

  const getValueByField = (field) => {
    switch (field) {
      case "admin_usdt_address":
        return addressUSDT.trim();

      case "admin_bnb_address":
        return addressBNB.trim();

      case "admin_bnb_key":
        return privateKeyBNB.trim();

      case "admin_bnb_amount":
        return amountBNB;

      default:
        break;
    }
  };

  const handleGetAllData = () => {
    handleGetKeyValue("admin_usdt_address");
    handleGetKeyValue("admin_bnb_address");
    handleGetKeyValue("admin_bnb_key");
    handleGetKeyValue("admin_bnb_amount");
  };

  const handleUpdateField = (field) => async () => {
    try {
      const res = await axios.post(
        "updateConfigValue",
        {
          configKey: field,
          configValue: getValueByField(field),
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      handleGetAllData();
      message.success(res.data.message);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetAllData();
  }, []);

  return (
    <div className="configContainer">
      <Descriptions column={1} title="Config" bordered>
        <Descriptions.Item label="BNB address">
          <div className="labelItem">
            <Input
              value={addressBNB}
              onChange={handleChangeFieldInput("admin_bnb_address")}
            />
            <Button onClick={handleUpdateField("admin_bnb_address")}>
              Update
            </Button>
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="BNB private key">
          <div className="labelItem">
            <Input
              value={privateKeyBNB}
              onChange={handleChangeFieldInput("admin_bnb_key")}
            />
            <Button onClick={handleUpdateField("admin_bnb_key")}>Update</Button>
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Amount BNB">
          <div className="labelItem">
            <Input
              value={amountBNB}
              onChange={handleChangeFieldInput("admin_bnb_amount")}
            />
            <Button onClick={handleUpdateField("admin_bnb_amount")}>
              Update
            </Button>
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="USDT address">
          <div className="labelItem">
            <Input
              value={addressUSDT}
              onChange={handleChangeFieldInput("admin_usdt_address")}
            />
            <Button onClick={handleUpdateField("admin_usdt_address")}>
              Update
            </Button>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
