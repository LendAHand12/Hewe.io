import clsx from "clsx";
import "./Button.scss";
import { Spin } from "antd";

/**
 *
 * @param {type} 'sell', 'buy'
 * @returns
 */
export const Button = ({
  children,
  onClick,
  style,
  htmlType = "button",
  type = "default",
  isDisabled = false,
  loading = false,
  loadingEl = <Spin />,
}) => {
  const btnClasses = clsx("btnContainer ", {
    sell: type === "sell",
    buy: type === "buy",
    default: type === "default" && !loading,
    defaultLoading: type === "default" && loading,
    outline: type === "outline",
    disabled: isDisabled,
  });

  return (
    <button
      className={btnClasses}
      onClick={onClick}
      style={style}
      type={htmlType}
      disabled={isDisabled}
    >
      {loading ? loadingEl : children}
    </button>
  );
};
