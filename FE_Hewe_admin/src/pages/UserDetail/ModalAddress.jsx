import { message, Modal } from "antd";
import React from "react";

export default function ModalAddress({ open, setOpen, modalData, setModalData }) {
  if (!modalData) return null;

  const hdCloseModalAndClearData = () => {
    setOpen(false);
    setModalData(null);
  };

  const hdCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  return (
    <Modal
      centered
      title={null}
      open={open}
      onOk={() => hdCloseModalAndClearData()}
      onCancel={() => hdCloseModalAndClearData()}
      footer={null}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <div className="title">Address</div>

          <div>
            <b className="content">{modalData.data.address}</b>
            <i
              className="fa-regular fa-copy"
              style={{ cursor: "pointer", marginLeft: 10 }}
              onClick={() => hdCopy(modalData.data.address)}
            ></i>
          </div>
        </div>

        <div>
          <div className="title">Private key</div>

          <div>
            <b className="content">{modalData.data.privateKey}</b>
            <i
              className="fa-regular fa-copy"
              style={{ cursor: "pointer", marginLeft: 10 }}
              onClick={() => hdCopy(modalData.data.privateKey)}
            ></i>
          </div>
        </div>
      </div>
    </Modal>
  );
}
