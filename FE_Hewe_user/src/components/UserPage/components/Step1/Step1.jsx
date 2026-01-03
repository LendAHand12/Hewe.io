import { useEffect, useRef, useState } from "react";
import { axiosService } from "../../../../util/service";
import { Button, Select, message } from "antd";
import "./Step1.scss";
import { Input } from "../../../Input/Input";
import { Bounce, toast } from "react-toastify";
import { BANKS } from "../../../../constant/constant";

const randomContent = () => {
  return Math.round(Math.random() * 1000000000).toString();
};

export const Step1 = ({ onNextStep, amount, namePackage }) => {
  const [banks, setBanks] = useState([]);
  const [bankSelected, setBankSelected] = useState(null);
  const [formData, setFormData] = useState({
    amount: amount.toString(),
    message: "",
    addressReceive: "",
  });
  const amountInputRef = useRef(null);
  const msgInputRef = useRef(null);
  const addressInputRef = useRef(null);
  const [isPendingBuy, setIsPendingBuy] = useState(false);
  const isDisabledBtnBuy =
    formData.addressReceive === "" || bankSelected === null;
  const randomStr = useRef(randomContent());

  const handleChangeAmountInput = (value) => {
    const inputValue = value.target.value.trim();
    const regCheckIsNumber = /^[0-9]+(\.[0-9]*)?$/;

    if (inputValue.length === 0) {
      setFormData({ ...formData, amount: "" });
      return;
    }

    if (!regCheckIsNumber.test(inputValue)) {
      return;
    }

    setFormData({ ...formData, amount: inputValue });
  };

  const handleChangeMsgInput = (value) => {
    setFormData({ ...formData, message: value.target.value.trim() });
  };

  const handleChangeAddressInput = (value) => {
    setFormData({ ...formData, addressReceive: value.target.value.trim() });
  };

  const handleResetFormBuy = () => {
    setBankSelected(null);
    setIsPendingBuy(false);
    setFormData({ amount: "", message: "", addressReceive: "" });
  };

  const handleRequestBuyToken = async () => {
    setIsPendingBuy(true);

    try {
      const res = await axiosService.post("api/depositVND/createDepositVND", {
        idBanking: bankSelected,
        amount: Number(formData.amount),
        message: randomStr.current,
        addressReceive: formData.addressReceive,
      });

      message.success(res.data.message);
      handleResetFormBuy();
      setIsPendingBuy(false);
      onNextStep();
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingBuy(false);
    }
  };

  const handleGetBanks = async () => {
    await axiosService
      .post("api/depositVND/getBanking")
      .then((res) => {
        setBanks(res.data.data);
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };

  const hanldeCopy = (value) => () => {
    navigator.clipboard.writeText(value.toString());
    toast.success("Copy success", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });

    return true;
  };

  useEffect(() => {
    handleGetBanks();
  }, []);

  return (
    <div className="step1Container">
      {/* <div className="header">
        <h2 className="titleContainer">Buy token</h2>
      </div> */}

      <div className="modalBuyTokenContainer">
        <Select
          placeholder="Select bank"
          options={banks.map((bank) => {
            const bankLogo = BANKS.find(
              (bankConst) => bankConst.name === bank.name_banking
            );

            return {
              value: bank.id,
              label: (
                <div className="bankOption">
                  <img src={bankLogo?.logo} />
                  <div>{bank.name_banking}</div>{" "}
                </div>
              ),
            };
          })}
          value={bankSelected}
          defaultValue={bankSelected}
          onChange={(value) => {
            setBankSelected(value);
          }}
        />
        <Input isFullWidth={true} label="Name package" value={namePackage} />
        <Input
          isFullWidth={true}
          label="Message"
          ref={msgInputRef}
          value={randomStr.current}
          iconBlock={
            <i
              onClick={hanldeCopy(randomStr.current)}
              className="fa-solid fa-copy"
              style={{ cursor: "pointer" }}
            ></i>
          }
        />
        <Input
          isFullWidth={true}
          label="Address receive"
          ref={addressInputRef}
          onChange={handleChangeAddressInput}
          value={formData.addressReceive}
        />

        <Button
          type="primary"
          onClick={handleRequestBuyToken}
          disabled={isDisabledBtnBuy}
          loading={isPendingBuy}
        >
          Buy
        </Button>
      </div>
    </div>
  );
};
