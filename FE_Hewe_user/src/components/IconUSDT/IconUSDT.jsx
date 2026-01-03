import usdtIcon from "../../assets/icons/usdt.svg";

export const IconUSDT = ({ style }) => {
  return (
    <img
      src={usdtIcon}
      style={{ width: "18px", height: "18px", display: "inline", ...style }}
    />
  );
};
