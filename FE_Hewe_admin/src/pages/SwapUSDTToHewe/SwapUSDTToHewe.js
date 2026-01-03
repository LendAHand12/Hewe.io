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
import { useSwapUSDTToHewe } from "./useSwapUSDTToHewe";
import {
  Table as TableAntd,
  Modal as ModalAntd,
} from "../../components/AntdComponent";
import { Input as InputAntd, Radio } from "antd";
import { useSwapUSDTToHeweConnectWallet } from "./useSwapUSDTToHeweConnectWallet";

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

const SwapUSDTToHewe = ({ history, setUsers, userData }) => {
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
  // useEffect(() => {
  //   getAdminList();
  // }, []);

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

  const [buyType, setBuyType] = useState("api"); // or 'connectWallet'

  // GET LIST BUY HEWE
  const {
    x,
    y,
    totalItems,
    currentPage,
    isPendingReview,
    data,
    loading,
    columns,
    limitPerRow,
    inputValue,
    isOpenModalApprove,
    isOpenModalReject,
    dataFocus,
    inputHash,
    inputReason,
    filterToken,
    keyword,
    handleChangeFilterToken,
    handleChangeKeyword,
    handleCloseModalApprove,
    handleCloseModalReject,
    handleRequestApprove,
    handleRequestReject,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    handleChangeInputReason,
    handleChangeInputHash,
  } = useSwapUSDTToHewe({ type: "api" });

  const {
    x: xWallet,
    y: yWallet,
    totalItems: totalItemsWallet,
    currentPage: currentPageWallet,
    isPendingReview: isPendingReviewWallet,
    data: dataWallet,
    loading: loadingWallet,
    columns: columnsWallet,
    limitPerRow: limitPerRowWallet,
    inputValue: inputValueWallet,
    isOpenModalApprove: isOpenModalApproveWallet,
    isOpenModalReject: isOpenModalRejectWallet,
    dataFocus: dataFocusWallet,
    inputHash: inputHashWallet,
    inputReason: inputReasonWallet,
    handleCloseModalApprove: handleCloseModalApproveWallet,
    handleCloseModalReject: handleCloseModalRejectWallet,
    handleRequestApprove: handleRequestApproveWallet,
    handleRequestReject: handleRequestRejectWallet,
    handleSearch: handleSearchWallet,
    handleSetCurrentPage: handleSetCurrentPageWallet,
    handleSetLimitPerRow: handleSetLimitPerRowWallet,
    handleChangeInputReason: handleChangeInputReasonWallet,
    handleChangeInputHash: handleChangeInputHashWallet,
    filterToken: filterTokenWallet,
    keyword: keywordWallet,
    handleChangeFilterToken: handleChangeFilterTokenWallet,
    handleChangeKeyword: handleChangeKeywordWallet,
  } = useSwapUSDTToHeweConnectWallet({ type: "connectWallet" });

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
                  Buy Token
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
                <div>
                  <h4 style={{ marginBottom: "16px" }}>
                    Mua bằng điểm hệ thống
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Radio.Group
                      value={filterToken}
                      onChange={handleChangeFilterToken}
                    >
                      <div>
                        <Radio value="amc">AMC</Radio>
                        <Radio value="hewe">HEWE</Radio>
                      </div>
                    </Radio.Group>

                    <InputAntd
                      style={{ maxWidth: "350px" }}
                      value={keyword}
                      placeholder="Search..."
                      onChange={handleChangeKeyword}
                    />
                  </div>
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

                <div style={{ marginTop: "50px" }}></div>

                <div>
                  <h4 style={{ marginBottom: "16px" }}>Mua bằng kết nối ví</h4>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Radio.Group
                      value={filterTokenWallet}
                      onChange={handleChangeFilterTokenWallet}
                    >
                      <div>
                        <Radio value="amc">AMC</Radio>
                        <Radio value="hewe">HEWE</Radio>
                      </div>
                    </Radio.Group>

                    <InputAntd
                      placeholder="Search..."
                      style={{ maxWidth: "350px" }}
                      value={keywordWallet}
                      onChange={handleChangeKeywordWallet}
                    />
                  </div>
                </div>
                <TableAntd
                  isShowTitle={true}
                  title="History transaction"
                  rowKey="id"
                  x={xWallet}
                  y={yWallet}
                  totalItems={totalItemsWallet}
                  data={dataWallet}
                  currentPage={currentPageWallet}
                  isLoading={loadingWallet}
                  columns={columnsWallet}
                  onChangePage={handleSetCurrentPageWallet}
                  limit={limitPerRowWallet}
                  onChangeLimitPerRow={handleSetLimitPerRowWallet}
                />
              </div>
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
                if (values.id) {
                  console.log("first");
                  handleEdit(values);
                } else {
                  console.log("second");
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
                        {(subadminData.id === "" ||
                          subadminData.id === undefined) && (
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
)(withRouter(SwapUSDTToHewe));
