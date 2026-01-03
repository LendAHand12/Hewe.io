import clsx from "clsx";
import "./IconToken.scss";
import { IconUSDT } from "../IconUSDT/IconUSDT";
import tokenHewe from "../../assets/logo/logo1.png";

export const IconToken = ({ token, style }) => {
  const classes = clsx("iconTokenContainer", {
    hewe: token === "HEWE",
    usdt: token === "USDT",
  });

  switch (token) {
    case "HEWE":
      // return <img className={classes} style={style} src={tokenHewe} />;
      return <span>HEWE</span>;

    case "USDT":
      return <IconUSDT />;

    default:
      return null;
  }
};
