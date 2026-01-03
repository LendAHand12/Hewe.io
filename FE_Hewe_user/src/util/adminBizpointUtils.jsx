import { Tag } from "antd";
import { toast } from "react-toastify";
import * as web3 from "web3";

export const convertTimeCreateAt = (input) => {
  // input có thể là chuỗi TZ hoặc timestamp ms
  const date = new Date(input);
  return date.toLocaleString("vi-VN");
};

export const isValidEthereumAdress = (address) => {
  //   const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

  //   return ethereumAddressPattern.test(address);

  return address.length > 1;
};

export const formatVND = (price, isShowToken = true) => {
  try {
    return price.toLocaleString("en-US") + (isShowToken ? " đ" : "");
  } catch {
    return 0;
  }
};

export const COLORS = {
  primary: "#03801F",
};

export const renderStatusWithdrawUSDT = (value) => {
  switch (value) {
    case "PENDING":
      return (
        <Tag color="blue" style={{ fontWeight: 500 }}>
          {`Đang chờ xử lý`}
        </Tag>
      );

    case "REJECTED":
      return (
        <Tag color="red" style={{ fontWeight: 500 }}>
          {`Từ chối`}
        </Tag>
      );

    case "APPROVED":
      return (
        <Tag color="green" style={{ fontWeight: 500 }}>
          {`Thành công`}
        </Tag>
      );

    default:
      return "-";
  }
};

export const renderStatusWithdrawHEWE = (value, record) => {
  switch (value) {
    case "pending":
      return (
        <Tag color="blue" style={{ fontWeight: 500 }}>
          {`Pending`}
        </Tag>
      );

    case "rejected":
      return (
        <div>
          <Tag color="red" style={{ fontWeight: 500 }}>
            {`Rejected`}
          </Tag>

          <div style={{ marginTop: "6px" }}>Reason: {record.reason}</div>
        </div>
      );

    case "approved":
      return (
        <Tag color="green" style={{ fontWeight: 500 }}>
          {`Success`}
        </Tag>
      );

    default:
      return "-";
  }
};
export const renderStatusWithdrawAMC = (value, record) => {
  switch (value) {
    case "pending":
      return (
        <Tag color="blue" style={{ fontWeight: 500 }}>
          {`Pending`}
        </Tag>
      );

    case "rejected":
      return (
        <div>
          <Tag color="red" style={{ fontWeight: 500 }}>
            {`Rejected`}
          </Tag>

          <div style={{ marginTop: "6px" }}>Reason: {record.reason}</div>
        </div>
      );

    case "approved":
      return (
        <Tag color="green" style={{ fontWeight: 500 }}>
          {`Success`}
        </Tag>
      );

    default:
      return "-";
  }
};

export const hanldeCopy = (value) => () => {
  navigator.clipboard.writeText(value.toString());
  toast.info("Đã copy nội dung");

  return true;
};

export const renderErrorBlock = (msg) => {
  if (!msg) {
    return null;
  }

  return <div className="errorBlockContainer">{msg}</div>;
};

export const formatBCF = (number) => {
  try {
    const parseNum = Number(number);

    if (Number.isInteger(parseNum)) {
      return parseNum;
    }

    return Math.floor(100 * parseNum) / 100;
  } catch (error) {
    return number;
  }
};

export const formatHewe = (number) => {
  try {
    const parseNum = Number(number);

    if (Number.isInteger(parseNum)) {
      return parseNum;
    }

    return Math.floor(100 * parseNum) / 100;
  } catch (error) {
    return number;
  }
};

export const format4DecimalsNumber = (n, showLog = false) => {
  try {
    showLog && console.log("RUN");
    showLog && console.log("f1", n);
    const value = Number(n);
    showLog && console.log("f1 after:", value);

    showLog && console.log("f2:", value);

    if (Number.isInteger(value)) {
      return value;
    }

    return Math.floor(10000 * value) / 10000;
  } catch (error) {
    showLog && console.log("RUN ERROR");
    showLog && console.log("e", error);
    return 0;
  }
};
