import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Nodata from "../../components/Nodata";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  MenuAndBack,
} from "./BlogElements";
import { useLocation } from "react-router-dom";
import axios from "../../axios";
import {
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
import { MdOutlineContentCopy } from "react-icons/md";

import { get } from "lodash";
import { toast } from "react-toastify";
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
    height: "70vh",
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
const UserTransactions = (props) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const location = useLocation();
  const [id, setId]=useState(location.state?.id)
  const [email, setEmail] = useState(location.state?.categoryEmail);

  const [transactionData, setTransactionData] = useState([]);
  const [totalTransactionAmount, setTotalTransactionAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  localStorage.setItem("Email", email);

  const getUserList = async () => {
    try {
      setIsLoading(true);
      const emailll = localStorage.getItem("Email");
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/getUserTransaction?email=${emailll}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(data);
      setTransactionData(data.data);
      setTotalTransactionAmount(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUserList();
    localStorage.removeItem('currentPage')
    localStorage.removeItem('rowsPerPage')
  }, []);

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
                style={{ color: "#02001c", margin: "8px", cursor: "pointer" }}
                onClick={() => history.push(`/user-management/referrals`, { categoryId: id })}
              />

              <DashHeading
                style={{ color: "#02001c", flex: "1", padding: "8px" }}
              >
                View User Transactions
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
            <div className="signup-cont">
              <div className="row">
                <div className="container">
                  <div className="row my-3 mx-5">
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <span style={{ fontWeight: "700" }}>
                            {" "}
                            Total Amount (USDT)
                          </span>
                        </div>
                        <div className="col-md-2">
                          {totalTransactionAmount?.total_amount_usd}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <span style={{ fontWeight: "700" }}>
                            Total Amount (HEWE)
                          </span>
                        </div>
                        <div className="col-md-2">
                          {totalTransactionAmount?.total_amount_hewe}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <TableContainer>
                    <Table>
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
                            Address
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Amount (HEWE)
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Amount (USDT)
                          </TableCell>
                          <TableCell className={classes.tablseHeadingCell}>
                            Txn Hash
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactionData !== undefined &&
                          transactionData.map((item, index) => (
                            <TableRow key={item.motor_id}>
                              <TableCell
                                className={classes.textMiddle}
                                component="th"
                                scope="row"
                              >
                                {index + 1 + page * rowsPerPage}
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                <div>
                                  {moment(get(item, "createdAt", "")).format(
                                    "DD/MM/YYYY"
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className={classes.textMiddle}>
                                <div>{get(item, "email", "")}</div>
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                <div>{get(item, "from", "")}</div>
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                <div>{get(item, "amount_hewe", "")}</div>
                              </TableCell>

                              <TableCell className={classes.textMiddle}>
                                <div>{get(item, "amount_usd", "")}</div>
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                <div>
                                  <MdOutlineContentCopy
                                    size={22}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      const hash = get(item, "hash", ""); // Retrieve the hash value
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
                    {transactionData === undefined && (
                      <Nodata TextToDisplay="No Data Found." fontSize="24px" />
                    )}
                  </TableContainer>
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

export default UserTransactions;
