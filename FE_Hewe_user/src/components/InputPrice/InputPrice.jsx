import clsx from "clsx";
import { forwardRef, useState } from "react";
import "./InputPrice.scss";

export const InputPrice = forwardRef(
  (
    {
      side,
      label,
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      style,
      inputStyle,
      isReadOnly = false,
      isFullWidth = false,
      topRightBlock = null,
      descriptionBlock = null,
      errorBlock = null,
      isShowError = false,
      iconBlock = null,
      isDisabled = false,
      type = "text",
    },
    ref
  ) => {
    const isInputTypePassword = type === "password";
    const [isShowPassword, setIsShowPassword] = useState(isInputTypePassword);
    const [inputType, setInputType] = useState(type);

    const baseClasses = clsx("InputPrice tablebg", {
      error: isShowError,
      disabled: isDisabled,
    });

    const inputClasses = clsx("inputPrice", {
      isFullWidth: isFullWidth,
    });

    const handleFocusInput = () => {
      // if (!ref) return;
      // ref?.current.focus();
    };

    const handleToggleShowPassword = (e) => {
      e.stopPropagation();
      setIsShowPassword(!isShowPassword);
      setInputType(isShowPassword ? "text" : "password");
    };

    return (
      <div style={style} onClick={handleFocusInput}>
        <div className={baseClasses}>
          <label htmlFor={`InputPrice_${side}`}>{label}</label>
          <input
            style={inputStyle}
            readOnly={isReadOnly}
            type={inputType}
            className={inputClasses}
            ref={ref}
            id={`InputPrice_${side}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={isDisabled}
          />

          {isInputTypePassword && (
            <div className="iconEye" onClick={handleToggleShowPassword}>
              <i
                className=" fa-regular fa-eye"
                style={{ display: isShowPassword ? "block" : "none" }}
              ></i>
              <i
                className="fa-regular fa-eye-slash"
                style={{ display: !isShowPassword ? "block" : "none" }}
              ></i>
            </div>
          )}

          <div className="iconCurrency">{iconBlock}</div>
          <div className="topRightBlock">{topRightBlock}</div>
        </div>
        {isShowError ? errorBlock : descriptionBlock}
      </div>
    );
  }
);
