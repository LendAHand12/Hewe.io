import React from "react";
import styled, { keyframes, withTheme } from "styled-components";
// import { FlexWrapper } from "./StyledComponents";
import { connect } from "react-redux";
import * as actionTypes from "../store/actions";




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
    z-index: 99;
    cursor: pointer;
    margin-left: 280px;
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
  const { position, direction, backgroundColor, viewheight, sidebar, setSidebar } = props;


  const showSidebar = () => setSidebar(!sidebar)


  return (
    <OverWrapper
      position={position}
      direction={direction}
      backgroundColor={backgroundColor}
      viewheight={viewheight}
      onClick={showSidebar}
    >
    </OverWrapper>
  );
}


const mapStateToProps = (state) => {
    return {
      userData: state.userData,
      locationData: state.locations,
      defaultState: state.defaultState,
      sidebar: state.sidebar,
    };
  };
  
  
  const mapDispatchToProps = (dispatch) => {
    return {
      setUsers: (updatedValue) => {
        dispatch({
          type: actionTypes.UPDATE_USER,
          updatedUser: updatedValue,
        });
      },
      setDefaultState: (updatedValue) => {
        dispatch({
          type: actionTypes.UPDATE_DEFAULT,
          updateDefault: updatedValue,
        });
      },
      setSidebar : (updatedValue) => {
        dispatch({
            type: actionTypes.UPDATE_SIDEBAR,
            updateSidebar: updatedValue,
        });
    }
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Overlay));

