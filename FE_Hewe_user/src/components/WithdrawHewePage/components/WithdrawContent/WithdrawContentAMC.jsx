import { useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChooseTagToken } from "..";
import { Button, InfoIcon, InputPrice, Modal } from "../../..";
import { roundDisplay } from "../../../../function/round";
import { useModal } from "../../../../hooks";
import { useProfile } from "../../../../hooks/useProfile";
import { requestWithdrawAMCAPI } from "../../../../services/transferService";
import {
  isValidEthereumAdress,
  renderErrorBlock,
} from "../../../../util/adminBizpointUtils";
import { formatHewe } from "../../../../util/format";
import { HistoryWithdrawAMC } from "../HistoryWithdraw/HistoryWithdrawAMC";
import "./WithdrawContent.scss";
import { message } from "antd";

const FEE = 0;
const MIN_WITHDRAW_USDT = 1;

const ERROR_CODE_MAPPING_MESSAGE = {
  0: null,
  1: "Invalid wallet address",
  2: "Minimum withdrawal amount of AMC is 50 USDT",
  3: "Insufficient AMC balance",
  4: "Profile not found, please try again",
  5: `Minimum withdrawal amount of AMC is ${MIN_WITHDRAW_USDT} AMC`,
};

export const WithdrawContentAMC = () => {
  const [isReloadData, setIsReloadData] = useState(false);
  const inputAddress = useRef(null);
  const inputTotalWithdraw = useRef(null);
  const [currentTag, setCurrentTag] = useState("AMC20");
  const [formData, setFormData] = useState({
    address: "",
    total: "",
    totalRealReceive: "",
  });
  const [errors, setErrors] = useState({
    address: ERROR_CODE_MAPPING_MESSAGE[0],
    total: ERROR_CODE_MAPPING_MESSAGE[0],
  });
  const { profile } = useSelector((state) => state.userReducer);
  const { handleGetProfile } = useProfile();
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const isDisabledBtnWithdraw =
    errors.address !== null ||
    errors.total !== null ||
    formData.address === "" ||
    formData.total === "";

  const handleResetAllFields = () => {
    setErrors({
      address: ERROR_CODE_MAPPING_MESSAGE[0],
      total: ERROR_CODE_MAPPING_MESSAGE[0],
    });
    setFormData({ address: "", total: "", totalRealReceive: "" });
  };

  const handleChooseTag = (tag) => () => {
    setCurrentTag(tag);
  };

  const handleChangeInput = (type) => (e) => {
    const value = e.target.value.trim();
    let errorsTemp = { ...errors };

    if (type === "address") {
      const isValidAddress = isValidEthereumAdress(value);

      if (value.length === 0) {
        setFormData({ ...formData, address: "" });
        setErrors({ ...errors, address: ERROR_CODE_MAPPING_MESSAGE[0] });
        return;
      }

      if (!isValidAddress) {
        errorsTemp.address = ERROR_CODE_MAPPING_MESSAGE[1];
      } else {
        errorsTemp.address = ERROR_CODE_MAPPING_MESSAGE[0];
      }

      setFormData({ ...formData, address: value });
      setErrors(errorsTemp);
    } else {
      const regexCheckNumberWithDot = /^[0-9]+(\.[0-9]*)?$/;

      if (value.length === 0) {
        setFormData({ ...formData, total: "", totalRealReceive: "" });
        setErrors({ ...errors, total: ERROR_CODE_MAPPING_MESSAGE[0] });
        return;
      }

      if (!regexCheckNumberWithDot.test(value)) {
        return;
      }

      if (!profile) {
        errorsTemp.total = ERROR_CODE_MAPPING_MESSAGE[3];
      } else {
        errorsTemp.total = ERROR_CODE_MAPPING_MESSAGE[0];
      }

      if (Number(value) > profile.amcBalance) {
        errorsTemp.total = ERROR_CODE_MAPPING_MESSAGE[3];
      } else if (Number(value) < MIN_WITHDRAW_USDT) {
        errorsTemp.total = ERROR_CODE_MAPPING_MESSAGE[5];
      } else {
        errorsTemp.total = ERROR_CODE_MAPPING_MESSAGE[0];
      }

      setFormData({
        ...formData,
        total: value,
        totalRealReceive: value - FEE,
      });
      setErrors(errorsTemp);
    }
  };

  const handleClickBtnWithdraw = () => {
    handleOpenModal();
  };

  const handleRequestWithdraw = async (token) => {
    setIsPendingWithdraw(true);

    try {
      const res = await requestWithdrawAMCAPI({
        method: currentTag,
        address: formData.address,
        amount: Number(formData.total),
        fee: FEE,
        gRec: token,
        symbol: currentTag,
        method: currentTag,
      });

      setIsReloadData(true);
      toast.success(res.data.message);
      setIsPendingWithdraw(false);
      handleCloseModal();
      handleResetAllFields();
      handleGetProfile();
    } catch (error) {
      console.log("RUN");
      setIsPendingWithdraw(false);
      message.error(error.response.data.message);
    }
  };

  const handleRecaptchaVerify = async () => {
    if (isPendingWithdraw) return;

    setIsPendingWithdraw(true);

    if (!executeRecaptcha) {
      return;
    }

    await executeRecaptcha("withdrawAMC").then((token) => {
      handleRequestWithdraw(token);
    });
  };

  const handleGetAllToken = (e) => {
    let value = 0;

    e.stopPropagation();

    value = formatHewe(profile.amcBalance).toString();
    setErrors({
      ...errors,
      total: ERROR_CODE_MAPPING_MESSAGE[0],
    });
    setFormData({
      ...formData,
      total: value,
      totalRealReceive: Number(value) - FEE,
    });
  };

  return (
    <div className="withdrawContentContainer">
      <div className="formTransaction tablebg">
        <div className="switch">
          <ChooseTagToken
            currentTag={currentTag}
            onChooseTag={handleChooseTag}
          />
        </div>

        <InputPrice
          ref={inputAddress}
          side="address"
          value={formData.address}
          className="text-white"
          label="Wallet address"
          isFullWidth={true}
          errorBlock={renderErrorBlock(errors.address)}
          isShowError={errors.address !== null}
          onChange={handleChangeInput("address")}
        />

        <div className="available">
          <div>Available</div>
          <div className="digit">
            {roundDisplay(profile?.amcBalance || 0)} AMC
          </div>
        </div>

        <InputPrice
          isFullWidth={true}
          ref={inputTotalWithdraw}
          side="totalWithdraw"
          value={formData.total}
          label="Amount of AMC withdrawn"
          errorBlock={renderErrorBlock(errors.total)}
          isShowError={errors.total !== null}
          onChange={handleChangeInput("total")}
          iconBlock={
            <div
              className="maxBtn"
              style={{ cursor: "pointer", fontWeight: 600 }}
              onClick={handleGetAllToken}
            >
              Max
            </div>
          }
        />

        <Button
          isDisabled={isDisabledBtnWithdraw}
          onClick={handleClickBtnWithdraw}
          className="prcolor"
        >
          Withdraw AMC
        </Button>

        <div className="description">
          <div className="note">
            <InfoIcon />{" "}
            <div className="center-flex-vertical">
              Minimum amount of AMC per transaction: {MIN_WITHDRAW_USDT} AMC
            </div>
          </div>
        </div>
      </div>

      <div className="listHistoryWithdrawContainer">
        <div className="title">History withdraw AMC</div>
        <HistoryWithdrawAMC
          isReloadData={isReloadData}
          setIsReloadData={setIsReloadData}
        />
      </div>

      <Modal
        isOpen={isOpen}
        title="Confirm withdraw AMC"
        onConfirm={handleRecaptchaVerify}
        onCancel={handleCloseModal}
        isCentered={false}
        confirmLoading={isPendingWithdraw}
      >
        <div style={{ marginBottom: 5 }}>
          Amount: {roundDisplay(Number(formData.total))} AMC
        </div>
        <div>Address: {formData.address}</div>
      </Modal>
    </div>
  );
};
