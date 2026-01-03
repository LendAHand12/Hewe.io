import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import "./AddEditBlog.css";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  HeadingButton,
  MenuAndBack,
} from "./BlogElements";
import Input from "../../components/Input";

import { makeStyles } from "@material-ui/core/styles";
// import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from "../../components/Overlay";

import { toast } from "react-toastify";

import { get } from "lodash";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions";

// import { uploadImage } from "../../utils/functions";

import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { MdOutlineContentCopy } from "react-icons/md";
import { SlClose } from "react-icons/sl";
import { Modal } from "../../components/Modal";
import Nodata from "../../components/Nodata";
import { Field, Form, Formik } from "formik";
import { TransDataValidator } from "../../utils/validators";

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
    height: "70vh",
  },
  paperTableHeight: {
    height: "65vh",
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

const DepositHEWE = ({ history, setUsers, userData }) => {
  // console.log("jsdjsjdsjdjsdjsdsd", history);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalData, setTotalData] = useState(90);
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [desc, setDesc] = useState();

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

  // For Pagination
  const [page, setPage] = useState(
    parseInt(localStorage.getItem("currentTransactionPage")) || 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(localStorage.getItem("rowsPerTransactionPage")) || 100
  );
  const [showFilter, setShowFilter] = useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem("currentTransactionPage", newPage);
    getAllTransactionList(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    localStorage.setItem("rowsPerTransactionPage", newRowsPerPage);
    getAllTransactionList(
      parseInt(localStorage.getItem("currentTransactionPage")),
      newRowsPerPage
    );
  };

  const recordsAfterPagingAndSorting = () => {
    const result = [];
    for (let i = 0; i <= tableData.length - 1; i++) {
      result.push(tableData[i]);
    }
    const sortedData = stableSort(result, getComparator(order, orderBy));
    const newpage = parseInt(localStorage.getItem("currentTransactionPage"));
    const row = parseInt(localStorage.getItem("rowsPerTransactionPage"));
    // Calculate the starting index and ending index for the current page
    const startIndex = newpage * row;
    const endIndex = startIndex + row;

    // Return the subset of data for the current page
    return sortedData;
  };

  const handleSortRequest = (cellId) => {
    console.log(cellId);
    console.log(orderBy);
    const isAsc = orderBy === cellId && order === "asc";
    // stableSort(tableData, getComparator(order, cellId))
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
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

  const dateOfJoining = (e) => {
    var date = new Date(e).toLocaleDateString();
    return date;
  };
  const dateOfExpiry = (e) => {
    var date = new Date(e).toLocaleDateString();
    if (e) {
      return date;
    } else {
      return "N/A";
    }
  };

  const getAllTransactionList = async (page, rowsPerPage) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log(page, rowsPerPage);
      const { data } = await axios.get(
        `/getAllTransaction?page=${page}&limit=${rowsPerPage}`,
        //  `/getAllTransaction?page=0&limit=100`,

        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTableData(data.data);
      setSearchedData(data.data);
      console.log(data);
      setTotalData(data.totalDocument);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      // if (err.response.status === 401 || err.response.status === 500) {
      //   localStorage.removeItem("token");
      //   localStorage.removeItem("userData");
      // }
    }
  };
  useEffect(() => {
    getAllTransactionList(page, rowsPerPage);
    localStorage.removeItem("currentPage");
    localStorage.removeItem("rowsPerPage");
    localStorage.removeItem("currentContactPage");
    localStorage.removeItem("rowsPerContactPage");
    localStorage.removeItem("searchVal"); // Remove searchVal from localStorage
  }, [page, rowsPerPage]);
  function myDeb(call, d = 1000) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        call(...args);
      }, d);
    };
  }

  const copyhash = (e) => {
    navigator.clipboard.writeText(e);
    setCopySuccess(true);
    toast.success("Copied Successfully");
  };
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
                  color: "#02001c",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i
                  class="fa-solid fa-hand-holding-dollar"
                  style={{ fontSize: "25px", margin: "8px" }}
                ></i>

                <DashHeading
                  style={{ color: "#02001c", flex: "1", padding: "8px" }}
                >
                  Transaction Management
                </DashHeading>
              </MenuAndBack>
            </DashboardHeading>

            <Paper
              className={classes.paperTableHeight}
              style={{
                overflow: "hidden",

                marginBottom: "4rem",
              }}
            >
              <TableContainer className={classes.tableContainerHeight}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tablePadding}
                        style={{ fontWeight: "800" }}
                      >
                        S.&nbsp;No.
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Email
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Address
                      </TableCell>

                      <TableCell className={classes.tablePadding}>
                        Amount (USDT)
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Amount (HEWE)
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Txn Hash
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recordsAfterPagingAndSorting().map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          className={classes.textMiddle}
                        >
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          {moment(get(category, "createdAt", "")).format(
                            "DD/MM/YYYY"
                          )}
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>{get(category, "email", "")}</div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>{get(category, "from", "")}</div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>{get(category, "amount_usd", "")}</div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>{get(category, "amount_hewe", "")}</div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>
                            <MdOutlineContentCopy
                              size={22}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                const hash = get(category, "hash", ""); // Retrieve the hash value
                                navigator.clipboard.writeText(hash); // Copy the hash value to the clipboard
                                setCopySuccess(true); // Set the copy success state to true
                                toast.success("Copied Successfully"); // Show success toast
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {tableData.length === 0 ? (
                <Nodata TextToDisplay="No Data Found." fontSize="24px" />
              ) : (
                false
              )}
              <TablePagination
                className={classes.tablePaginationStyle}
                rowsPerPageOptions={[15, 30, 100]}
                component="div"
                count={totalData}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </DashboardWrapper>
        </DashboardContainer>
      </div>
      <Modal
        maxWidth="lg"
        width="640px"
        RoundedCorners={true}
        isOpen={openModal}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenModal(false);
          }
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="my-3"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "22px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {"Description"}
            </div>
            <div className="">
              <SlClose
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenModal(false);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <div className="text-center p-3">{desc}</div>
          </>
        }
      />
      ;{isLoading && <Overlay />}
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
)(withRouter(DepositHEWE));
