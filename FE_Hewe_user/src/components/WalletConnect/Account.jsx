import { useWeb3Modal } from "@web3modal/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import getWeb3 from "../../function/getWeb3";

export default function Account() {
  const { open, isOpen } = useWeb3Modal();
  const account = useAccount();
  const dispatch = useDispatch();

  const renderShortAddress = (address) =>
    address.slice(0, 4) + "..." + address.slice(-4);

  const renderButtonContent = () => {
    if (account.address) return renderShortAddress(account.address);
    else return "Connect Wallet";
  };

  const onConnect = async (address) => {
    // hàm chạy mỗi khi kết nối thành công hoặc khi reload nó tự kết nối lại
    // lưu địa chỉ lên redux
    try {
      const web3 = await getWeb3();
      dispatch({ type: "ON_CONNECT", payload: address });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (account.address && account.address.startsWith("0x")) {
      //   if (window.innerWidth > 992) {
      //     // desktop
      //     // message.success("Connected successfully");
      //   }
      onConnect(account.address);
    } else {
      dispatch({ type: "ON_DISCONNECT" });
    }
  }, [account.address]);

  return (
    <button
      type="primary"
      onClick={() => {
        console.log("dsdsd");
        open();
      }}
      id="mmConnect"
    >
      <i
        className="fa-solid fa-wallet"
        style={{ fontSize: 14, marginRight: 8 }}
      ></i>
      {renderButtonContent()}
    </button>
  );
}
