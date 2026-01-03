import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { MdDashboard } from "react-icons/md";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "../../axios";
import { MenuAndBack } from "../../pages/FAQManagement/FAQElements";
import * as actionTypes from "../../store/actions";
import Overlay from "../Overlay";
import "./Dashboard.css";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
} from "./DashboardElement";

const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "0.5rem",
    textAlign: "center",
    fontSize: "0.8rem",
  },
  paperTableHeight: {
    height: "650px",
    width: "95%",
    marginLeft: "2rem",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  "@media (max-width: 780px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  "@media (max-width: 480px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  tablePaginationStyle: {
    border: "1px solid #0000001a",
    borderRadius: "0rem 0rem 0.4rem 0.4rem",
  },
  tableFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentHeight: {
    fontSize: "1rem",
  },
  displayFlex: {
    height: "auto",
    width: "95%",
    marginLeft: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0px",
  },
}));

const Dashboard = ({ history, userData }) => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (!userData) {
  //     history.push("/");
  //   }
  //   // getCount();
  // }, []);

  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showFilter, setShowFilter] = useState(false);
  const [datefiltervalue, setDateFilter] = useState();
  const closeFilterMenu = (event) => {
    if (showFilter && !event.target.closest("#yourFilterMenuId")) {
      setShowFilter(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", closeFilterMenu);
    return () => {
      document.removeEventListener("click", closeFilterMenu);
    };
  }, [showFilter]);

  const dashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await axios.get("/admin/dashboard", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setTableData(data.data);
    } catch (e) {}
  };
  useEffect(() => {
    // dashboardData();
  }, []);
  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading
              style={{ display: "flex", flexDirection: "column" }}
            >
              <MenuAndBack
                style={{
                  height: "50px",
                  backgroundColor: "#02001c",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MdDashboard style={{ fontSize: "25px", margin: "8px" }} />

                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Dashboard
                </DashHeading>
              </MenuAndBack>
            </DashboardHeading>
            <Paper
              className={classes.paperTableHeight}
              style={{
                overflow: "hidden",
                height: "100%",
                marginBottom: "0.5rem",
              }}
            ></Paper>
          </DashboardWrapper>
        </DashboardContainer>
      </div>
      {isLoading && <Overlay />}
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
)(withRouter(Dashboard));
