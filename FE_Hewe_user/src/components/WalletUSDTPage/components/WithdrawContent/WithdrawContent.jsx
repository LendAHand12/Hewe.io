import "./WithdrawContent.scss";
import { IconUSDT, Modal, InputPrice, Button, InfoIcon } from "../../..";
import { ChooseTagToken, HistoryWithdraw } from "..";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  isValidEthereumAdress,
  renderErrorBlock,
} from "../../../../util/adminBizpointUtils";
import { useModal } from "../../../../hooks";
import { requestWithdrawUSDTAPI } from "../../../../services/transferService";
import { toast } from "react-toastify";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Descriptions } from "antd";
import { formatHewe } from "../../../../util/format";
import { useProfile } from "../../../../hooks/useProfile";

const FEE = 1;
const MIN_WITHDRAW_USDT = 50;

const ERROR_CODE_MAPPING_MESSAGE = {
  0: null,
  1: "Invalid wallet address",
  2: "Minimum withdrawal amount of USDT is 50 USDT",
  3: "Insufficient USDT balance",
  4: "Profile not found, please try again",
  5: `Minimum withdrawal amount of USDT is ${MIN_WITHDRAW_USDT} USDT`,
};

export const WithdrawContent = () => {
  const [isReloadData, setIsReloadData] = useState(false);
  const inputAddress = useRef(null);
  const inputTotalWithdraw = useRef(null);
  const [currentTag, setCurrentTag] = useState("BEP20");
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

      if (Number(value) > profile.usdtBalance) {
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
      const res = await requestWithdrawUSDTAPI({
        method: currentTag,
        address: formData.address,
        amount: Number(formData.total),
        fee: FEE,
        gRec: token,
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

    await executeRecaptcha("withdrawUSDT").then((token) => {
      handleRequestWithdraw(token);
    });
  };

  const handleGetAllToken = (e) => {
    let value = 0;

    e.stopPropagation();

    value = formatHewe(profile.usdtBalance).toString();
    setFormData({
      ...formData,
    });
  };

  const descriptionWithdrawInfo = useMemo(() => {
    return [
      {
        key: "2",
        label: `USDT wallet address`,
        children: (
          <div>
            <span>{formData.address}</span>
          </div>
        ),
      },
      {
        key: "3",
        label: "Amount of USDT withdrawn",
        children: (
          <div className="center-flex-vertical">
            <div>{formData.total}</div> <IconUSDT />
          </div>
        ),
      },
      {
        key: "fee",
        label: "Fee",
        children: (
          <div className="center-flex-vertical">
            <div>{FEE}</div> <IconUSDT />
          </div>
        ),
      },
      {
        key: "4",
        label: "Amount of USDT to be received",
        children: (
          <div className="center-flex-vertical">
            <div>{formData.totalRealReceive}</div> <IconUSDT />
          </div>
        ),
      },
    ];
  }, [isOpen]);

  return (
    <div className="withdrawContentContainer">
      <div className="formTransaction">
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
          label="USDT wallet address"
          isFullWidth={true}
          errorBlock={renderErrorBlock(errors.address)}
          isShowError={errors.address !== null}
          onChange={handleChangeInput("address")}
        />

        <div className="available">
          <div>Available</div>
          <div className="digit">
            {formatHewe(profile?.usdtBalance || 0)} <IconUSDT />
          </div>
        </div>

        <InputPrice
          isFullWidth={true}
          ref={inputTotalWithdraw}
          side="totalWithdraw"
          value={formData.total}
          label="Amount of USDT withdrawn"
          errorBlock={renderErrorBlock(errors.total)}
          isShowError={errors.total !== null}
          onChange={handleChangeInput("total")}
          iconBlock={
            <div className="maxBtn" onClick={handleGetAllToken}>
              "Max"
            </div>
          }
        />

        <InputPrice
          isFullWidth={true}
          side="totalRealWithdraw"
          label="Amount of USDT to be received"
          placeholder="0"
          value={formData.totalRealReceive}
          isDisabled={true}
        />

        <Button
          isDisabled={isDisabledBtnWithdraw}
          onClick={handleClickBtnWithdraw}
        >
          Withdraw
        </Button>

        <div className="description">
          <div className="note">
            <InfoIcon />{" "}
            <div className="center-flex-vertical">
              Fee: {FEE} <IconUSDT />
            </div>
          </div>
          <div className="note">
            <InfoIcon />{" "}
            <div className="center-flex-vertical">
              Minimum amount of USDT per transaction: {MIN_WITHDRAW_USDT}
              <IconUSDT />
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
        title="Confirm withdraw USDT"
        onConfirm={handleRecaptchaVerify}
        onCancel={handleCloseModal}
        width={700}
        isCentered={false}
        confirmLoading={isPendingWithdraw}
      >
        <div style={{ marginTop: "16px" }}>
          <Descriptions
            items={descriptionWithdrawInfo}
            size="small"
            bordered
            column={1}
          />
        </div>
      </Modal>
    </div>
  );
};
