import "./WithdrawContent.scss";
import { Modal, InputPrice, InfoIcon, IconToken } from "../../..";
import { ChooseTagToken, HistoryWithdraw } from "..";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  isValidEthereumAdress,
  renderErrorBlock,
} from "../../../../util/adminBizpointUtils";
import { useModal } from "../../../../hooks";
import { requestWithdrawUSDTAPI } from "../../../../services/transferService";
import { toast } from "react-toastify";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { formatHewe } from "../../../../util/format";
import { useProfile } from "../../../../hooks/useProfile";
import { Alert, Button } from "antd";
import { axiosService } from "../../../../util/service";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const FEE = 1;
const MIN_WITHDRAW_USDT = 2;

const ERROR_CODE_MAPPING_MESSAGE = {
  0: null,
  1: "Invalid wallet address",
  2: "Minimum withdrawal amount of USDT is 50 USDT",
  3: "Insufficient USDT balance",
  4: "Profile not found, please try again",
  5: `Minimum withdrawal amount of USDT is ${MIN_WITHDRAW_USDT} USDT`,
};

export const WithdrawContent = () => {
  const history = useHistory();
  const [canWithdraw, setCanWithdraw] = useState(null);
  const [isReloadData, setIsReloadData] = useState(false);
  const inputAddress = useRef(null);
  const inputTotalWithdraw = useRef(null);
  const [currentTag, setCurrentTag] = useState(null);
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

      if (Number(value) > formatHewe(profile.usdtBalance)) {
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
        symbol: currentTag,
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

  const checkUserCanWithdraw = async () => {
    try {
      const res = await axiosService.post("/checkUserHeweDB", {
        email: profile.email,
      });
      if (res.data && res.data.data && res.data.data.isUserInHeweDB == true) {
        setCanWithdraw(true);
      } else {
        setCanWithdraw(false);
      }
    } catch (error) {
      console.error(error);
      setCanWithdraw(false);
    }
  };

  useEffect(() => {
    if (profile?.email) {
      checkUserCanWithdraw();
    }
  }, [profile?.email]);

  return (
    <div className="withdrawContentContainerJ24">
      {canWithdraw === true && (
        <div className="formTransaction">
          <div className="switch">
            <ChooseTagToken
              currentTag={currentTag}
              onChooseTag={handleChooseTag}
            />
          </div>

          {currentTag && (
            <>
              <InputPrice
                ref={inputAddress}
                side="address"
                value={formData.address}
                label="Wallet address"
                isFullWidth={true}
                errorBlock={renderErrorBlock(errors.address)}
                isShowError={errors.address !== null}
                onChange={handleChangeInput("address")}
              />

              <div className="available">
                <div>Available</div>
                <div className="digit">
                  {formatHewe(profile?.usdtBalance || 0)}
                  <IconToken token="USDT" />
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
                  <div
                    className="maxBtn"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                    onClick={handleGetAllToken}
                  >
                    Max
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
            </>
          )}

          <Button
            disabled={isDisabledBtnWithdraw}
            onClick={handleClickBtnWithdraw}
            type={"primary"}
            size="large"
            style={{ color: "black", fontWeight: 600 }}
          >
            Withdraw USDT
          </Button>

          <div className="description">
            <div className="note">
              <InfoIcon />{" "}
              <div className="center-flex-vertical">
                Fee: {FEE} <IconToken token="USDT" />
              </div>
            </div>
            <div className="note">
              <InfoIcon />{" "}
              <div className="center-flex-vertical">
                Minimum amount of USDT per transaction: {MIN_WITHDRAW_USDT}
                <IconToken token="USDT" />
              </div>
            </div>
          </div>
        </div>
      )}

      {canWithdraw === false && (
        <div style={{ marginTop: "20px" }}>
          <Alert
            type="warning"
            message="Withdrawal is restricted"
            description="According to our new policies, users need to make at least one HEWE DB transaction to be able to withdraw USDT."
            showIcon
            action={
              <Button type="primary" onClick={() => history.push("/hewedb")}>
                Go to HEWE DB
              </Button>
            }
          />
        </div>
      )}

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
        isCentered={false}
        confirmLoading={isPendingWithdraw}
      >
        <div>Confirm withdraw {formData.total} USDT</div>
      </Modal>
    </div>
  );
};
