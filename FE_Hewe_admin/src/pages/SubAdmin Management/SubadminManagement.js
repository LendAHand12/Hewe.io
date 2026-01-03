import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import "./AddEditBlog.css";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  HeadingButton,
  MenuAndBack,
} from "./BlogElements";
// import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from "../../components/Overlay";

import { DeleteOutline } from "@material-ui/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions";
// import { uploadImage } from "../../utils/functions";
import { Edit } from "@material-ui/icons";
import { get } from "lodash";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { SlClose } from "react-icons/sl";
import Select from "react-select";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import { Modal } from "../../components/Modal";
import Nodata from "../../components/Nodata";
import { subadminValidator } from "../../utils/validators";
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

const OfferManagement = ({ history, setUsers, userData }) => {
  const classes = useStyles();
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
  useEffect(() => {
    getAdminList();
  }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const recordsAfterPagingAndSorting = () => {
    const result = [];
    for (let i = 0; i <= tableData.length - 1; i++) {
      result.push(tableData[i]);
    }
    const sortedData = stableSort(result, getComparator(order, orderBy));

    // Calculate the starting index and ending index for the current page
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Return the subset of data for the current page
    return sortedData.slice(startIndex, endIndex);
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
      const data = await axios.put  (`/editSubAdmin/${values.id}`, values, {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await axios.get("/getAllModule", {
          headers: {
            Authorization: token,
          },
        });
        // setOptions(data)
        const newArrr = [];
        data.data.data.forEach((item) => {
          newArrr.push(item.access_module);
        });
        setOptionss(data.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
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
                  SubAdmin Management
                </DashHeading>
              </MenuAndBack>
              <div
                className="d-flex align-items-center justify-content-end"
                style={{ width: "100%" }}
              >
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{
                    background: "#02001c",
                    border: "#02001c",
                    width: "150px",
                    height: "50px",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    setOpenModal(true);
                    setSubadminData({
                      email: "",
                      password: "",
                      access_module: "",
                      role: "",
                    });
                  }}
                >
                  ADD SUBADMIN
                </button>
              </div>
            </DashboardHeading>

            <Paper
              className={classes.paperTableHeight}
              style={{
                overflow: "hidden",
                height: "100%",
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
                        Role
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Access Modules
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
                          <div>{get(category, "email", "")}</div>
                        </TableCell>
                        <TableCell className={classes.textMiddle}>
                          <div>{get(category, "role", "")}</div>
                        </TableCell>

                        <TableCell className={classes.textMiddle}>
                          {category?.access_module.length !== 0 && (
                            <select
                              className="rounded"
                              style={{ height: "40px", width:"150px" }}
                            >
                              {category?.access_module.map((option) => (
                                <option
                                  key={option._id}
                                  value={option.access_module}
                                >
                                  {option.access_module}
                                </option>
                              ))}
                            </select>
                          )}
                        </TableCell>

                        <TableCell
                          className={`${classes.textMiddle} d-flex justify-content-center align-items-center`}
                          style={{ marginTop: "10px" }}
                        >
                          <Tooltip title={"Delete"} arrow>
                            <Button
                              // variant="outlined"
                              aria-label="delete"
                              // className={classes.Marginbutton}
                              onClick={() => {
                                deleteSubadmin({ categoryId: category._id });
                              }}
                            >
                              <DeleteOutline />
                            </Button>
                          </Tooltip>
                          <Tooltip title={"Edit"} arrow>
                            <Button
                              aria-label="Edit"
                              onClick={() => {
                                setSubadminData({
                                  email: category.email,

                                  access_module: category.access_module,
                                  role: category.role,

                                  id: category._id,
                                });
                                // setOptionss(category.access_module)
                                console.log(category);
                                setOpenModal(true);
                              }}
                            >
                              <Edit />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {tableData.length === 0 ? (
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
        width="700px"
        height="auto"
        RoundedCorners={true}
        isOpen={openModal}
        // RoundedCorners={true}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenModal(false);
            setSubadminData({
              email: "",
              password: "",
              access_module: "",
              role: "",
            });
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
              {subadminData.id ? "Edit New Subadmin" : "Add Subadmin Details"}
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
                  setSubadminData({
                    email: "",
                    password: "",
                    access_module: "",
                    role: "",
                  });
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={subadminData}
              enableReinitialize
              initialValues={subadminData}
              // validate={subadminValidator}
              validateOnChange
              onSubmit={(values) => {
                if(values.id){
                  console.log('first')
                  handleEdit(values)
                }
                else{
                  console.log('second')
                  handleSubmit(values);
                }
              }}
            >
              {(formikBag) => {
                return (
                  <Form>
                    <div className="signup-cont">
                      <div className="row">
                        <div className="col-md-6">
                          <label className={classes.offerLabel}>Email</label>
                          <Field name="Enter Email">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  autocomplete="off"
                                  value={formikBag.values.email}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "email",
                                      e.target.value
                                    );
                                  }}
                                  // error={
                                  //   formikBag.touched.email &&
                                  //   formikBag.errors.email
                                  //     ? formikBag.errors.email
                                  //     : null
                                  // }
                                  className="form-control"
                                  placeholder="Email Address"
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-6">
                          <label className={classes.offerLabel}>
                            Admin Role
                          </label>
                          <div className="mt-2">
                            <Select
                              options={options}
                              value={options.find(
                                (option) =>
                                  option.value === formikBag.values.role
                              )}
                              onChange={(selectedOption) => {
                                formikBag.setFieldValue(
                                  "role",
                                  selectedOption.value
                                );
                              }}
                              classNamePrefix="react-select"
                              isClearable
                              placeholder="Select Admin Role"
                              // error={
                              //       formikBag.touched.role &&
                              //       formikBag.errors.role
                              //         ? formikBag.errors.role
                              //         : null
                              //     }
                            />
                            
                          </div>
                        </div>
                        {(subadminData.id === "" || subadminData.id === undefined) && (
                          <div className="col-md-6">
                            <label className={classes.offerLabel}>
                              Password
                            </label>
                            <Field name=" Password">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="password"
                                    variant="outlined"
                                    autocomplete="off"
                                    value={formikBag.values.password}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "password",
                                        e.target.value
                                      );
                                    }}
                                    // error={
                                    //   formikBag.touched.password &&
                                    //   formikBag.errors.password
                                    //     ? formikBag.errors.password
                                    //     : null
                                    // }
                                    className="form-control"
                                    placeholder="Password"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                        )}

                        <div className="col-md-6">
                          <label className={classes.offerLabel}>
                            Access Modules
                          </label>
                          <div className="mt-2">
                            <Select
                              options={optionss.map((option) => ({
                                value: option._id,
                                label: option.access_module,
                              }))}
                              value={optionss.find(
                                (option) =>
                                  option.value ===
                                  formikBag.values.access_module
                              )} 
                              onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(
                                  (option) => option.value
                                );
                                formikBag.setFieldValue(
                                  "access_module",
                                  selectedValues
                                );
                              }}
                              classNamePrefix="react-select"
                              isClearable
                              isMulti
                              placeholder="Select Access Modules"
                              // error={
                              //   formikBag.touched.access_module &&
                              //   formikBag.errors.access_module
                              //     ? formikBag.errors.access_module
                              //     : null
                              // }
                            />
                            {console.log(formikBag.values)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div
                        className="col-md-12"
                        style={{ display: "flex", justifyContent: "center" }}
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
