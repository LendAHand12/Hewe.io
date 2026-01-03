import "./CardBank.scss";
import { useModal } from "../../../../hooks/useModal";
import { Modal } from "../../../Modal/Modal";
import { Input } from "../../../Input/Input";
import { useRef, useState } from "react";
import { axiosService } from "../../../../util/service";
import { message } from "antd";

export const CardBank = ({ bankInfo }) => {
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const [formData, setFormData] = useState({
    amount: "",
    message: "",
    addressReceive: "",
  });
  const amountInputRef = useRef(null);
  const msgInputRef = useRef(null);
  const addressInputRef = useRef(null);
  const [isPendingBuy, setIsPendingBuy] = useState(false);
  const isDisabledBtnBuy =
    formData.amount === "" ||
    formData.message === "" ||
    formData.addressReceive === "";

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

  const handleCloseModalMdw = () => {
    setIsPendingBuy(false);
    handleCloseModal();
    setFormData({ amount: "", message: "", addressReceive: "" });
  };

  const handleRequestBuyToken = async () => {
    setIsPendingBuy(true);

    try {
      const res = await axiosService.post("api/depositVND/createDepositVND", {
        idBanking: bankInfo.id,
        amount: Number(formData.amount),
        message: formData.message,
        addressReceive: formData.addressReceive,
      });

      message.success(res.data.message);
      handleCloseModalMdw();
      setIsPendingBuy(false);
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingBuy(false);
    }
  };

  return (
    <>
      <div className="cardBankContainer" onClick={handleOpenModal}>
        <div className="bankName">{bankInfo.name_banking}</div>
        <div className="content" style={{ marginTop: "24px" }}>
          <div className="accountOwner">{bankInfo.owner_banking}</div>
        </div>
        <div className="content">
          <div className="accountNumber">{bankInfo.number_banking}</div>
        </div>
      </div>

      <Modal
        maskClosable={false}
        title="Confirm buy token"
        isOpen={isOpen}
        onCancel={handleCloseModalMdw}
        destroyOnClose={true}
        onConfirm={handleRequestBuyToken}
        isDisabledBtn={isDisabledBtnBuy}
        confirmLoading={isPendingBuy}
      >
        <div className="modalBuyTokenContainer">
          <Input
            label="Amount"
            ref={amountInputRef}
            onChange={handleChangeAmountInput}
            value={formData.amount}
          />
          <Input
            label="Message"
            ref={msgInputRef}
            onChange={handleChangeMsgInput}
            value={formData.message}
          />
          <Input
            label="Address receive"
            ref={addressInputRef}
            onChange={handleChangeAddressInput}
            value={formData.addressReceive}
          />
        </div>
      </Modal>
    </>
  );
};
