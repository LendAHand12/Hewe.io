import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { SlClose } from "react-icons/sl";
import Input from "../../components/Input";
import { Modal } from "../../components/Modal";

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
import axios from "../../axios";
import Overlay from "../../components/Overlay";
import { round, roundDisplay } from "../../utils/functions";

import { toast } from "react-toastify";

import { get } from "lodash";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions";
// import { uploadImage } from "../../utils/functions";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { AutoComplete, message, Button as ButtonAndt } from "antd";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Nodata from "../../components/Nodata";
import "./UserMng.css";
import ModalUpdateBalance from "./ModalUpdateBalance";
import { useSearchAddress } from "./useSearchAddress";
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
  "@media (max-width: 1200px)": {
    paperTableHeight: {
      height: "75vh",
    },
  },
  "@media (max-width: 780px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
      height: "70vh",
    },
  },
  "@media (max-width: 968px)": {
    paperTableHeight: {
      height: "70vh",
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

const OfferManagement = ({ history, setUsers, userData }) => {
  // modal update user balance
  const [openModalUpdateBalance, setOpenModalUpdateBalance] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [selectedToken, setSelectedToken] = useState(undefined);

  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalData, setTotalData] = useState(90);
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [openPay, setOpenPay] = useState(false);
  const [openRef, setOpenRef] = useState(false);
  const [lahMember, setLahMember] = useState("");
  const [userName, setUserName] = useState("");
  const [totalRewardHewe, setTotalRewardHewe] = useState(0);
  const [totalRewardUSDT, setTotalRewardUSDT] = useState(0);
  const [paidUSDT, setPaidUSDT] = useState(0);
  const [paidHewe, setPaidHewe] = useState(0);
  const [lahid, setLahid] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [lahvalue, setLahvalue] = useState("");
  const [lahBool, setLahBool] = useState(null);
  const [lahval, setLahval] = useState("");
  const [modal, setModal] = useState(false);
  const capitalizedUserName =
    userName.charAt(0).toUpperCase() + userName.slice(1);
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
    parseInt(localStorage.getItem("currentPage")) || 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(localStorage.getItem("rowsPerPage")) || 15
  );

  const [showFilter, setShowFilter] = useState(false);
  const [name, setName] = useState("");
  const handleChangePage = async (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
    localStorage.setItem("currentPage", newPage);
    getAllUserList(newPage, rowsPerPage); // Pass rowsPerPage as a parameter
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    localStorage.setItem("rowsPerPage", newRowsPerPage);
    getAllUserList(
      parseInt(localStorage.getItem("currentPage")),
      newRowsPerPage
    ); // Pass page as 0 (first page) when changing rows per page
  };
  const recordsAfterPagingAndSorting = () => {
    const result = [];
    for (let i = 0; i <= tableData.length - 1; i++) {
      result.push(tableData[i]);
    }
    const sortedData = stableSort(result, getComparator(order, orderBy));
    const newpage = parseInt(localStorage.getItem("currentPage"));
    const row = parseInt(localStorage.getItem("rowsPerPage"));
    // Calculate the starting index and ending index for the current page
    const startIndex = newpage * row;
    const endIndex = startIndex + row;

    // Return the subset of data for the current page
    console.log(sortedData);
    return sortedData;
  };

  const handleSortRequest = (cellId) => {
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
  const getAllUserList = async (page, rowsPerPage) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `/getAllUsers?page=${page}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (data && data.data) {
        setTableData(data.data);
        setSearchedData(data.data);
        setTotalData(data.totalDocuments);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getAllUserList(page, rowsPerPage);
    localStorage.removeItem("currentTransactionPage");
    localStorage.removeItem("rowsPerTransactionPage");
    localStorage.removeItem("currentContactPage");
    localStorage.removeItem("rowsPerContactPage");
    localStorage.removeItem("currentRPage");
    localStorage.removeItem("rowsPerRPage");
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
  const [searchVal, setSearchVal] = useState("");
  const storedSearchVal = localStorage.getItem("searchVal");
  useEffect(() => {
    if (storedSearchVal) {
      setSearchVal(storedSearchVal);
    }
  }, []);
  useEffect(() => {
    // Call your API with the search value
    const searchUser = async () => {
      try {
        const val = searchVal.toLowerCase();
        if (val.length >= 3) {
          const token = localStorage.getItem("token");
          const { data } = await axios.get(`/searchUser?search=${val}`, {
            headers: {
              Authorization: token,
            },
          });
          setPage(0);
          setTableData(data.data.slice(0, rowsPerPage)); // Reset page to 0
          setTotalData(data.data.length);
        } else if (val.length === 0) {
          getAllUserList(page, rowsPerPage); // Reset page to 0
          localStorage.removeItem("searchVal"); // Remove searchVal from localStorage
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    searchUser();
  }, [searchVal, rowsPerPage, page, storedSearchVal]);

  const getUserListFilter = (startDate, endDate) => {
    const formatStartDate = moment(startDate).format("YYYY-MM-DD");
    const formatEndDate = moment(endDate).format("YYYY-MM-DD");
    const filteredItems = tableData.filter((item) => {
      const itemDate = moment(item.createdAt, "YYYY-MM-DD");
      return itemDate.isBetween(
        moment(formatStartDate),
        moment(formatEndDate),
        null,
        "[]"
      );
    });

    setTableData(filteredItems);
    setSearchedData(filteredItems);
    setTotalData(filteredItems.length);

    return filteredItems;
  };
  const createLah = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await axios.put(
        `/addLAHMember?_id=${lahid}`,
        {
          LAH_member: lahvalue,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      getAllUserList();
      toast.success(data.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenRef(false);
    } catch (e) {
      console.log(e);
    }
  };
  const verifyLah = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await axios.put(
        `/verifyLAH?_id=${lahid}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(data.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenRef(false);
      getAllUserList();
    } catch (e) {
      console.log(e);
    }
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
  const [paidData, setPaidData] = useState({
    user_id: "",
    totalPaid_HEWE: "",
    transactionHash_HEWE: "",
    paidType: "",
  });
  const [paidDataUSDT, setPaidDataUSDT] = useState({
    user_id: "",
    totalPaid_USDT: "",
    transactionHash_USDT: "",
    paidType: "",
  });

  const paidsendData = async () => {
    try {
      const token = localStorage.getItem("token");
      let dataToSend = null;
      if (tabValue === 0) {
        if (
          paidUSDT > 0 &&
          totalRewardUSDT > 0 &&
          paidUSDT >= paidDataUSDT.totalPaid_USDT
        ) {
          dataToSend = { ...paidDataUSDT, paidType: "USDT" };
        }
      } else if (tabValue === 1) {
        if (
          paidHewe > 0 &&
          totalRewardHewe > 0 &&
          paidHewe >= paidData.totalPaid_HEWE
        ) {
          dataToSend = { ...paidData, paidType: "HEWE" };
        }
      }
      if (dataToSend !== null) {
        try {
          const response = await axios.post("/paidUser", dataToSend, {
            headers: {
              Authorization: token,
            },
          });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setOpenPay(false);
        } catch (error) {
          console.error("Error:", error);
          // Handle error if needed
        }
      } else {
        // Show a toast message indicating that the payment amount exceeds the reward amount
        toast.error("Payment amount exceeds the reward amount", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Invalid Data", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error sending data:", error);
    }
  };
  const clearSearch = () => {
    setSearchVal("");
  };

  const reloadPage = async () => await getAllUserList(page, rowsPerPage);

  const handleUpdateUSDTBalance = async (userData) => {
    setSelectedToken("USDT");
    setSelectedUser(userData);
    setOpenModalUpdateBalance(true);
  };

  const handleVerifyEmail = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      const data = await axios.post(
        `/verifyEmailUser`,
        {
          userId: userData._id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(data.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      await getAllUserList();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateHEWEBalance = async (userData) => {
    setSelectedToken("HEWE");
    setSelectedUser(userData);
    setOpenModalUpdateBalance(true);
  };

  const handleUpdateHEWEDeposit = async (userData) => {
    setSelectedToken("HEWEDEPOSIT");
    setSelectedUser(userData);
    setOpenModalUpdateBalance(true);
  };

  const handleUpdateAMCBalance = async (userData) => {
    setSelectedToken("AMC");
    setSelectedUser(userData);
    setOpenModalUpdateBalance(true);
  };

  const { value, options, onSelect, onChange } = useSearchAddress();

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
                  class="fa-solid fa-users"
                  style={{ fontSize: "25px", margin: "8px" }}
                ></i>

                <DashHeading
                  style={{ color: "#02001c", flex: "1", padding: "8px" }}
                >
                  User Management
                </DashHeading>
              </MenuAndBack>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "24px",
                  width: "100%",
                  gap: "16px",
                }}
              >
                <ButtonAndt
                  onClick={() =>
                    history.push("/adminPanel/history-update-address")
                  }
                >
                  View history update address
                </ButtonAndt>
                <AutoComplete
                  value={value}
                  options={options}
                  style={{
                    width: 400,
                  }}
                  onSelect={onSelect}
                  onChange={onChange}
                  placeholder="Search address BEP20 ..."
                />
              </div>
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
                          onClick={clearSearch}
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
                        borderRadius: "10px",
                        color: "#02001C",
                        marginLeft: "5px",
                        border: "2px solid gray",
                        height: "40px",
                        width: "40px",
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
                              getAllUserList();
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
                // marginBottom: "2rem",
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
                        No.
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Email
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        LAH Member
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Phone Number
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Verified
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        USDT Balance
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        HEWE Balance
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        HEWE Deposit
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        AMC Balance
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Revenue
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Revenue F1
                      </TableCell>
                      {/* <TableCell className={classes.tablePadding}>Total Reward (USDT)</TableCell>
                      <TableCell className={classes.tablePadding}>Paid Reward (USDT)</TableCell>
                      <TableCell className={classes.tablePadding}>Pending Reward (USDT)</TableCell>
                      <TableCell className={classes.tablePadding}>Total Reward (HEWE)</TableCell>
                      <TableCell className={classes.tablePadding}>Paid Reward (HEWE)</TableCell>
                      <TableCell className={classes.tablePadding}>Pending Reward (HEWE)</TableCell> */}
                      {/* <TableCell className={classes.tablePadding}>
                        Referrals
                      </TableCell> */}
                      {/* <TableCell className={classes.tablePadding}>
                        Transactions
                      </TableCell> */}
                      <TableCell className={classes.tablePadding}>
                        Address
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Pay
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Actions
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
                          <Link
                            to={`/adminPanel/user-management/${get(
                              category,
                              "_id",
                              ""
                            )}`}
                          >
                            <div style={{ textDecoration: "underline" }}>
                              {get(category, "email", "")}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>
                            {get(category, "LAH_member", "") === ""
                              ? "-"
                              : get(category, "LAH_member", "")}
                          </div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div>
                            {get(category, "countryCode", "")}{" "}
                            {get(category, "phone_number", "")}
                          </div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div>
                            {" "}
                            {get(category, "isOtpVerified", "") ? (
                              "✅"
                            ) : (
                              <button
                                onClick={() =>
                                  handleVerifyEmail(category, "email")
                                }
                              >
                                Verify Email
                              </button>
                            )}
                          </div>
                        </TableCell>

                        {/* new USDT balance */}
                        <TableCell className={classes.textMiddle}>
                          <div>
                            <div style={{ marginBottom: 2 }}>
                              <b style={{ whiteSpace: "nowrap" }}>
                                {category.usdtBalance
                                  ? roundDisplay(category.usdtBalance)
                                  : 0}
                              </b>
                            </div>
                            <button
                              onClick={() => handleUpdateUSDTBalance(category)}
                            >
                              Update
                            </button>
                          </div>
                        </TableCell>

                        {/* new HEWE balance */}
                        <TableCell className={classes.textMiddle}>
                          <div>
                            <div>
                              <b style={{ whiteSpace: "nowrap" }}>
                                {category.heweBalance
                                  ? roundDisplay(category.heweBalance)
                                  : 0}
                              </b>
                            </div>
                            <button
                              onClick={() => handleUpdateHEWEBalance(category)}
                            >
                              Update
                            </button>
                          </div>
                        </TableCell>

                        {/* HEWE deposit */}
                        <TableCell className={classes.textMiddle}>
                          <div>
                            <div>
                              <b style={{ whiteSpace: "nowrap" }}>
                                {category.heweDeposit
                                  ? roundDisplay(category.heweDeposit)
                                  : 0}
                              </b>
                            </div>
                            <button
                              onClick={() => handleUpdateHEWEDeposit(category)}
                            >
                              Update
                            </button>
                          </div>
                        </TableCell>

                        {/* new AMC balance */}
                        <TableCell className={classes.textMiddle}>
                          <div>
                            <div>
                              <b style={{ whiteSpace: "nowrap" }}>
                                {category.amcBalance
                                  ? roundDisplay(category.amcBalance)
                                  : 0}
                              </b>
                            </div>
                            <button
                              onClick={() => handleUpdateAMCBalance(category)}
                            >
                              Update
                            </button>
                          </div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div>{get(category, "revenue", "0")}</div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div>{get(category, "revenueF1", "0")}</div>
                        </TableCell>

                        {/* <TableCell className={classes.textMiddle}>
                          <div>
                            {category?.referredDetails[0]?.ReceivedPrice !== undefined
                              ? category?.referredDetails[0]?.ReceivedPrice
                              : 0}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          {category.totalPaid_USDT !== undefined ? get(category, "totalPaid_USDT", "") : 0}
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          {(category?.referredDetails[0]?.ReceivedPrice !== undefined
                            ? category?.referredDetails[0]?.ReceivedPrice
                            : 0) - get(category, "totalPaid_USDT", 0)}
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          <div>
                            {category.referredDetails[0]?.ReceivedHewePrice !== undefined
                              ? category.referredDetails[0]?.ReceivedHewePrice
                              : 0}
                          </div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>{category?.totalPaid_HEWE !== undefined ? category?.totalPaid_HEWE : 0}</div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          {(category?.referredDetails[0]?.ReceivedHewePrice !== undefined
                            ? category?.referredDetails[0]?.ReceivedHewePrice
                            : 0) - get(category, "totalPaid_HEWE", "")}
                        </TableCell> */}

                        {/* <TableCell className={classes.textMiddle}>
                          <Tooltip
                            title={"View Referal Details"}
                            placement="top"
                          >
                            <div style={{ cursor: "pointer" }}>
                              <Link
                                to={{
                                  pathname: "/user-management/referrals",
                                  state: { categoryId: category._id },
                                }}
                              >
                                {get(category, "total_referredTo", "")}
                              </Link>
                            </div>
                          </Tooltip>
                        </TableCell> */}

                        {/* <TableCell className={classes.textMiddle}>
                          <Tooltip
                            title={"View Transaction Details"}
                            placement="top"
                          >
                            <div style={{ cursor: "pointer" }}>
                              <Link
                                to={{
                                  pathname: "/user-management/transactions",
                                  state: { categoryEmail: category.email },
                                }}
                              >
                                {get(category, "total_transactions", "")}
                              </Link>
                            </div>
                          </Tooltip>
                        </TableCell> */}

                        <TableCell className={classes.textMiddle}>
                          {get(category, "walletAddress", "") && (
                            <div>
                              <div>{get(category, "walletAddress", "")}</div>
                              <div>
                                Updated at:{" "}
                                {get(category, "timeWalletAddress", "")
                                  ? new Date(
                                      get(category, "timeWalletAddress", "")
                                    ).toLocaleString("vi-VN")
                                  : ""}
                              </div>
                            </div>
                          )}
                        </TableCell>

                        <TableCell className={classes.tablePadding}>
                          <Button
                            style={{
                              backgroundColor: "#02001c",
                              color: "#fff",
                              cursor: "pointer",
                              height: "40px",
                            }}
                            onClick={() => {
                              setOpenPay(true);
                              setUserName(category.name);
                              setPaidDataUSDT({
                                user_id: get(category, "_id", ""),
                              });
                              setPaidData({
                                user_id: get(category, "_id", ""),
                              });

                              setTotalRewardHewe(
                                category?.referredDetails[0]
                                  ?.ReceivedHewePrice !== undefined
                                  ? category?.referredDetails[0]
                                      ?.ReceivedHewePrice
                                  : 0
                              );
                              setTotalRewardUSDT(
                                category?.referredDetails[0]?.ReceivedPrice !==
                                  undefined
                                  ? category?.referredDetails[0]?.ReceivedPrice
                                  : 0
                              );
                              setPaidUSDT(
                                (category?.referredDetails[0]?.ReceivedPrice !==
                                undefined
                                  ? category?.referredDetails[0]?.ReceivedPrice
                                  : 0) - get(category, "totalPaid_USDT", 0)
                              );
                              setPaidHewe(
                                ((category?.referredDetails[0]
                                  ?.ReceivedHewePrice !==
                                  undefined?.ReceivedHewePrice) !==
                                undefined
                                  ? category?.referredDetails[0]
                                      ?.ReceivedHEWEPrice?.ReceivedHewePrice
                                  : 0) - get(category, "totalPaid_HEWE", "")
                              );
                            }}
                            variant="contained"
                          >
                            Pay
                          </Button>
                        </TableCell>

                        <TableCell
                          className={classes.textMiddle}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            style={{
                              backgroundColor: category.verifyLAH
                                ? "#00C337"
                                : "#02001c",
                              color: "#fff",
                              cursor: category.verifyLAH
                                ? "not-allowed"
                                : "pointer",
                              height: "40px",
                            }}
                            disabled={category.verifyLAH}
                            onClick={() => {
                              !category.verifyLAH && setOpenRef(true);
                              setLahMember(category.LAH_member);
                              setLahval(category.LAH_member);
                              setLahid(category._id);
                              setLahBool(category.verifyLAH);
                              console.log(category.verifyLAH);
                              setName(
                                category.name.charAt(0).toUpperCase() +
                                  category.name.slice(1)
                              );
                            }}
                          >
                            {category.verifyLAH ? (
                              <>
                                Verified
                                <IoCheckmarkCircleSharp
                                  style={{ marginLeft: "5px" }}
                                />
                              </>
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {tableData.length === 0 ? (
                  <Nodata
                    TextToDisplay="No Data Found."
                    fontSize="24px"
                    className="d-flex align-items-center justify-content-center"
                  />
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
        width="500px"
        RoundedCorners={true}
        isOpen={openPay}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenPay(false);
          }
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="mt-2"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "22px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {`Referral Payment to ${capitalizedUserName}`}
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
                  setOpenPay(false);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <div>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="USDT" />
                <Tab label="HEWE" />
              </Tabs>

              {/* Content for the tabs */}
              {tabValue === 0 && (
                <div>
                  <TextField
                    label="Amount"
                    fullWidth
                    value={paidDataUSDT.totalPaid_USDT}
                    onChange={(e) =>
                      setPaidDataUSDT((prevState) => ({
                        ...prevState,
                        totalPaid_USDT: e.target.value,
                      }))
                    }
                  />
                  <TextField
                    label="Transaction Hash"
                    fullWidth
                    value={paidDataUSDT.transactionHash_USDT}
                    onChange={(e) =>
                      setPaidDataUSDT((prevState) => ({
                        ...prevState,
                        transactionHash_USDT: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
              {tabValue === 1 && (
                <div>
                  <TextField
                    label="Amount"
                    fullWidth
                    value={paidData.totalPaid_Hewe}
                    onChange={(e) =>
                      setPaidData((prevState) => ({
                        ...prevState,
                        totalPaid_HEWE: parseInt(e.target.value),
                      }))
                    }
                    // type="number"
                  />
                  <TextField
                    label="Transaction Hash"
                    fullWidth
                    value={paidData.transactionHash_Hewe}
                    onChange={(e) =>
                      setPaidData((prevState) => ({
                        ...prevState,
                        transactionHash_HEWE: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
            <div className="row my-3 mt-5">
              <div
                className="col-md-12"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  onClick={paidsendData}
                  style={{
                    padding: "0.5em 2em",
                    backgroundColor: "#02001c",
                    color: "white",
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        }
      />
      <Modal
        maxWidth="lg"
        width="600px"
        RoundedCorners={true}
        isOpen={openRef}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenPay(false);
          }
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="mt-2"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "22px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {lahval !== "" ? `Verify LAH Member` : "Save LAH Member"}
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
                  setOpenRef(false);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <div>
              <div className="row">
                {(lahMember === "" || lahMember !== "") && (
                  <div
                    className="col-md-12 mb-3"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Input
                      type="text"
                      variant="outlined"
                      value={lahMember}
                      onChange={(e) => {
                        setLahMember(e.target.value);
                      }}
                      // error={
                      //   formikBag.touched.name &&
                      //   formikBag.errors.name
                      //     ? formikBag.errors.name
                      //     : null
                      // }
                      style={{ textAlign: "center" }}
                      className="form-control"
                      placeholder="LAH ID"
                    />
                  </div>
                )}

                <div
                  className="col-md-12"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    onClick={
                      lahMember === ""
                        ? createLah
                        : () => {
                            setModalOpen(true);
                          }
                    }
                    className="mb-2"
                    style={{
                      padding: "0.5em 2em",
                      backgroundColor: "#02001c",
                      color: "white",
                    }}
                  >
                    {console.log(lahBool, "this is lahbool")}
                    {lahval !== "" ? "Verify" : "Save"}
                  </Button>
                  {modalOpen && (
                    <Modal
                      maxWidth="lg"
                      width="500px"
                      RoundedCorners={true}
                      isOpen={modalOpen}
                      onClose={(event, reason) => {
                        if (
                          reason &&
                          (reason === "backdropClick" || "escapeKeyDown")
                        ) {
                        } else {
                          setModalOpen(false);
                        }
                      }}
                      backgroundModal={false}
                      backgroundModalContent={false}
                      title={
                        <div>
                          <div
                            className="mt-1 mb-1 p-0"
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "22px",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {`Confirmation`}
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
                                setModalOpen(false);
                              }}
                            />
                          </div>
                        </div>
                      }
                      content={
                        <div style={{ textAlign: "center" }}>
                          <div className="mt-1 mb-3">
                            Are you sure you want to verify {name} as an LAH
                            Member with Member Id{" "}
                            <span style={{ color: "green", fontWeight: 700 }}>
                              {'"' + lahMember + '"'}
                            </span>
                            ?
                          </div>

                          <div
                            className="d-flex justify-content-center align-items-center mt-2 mb-1"
                            mt={2}
                          >
                            <Button
                              style={{
                                backgroundColor: "#02001c",
                                margin: "10px",
                                color: "white",
                              }}
                              onClick={verifyLah}
                              color="primary"
                            >
                              Yes
                            </Button>
                            <Button
                              style={{
                                backgroundColor: "#02001c",
                                color: "white",
                              }}
                              onClick={() => setModalOpen(false)}
                              color="secondary"
                              autoFocus
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        }
      />

      <ModalUpdateBalance
        {...{
          openModalUpdateBalance,
          setOpenModalUpdateBalance,
          selectedUser,
          selectedToken,
          reloadPage,
        }}
      />

      {isLoading && <Overlay />}
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
