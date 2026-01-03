import "./TransferContent.scss";
import { IconUSDT, Modal, InputPrice } from "../../..";
import { HistoryTransfer } from "..";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../../hooks";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Descriptions, Result } from "antd";
import { requestTransferUSDTToUserAPI } from "../../../..//services/swapService";
import { toast } from "react-toastify";
// import { getProfile } from "~/redux/reducers/authReducer";
import { getUserNameByIdAPI } from "../../../../services/transferService";

const FEE = 0;
const MIN_WITHDRAW_USDT = 50;

const ERROR_CODE_MAPPING_MESSAGE = {
  0: null,
  1: "Địa chỉ ví không hợp lệ",
  2: "Số USDT rút tối thiểu là 50 USDT",
  3: "Số dư USDT không đủ",
  4: "Không tìm thấy profile, hãy thử lại",
  5: `Số USDT rút tối thiểu là ${MIN_WITHDRAW_USDT} USDT`,
  6: "Không tìm thấy thông tin người dùng",
  7: "Vui lòng nhập số lượng USDT cần chuyển",
  8: "Không được chuyển cho tài khoản của mình",
};

export const TransferContent = () => {
  const dispatch = useDispatch();
  const [isReloadData, setIsReloadData] = useState(false);
  const inputUserReceivedRef = useRef(null);
  const inputAmountUSDTRef = useRef(null);
  const inputAmountUSDTWithRef = useRef(null);
  const inputContentRef = useRef(null);
  const [formData, setFormData] = useState({
    userReceived: "",
    amountUSDT: "",
    amountUSDTWithFee: "",
    content: "",
  });
  const [errors, setErrors] = useState({
    userReceived: ERROR_CODE_MAPPING_MESSAGE[0],
    amountUSDT: ERROR_CODE_MAPPING_MESSAGE[0],
  });
  const { profile } = useSelector((state) => state.auth);
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const [isPendingTransfer, setIsPendingTransfer] = useState(false);
  const [userReceivedData, setUserReceivedData] = useState(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [dataAfterConfirm, setDataAfterConfirm] = useState(null);
  const {
    isOpen: isOpenModalNotif,
    handleCloseModal: handleCloseModalNotif,
    handleOpenModal: handleOpenModalNotif,
  } = useModal();
  const isDisabledBtnTransfer =
    errors.userReceived !== null ||
    errors.amountUSDT !== null ||
    !userReceivedData ||
    formData.userReceived === "" ||
    formData.amountUSDT === "";

  const handleResetAllFields = () => {
    setErrors({
      userReceived: ERROR_CODE_MAPPING_MESSAGE[0],
      amountUSDT: ERROR_CODE_MAPPING_MESSAGE[0],
    });
    setFormData({
      userReceived: "",
      amountUSDT: "",
      content: "",
      amountUSDTWithFee: "",
    });
    setUserReceivedData(null);
  };

  const handleCloseModalNotifMiddleware = () => {
    handleCloseModalNotif();
    setDataAfterConfirm(null);
  };

  const handleChangeInput = (type) => (e) => {
    const value = e.target.value;
    const regexCheckNumberWithDot = /^[0-9]+(\.[0-9]*)?$/;
    const errorsTemp = { ...errors };

    switch (type) {
      case "userReceived":
        if (value.trim().length > 8) {
          return;
        }

        if (Number(value.trim()) === profile.id) {
          setErrors({
            ...errors,
            userReceived: ERROR_CODE_MAPPING_MESSAGE[8],
          });
          setFormData({
            ...formData,
            userReceived: value,
          });

          return;
        }

        setUserReceivedData(null);
        setErrors({
          ...errors,
          amountUSDT: ERROR_CODE_MAPPING_MESSAGE[0],
          userReceived: ERROR_CODE_MAPPING_MESSAGE[0],
        });
        setFormData({
          ...formData,
          amountUSDT: "",
          amountUSDTWithFee: "",
          content: "",
          userReceived: value,
        });

        return;

      case "amountUSDT":
        if (value.length === 0) {
          setFormData({ ...formData, amountUSDT: "" });
          setErrors({ ...errors, amountUSDT: ERROR_CODE_MAPPING_MESSAGE[0] });
          return;
        }

        if (!regexCheckNumberWithDot.test(value)) {
          return;
        }

        if (!profile) {
          errorsTemp.amountUSDT = ERROR_CODE_MAPPING_MESSAGE[3];
        } else {
          errorsTemp.amountUSDT = ERROR_CODE_MAPPING_MESSAGE[0];
        }

        if (Number(value) > profile.balance) {
          errorsTemp.amountUSDT = ERROR_CODE_MAPPING_MESSAGE[3];
        } else if (Number(value) < FEE) {
          errorsTemp.amountUSDT = ERROR_CODE_MAPPING_MESSAGE[7];
        } else {
          errorsTemp.amountUSDT = ERROR_CODE_MAPPING_MESSAGE[0];
        }

        setFormData({
          ...formData,
          amountUSDT: value,
          amountUSDTWithFee: Number(value) - FEE,
        });
        setErrors(errorsTemp);
        return;

      case "content":
        setFormData({ ...formData, content: value });
        return;

      default:
        return;
    }
  };

  const handleClickBtnWithdraw = () => {
    handleOpenModal();
  };

  const handleRequestTransfer = async (token) => {
    setIsPendingTransfer(true);

    try {
      const res = await requestTransferUSDTToUserAPI({
        receiverId: Number(formData.userReceived),
        receiverName: userReceivedData.name,
        amountUSDT: Number(formData.amountUSDT),
        fee: FEE,
        content: formData.content,
        gRec: token,
      });

      toast.success(res.data.message);
      handleResetAllFields();
      handleCloseModal();
      setIsPendingTransfer(false);
      setIsReloadData(true);
      // dispatch(getProfile());
      setDataAfterConfirm(res.data.data.data);
      handleOpenModalNotif();
    } catch (error) {
      setIsPendingTransfer(false);
    }
  };

  const handleRecaptchaVerify = async () => {
    if (isPendingTransfer) return;

    setIsPendingTransfer(true);

    if (!executeRecaptcha) {
      return;
    }

    await executeRecaptcha("withdrawUSDT").then((token) => {
      handleRequestTransfer(token);
    });
  };

  const descriptionWithdrawInfo = useMemo(() => {
    return [
      {
        key: "1",
        label: `ID người nhận`,
        children: (
          <div>
            <span>{formData.userReceived}</span>
          </div>
        ),
      },
      {
        key: "2",
        label: `Tên người nhận`,
        children: (
          <div>
            <span>{userReceivedData?.name}</span>
          </div>
        ),
      },
      {
        key: "3",
        label: "Số lượng USDT chuyển",
        children: (
          <div className="center-flex-vertical">
            <div>{formData.amountUSDT}</div> <IconUSDT />
          </div>
        ),
      },
      {
        key: "fee",
        label: "Phí",
        children: (
          <div className="center-flex-vertical">
            <div>{FEE}</div> <IconUSDT />
          </div>
        ),
      },
      {
        key: "4",
        label: "Người nhận nhận được",
        children: (
          <div className="center-flex-vertical">
            <div>{formData.amountUSDTWithFee}</div> <IconUSDT />
          </div>
        ),
      },
      {
        key: "content",
        label: "Nội dung",
        children: (
          <div className="center-flex-vertical">
            <div>{formData.content}</div>
          </div>
        ),
      },
    ];
  }, [isOpen]);

  useEffect(() => {
    if (formData.userReceived.length === 8 && errors.userReceived === null) {
      const timeout = setTimeout(() => {
        getUserNameByIdAPI({ id: formData.userReceived })
          .then((res) => {
            setUserReceivedData(res.data.data);
          })
          .catch(() => {
            setErrors({
              ...errors,
              userReceived: ERROR_CODE_MAPPING_MESSAGE[6],
            });
            setUserReceivedData(null);
          });
      }, 300);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formData.userReceived]);

  return (
    <div className="withdrawContentContainer">
      {/* <div className="formTransaction">
        <InputPrice
          ref={inputUserReceivedRef}
          side="userReceived"
          value={formData.userReceived}
          label="ID người nhận"
          isFullWidth={true}
          errorBlock={renderErrorBlock(errors.userReceived)}
          isShowError={errors.userReceived !== null}
          onChange={handleChangeInput("userReceived")}
        />

        {userReceivedData && (
          <>
            <InputPrice
              isFullWidth={true}
              side="nameUserReceive"
              value={userReceivedData.name}
              label="Tên người nhận"
              isDisabled={true}
            />

            <div className="available">
              <div>Khả dụng</div>
              <div className="digit">
                {formatHewe(profile?.balance || 0)} <IconUSDT />
              </div>
            </div>

            <InputPrice
              isFullWidth={true}
              ref={inputAmountUSDTRef}
              side="amountUSDT"
              value={formData.amountUSDT}
              label="Số lượng USDT chuyển"
              errorBlock={renderErrorBlock(errors.amountUSDT)}
              isShowError={errors.amountUSDT !== null}
              onChange={handleChangeInput("amountUSDT")}
              iconBlock={<IconUSDT />}
            />

            <InputPrice
              isFullWidth={true}
              ref={inputAmountUSDTWithRef}
              side="amountUSDTWithFee"
              value={formData.amountUSDTWithFee}
              label="Người nhận sẽ nhận"
              iconBlock={<IconUSDT />}
              isDisabled={true}
            />

            <InputPrice
              isFullWidth={true}
              side="content"
              placeholder="Nhập nội dung chuyển USDT"
              ref={inputContentRef}
              label="Nội dung"
              value={formData.content}
              onChange={handleChangeInput("content")}
            />
          </>
        )}
        <Button
          isDisabled={isDisabledBtnTransfer}
          onClick={handleClickBtnWithdraw}
        >
          Chuyển
        </Button>

        <div className="description">
          <div className="note">
            <InfoIcon />{" "}
            <div className="center-flex-vertical">
              Phí chuyển: {FEE} <IconUSDT />
            </div>
          </div>
        </div>
      </div> */}

      <div>
        <Result status="warning" title="Chức năng chuyển USDT đang tạm khóa" />
      </div>

      <div className="listHistoryWithdrawContainer">
        <div className="title">Lịch sử chuyển USDT</div>
        <HistoryTransfer
          isReloadData={isReloadData}
          setIsReloadData={setIsReloadData}
        />
      </div>

      <Modal
        isOpen={isOpen}
        title="Xác nhận chuyển USDT"
        onConfirm={handleRecaptchaVerify}
        onCancel={handleCloseModal}
        width={700}
        isCentered={false}
        confirmLoading={isPendingTransfer}
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
