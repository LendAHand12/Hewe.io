import styled from "styled-components";

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 280px;

  @media screen and (max-width: 1060px) {
    width: 280px;
  }
  @media screen and (max-width: 980px) {
    width: 169px;
  }

  @media screen and (max-width: 768px) {
    width: 165px;
  }

  @media screen and (max-width: 520px) {
    width: 150px;
  }

  @media screen and (max-width: 480px) {
    width: 90px;
  }
  @media screen and (max-width: 320px) {
    width: 80px;
  }
`;

export const SearchBar = styled.div`
  justify-content: end;
  position: relative;
  display: flex;
  height: 46px;
  width: 350px; @media screen and (max-width: 480px) {
    height: 44px;
    width: 250px;
  }
  @media screen and (max-width: 320px) {
    height: 42px;
    width: 200px;
  }
`;

export const SearchIcon = styled.span`
  width: 30px;
  text-align: center;
  color: #000000;
  //  font-size: 8px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 8px 0px 0px 8px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 480px) {
    width: 25px;
  }
  @media screen and (max-width: 320px) {
    width: 20px;
  }
`;

export const SearchInput = styled.input`
  width: 92%;
  border: none;
  padding: 5px;
  outline: none;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 0px 8px 8px 0px;
  opacity: 1;
  color: #000000d6;

  &::placeholder {
    color: #c4c4c4;
  }
`;
