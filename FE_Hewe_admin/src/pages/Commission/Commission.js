import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import "./AddEditBlog.css";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  MenuAndBack,
} from "./BlogElements";
// import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from "../../components/Overlay";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions";
// import { uploadImage } from "../../utils/functions";
import { Button, Input as InputAntd, InputNumber, message } from "antd";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { toast } from "react-toastify";
import instance from "../../axios";
import {
  Modal as ModalAntd,
  Table as TableAntd,
} from "../../components/AntdComponent";
import { useCommission } from "./useCommission";

const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablseHeadingCell: {
    textAlign: "center",
    fontWeight: "600",
  },
  tablePadding: {
    padding: "5px",
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: "800",
  },
  tableContainerHeight: {
    height: "60vh",
  },
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
  tablePaginationStyle: {
    border: "1px solid #0000001a",
    borderRadius: "0rem 0rem 0.4rem 0.4rem",
    overflowY: "hidden",
  },
  tableFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  searchDesign: {
    borderRadius: "20px",
    boxShadow: "none",
    width: "21%",
  },
}));

const Commission = ({ history, setUsers, userData }) => {
  const classes = useStyles();

  const [percent, setPercent] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalData, setTotalData] = useState(90);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [subadminData, setSubadminData] = useState({
    email: "",
    password: "",
    access_module: "",
    role: "",
    id: "",
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const options = [
    { value: "SUBADMIN", label: "SUBADMIN" },
    { value: "ADMIN", label: "ADMIN" },
  ];
  // useEffect(() => {
  //   getAdminList();
  // }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const adminGetPercent = async () => {
    try {
      const res = await instance.get(`/adminGetCommissionPercentage`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setPercent(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const adminUpdatePercent = async (newValue) => {
    try {
      const res = await instance.post(
        `/adminUpdateCommissionPercentage`,
        {
          newValue,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      message.success(res.data.message);
      adminGetPercent();
    } catch (error) {
      console.log(error);
      message.error("Error");
    }
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    // console.log(stabilizedThis.map((el) => el[0]));
    return stabilizedThis.map((el) => el[0]);
  };

  function getComparator(order, orderBy) {
    // return  (a, b) => descendingComparator(a, b, orderBy)
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return 1;
    }
    if (b[orderBy] > a[orderBy]) {
      return -1;
    }
    return 0;
  }

  const getAdminList = async (
    page = 1,
    rowsPerPage = 15,
    searchValue = "",
    startDate = "",
    endDate = "",
    dateFilter = ""
  ) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `/getAllSubAdmin?page=${page}&pageSize=${rowsPerPage}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTableData(data.data);
      setTotalData(data.data.length);
      setPage(page - 1);
      setRowsPerPage(rowsPerPage);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const data = await axios.post("/createSubAdmin", values, {
        headers: {
          Authorization: token,
        },
      });
      toast.success("New SubAdmin Created", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getAdminList();
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const handleEdit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const data = await axios.put(`/editSubAdmin/${values.id}`, values, {
        headers: {
          Authorization: token,
        },
      });
      toast.success("Subadmin details changed", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getAdminList();
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const [optionss, setOptionss] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const data = await axios.get("/getAllModule", {
  //         headers: {
  //           Authorization: token,
  //         },
  //       });
  //       // setOptions(data)
  //       const newArrr = [];
  //       data.data.data.forEach((item) => {
  //         newArrr.push(item.access_module);
  //       });
  //       setOptionss(data.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  const deleteSubadmin = async (e) => {
    // Prompt the user to enter the admin password

    if (window.confirm("Are you sure you want to delete this SubAdmin?")) {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.delete(`/deleteSubAdmin/${e.categoryId}`, {
          headers: {
            Authorization: token,
          },
        });
        getAdminList();
        toast.error("SubAdmin deleted Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

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
    isPendingReview,
    isOpenModalApprove,
    isOpenModalReject,
    dataFocus,
    inputHash,
    inputReason,
    keyword,
    handleChangeKeyword,
    handleCloseModalApprove,
    handleCloseModalReject,
    handleRequestApprove,
    handleRequestReject,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    handleChangeInputReason,
    handleChangeInputHash,
  } = useCommission();

  useEffect(() => {
    adminGetPercent();
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
                  Commission
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
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <span>Commission Percent</span>
                  <InputNumber
                    value={percent}
                    controls={false}
                    suffix="%"
                    onChange={(num) => setPercent(num)}
                  />
                  <Button onClick={() => adminUpdatePercent(percent)}>
                    Update
                  </Button>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "8px",
                  }}
                >
                  <InputAntd
                    placeholder="Search..."
                    style={{ maxWidth: "350px" }}
                    value={keyword}
                    onChange={handleChangeKeyword}
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
      </div>

      <ModalAntd
        title="Approve transaction"
        isOpen={isOpenModalApprove}
        onCancel={handleCloseModalApprove}
        loading={isPendingReview}
        onConfirm={handleRequestApprove}
      >
        <InputAntd
          style={{ margin: "12px 0" }}
          placeholder="Enter hash"
          value={inputHash}
          onChange={handleChangeInputHash}
        />
      </ModalAntd>

      <ModalAntd
        title="Reject transaction"
        isOpen={isOpenModalReject}
        onCancel={handleCloseModalReject}
        loading={isPendingReview}
        onConfirm={handleRequestReject}
        isDangerButton={true}
      >
        <InputAntd
          style={{ margin: "12px 0" }}
          placeholder="Enter reason reject"
          value={inputReason}
          onChange={handleChangeInputReason}
        />
      </ModalAntd>
    </>
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
)(withRouter(Commission));
