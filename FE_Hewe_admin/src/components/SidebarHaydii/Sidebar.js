import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons/lib";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import axios from "../../axios";
import backgroundImage from "../../images/sidebarImg.png";
import * as actionTypes from "../../store/actions";
import { SidebarData } from "./SidebarData";
import "./sidebarScrollDesign.css";
import SubMenu from "./SubMenu";

// const Nav = styled.div`
//     background: #15171c;
//     height: 80px;
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
// `
const NavIcon = styled.div`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const SidebarNav = styled.nav`
  background: #02001c;
  width: 280px;
  height: 95vh;
  background-image: url(${backgroundImage}); // Set the background image
  background-size: 240px; // Adjust the background size as needed
  background-position: bottom left;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  position: fixed;
  border-top-right-radius: 15px;

  transition: 100ms;
  z-index: 8;

  @media (max-width: 756px) {
    width: 200px;
  }
`;
const SidebarWrap = styled.div`
  width: 100%;
  overflow-x: hidden;
  /* overflow-y: hidden; */
  box-shadow: rgb(0 0 0 / 10%) 0px 4px 12px;
  height: 85vh;
`;

const BannerImage = styled.div`
  margin-left: 2rem;
  font-size: 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaebee;
  margin-right: 1rem;
  height: 100px;
`;

const RestaurantImage = styled.img`
  width: 60px;
  height: 60px;
  margin-top: 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
`;
export const BannerContent = styled.div`
  width: 100%;
  height: 60px;
  margin-top: 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const BannerCity = styled.div`
  text-align: left;
  font-size: 17px;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
  width: 100%;
`;
export const BannerState = styled.div`
  text-align: left;
  font-size: 14px;
  letter-spacing: 0px;
  color: #000000;
  opacity: 0.5;
  // width: 100%;
  text-overflow: ellipsis;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
`;

// export const StartLogo = styled.div`
//      height: auto;
//      width: auto;
//      display: flex;
//      align-items: center;
// `

export const Rating = styled.p`
  color: #878997;
  font-size: 0.8rem;
`;

export const SidebarDiv = styled.p`
  margin-top: 2rem;
`;

const Sidebar = ({ userData, sidebar, setSidebar }) => {
  const [data, setData] = useState([]);
  console.log("run outside");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const { data } = await axios.get(`/getModulesOfAdmin?email=${email}`, {
          headers: {
            Authorization: token,
          },
        });

        setData(data.data.access_module);
      } catch (err) {
        console.log(err);
        console.log("RUN");
      }
    };

    fetchData();
  }, []);

  const showSidebar = () => setSidebar(!sidebar);
  // let stateAccessModule = ["User Management", "Transaction Management", "Support Ticket", "SubAdmin Management"];

  let new_routes = data.map((item) => {
    return item.access_module;
  });
  let stateAccessModule = new_routes;

  return (
    <IconContext.Provider value={{ color: "#fffff" }}>
      <SidebarNav sidebar={sidebar}>
        <SidebarWrap className="designScrollbarSide">
          <SidebarDiv></SidebarDiv>
          {SidebarData.filter((data, index) =>
            stateAccessModule.includes(data.title)
          ).map((item, index) => {
            return <SubMenu item={item} key={index} style={{ color: "red" }} />;
          })}
        </SidebarWrap>
      </SidebarNav>
    </IconContext.Provider>
  );
};

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
    setSidebar: (updatedValue) => {
      dispatch({
        type: actionTypes.UPDATE_SIDEBAR,
        updateSidebar: updatedValue,
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Sidebar));
