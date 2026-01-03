import clsx from "clsx";
import { forwardRef } from "react";
import "./Input.scss";

export const Input = forwardRef(
  (
    {
      side,
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      style,
      isFullWidth = false,
      topRightBlock = null,
      descriptionBlock = null,
      errorBlock = null,
      isShowError = false,
      iconBlock = null,
      isDisabled = false,
    },
    ref
  ) => {
    const baseClasses = clsx("inputPriceContainer", {
      error: isShowError,
      disabled: isDisabled,
    });

    const inputClasses = clsx("inputPrice", {
      isFullWidth: isFullWidth,
    });

    const handleFocusInput = () => {
      ref?.current.focus();
    };

    return (
      <div style={style} onClick={handleFocusInput}>
        <div className={baseClasses}>
          <label htmlFor={`InputPrice_${side}`}>{label}</label>
          <input
            className={inputClasses}
            ref={ref}
            id={`InputPrice_${side}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isDisabled}
          />

          <div className="iconCurrency">{iconBlock}</div>
          <div className="topRightBlock">{topRightBlock}</div>
        </div>
        {isShowError ? errorBlock : descriptionBlock}
      </div>
    );
  }
);
