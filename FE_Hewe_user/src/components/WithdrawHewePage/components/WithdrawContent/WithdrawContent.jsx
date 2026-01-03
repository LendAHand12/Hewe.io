import { useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChooseTagToken, HistoryWithdraw } from "..";
import { Button, IconToken, InfoIcon, InputPrice, Modal } from "../../..";
import { useModal } from "../../../../hooks";
import { useProfile } from "../../../../hooks/useProfile";
import { requestWithdrawHEWEAPI } from "../../../../services/transferService";
import {
  isValidEthereumAdress,
  renderErrorBlock,
} from "../../../../util/adminBizpointUtils";
import { formatHewe } from "../../../../util/format";
import "./WithdrawContent.scss";

const FEE = 0;
const MIN_WITHDRAW_USDT = 1;

const ERROR_CODE_MAPPING_MESSAGE = {
  0: null,
  1: "Invalid wallet address",
  2: "Minimum withdrawal amount of HEWE is 50 USDT",
  3: "Insufficient HEWE balance",
  4: "Profile not found, please try again",
  5: `Minimum withdrawal amount of HEWE is ${MIN_WITHDRAW_USDT} HEWE`,
};

export const WithdrawContent = () => {
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

  console.log("totalHeweBalance", profile?.heweBalance);
  console.log("deposit", profile?.heweDeposit);

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

      if (Number(value) > profile.heweBalance) {
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
      const res = await requestWithdrawHEWEAPI({
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
    } catch {
      setIsPendingWithdraw(false);
    }
  };

  const handleRecaptchaVerify = async () => {
    if (isPendingWithdraw) return;

    setIsPendingWithdraw(true);

    if (!executeRecaptcha) {
      return;
    }

    await executeRecaptcha("withdrawHEWE").then((token) => {
      handleRequestWithdraw(token);
    });
  };

  const handleGetAllToken = (e) => {
    let value = 0;

    e.stopPropagation();

    value = formatHewe(profile.heweBalance).toString();
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
    <div className="withdrawContentContainer ">
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
            {formatHewe(profile?.heweBalance || 0)}
            <IconToken token="HEWE" />
          </div>
        </div>

        <InputPrice
          isFullWidth={true}
          ref={inputTotalWithdraw}
          side="totalWithdraw"
          value={formData.total}
          label="Amount of HEWE withdrawn"
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

        {/* <InputPrice
          isFullWidth={true}
          side="totalRealWithdraw"
          label="Amount of HEWE to be received"
          placeholder="0"
          value={formData.totalRealReceive}
          isDisabled={true}
        /> */}

        <Button
          isDisabled={isDisabledBtnWithdraw}
          onClick={handleClickBtnWithdraw}
          className="prcolor"
        >
          Withdraw
        </Button>

        <div className="description">
          {/* <div className="note">
            <InfoIcon />{" "}
            <div className="center-flex-vertical">
              Fee: {FEE} <IconToken token="HEWE" />
            </div>
          </div> */}
          <div className="note">
            <InfoIcon />{" "}
            <div className="center-flex-vertical">
              Minimum amount of HEWE per transaction: {MIN_WITHDRAW_USDT}
              <IconToken token="HEWE" />
            </div>
          </div>
        </div>
      </div>

      <div className="listHistoryWithdrawContainer">
        <div className="title">History withdraw</div>
        <HistoryWithdraw
          isReloadData={isReloadData}
          setIsReloadData={setIsReloadData}
        />
      </div>

      <Modal
        isOpen={isOpen}
        title="Confirm withdraw HEWE"
        onConfirm={handleRecaptchaVerify}
        onCancel={handleCloseModal}
        isCentered={false}
        confirmLoading={isPendingWithdraw}
      >
        <div>Confirm withdraw {formData.total} HEWE</div>
      </Modal>
    </div>
  );
};
