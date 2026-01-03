import React, { useState } from "react";
import styled from "styled-components/macro";
import { withRouter, NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";

const SidebarLink = styled(Link)`
  display: flex;
  color: #ffffff;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0px 18px 18px;
  border-radius: 10px;
  padding: 0px 5px;
  margin: 0px 5px;
  margin-top: 10px;
  height: 50px;
  text-decoration: none;
  font-size: 15px;
  background: ${({ sidebarActive }) => (sidebarActive ? "#ffffff" : "#02001c")};

  /* &:hover {
        background: #EB7D35;
        color: white;
        cursor: pointer;
    } */
`;
const SidebarLabel = styled.span`
  /* color: #fffff; */
  text-align: left;
  width: 75%;
  &:hover {
    color: #fff;
    // color: #fff;
  }
  @media (max-width: 756px) {
    font-size: 12px;
  }
`;

const DropdownLink = styled(Link)`
  /* background: #414757; */
  height: 45px;
  padding-left: 2rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  // font-size: 18px;

  background: ${({ sidebarActive }) => (sidebarActive ? "#6050dc" : "#FFFFFF")};

  &:hover {
    color: #ffffff;
    // color: #fff;
  }
`;

const IconLabel = styled.div`
  width: 100%;
  border-radius: 1.5px;
  // color: grey;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: baseline;
  color: ${({ sidebarActive }) => (sidebarActive ? "#02001c" : "#fff")};

  &:hover {
    ${"" /* border-right: 2.5px solid #EB7D35; */}
    cursor: pointer;
  }
  @media (max-width: 756px) {
    font-size: 12px;
  }
`;

const SidebarIcon = styled.span`
  color: ${({ sidebarActive }) => sidebarActive && "white"};
`;
const SubMenu = ({ userData, item, history, sidebar, setSidebar }) => {
  // console.log("item".item);

  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  const showSidebar = () => setSidebar(!sidebar);

  // console.log("history.location.pathname", history.location.pathname);
  const sidePathname = history.location.pathname.split("/")[2];
  // console.log("sidePathname", sidePathname);

  // if(history.location.pathname==='/view-details'){
  //   console.log('print right')
  //   history.location.pathname= "/leads-management"
  // }
  return (
    <>
      <SidebarLink
        sidebarActive={
          history.location.pathname == item.path ||
          (history.location.pathname == "/view-details" &&
            item.title === "Leads Management") ||
          sidePathname == item.path.split("/")[2]
            ? true
            : false
        }
        to={item.path}
        // onClick={() => {
        //     history.push(item.path)
        // }}
        onClick={(item.subNav && showSubnav) || (!sidebar ? showSidebar : "")}
        // style={{ borderRight: history.location.pathname == item.path ? "2px solid #D90066" : "" }}
      >
        <IconLabel
          sidebarActive={
            history.location.pathname == item.path ||
            (history.location.pathname == "/view-details" &&
              item.title === "Leads Management") ||
            sidePathname == item.path.split("/")[2]
              ? true
              : false
          }

          // style={{ color: history.location.pathname == item.path ? "#fff" : "black" }}
        >
          {/* {item.icon} */}

          <SidebarIcon>{item.icon}</SidebarIcon>

          <SidebarLabel
            style={{
              color: history.location.pathname == item.path ? "#02001C " : "",
              fontWeight: history.location.pathname == item.path ? "600" : "",
            }}
          >
            {item.title}
          </SidebarLabel>
          <SidebarIcon>{item.sideicon}</SidebarIcon>
        </IconLabel>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink
              to={item.path}
              sidebarActive={
                history.location.pathname == item.path ||
                sidePathname == item.path.split("/")[2]
                  ? true
                  : false
              }
              key={index}
            >
              <IconLabel
                style={{
                  color: history.location.pathname == item.path ? "#fff" : "",
                }}
              >
                {/* {item.icon} */}
                {item.icon}
                <SidebarLabel
                  style={{
                    color: history.location.pathname == item.path ? "#fff" : "",
                    fontWeight:
                      history.location.pathname == item.path ? "500" : "",
                  }}
                >
                  {item.title}
                </SidebarLabel>
              </IconLabel>
            </DropdownLink>
          );
        })}
    </>
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
)(withRouter(SubMenu));
