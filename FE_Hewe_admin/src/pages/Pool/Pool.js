import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input, InputNumber } from "antd";
import React from "react";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions";
import "./AddEditBlog.css";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  MenuAndBack,
} from "./BlogElements";
import { usePool } from "./usePool";
import { useTransactionOrder } from "./useTransactionOrder";
import { Table as TableAntd } from "../../components/AntdComponent";

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

const Pool = () => {
  const classes = useStyles();

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
    tokenFilter,
    keyword,
    handleChangeKeyword,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    handleChangeTokenFilter,
    handleRetchData,
  } = useTransactionOrder();
  const { poolHewe, poolUsdt, hdChange, hdUpdate } = usePool();

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
              Pool
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
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                <span>HEWE</span>
                <InputNumber
                  size="large"
                  controls={false}
                  value={poolHewe}
                  onChange={(num) => hdChange("hewe", num)}
                  style={{ width: 200 }}
                />

                <Button
                  size="large"
                  type="primary"
                  onClick={() => hdUpdate("hewe")}
                >
                  Update
                </Button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 15,
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <span>USDT</span>
                <InputNumber
                  size="large"
                  controls={false}
                  value={poolUsdt}
                  onChange={(num) => hdChange("usdt", num)}
                  style={{ width: 200 }}
                />
                <Button
                  size="large"
                  type="primary"
                  onClick={() => hdUpdate("usdt")}
                >
                  Update
                </Button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "16px",
              }}
            >
              <Button onClick={handleRetchData}>Refresh data</Button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "16px",
              }}
            >
              <Input
                placeholder="Search..."
                value={keyword}
                onChange={handleChangeKeyword}
                style={{ maxWidth: "350px" }}
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
              isShowPagination={false}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Pool));
