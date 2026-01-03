import { Link as LinkR } from "react-router-dom";
import styled from "styled-components";
import logo from "../../images/logo.png";

export const Nav = styled.nav`
  background: ${({ scrollNav, bgLogin }) =>
    bgLogin
      ? "#fff"
      : scrollNav
      ? "#000"
      : "transparent linear-gradient(90deg, #02001c 0%, #02001c 100%)"};
  background: ${({ bgLogin }) => (bgLogin ? "#fff" : "")};
  height: 90px;
  /* margin-top: -80px; */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  // border-bottom-left-radius:15px;
  border-bottom-right-radius: 15px;
  top: 0;
  z-index: 10;
  border: none;
  position: sticky;
  overflow: hidden;
  @media screen and (max-width: 960px) {
    transition: 0.8s all ease;
  }

  @media screen and (max-width: 480px) {
    height: 60px;
    transition: 0s all ease-in-out;
  }
`;

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  /* height: 68px; */
  z-index: 1;
  width: 100%;
  ${
    "" /* box-shadow: rgb(0 0 0 / 15%) 0px 15px 25px, rgb(0 0 0 / 5%) 0px 5px 10px; */
  }
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  /* max-width: 1100px; */
`;

export const NavLogo = styled(LinkR)`
  color: #fff;
  justify-self: flex-start;
  cursor: pointer;
  /* font-size: 1.5rem; */
  display: flex;
  align-items: center;
  margin-left: 24px;
  /* font-weight: bold; */
  text-decoration: none;
  /* margin-top: 15px; */

  /* .logoImage {
        width: 75%;
    } */

  @media screen and (max-width: 768px) {
    margin-left: 0px;
  }

  @media screen and (max-width: 480px) {
    margin-left: 0px;
    margin-top: 0px;
    .logoImage {
      width: 65%;
    }
  }
`;
export const SvgLogo = styled.img`
  /* color: #fff; */
  /* background: url(${logo}) no-repeat center center / cover; */
`;

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: -10px;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
  }

  @media screen and (max-width: 480px) {
    font-size: 1.5em;
    /* top: -5px; */
  }
`;

export const SidebarMobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: contents;
    position: absolute;
    top: -45px;
    /* right: 0; */
    transform: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
  }

  @media screen and (max-width: 480px) {
    font-size: 1.5em;
    /* top: -5px; */
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  margin-right: -22px;
  margin-bottom: 0;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
export const NavItem = styled.li`
  height: 80px;
`;

export const NavLinks = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 1rem;
  height: 100%;
  cursor: pointer;
  font-size: 1em;
  font-weight: 400;

  /* &.active {
        border-bottom: 3px solid #01bf71;
    } */
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(LinkR)`
  margin: 0.4em;
  border-radius: 4px;
  white-space: nowrap;
  padding: 0.25em 1em;
  color: ${(props) => (props.primary ? "#F1F1F1" : "#F1F1F1")};
  background: ${(props) => (props.primary ? "transparent" : "#FF4001")};
  border: 1px solid ${(props) => (props.primary ? "#FFFFFF" : "#FF4001")};
  font-size: 1em;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: ${(props) => (props.primary ? "transparent" : "#FF4001")};
    color: ${(props) => (props.primary ? "FFFFFF" : "#FFFFFF")};
  }
`;

export const LoginTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LoginCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const LoginAnchor = styled.a`
  color: #2b3bf6;
`;

export const NavIcon = styled(LinkR)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  @media screen and (max-width: 480px) {
    font-size: 1.5rem;
    /* top: -5px; */
  }
`;
