import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
export default function PhoneInputComponent(props) {
  const { error } = props;
  return (
    <>
      {" "}
      <div>
        {" "}
        <PhoneInput {...props} />{" "}
        {error ? (
          <p
            style={{
              paddingTop: 5,
              fontSize: 13,
              color: "red",
            }}
          >
            {" "}
            {error}
          </p>
        ) : null}
      </div>{" "}
    </>
  );
}
