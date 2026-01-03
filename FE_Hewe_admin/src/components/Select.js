import React from "react";
import Select from "react-select";
import "./SelectStyle.css";

function SelectInput(props) {
  const { error } = props;
  return (
    <div>
      <Select isClearable formatCreateLabel={(userInput) => `${userInput} (Add New Address)`} {...props} />
      {error ? <p style={{ paddingTop: 5, fontSize: 13, color: "red", textAlign: "left" }}>{error}</p> : null}
    </div>
  );
}

export default SelectInput;
