import React, { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
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

export default function InputLogin(props) {
  const { error, type, icon, noBorderBottom } = props;
 
  const [showPassword, setShowPassword] = useState(false)
  return (
    <>
    <div style={{display:"flex",gap:"5px"}}>
        <div className={`input_box ${icon ? 'borderBottom' : ''} ${noBorderBottom ? '' : 'borderBottom'}`}>
        {icon ? (
        //   <SearchIcon>
        // <div style={{backgroundImage: url(icon)}}></div>
        <div>{icon}</div>
            // <i src={icon} style={{width:"20px",height:"25px"}}></img>
        //   </SearchIcon>
        ) : (
          ""
        )}
         </div>
         <div style={{display:"flex",flexDirection:"column",flex:1}}>
        <div style={{position:"relative"}}>  <input {...props} type={type==="password" ? (showPassword ? "text" : type) : "text"}/>
        {type==="password"?<div style={{position:"absolute",right:"11px",top:"11px",cursor:"pointer"}} 
        onClick={()=>{setShowPassword(!showPassword)}}>
            {showPassword?<RiEyeLine style={{fontSize:"20px"}}/>
            :
            <RiEyeOffLine style={{fontSize:"20px"}}/>
            
            }</div>:false}
          {/* {type === "password" ? (
            <i onClick={() => setShowPassword(!showPassword)} className={`fa-regular ${!showPassword ? "fa-eye-slash" : "fa-eye"}`}>

            </i>
          ) : (
            ""
          )} */}
       </div>
       <div>
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
      </div>
       </div>
       
       </div>
    </>
  );
}
