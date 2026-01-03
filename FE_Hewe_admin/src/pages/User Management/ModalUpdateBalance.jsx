import { InputNumber, message, Modal, Radio } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../axios";

export default function ModalUpdateBalance({
  openModalUpdateBalance,
  setOpenModalUpdateBalance,
  selectedUser,
  selectedToken,
  reloadPage,
}) {
  const options = [
    { label: "USDT", value: "USDT" },
    { label: "HEWE", value: "HEWE" },
    { label: "HEWE DEPOSIT", value: "HEWEDEPOSIT" },
    { label: "AMC", value: "AMC" },
  ];

  const options2 = [
    { label: "Add", value: "Add" },
    { label: "Subtract", value: "Subtract" },
  ];

  const [token, setToken] = useState(undefined);
  const [method, setMethod] = useState("Add");
  const [amount, setAmount] = useState(0);

  const handleUpdateBalance = async () => {
    try {
      let amountToUpdate = method === "Add" ? amount : amount * -1;

      const res = await axios.post(
        "/setUserBalance",
        {
          userId: selectedUser._id,
          token: token.toLowerCase(),
          amount: amountToUpdate,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      message.success(res.data.message);
      await reloadPage();
      closeModalAndReset();
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const calcNewBalance = () => {
    if (!selectedUser || !token) return null;

    if (method === "Add") {
      if (token === "HEWEDEPOSIT") {
        return (selectedUser["heweDeposit"] || 0) + amount;
      }

      return (selectedUser[token.toLowerCase() + "Balance"] || 0) + amount;
    } else {
      if (token === "HEWEDEPOSIT") {
        return (selectedUser["heweDeposit"] || 0) - amount;
      }

      return (selectedUser[token.toLowerCase() + "Balance"] || 0) - amount;
    }
  };

  const calcCurrentBalance = () => {
    if (!selectedUser || !token) return null;

    if (token === "HEWEDEPOSIT") {
      return selectedUser["heweDeposit"] || 0;
    }

    return selectedUser[token.toLowerCase() + "Balance"] || 0;
  };

  const closeModalAndReset = () => {
    setOpenModalUpdateBalance(false);
    // reset
    setToken(undefined);
    setMethod("Add");
    setAmount(0);
  };

  useEffect(() => {
    setToken(selectedToken);
  }, [selectedToken, openModalUpdateBalance]);

  if (!selectedUser) return null;

  return (
    <Modal
      title="Update balance"
      open={openModalUpdateBalance}
      onOk={() => handleUpdateBalance()}
      onCancel={() => closeModalAndReset()}
      destroyOnClose={true}
      maskClosable={false}
      okText="Update"
      width={700}
      key={selectedUser._id + selectedToken + openModalUpdateBalance}
    >
      <div>
        <div>
          User: <b>{selectedUser?.name}</b>
        </div>
        <div>
          Email: <b>{selectedUser?.email}</b>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <Radio.Group
          options={options}
          value={token}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => setToken(e.target.value)}
        />
        <Radio.Group
          options={options2}
          value={method}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => setMethod(e.target.value)}
          fullWidth
        />
      </div>

      <div style={{ marginTop: 15 }}>
        <InputNumber
          size="large"
          controls={false}
          style={{ width: "100%" }}
          placeholder={`Enter amount ${token} to ${method.toLowerCase()}`}
          value={amount}
          onChange={(value) => setAmount(value)}
          min={0}
          addonBefore={`Amount ${token} to ${method.toLowerCase()}`}
        />
      </div>

      <div style={{ marginTop: 15 }}>
        <div>
          Current {token} balance:{" "}
          <b style={{ fontSize: 16 }}>{calcCurrentBalance()}</b>
        </div>
        <div>
          New {token} balance:{" "}
          <b style={{ fontSize: 16 }}>{calcNewBalance()}</b>
        </div>
      </div>
    </Modal>
  );
}
