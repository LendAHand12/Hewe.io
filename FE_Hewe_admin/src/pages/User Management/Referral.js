import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Nodata from "../../components/Nodata";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Select from "react-select";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  MenuAndBack,
} from "./BlogElements";
import { useLocation } from "react-router-dom";
import axios from "../../axios";
import * as XLSX from "xlsx";
import {
  Button,
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
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";
import Overlay from "../../components/Overlay";
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
    height: "56vh",
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
    tableContainerHeight: {
      maxHeight: "44vh",
    },
  },
  "@media (max-width: 968px)": {
    tableContainerHeight: {
      maxHeight: "44vh",
    },
  },
  "@media (max-width: 1200px)": {
    tableContainerHeight: {
      maxHeight: "48vh",
    },
  },
  "@media (max-width: 480px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
    tableContainerHeight: {
      maxHeight: "42vh",
    },
  },
  "@media (max-width: 576px)": {
    tableContainerHeight: {
      maxHeight: "42vh",
    },
  },
  "@media (max-width: 768px)": {
    tableContainerHeight: {
      maxHeight: "42vh",
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
const Referral = (props) => {
  const classes = useStyles();
  const history = useHistory();
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(
    parseInt(localStorage.getItem("currentRPage")) || 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(localStorage.getItem("rowsRPerPage")) || 15
  );
  const location = useLocation();
  const [ids, setIds] = useState(location.state?.categoryId);
  const [totalReferralAmount, setTotalReferralAmount] = useState();
  const [referralData, setReferralData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalData, setTotalData] = useState([]);
  const [orderBy, setOrderBy] = useState();
  const [order, setOrder] = useState();
  const [selectedOption, setSelectedOption] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  const handleChangePage = async (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
    localStorage.setItem("currentRPage", newPage);
    getReferralList(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    localStorage.setItem("rowsPerRPage", newRowsPerPage);
    getReferralList(
      parseInt(localStorage.getItem("currentRPage")),
      newRowsPerPage
    ); // Pass page as 0 (first page) when changing rows per page
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
  const recordsAfterPagingAndSorting = () => {
    const result = [];
    for (let i = referralData.length - 1; i >= 0; i--) {
      result.push(referralData[i]);
    }
    const sortedData = stableSort(result, getComparator(order, orderBy));
    const newpage = parseInt(localStorage.getItem("currentRPage"));
    const row = parseInt(localStorage.getItem("rowsPerRPage"));
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

  const getReferralList = async (page, rowsPerPage) => {
    try {
      console.log(rowsPerPage, page);
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `/getUserReferrels?_id=${ids}&page=${page}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("get ki api", data);
      setReferralData(data?.data);
      setTotalReferralAmount(data);
      setTotalData(data.totalDocuments);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    getReferralList(page, rowsPerPage);
    localStorage.removeItem("currentPage");
    localStorage.removeItem("rowsPerPage");
  }, []);
  const options = [
    { value: "all", label: "ALL" },
    { value: "purchased", label: "Purchased HEWE" },
    { value: "not", label: "Not Purchased" },
  ];
  const handleSelectChange = async (selectedOption) => {
    setSelectedOption(selectedOption);
    setIsLoading(true);
    if (selectedOption.value === "not") {
      try {
        console.log("hitttttttttttttt");
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `/getReferralZeroTransaction?_id=${ids}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(data);
        setReferralData(data.data);
        setTotalData(data.data.length);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (selectedOption.value === "purchased") {
      try {
        console.log("shitttttttttttttt");

        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `/getReferralNoZeroTransaction?_id=${ids}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(data);
        setReferralData(data.data);
        setTotalData(data.data.length);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (selectedOption.value === "all") {
      console.log("all ");
      getReferralList();
    }
  };
  const extractedData = [];
  referralData.filter((row) => {
    let date = moment(row?.referredUserDetails[0]?.createdAt).format(
      "DD/MM/YYYY"
    );
    let email = row.referredUserDetails[0]?.email;
    let name = row.referredUserDetails[0]?.name;
    let country_code = row.referredUserDetails[0]?.countryCode.toString();
    let phone_number = row.referredUserDetails[0]?.phone_number.toString();
    let phone = country_code + phone_number;
    let earned_usdt = row.referredUserDetails[0]?.totalRewardPriceReferrer;
    let earned_hewe = row.referredUserDetails[0]?.totalRewardHeweToReferrer;
    let total_transactions = row.referredUserDetails[0]?.totalTransactions;

    const rowData = {
      date,
      email,
      name,
      phone,
      earned_usdt,
      earned_hewe,
      total_transactions,
    };
    extractedData.push(rowData);
    return true;
  });

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(extractedData);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet");
    XLSX.writeFile(wb, "UserData.xlsx");
  };

  return (
    <div>
      <DashboardContainer>
        <DashboardWrapper>
          <DashboardHeading
            style={{ display: "flex", flexDirection: "column" }}
          >
            <MenuAndBack
              style={{
                backgroundColor: "transparent",
                width: "100%",
                color: "#02001c",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowBackIosIcon
                style={{ margin: "8px", cursor: "pointer", color: "#02001c" }}
                onClick={() => history.push("/user-management")}
              />
              <DashHeading
                style={{ color: "#02001c", flex: "1", padding: "8px" }}
              >
                View Referrals
              </DashHeading>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {" "}
                <div
                  style={{ width: "180px", zIndex: "99999", color: "black" }}
                >
                  {" "}
                  <Select
                    style={{ paddingRight: "14px" }}
                    // defaultValue={selectedOption}
                    placeholder={"Filter by Status"}
                    isSearchable={false}
                    onChange={handleSelectChange}
                    options={options}
                    value={selectedOption}
                  />
                </div>
                <div className="ml-2">
                  <i
                    onClick={handleExport}
                    style={{
                      cursor: "pointer",
                      color: "black",
                      fontSize: "24px",
                    }}
                    className="fa-solid fa-cloud-arrow-down"
                    title="Export to Excel"
                  ></i>
                </div>
              </div>
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
            <div className="signup-cont">
              <div className="row">
                <div className="container">
                  <div className="row my-3 mx-5">
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <span style={{ fontWeight: "700" }}>
                            Reward Amount (USDT)
                          </span>
                        </div>
                        <div className="col-md-6">
                          {totalReferralAmount?.priceReward}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <span style={{ fontWeight: "700" }}>
                            {" "}
                            Reward Amount (HEWE)
                          </span>
                        </div>
                        <div className="col-md-6">
                          {totalReferralAmount?.heweReward}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 d-flex flex-column justify-content-space-between">
                  <TableContainer className={classes.tableContainerHeight}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tablseHeadingCell}>
                            S. No.
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Date
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Email
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Name
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Phone Number
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Earned Rewards (USDT)
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Earned Rewards (HEWE)
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Total Transactions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {referralData !== undefined &&
                          recordsAfterPagingAndSorting().map((item, index) => (
                            <TableRow key={item.motor_id}>
                              <TableCell
                                className={classes.textMiddle}
                                component="th"
                                scope="row"
                              >
                                {index + 1 + page * rowsPerPage}
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                {moment(
                                  item?.referredUserDetails[0]?.createdAt
                                ).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                <div>{item?.referredUserDetails[0]?.email}</div>
                              </TableCell>

                              <TableCell className={classes.textMiddle}>
                                <div>
                                  {/* {capitalizeFirstLetter(
                                    item?.referredUserDetails[0]?.name
                                  )} */}
                                  {item?.referredUserDetails[0]?.name}
                                </div>
                              </TableCell>

                              <TableCell className={classes.textMiddle}>
                                <div className="d-flex justify-content-center">
                                  <div style={{ marginRight: "5px" }}>
                                    {" "}
                                    {item?.referredUserDetails[0]?.countryCode}
                                  </div>
                                  <div>
                                    {item?.referredUserDetails[0]?.phone_number}
                                  </div>{" "}
                                </div>
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                <div>
                                  {
                                    item?.referredUserDetails[0]
                                      ?.totalRewardPriceReferrer
                                  }
                                </div>
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                <div>
                                  {
                                    item?.referredUserDetails[0]
                                      ?.totalRewardHeweToReferrer
                                  }
                                </div>
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                <div>
                                  <Link
                                    to={{
                                      pathname: `/user-management/referralsTransactions`,
                                      state: { categoryEmail: item?.referredUserDetails[0]?.email, id: ids }
                                    }}
                                  >
                                    {
                                      item?.referredUserDetails[0]
                                        ?.totalTransactions
                                    }
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      {referralData === undefined && (
                        <Nodata
                          TextToDisplay="No Data Found."
                          fontSize="24px"
                        />
                      )}
                    </Table>
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
                </div>
              </div>
            </div>
          </Paper>
        </DashboardWrapper>
      </DashboardContainer>
      {isLoading && <Overlay />}
    </div>
  );
};

export default Referral;
