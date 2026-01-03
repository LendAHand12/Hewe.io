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
  HeadingButton,
  MenuAndBack,
} from "./BlogElements";
import { useLocation } from "react-router-dom";
import axios from "../../axios";
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
import { MdOutlineContentCopy } from "react-icons/md";
import { TransDataValidator } from "../../utils/validators";

import { get } from "lodash";
import { toast } from "react-toastify";
import moment from "moment";
import Input from "../../components/Input";
import { Field, Form, Formik } from "formik";
import { Modal } from "../../components/Modal";
import { SlClose } from "react-icons/sl";

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
const Transactions = (props) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const location = useLocation();
  const [emaill, setEmaill]=useState(location.state?.categoryEmail);
  const [transactionData, setTransactionData] = useState([]);
  const [totalTransactionAmount, setTotalTransactionAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [modal, setModal] = useState(false);
  const [transData, setTransData] = useState({
    email: "",
    from: "",
    to: "",
    amount_hewe: "",
    amount_usd: "",
    hash: "",
    date:""
  });
  
  const getUserList = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/getUserTransaction?email=${emaill}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(data);
      setTransactionData(data.data);
      setTotalTransactionAmount(data);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUserList();
  
  }, []);

  const handleSubmit = async (values) => {
    try {
      let formData = new FormData();

      // Append email separately
      formData.append("email", emaill);
      formData.append("from", values.from);
      formData.append("to","0x55d398326f99059fF775485246999027B3197955");
      formData.append("amount_hewe", values.amount_hewe);
      formData.append("amount_usd", values.amount_usd);
      formData.append("hash", values.hash);
      formData.append("date", values.date);
      const token = localStorage.getItem("token");
      const data = await axios.post("/addTransactionUser", formData, {
        headers: {
          Authorization: token,
        },
      });
      toast.success("New Transaction Updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setModal(false);
      getUserList();
    } catch (error) {
      console.log(error);
    }
  };
    const getCurrentDate = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1;
      let day = currentDate.getDate();
    
      // Add leading zeros if month or day is less than 10
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;
    
      return `${year}-${month}-${day}`;
    };
  return (
    <div>
      <DashboardContainer>
        <DashboardWrapper>
          <DashboardHeading
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
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
                onClick={() => history.push("/user-management")}
              />

              <DashHeading
                style={{ color: "#02001c", flex: "1", padding: "8px" }}
              >
                View Transactions
              </DashHeading>
              <Button
                style={{
                  backgroundColor: "#02001c",
                  color: "#fff",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  marginLeft: "10px",
                }}
                onClick={() => {
                  setModal(true);
                }}
              >
                Add Transaction
              </Button>
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
                        <div className="col-md-6">
                          {totalTransactionAmount?.total_amount_usd}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <span style={{ fontWeight: "700" }}>
                            {" "}
                            Total Amount (HEWE)
                          </span>
                        </div>
                        <div className="col-md-6">
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
          <Modal
            maxWidth="lg"
            width="640px"
            RoundedCorners={true}
            isOpen={modal}
            onClose={(event, reason) => {
              if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
              } else {
                setModal(false);
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
                  {"Add Transaction"}
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
                      setModal(false);
                    }}
                  />
                </div>
              </div>
            }
            content={
              <>
                <Formik
                  key={transData}
                  enableReinitialize
                  initialValues={transData}
                    validate={TransDataValidator}
                  validateOnChange
                  onSubmit={(values) => {
                    handleSubmit(values);
                  }}
                >
                  {(formikBag) => {
                    return (
                      <Form>
                        <div className="signup-cont">
                          <div className="row">
                          <div className="col-md-6">
                              <label className={classes.offerLabel}>Date</label>
                              <Field name="From">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="date"
                                      variant="outlined"
                                      value={formikBag.values.date}
                                      onChange={(e) => {
                                        formikBag.setFieldValue(
                                          "date",
                                          e.target.value
                                        );
                                      }}
                                      max={getCurrentDate()}
                                      error={
                                        formikBag.touched.date &&
                                        formikBag.errors.date 
                                          ? formikBag.errors.date
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="Date"
                                    />
                                  </div>
                                )}
                              </Field>
                            </div>
                            <div className="col-md-6">
                              <label className={classes.offerLabel}>Buyer's Address</label>
                              <Field name="From">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="text"
                                      variant="outlined"
                                      value={formikBag.values.from}
                                      onChange={(e) => {
                                        formikBag.setFieldValue(
                                          "from",
                                          e.target.value
                                        );
                                      }}
                                      error={
                                        formikBag.touched.from &&
                                        formikBag.errors.from
                                          ? formikBag.errors.from
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="Buyer's Address"
                                    />
                                  </div>
                                )}
                              </Field>
                            </div>

                            {/* <div className="col-md-6">
                              <label className={classes.offerLabel}>To</label>
                              <Field name="To">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="text"
                                      variant="outlined"
                                      value={formikBag.values.to}
                                      onChange={(e) => {
                                        formikBag.setFieldValue(
                                          "to",
                                          e.target.value
                                        );
                                      }}
                                      error={
                                        formikBag.touched.to &&
                                        formikBag.errors.to
                                          ? formikBag.errors.to
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="To"
                                    />
                                  </div>
                                )}
                              </Field>
                            </div> */}

                            <div className="col-md-6">
                              <label className={classes.offerLabel}>
                                Amount USDT
                              </label>
                              <Field name="Amount USDT ">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="text"
                                      variant="outlined"
                                      value={formikBag.values.amount_usd}
                                      onChange={(e) => {
                                        formikBag.setFieldValue(
                                          "amount_usd",
                                          e.target.value
                                        );
                                      }}
                                      error={
                                        formikBag.touched.amount_usd &&
                                        formikBag.errors.amount_usd
                                          ? formikBag.errors.amount_usd
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="Amount USDT"
                                    />
                                  </div>
                                )}
                              </Field>
                            </div>
                            <div className="col-md-6">
                              <label className={classes.offerLabel}>
                                Amount HEWE
                              </label>
                              <Field name="Amount HEWE">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="text"
                                      variant="outlined"
                                      autocomplete="off"
                                      value={formikBag.values.amount_hewe}
                                      onChange={(e) => {
                                        formikBag.setFieldValue(
                                          "amount_hewe",
                                          e.target.value
                                        );
                                      }}
                                      error={
                                        formikBag.touched.amount_hewe &&
                                        formikBag.errors.amount_hewe
                                          ? formikBag.errors.amount_hewe
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="Amount HEWE"
                                    />
                                  </div>
                                )}
                              </Field>
                            </div>
                            <div className="col-md-6">
                              <label className={classes.offerLabel}>
                                Transaction Hash
                              </label>
                              <Field name="Hash">
                                {({ field }) => (
                                  <div className="pb-2 mt-1">
                                    <Input
                                      {...field}
                                      type="text"
                                      variant="outlined"
                                      autocomplete="off"
                                      value={formikBag.values.hash}
                                      onChange={(e) => {
                                        formikBag.setFieldValue(
                                          "hash",
                                          e.target.value
                                        );
                                      }}
                                      error={
                                        formikBag.touched.hash &&
                                        formikBag.errors.hash
                                          ? formikBag.errors.hash
                                          : null
                                      }
                                      className="form-control"
                                      placeholder="Transaction Hash"
                                    />
                                  </div>
                                )}
                              </Field>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div
                            className="col-md-12"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <HeadingButton
                              type="submit"
                              style={{ padding: "0.5em 2em" }}
                            >
                              Save
                            </HeadingButton>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </>
            }
          />
        </DashboardWrapper>
      </DashboardContainer>
    </div>
  );
};

export default Transactions;
