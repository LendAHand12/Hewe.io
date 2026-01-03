import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import backgroundImage from "../../images/HeweBg.jpg";
import blurbox from "../../images/blurbox.png";

export const InfoContainer = styled.div`
  color: #fff;
  background: ${({ lightBg }) => (lightBg ? "#f9f9f9" : "#ffffff")};

  /* @media screen and (max-width: 768px) {
        padding: 100px 0;
    } */
`;

export const InfoWrapper = styled.div`
  background-image: url(${backgroundImage}); // Set the background image
  background-size: cover; // Adjust the background size as needed
  background-position: center;
  
  display: grid;
  z-index: 1;
  height: 100vh;
  width: 100%;
  /* max-width: 1100px; */
  margin-right: auto;
  margin-left: auto;
  /* padding: 0 24px; */
  justify-content: center;
`;

export const InfoRow = styled.div`
  height: 100%;

  width: 100vw;

  display: flex;

  @media screen and (max-width: 768px) {
    grid-template-areas: auto auto;
  }
`;
export const Column1 = styled.div`
  width: auto;
  display: flex;
  margin:auto -24px;
  justify-content: center;
  align-items: center;
  background-image: url(${blurbox}); // Set the background image
  background-size: cover; // Adjust the background size as needed
  background-position: center;
  height:80%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
export const Column2 = styled.div`
  /* margin-bottom: 15px;
    padding: 0 15px; */
  grid-area: col1;
  height: 100%;
  width: 63vw;

  @media screen and (max-width: 1300px) {
    width: 50vw;
  }

  @media screen and (max-width: 950px) {
    width: 40vw;
  }
  @media screen and (max-width: 768px) {
    // width: 100vw;
    display: none;
  }

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

export const TextWrapper = styled.div`
  height: auto;

  width: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  @media screen and (max-width: 768px) {
    padding: 0 2rem 0 2rem;
  }
`;

export const TopLine = styled.p`
  color: #01bf71;
  font-size: 16px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

export const Heading = styled.h1`
  margin-bottom: 24px;
  font-size: 48px;
  line-height: 1.1;
  font-weight: 600;
  color: ${({ lightText }) => (lightText ? "#f7f8fa" : "#010606")};

  @media screen and (max-width: 480px) {
    font-size: 32px;
  }
`;

export const SubTitle = styled.p`
  max-width: 440px;
  margin-bottom: 35px;
  font-size: 18px;
  line-height: 24px;
  color: ${({ darkText }) => (darkText ? "#010606" : "#fff")};
`;

export const BtnWrap = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const ImgWrap = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const Img = styled.img`
  width: 100%;
  /* margin: 0 0 10px 0; */
  padding-right: 0;
  height: 100%;
`;

export const LoginBox = styled.div`
  padding: 2rem 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media screen and (max-width: 480px) {
    margin-top: 0rem;
    padding: 0rem 1rem;
  }
`;

export const LoginHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  width: 100%;
  text-align: center;
  font: normal normal 600 35px/42px Lato;
  letter-spacing: 0px;
  color: #ffffff;
  opacity: 1;
  font-size: 22px;
  margin-bottom: 0.2rem;

  @media screen and (max-width: 420px) {
    font-size: 25px;
    margin-bottom: 0rem;
  }

  @media screen and (max-width: 320px) {
    font-size: 20px;
    margin-bottom: 0rem;
  }
`;

export const LoginPara = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fffff;
  text-align: ${({ textAlign }) => (textAlign ? "center" : "left")};
  font: normal normal normal 10px/22px Lato;
  letter-spacing: 0px;
  opacity: 1;
  width: 100%;
  font-size: 18px;
  // padding-left: 1rem;
`;
export const InputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: black;
`;
export const LoginButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const LoginButton = styled.button`
  box-shadow: 0px 0px 10px #00000030;
  border-radius: 10px;
  opacity: 1;
  margin: 0.4em;
  white-space: nowrap;
  padding: ${({ big }) => (big ? "0.5em 2em" : "0.6em 2.5em")};
  border: none;
  font-weight: 700;
  background: var(--g2, linear-gradient(180deg, #02FFB3 32.9%, #00A3FF 75.4%));
  color: ${({ primary }) => (primary ? "#000000" : "#000000")};
  /* border: 1px solid ${({ primary }) => (primary ? "#FFFFFF" : "#FF4001")}; */
  font-size: ${({ fontBig }) => (fontBig ? "1.2rem" : "1rem")};
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  /* &:hover {
            transition: all 0.2s ease-in-out;
            background: ${({ primary }) =>
    primary ? "#FF4001" : "transparent"};
            border: 1px solid ${({ primary }) =>
    primary ? "#FF4001" : "#FFFFFF"};
            color: ${(dark) => (dark ? "#F1F1F1" : "#F1F1F1")};
        } */

  @media screen and (max-width: 768px) {
    margin: 0.5em;
    margin-left: 0;
    // padding: ${({ big }) => (big ? "0.5em 2em" : "1.2em 1.5em")};
    font-size: ${({ fontBig }) => (fontBig ? "1.2em" : "1rem")};
  }

  @media screen and (max-width: 480px) {
    margin: 0.5em;
    margin-left: 0;
    padding: ${({ big }) => (big ? "0.5em 2em" : "1.2em 1.5em")};
    font-size: ${({ fontBig }) => (fontBig ? "1.2em" : "1rem")};
  }
`;
export const LabelHeading = styled.div`
  color: #000000;
  text-align: left;
  font-size: 22px;
  // padding: 0rem 0rem;
`;
export const LabelPara = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  color: #000000;
  font-size: 18px;
`;

export const SelectServiceBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;

  @media screen and (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const ProfileTime = styled.div`
  display: flex;
  width: 59%;
  justify-content: flex-end;
  align-items: center;
`;

export const ProfileDayTime = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const LanguageLogout = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #000;
`;
export const LanguageIcon = styled.div`
  padding: 1rem;
  margin-top: 0.5rem;
`;
export const LogoutIcon = styled.div`
  padding: 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
`;

export const SearchIcon = styled.span`
  width: 8%;
  padding: 5px;
  text-align: center;
  color: #000000;
  /* font-size: 20px; */
  background: #ffffff;
  border-radius: 8px 0px 0px 8px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoginButtonLink = styled(Link)`
  box-shadow: 0px 0px 10px #00000030;
  border-radius: 32px;
  opacity: 1;
  margin: 0.4em;
  width: 100%;
  white-space: nowrap;
  padding: ${({ big }) => (big ? "0.5em 2em" : "1.2em 1.5em")};
  border: none;
  font-weight: 700;
  background: ${({ primary }) =>
    primary
      ? "#F9ECFD"
      : "transparent linear-gradient(90deg, #E42279 0%, #6C1D63 100%) 0% 0% no-repeat padding-box"};
  color: ${({ primary }) => (primary ? "#000000" : "#FFFFFF")};
  /* border: 1px solid ${({ primary }) => (primary ? "#FFFFFF" : "#FF4001")}; */
  font-size: ${({ fontBig }) => (fontBig ? "1.2rem" : "1rem")};
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  // justify-content: ${({ primary }) =>
    primary ? "center" : "space-between"};
  align-items: center;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  /* &:hover {
        transition: all 0.2s ease-in-out;
        background: ${({ primary }) => (primary ? "#FF4001" : "transparent")};
        border: 1px solid ${({ primary }) => (primary ? "#FF4001" : "#FFFFFF")};
        color: ${(dark) => (dark ? "#F1F1F1" : "#F1F1F1")};
    } */

  @media screen and (max-width: 768px) {
    margin: 0.5em;
    margin-left: 0;
    padding: ${({ big }) => (big ? "0.5em 2em" : "1.2em 1.5em")};
    font-size: ${({ fontBig }) => (fontBig ? "1.2em" : "1rem")};
  }

  @media screen and (max-width: 480px) {
    margin: 0.5em;
    margin-left: 0;
    padding: ${({ big }) => (big ? "0.5em 2em" : "1.2em 1.5em")};
    font-size: ${({ fontBig }) => (fontBig ? "1.2em" : "1rem")};
  }
`;

export const LoginBtnWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-item:center;
    margin: 20px 0;
}

`;

export const LogoMenzil = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
}

`;
