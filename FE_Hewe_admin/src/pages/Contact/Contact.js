import {
  Button,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  styled,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import {
  SearchBar,
  SearchContainer,
  SearchIcon,
  SearchInput,
} from "../../components/SearchBar/SearchElements";
import "./AddEditBlog.css";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  MenuAndBack,
} from "./BlogElements";

import { makeStyles } from "@material-ui/core/styles";
// import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from "../../components/Overlay";

import { toast } from "react-toastify";

import { get } from "lodash";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions";
import { FaSearch, FaTimes } from "react-icons/fa";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import { SlClose } from "react-icons/sl";
import { Modal } from "../../components/Modal";
import Nodata from "../../components/Nodata";

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
    height: "65vh",
  },
  paperTableHeight: {
    height: "70vh",
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
// const IOSSwitch = styled((props) => (
//   <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
// ))(({ theme }) => ({
//   width: 42,
//   height: 26,
//   padding: 0,
//   "& .MuiSwitch-switchBase": {
//     padding: 0,
//     margin: 2,
//     transitionDuration: "300ms",
//     "&.Mui-checked": {
//       transform: "translateX(16px)",
//       color: "#fff",
//       "& + .MuiSwitch-track": {
//         backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#02001c",
//         opacity: 1,
//         border: 0,
//       },
//       "&.Mui-disabled + .MuiSwitch-track": {
//         opacity: 0.5,
//       },
//     },
//     "&.Mui-focusVisible .MuiSwitch-thumb": {
//       color: "#33cf4d",
//       border: "6px solid #fff",
//     },
//     "&.Mui-disabled .MuiSwitch-thumb": {
//       color:
//         theme.palette.mode === "light"
//           ? theme.palette.grey[100]
//           : theme.palette.grey[600],
//     },
//     "&.Mui-disabled + .MuiSwitch-track": {
//       opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     boxSizing: "border-box",
//     width: 22,
//     height: 22,
//   },
//   "& .MuiSwitch-track": {
//     borderRadius: 26 / 2,
//     backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
//     opacity: 1,
//     transition: theme.transitions.create(["background-color"], {
//       duration: 500,
//     }),
//   },
// }));
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#02001c" : "red",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "red",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "red" : "#02001c",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
const OfferManagement = ({ history, setUsers, userData }) => {

  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const editor = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalData, setTotalData] = useState(90);
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [wordCount, setWordCount] = useState();
  const [wordCountLong, setWordCountLong] = useState();
  const [userid, setUserId] = useState("");
  const [motorid, setMotorid] = useState([]);
  const [motoridTemo, setMotoridTemp] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [openRModal, setOpenRModal] = useState(false);
  const [referralData, setReferralData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [totalTransactionAmount, setTotalTransactionAmount] = useState();
  const [desc, setDesc] = useState();
  const [totalReferralAmount, setTotalReferralAmount] = useState();

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

  useEffect(() => {
    getAllContactList();
    localStorage.removeItem('currentTransactionPage')
    localStorage.removeItem('rowsPerTransactionPage')
    localStorage.removeItem('currentPage')
    localStorage.removeItem('rowsPerPage')
    localStorage.removeItem("searchVal"); // Remove searchVal from localStorage

  }, []);

  // For Pagination
  const [page, setPage] = useState(
    parseInt(localStorage.getItem("currentContactPage")) || 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(localStorage.getItem("rowsPerContactPage")) || 100
  );
  const [showFilter, setShowFilter] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem("currentContactPage", newPage);
    getAllContactList(newPage , rowsPerPage);

  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    localStorage.setItem("rowsPerContactPage", newRowsPerPage);
    getAllContactList(
      parseInt(localStorage.getItem("currentContactPage")),
      newRowsPerPage
    );
  };

  const recordsAfterPagingAndSorting = () => {
    const result = [];
    for (let i = 0; i <= tableData.length - 1; i++) {
      result.push(tableData[i]);
    }
    const sortedData = stableSort(result, getComparator(order, orderBy));
    const newpage = parseInt(localStorage.getItem("currentContactPage"));
    const row = parseInt(localStorage.getItem("rowsPerContactPage"));
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
  const getAllContactList = async (
    page,
    rowsPerPage,
    searchValue = "",
    startDate = "",
    endDate = "",
    dateFilter = ""
  ) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `/getAllContacts?page=${page}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTableData(data.data);
      setSearchedData(data.data);
      setTotalData(data.totalDocuments);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  function myDeb(call, d = 1000) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        call(...args);
      }, d);
    };
  }
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    // Call your API with the search value
    const searchUser = async () => {
      try {
        const val = searchVal.toLowerCase();
        if (val.length >= 3) {
          const token = localStorage.getItem("token");
          const { data } = await axios.get(`/searchContact?search=${val}`, {
            headers: {
              Authorization: token,
            },
          });
          setPage(0);
          setTableData(data.data.slice(page, rowsPerPage));
          setTotalData(data.data.length);
        } else if (val.length === 0) {
          getAllContactList(page,rowsPerPage)
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    searchUser();
  }, [searchVal, page, rowsPerPage]);

  const getUserListFilter = (startDate, endDate) => {
    const formatStartDate = moment(startDate).format("YYYY-MM-DD");
    const formatEndDate = moment(endDate).format("YYYY-MM-DD");
    console.log(formatStartDate, formatEndDate);
    const filteredItems = tableData.filter((item) => {
      const itemDate = moment(item.createdAt, "YYYY-MM-DD"); // Parse item.date as a Moment.js object
      return itemDate.isBetween(
        moment(formatStartDate),
        moment(formatEndDate),
        null,
        "[]"
      ); // Use moment() to create Moment.js objects
    });
    console.log(filteredItems);
    setTableData(filteredItems);
    setSearchedData(filteredItems);
    setTotalData(filteredItems.length);

    return filteredItems;
  };
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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
                  color:'#02001c',
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i
                  class="fa-solid fa-address-book"
                  style={{ fontSize: "25px", margin: "8px" }}
                ></i>

                <DashHeading
                  style={{ color:'#02001c', flex: "1", padding: "8px" }}
                >
                  Support Ticket
                </DashHeading>
              </MenuAndBack>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: "100%" }}
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ width: "100%" }}
                >
                  <SearchContainer style={{ width: "100%" }}>
                    <SearchBar>
                      <SearchIcon>
                        <FaSearch style={{ color: "#c4c4c4" }} />
                      </SearchIcon>
                      <SearchInput
                        type="text"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search by Email"
                      ></SearchInput>
                      {searchVal && (
                        <SearchIcon
                          onClick={() => {
                            setSearchVal("");
                          }}
                          style={{
                            borderRadius: "10px",
                            height: "100%",
                            position: "absolute",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FaTimes
                            style={{ color: "#c4c4c4", cursor: "pointer" }}
                          />
                        </SearchIcon>
                      )}
                    </SearchBar>
                  </SearchContainer>
                </div>
                <div style={{ position: "relative" }} ref={filterRef}>
                  <Tooltip
                    title={
                      <span style={{ color: "white", fontSize: "16px" }}>
                        Filter
                      </span>
                    }
                    arrow
                  >
                    <IconButton
                      className=""
                      style={{
                       backgroundColor: "transparent",
                       borderRadius:"10px",
                        color: "#02001C",
                        marginLeft: "5px",
                        border: "2px solid gray",
                        height: "40px",
                        width:"40px"
                      }}
                      onClick={() => {
                        setShowFilter(!showFilter);
                      }}
                    >
                    <i class="fa-solid fa-filter"></i>
                    </IconButton>
                  </Tooltip>
                  {showFilter ? (
                    <div
                      className="box arrow-top"
                      style={{
                        display: "flex",
                        position: "absolute",
                        backgroundColor: "whitesmoke",
                        zIndex: 5,
                        borderRadius: "10px",
                        marginLeft: "-120px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          padding: "5px",
                          margin: "20px",
                          // width: "250px",
                        }}
                      >
                        <span style={{ color: "black" }}>From:</span>
                        <DatePicker
                          value={startDate}
                          dateFormat="DD/MM/YYYY"
                          onChange={(date) => {
                            setStartDate(date);
                          }}
                        />
                        <span style={{ color: "black" }}>To:</span>
                        <DatePicker
                          onChange={(date) => {
                            setEndDate(date);
                          }}
                          minDate={startDate}
                          value={endDate}
                          dateFormat="DD/MM/YYYY"
                        />

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                            marginTop: "15px",
                          }}
                        >
                          <span
                            style={{
                              background:
                                "transparent linear-gradient(90deg, #02001c 0%, #02001c 100%) 0% 0% no-repeat padding-box",

                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              if (startDate === null && endDate === null) {
                                toast.info(
                                  "Please Select Both Dates To Get Filtered Data",
                                  {
                                    position: toast.POSITION.TOP_RIGHT,
                                  }
                                );
                              } else if (
                                startDate === null ||
                                endDate === null
                              ) {
                                toast.info(
                                  "Please Select Both Dates To Get Filtered Data",
                                  {
                                    position: toast.POSITION.TOP_RIGHT,
                                  }
                                );
                              } else if (
                                startDate !== null &&
                                endDate !== null
                              ) {
                                setShowFilter(false);
                                getUserListFilter(startDate, endDate);
                              }
                            }}
                          >
                            {" "}
                            Apply
                          </span>
                          <span
                            style={{
                              background:
                                "transparent linear-gradient(90deg, #02001c 0%, #02001c 100%) 0% 0% no-repeat padding-box",
                              color: "#fff",
                              cursor: "pointer",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                            onClick={() => {
                              setStartDate(null);
                              setEndDate(null);
                              getAllContactList();
                              setShowFilter(false);
                            }}
                          >
                            {" "}
                            Reset
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    false
                  )}
                </div>
              </div>
            </DashboardHeading>

            <Paper
              className={classes.paperTableHeight}
              style={{
                overflow: "hidden",
                marginBottom: "0.5rem",
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
                        Phone Number
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Subject
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Description
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
                          <div className="d-flex justify-content-center">
                            <div style={{ marginRight: "5px" }}>
                              {get(category, "country_code", "")}
                            </div>{" "}
                            <div>{get(category, "phone_number", "")}</div>
                          </div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div> {get(category, "subject", "")}</div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div style={{width:'200px'}}>
                          {category.description.length <= 50 ? (
                            category.description
                          ) : (
                            <>
                              {category.description.slice(0, 50)}...
                              <Button
                                onClick={() => {
                                  setOpenModal(true);
                                  setDesc(get(category, "description"));
                                }}
                                style={{
                                  textTransform: "lowercase",
                                }}
                              >
                                See more
                              </Button>
                            </>
                          )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>    {tableData.length === 0 ? (
                <Nodata TextToDisplay="No Data Found." fontSize="24px" />
              ) : (
                false
              )}
              </TableContainer>
          
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
)(withRouter(OfferManagement));
