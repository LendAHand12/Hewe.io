import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Input as InputAntd, Radio } from "antd";
import React from "react";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table as TableAntd } from "../../components/AntdComponent";
import * as actionTypes from "../../store/actions";
import "./AddEditBlog.css";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  MenuAndBack,
} from "./BlogElements";
import { useDepositUSDT } from "./useDepositUSDT";

const useStyles = makeStyles((theme) => ({
  paperTableHeight: {
    height: "60vh",
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
    tableContainerHeight: {
      maxHeight: "64vh",
    },
  },
  "@media (max-width: 968px)": {
    tableContainerHeight: {
      maxHeight: "64vh",
    },
  },
  "@media (max-width: 480px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
}));

const DepositUSDT = () => {
  const classes = useStyles();

  // GET LIST BUY HEWE
  const {
    x,
    y,
    totalItems,
    currentPage,
    data,
    loading,
    columns,
    limitPerRow,
    inputValue,
    network,
    keyword,
    handleChangeKeyword,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    handleChangeNetwork,
  } = useDepositUSDT();

  return (
    <DashboardContainer>
      <DashboardWrapper>
        <DashboardHeading style={{ display: "flex", flexDirection: "column" }}>
          <MenuAndBack
            style={{
              backgroundColor: "none",
              width: "100%",
              color: "#02001c",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              class="fa-solid fa-user-tie"
              style={{ fontSize: "25px", margin: "8px" }}
            ></i>

            <DashHeading
              style={{ color: "#02001c", flex: "1", padding: "8px" }}
            >
              Deposit USDT
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
        >
          <div
            style={{
              padding: "16px",
              maxHeight: "75vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Radio.Group onChange={handleChangeNetwork} value={network}>
                <Radio value={"BEP20"}>BEP20</Radio>
                <Radio value={"ERC20"}>ERC20</Radio>
                <Radio value={"TRC20"}>TRC20</Radio>
              </Radio.Group>
              <InputAntd
                value={keyword}
                onChange={handleChangeKeyword}
                style={{ maxWidth: "300px" }}
                placeholder="Search..."
              />
            </div>

            <TableAntd
              isShowTitle={true}
              title="History transaction"
              rowKey="id"
              x={x}
              y={y}
              totalItems={totalItems}
              data={data}
              currentPage={currentPage}
              isLoading={loading}
              columns={columns}
              onChangePage={handleSetCurrentPage}
              limit={limitPerRow}
              onChangeLimitPerRow={handleSetLimitPerRow}
            />
          </div>
        </Paper>
      </DashboardWrapper>
    </DashboardContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    locationData: state.locations,
    defaultState: state.defaultState,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DepositUSDT));
