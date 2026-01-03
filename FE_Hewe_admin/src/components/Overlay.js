import React from "react";
import styled, { keyframes, withTheme } from "styled-components";
// import { FlexWrapper } from "./StyledComponents";




const OverWrapper = styled.div(
  props => `
    display: flex;
    flex-direction: ${props.direction || "column"};
    justify-content: ${props.justifyContent || "flex-start"};
    align-items: ${props.alignItems || "flex-start"};
    position:${props.position ? props.position : "fixed"} ;
    width: 100%;
    height: ${props.viewheight ? props.viewheight : "fixed"};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:${props.backgroundColor || "rgba(0, 0, 0, 0.5)"};
    z-index: 999999999;
    cursor: pointer;
`
);
const spin = keyframes`
0% { transform: rotate(0deg) }
100% {transform: rotate(360deg) }
`;
const Circle = styled.div`
  border: 3px solid ${props => props.theme.primary};
  border-top: 3px solid #fff;
  border-radius: 50%;
  margin: auto;
  width: 60px;
  height: 60px;
  animation: ${spin} 0.6s linear infinite;
  transition: 0.2s;
`;

function Overlay(props) {
  const { position, direction, backgroundColor, viewheight } = props;
  return (
    <OverWrapper
      position={position}
      direction={direction}
      backgroundColor={backgroundColor}
      viewheight={viewheight}
    >
      <Circle />
    </OverWrapper>
  );
}

export default withTheme(Overlay);
