import { Button, InputPrice, Modal, IconToken } from "../../..";
import "./FormSwapToken.scss";
import { useEffect, useRef, useState } from "react";
import { useModal, useProfile } from "../../../../hooks";
import { requestSwapTokenAPI } from "../../../../services/swapService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { formatHewe, renderErrorBlock } from "../../../../util/adminBizpointUtils";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { hedera } from "@wagmi/core/chains";

const ERROR_CODE_MAPPING_MESSAGE = {
  0: null,
  1: "Insufficient balance",
};

const checkIsSufficientQuantity = (profile, token, inputValue) => {
  if (!profile) return false;

  switch (token) {
    case "USDT":
      return Number(inputValue) <= profile.usdtBalance;

    case "HEWE":
      return Number(inputValue) <= profile.heweBalance;

    default:
      return false;
  }
};

export const FormSwapToken = ({ swapConfig, setIsReloadData }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { profile } = useSelector((state) => state.userReducer);
  const [isPendingSwap, setIsPendingSwap] = useState(false);
  const {
    isOpen: isOpenConfirm,
    handleCloseModal: handleCloseModalConfirm,
    handleOpenModal: handleOpenModalConfirm,
  } = useModal();
  const [tokensSelected, setTokenSelected] = useState({
    from: "USDT",
    to: "HEWE",
  });
  const [formData, setFormData] = useState({ from: "", to: "" });
  const [errorsMsg, setErrorsMsg] = useState({
    from: ERROR_CODE_MAPPING_MESSAGE[0],
    to: ERROR_CODE_MAPPING_MESSAGE[0],
  });
  const { handleGetProfile } = useProfile();
  const inputFromRef = useRef(null);
  const isDisabledBtn =
    formData.to === "" ||
    formData.from === "0" ||
    formData.to === "0" ||
    errorsMsg.from !== ERROR_CODE_MAPPING_MESSAGE[0] ||
    !checkIsSufficientQuantity(profile, tokensSelected.from, formData.from);

  const renderBalance = (token) => {
    if (!profile) return null;

    switch (token) {
      case "USDT":
        return `Balance: ${formatHewe(profile?.usdtBalance || 0)} USDT`;

      case "HEWE":
        return `Balance: ${formatHewe(profile?.heweBalance || 0)} HEWE`;

      default:
        return null;
    }
  };

  const handleChangeInputFrom = (e) => {
    const value = e.target.value;
    let errorTemp = ERROR_CODE_MAPPING_MESSAGE[0];
    const regexCheckNumberWithDot = /^[0-9]+(\.[0-9]*)?$/;

    if (value.length === 0) {
      setFormData({ ...formData, from: "", to: "" });
      setErrorsMsg({ ...errorsMsg, from: ERROR_CODE_MAPPING_MESSAGE[0] });
      return;
    }

    if (!regexCheckNumberWithDot.test(value)) {
      return;
    }

    let isSufficient = checkIsSufficientQuantity(profile, tokensSelected.from, value);

    if (!isSufficient) {
      errorTemp = ERROR_CODE_MAPPING_MESSAGE[1];
    } else {
      errorTemp = ERROR_CODE_MAPPING_MESSAGE[0];
    }

    setFormData({
      ...formData,
      from: value.toString(),
      to: formatHewe(Number(value) / swapConfig.rate).toString(),
    });
    setErrorsMsg({ ...errorsMsg, from: errorTemp });
  };

  const handleGetAllToken = (e) => {
    let value = 0;

    e.stopPropagation();

    switch (tokensSelected.from) {
      case "USDT":
        value = formatHewe(profile.usdtBalance).toString();
        setFormData({
          ...formData,
          from: value,
          to: formatHewe(Number(value) / swapConfig.rate).toString(),
        });
        break;

      default:
        break;
    }
  };

  const handleClearInputs = () => {
    setFormData({ from: "", to: "" });
  };

  const handleUpdateInputTo = () => {
    if (formData.from === "") return;

    setFormData({
      ...formData,
      to: formatHewe(swapConfig.rate * Number(formData.from)).toString(),
    });
  };

  const handleClickBtnSwap = () => {
    handleOpenModalConfirm();
  };

  const handleSwap = async (token) => {
    try {
      const res = await requestSwapTokenAPI({
        from: tokensSelected.from.toLowerCase(),
        to: tokensSelected.to.toLowerCase(),
        amountUSDT: formatHewe(Number(formData.from)),
        gRec: token,
      });

      toast.success(res.data.message);
      handleClearInputs();
      setIsPendingSwap(false);
      handleCloseModalConfirm();
      setIsReloadData(true);
      handleGetProfile();
    } catch (error) {
      setIsPendingSwap(false);
    }
  };

  const handleRecaptchaVerify = async () => {
    if (isPendingSwap) return;

    setIsPendingSwap(true);

    if (!executeRecaptcha) {
      return;
    }

    await executeRecaptcha("withdrawUSDT").then((token) => {
      handleSwap(token);
    });
  };

  useEffect(() => {
    handleUpdateInputTo();
  }, [swapConfig.rate]);

  useEffect(() => {
    if (formData.from !== "" && profile) {
      const isSufficient = checkIsSufficientQuantity(profile, tokensSelected.from, formData.from);

      if (!isSufficient) {
        setErrorsMsg({ ...errorsMsg, from: ERROR_CODE_MAPPING_MESSAGE[1] });
      } else {
        setErrorsMsg({ ...errorsMsg, from: ERROR_CODE_MAPPING_MESSAGE[0] });
      }
    }
  }, [tokensSelected.from, formData.from, profile]);

  return (
    <div>
      <div className="formSwapTokenContainer">
        <div className="rate">
          Rate:
          <div className="contentRate">
            <span className="highlight">1</span>
            {tokensSelected.to} = <span className="highlight">{swapConfig.rate}</span>{" "}
            <div className="icontokenimg mx-1">
              <IconToken token="USDT" />
            </div>
            {tokensSelected.from}
          </div>
        </div>

        <InputPrice
          ref={inputFromRef}
          className="tablebg"
          style={{
            height: "90px",
            marginBottom: "40px",
            lineHeight: 1.8,
          }}
          side="from"
          label={
            <div className="token">
              <div className="icontokenimg">
                <IconToken token="USDT" /> <span className="ps-2">USDT</span>
              </div>
            </div>
          }
          inputStyle={{ fontSize: "18px" }}
          placeholder="0.00"
          onChange={handleChangeInputFrom}
          errorBlock={renderErrorBlock(errorsMsg.from)}
          isShowError={errorsMsg.from !== null}
          value={formData.from}
          topRightBlock={
            <div className="maxBtn" onClick={handleGetAllToken}>
              {renderBalance(tokensSelected.from)}
            </div>
          }
          iconBlock={
            <div className="maxBtn" style={{ cursor: "pointer", fontWeight: 600 }} onClick={handleGetAllToken}>
              Max
            </div>
          }
        />

        <InputPrice
          side="to"
          className="tablebg"
          label={
            <div className="token">
              <IconToken token="HEWE" />
            </div>
          }
          placeholder="0.00"
          value={formData.to}
          inputStyle={{
            cursor: "default",
            fontSize: "18px",
          }}
          style={{ lineHeight: 1.8 }}
          isReadOnly={true}
          topRightBlock={<div className="maxBtn">{renderBalance(tokensSelected.to)}</div>}
        />

        <Button
          style={{ marginTop: "18px" }}
          isDisabled={isDisabledBtn}
          loading={isPendingSwap}
          onClick={handleClickBtnSwap}
        >
          Swap
        </Button>

        <Modal
          isOpen={isOpenConfirm}
          onCancel={handleCloseModalConfirm}
          onConfirm={handleRecaptchaVerify}
          confirmLoading={isPendingSwap}
          isCentered={false}
          title="Confirm swap"
          destroyOnClose={true}
        >
          <div className="modalConfirmSwapToken">
            <div className="note" style={{ fontStyle: "normal" }}>
              <span>
                Swap <span className="highlight">{formatHewe(formData.from) + " " + tokensSelected.from}</span> to{" "}
                <span className="highlight">{formData.to + " " + tokensSelected.to}</span>
              </span>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
