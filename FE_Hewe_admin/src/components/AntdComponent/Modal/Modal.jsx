import { Modal as ModalAntd } from "antd";

export const Modal = ({
  isOpen,
  title,
  confirmLoading,
  onConfirm,
  onCancel,
  children,
  size,
  width,
  okText = "Confirm",
  cancelText = "Cancel",
  isDangerButton = false,
  isShowFooter = true,
  isDisabledBtn = false,
  destroyOnClose = false,
  isCentered = true,
  maskClosable = false,
}) => {
  return (
    <ModalAntd
      open={isOpen}
      title={title}
      okText={okText}
      destroyOnClose={destroyOnClose}
      cancelText={cancelText}
      centered={isCentered}
      footer={isShowFooter ? undefined : null}
      okButtonProps={{ danger: isDangerButton, size, disabled: isDisabledBtn }}
      cancelButtonProps={{ size }}
      onCancel={onCancel}
      onOk={onConfirm}
      confirmLoading={confirmLoading}
      width={width}
      styles={{ body: { maxHeight: "calc(100vh - 200px)", overflowY: "auto" } }}
      maskClosable={maskClosable}
    >
      {children}
    </ModalAntd>
  );
};
