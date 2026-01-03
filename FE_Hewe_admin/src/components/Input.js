import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import styled from 'styled-components';

const SearchIcon = styled.span`
    width: 8%;
    padding: 5px;
    text-align: center;
    color: #000000;
    /* font-size: 20px; */
    background: #FFFFFF;
    border-radius: 8px 0px 0px 8px;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`

export default function Input(props) {
  const { error, type, icon, noBorderBottom,value,minDate } = props;
  const [showPassword, setShowPassword] = useState(false)
  return (
    <>
        {type!=="Customdate"?<div className={`input_box ${icon ? 'borderBottom' : ''} ${noBorderBottom ? '' : 'borderBottom'}`}>
        {icon ? (
          <SearchIcon>
            <img src={icon}></img>
          </SearchIcon>
        ) : (
          ""
        )}
          <input {...props} type={type ? (showPassword ? "text" : type) : "text"}/>
          {type === "password" ? (
            <i onClick={() => setShowPassword(!showPassword)} className={`fa ${!showPassword ? "fa-eye-slash" : "fa-eye"}`}>

            </i>
          ) : (
            ""
          )}
        </div>:
         <div className="DatepickerCustomCss"><DatePicker
         {...props}
        //  style={{width:"100%"}}
value={value}
format="dd/MM/yyyy"
minDate={minDate}
// showLeadingZeros={true}

/></div>}
      {error ? (
        <p
          style={{
            paddingTop: 5,
            fontSize: 13,
            color: "red",
            textAlign: "left"
          }}>
          {error}
        </p>
      ) : null}
    </>
  );
}
