import clsx from "clsx";
import { useState } from "react";
import "./SwitchSide.scss";

export const SwitchSide = ({ onClickSend, onClickReceive, style }) => {
  const [isSendBtnActive, setIsSendBtnActive] = useState(true);

  const btnSendClasses = clsx("btn send", {
    active: isSendBtnActive,
  });

  const btnReceiveClasses = clsx("btn receive", {
    active: !isSendBtnActive,
  });

  const handleClickSendBtn = () => {
    setIsSendBtnActive(true);
    onClickSend();
  };

  const handleClickReceiveBtn = () => {
    setIsSendBtnActive(false);
    onClickReceive();
  };

  const containerClasses = clsx("switchSideContainer", {
    isReceive: !isSendBtnActive,
  });

  return (
    <div className={containerClasses} style={style}>
      <div className={btnSendClasses} onClick={handleClickSendBtn}>
        Chuyển
      </div>
      <div className={btnReceiveClasses} onClick={handleClickReceiveBtn}>
        Nhận
      </div>
    </div>
  );
};
