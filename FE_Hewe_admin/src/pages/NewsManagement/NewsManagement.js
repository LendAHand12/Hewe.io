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
import FileInput from "../../components/FileInput";
import { handleImageUpload } from "../../utils/functions";

import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import "../BlogManagement/AddEditBlog.css";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  HeadingButton,
  MenuAndBack,
} from "../User Management/BlogElements";
// import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from "../../components/Overlay";

import { toast } from "react-toastify";

import { get } from "lodash";

import { DeleteOutline, Edit } from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import JoditEditor from "jodit-react";
import { Editor } from "@tinymce/tinymce-react";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { FaRegNewspaper } from "react-icons/fa6";
import { SlClose } from "react-icons/sl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Input from "../../components/Input";
import { Modal } from "../../components/Modal";
import MoreLess from "../../components/MoreLess";
import Nodata from "../../components/Nodata";
import * as actionTypes from "../../store/actions";
import { URL } from "../../constants/Statics";
import { editorConfig } from "../../utils/editorConfig";

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
    height: "67vh",
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
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [openModal, setOpenModal] = useState(false);
  const editor = useRef(null);
  const tableRef = useRef();
  const [newsData, setNewsData] = useState({
    id: "",
    title: "",
    bannerImage: "",
    longDescription: "",
    authorName: "",
    keywords: "",
    actions: "",
    tableContent: "",
    shortDescription: "",
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

  // For Pagination
  const [page, setPage] = useState(
    parseInt(localStorage.getItem("currentNewsPage")) || 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(localStorage.getItem("rowsPerNewsPage")) || 15
  );
  const [showFilter, setShowFilter] = useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem("currentNewsPage", newPage);
    getAllNews(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    localStorage.setItem("rowsPerNewsPage", newRowsPerPage);
    getAllNews(
      parseInt(localStorage.getItem("currentNewsPage")),
      newRowsPerPage
    );
  };

  const recordsAfterPagingAndSorting = () => {
    const result = [];
    for (let i = 0; i <= tableData.length - 1; i++) {
      result.push(tableData[i]);
    }
    const sortedData = stableSort(result, getComparator(order, orderBy));
    const newpage = parseInt(localStorage.getItem("currentNewsPage"));
    const row = parseInt(localStorage.getItem("rowsPerNewsPage"));
    // Calculate the starting index and ending index for the current page
    const startIndex = newpage * row;
    const endIndex = startIndex + row;
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

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      const data = await axios.post("/createBlog", values, {
        headers: {
          Authorization: token,
        },
      });
      toast.success("New News Created", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getAllNews();
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const handleEdit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const data = await axios.put(`/editBlog/${values.id}`, values, {
        headers: {
          Authorization: token,
        },
      });
      toast.success("News details changed", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getAllNews();
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const getAllNews = async (page, rowsPerPage) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log(page, rowsPerPage);
      const { data } = await axios.get(
        `/getAllBlogs`,

        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTableData(data.data);
      setSearchedData(data.data);
      console.log(data.data, "?????????????");
      setTotalData(data.data.length);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    getAllNews(page, rowsPerPage);
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
  const deleteNews = async (e) => {
    // Prompt the user to enter the admin password

    if (window.confirm("Are you sure you want to delete this News?")) {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.delete(`/deleteBlog/${e.categoryId}`, {
          headers: {
            Authorization: token,
          },
        });
        getAllNews();
        toast.error("News deleted Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const editorRef = useRef(null);
  const editorTableOfContent = useRef(null);

  return (
    <>
      <DashboardContainer>
        <DashboardWrapper>
          <div
            style={{
              padding: "16px",
              overflowY: "scroll",
            }}
          >
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
                <FaRegNewspaper style={{ fontSize: "25px", margin: "8px" }} />

                <DashHeading
                  style={{ color: "#02001c", flex: "1", padding: "8px" }}
                >
                  News Management
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
                    width: "120px",
                    height: "50px",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    setOpenModal(true);
                    setNewsData({
                      id: "",
                      title: "",
                      bannerImage: "",
                      longDescription: "",
                      authorName: "",
                      keywords: "",
                      actions: "",
                      tableContent: "",
                      shortDescription: "",
                    });
                    document
                      .getElementById("addEditBlog")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  ADD NEWS
                </button>
              </div>
            </DashboardHeading>
            <Paper
              className={classes.paperTableHeight}
              style={{
                overflow: "hidden",
                marginBottom: "4rem",
              }}
            >
              <>
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
                          Title
                        </TableCell>
                        <TableCell className={classes.tablePadding}>
                          Banner Image
                        </TableCell>

                        <TableCell className={classes.tablePadding}>
                          Description
                        </TableCell>
                        <TableCell className={classes.tablePadding}>
                          Author Name
                        </TableCell>
                        <TableCell className={classes.tablePadding}>
                          Keywords
                        </TableCell>
                        <TableCell className={classes.tablePadding}>
                          Views
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
                            <div>{get(category, "title", "")}</div>
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>
                              <img
                                src={`${URL}/${get(
                                  category,
                                  "bannerImage",
                                  ""
                                )}`}
                                alt="news"
                                style={{ width: "60px" }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <MoreLess desc={category.shortDescription} />
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "authorName", "")}</div>
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "keywords", "")}</div>
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            <div>{get(category, "view", "")}</div>
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
                                  deleteNews({ categoryId: category._id });
                                }}
                              >
                                <DeleteOutline />
                              </Button>
                            </Tooltip>
                            <Tooltip title={"Edit"} arrow>
                              <Button
                                aria-label="Edit"
                                onClick={() => {
                                  setNewsData({
                                    id: category._id,
                                    title: category.title,
                                    bannerImage: category.bannerImage,
                                    authorName: category.authorName,
                                    keywords: category.keywords,
                                    longDescription: category.longDescription,
                                    shortDescription: category.shortDescription,
                                    tableContent: category.tableContent,
                                  });
                                  setOpenModal(true);
                                  document
                                    .getElementById("addEditBlog")
                                    .scrollIntoView({ behavior: "smooth" });
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
              </>
            </Paper>

            <div
              style={{
                width: "95%",
                padding: "2rem",
                display: "flex",
                color: "#02001c",
                marginBottom: 100,
                marginLeft: "2rem",
                flexDirection: "column",
                backgroundColor: "white",
                justifyContent: "space-between",
              }}
              id="addEditBlog"
            >
              <Formik
                key={newsData}
                enableReinitialize
                initialValues={newsData}
                // validate={subadminValidator}
                validateOnChange
                onSubmit={(values) => {
                  if (values.id) {
                    const longDescription = editorRef.current.getContent();
                    const tableContent =
                      editorTableOfContent.current.getContent();
                    if (longDescription === "") {
                      alert("Please enter description");
                    } else if (tableContent === "") {
                      alert("Please enter table of content");
                    } else {
                      handleEdit({ ...values, longDescription, tableContent });
                      setNewsData({
                        id: "",
                        title: "",
                        bannerImage: "",
                        longDescription: "",
                        authorName: "",
                        keywords: "",
                        actions: "",
                        tableContent: "",
                        shortDescription: "",
                      });
                    }
                  } else {
                    const longDescription = editorRef.current.getContent();
                    const tableContent =
                      editorTableOfContent.current.getContent();
                    // handleSubmit(values);
                    if (longDescription === "") {
                      alert("Please enter description");
                    } else if (tableContent === "") {
                      alert("Please enter table of content");
                    } else {
                      handleSubmit({
                        ...values,
                        longDescription,
                        tableContent,
                      });
                      setNewsData({
                        id: "",
                        title: "",
                        bannerImage: "",
                        longDescription: "",
                        authorName: "",
                        keywords: "",
                        actions: "",
                        tableContent: "",
                        shortDescription: "",
                      });
                    }
                  }
                }}
              >
                {(formikBag) => {
                  return (
                    <Form>
                      {console.log(formikBag.values)}
                      <div className="signup-cont">
                        <div className="row">
                          <div className="col-md-6">
                            <label className={classes.offerLabel}>Title</label>
                            <Field name="Enter Title">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="text"
                                    variant="outlined"
                                    autocomplete="off"
                                    value={formikBag.values.title}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "title",
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
                                    placeholder="News Title"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-6">
                            <label className={classes.offerLabel}>
                              Author Name
                            </label>
                            <Field name="Enter author name">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="text"
                                    variant="outlined"
                                    autocomplete="off"
                                    value={formikBag.values.authorName}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "authorName",
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
                                    placeholder="Author Name"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-6">
                            <label className={classes.offerLabel}>
                              Keywords
                            </label>
                            <Field name="Enter keywords name">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="text"
                                    variant="outlined"
                                    autocomplete="off"
                                    value={formikBag.values.keywords}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "keywords",
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
                                    placeholder="Keywords"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-6">
                            <label className={classes.offerLabel}>
                              Short Description
                            </label>
                            <Field name="Enter short description">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="text"
                                    variant="outlined"
                                    autocomplete="off"
                                    value={formikBag.values.shortDescription}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "shortDescription",
                                        e.target.value
                                      );
                                    }}
                                    className="form-control"
                                    placeholder="Short Description"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-12">
                            <label className={classes.offerLabel}>
                              Description
                            </label>
                            <Field name="Enter Description">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Editor
                                    init={editorConfig}
                                    onInit={(evt, editor) =>
                                      (editorRef.current = editor)
                                    }
                                    apiKey="eb6jth2ze6v4fejxi0kcvnst5wdc0q1ate9jwgyx6asalbl4"
                                    initialValue={
                                      formikBag.values.longDescription
                                    }
                                    onBlur={(newContent) => {
                                      formikBag.setFieldValue(
                                        "longDescription",
                                        newContent
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-12">
                            <label className={classes.offerLabel}>
                              Table of Content
                            </label>
                            <Field name="Enter Table of Content">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Editor
                                    init={editorConfig}
                                    onInit={(evt, editor) =>
                                      (editorTableOfContent.current = editor)
                                    }
                                    apiKey="eb6jth2ze6v4fejxi0kcvnst5wdc0q1ate9jwgyx6asalbl4"
                                    initialValue={formikBag.values.tableContent}
                                    onBlur={(newContent) => {
                                      formikBag.setFieldValue(
                                        "tableContent",
                                        newContent
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-12 mt-2">
                            <label>News Banner Image</label>
                            <Field name="icon">
                              {({ field }) => (
                                <div className="py-2">
                                  <FileInput
                                    className="file-input"
                                    id="facility_images"
                                    limit="1"
                                    dictionary="dictionary"
                                    images={
                                      formikBag.values.bannerImage
                                        ? [formikBag.values.bannerImage]
                                        : []
                                    }
                                    onDelete={(image) => {
                                      formikBag.setFieldValue(
                                        "bannerImage",
                                        ""
                                      );
                                    }}
                                    type="text"
                                    label="upload_products_facility_photos"
                                    info="eg_img"
                                    onChange={async (e) => {
                                      const fileSize =
                                        e.target.files[0].size / 1024 / 1024; // in MiB
                                      if (fileSize > 2) {
                                        alert("ex_2mb");
                                      } else {
                                        var image = await handleImageUpload(
                                          e.target.files[0]
                                        );
                                        // console.log("this is image url", image);
                                        formikBag.setFieldValue(
                                          "bannerImage",
                                          image
                                        );
                                      }
                                    }}
                                  />
                                  {formikBag.touched.icon &&
                                    formikBag.errors.icon && (
                                      <div style={{ color: "red" }}>
                                        {formikBag.errors.icon}
                                      </div>
                                    )}
                                </div>
                              )}
                            </Field>
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
            </div>
          </div>
        </DashboardWrapper>
      </DashboardContainer>

      {isLoading && <Overlay />}
      {/* <Modal
        maxWidth="lg"
        width="640px"
        RoundedCorners={true}
        isOpen={openModal}
        disableEnforceFocus={true}
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
              {newsData.id ? "Edit News" : "Add News"}
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
                  setNewsData({
                    id: "",
                    title: "",
                    bannerImage: "",
                    longDescription: "",
                    authorName: "",
                    keywords: "",
                    actions: "",
                    tableContent: "",
                    shortDescription: "",
                  });
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={newsData}
              enableReinitialize
              initialValues={newsData}
              // validate={subadminValidator}
              validateOnChange
              onSubmit={(values) => {
                if (values.id) {
                  handleEdit(values);
                } else {
                  handleSubmit(values);
                }
              }}
            >
              {(formikBag) => {
                return (
                  <Form>
                    {console.log(formikBag.values)}
                    <div className="signup-cont">
                      <div className="row">
                        <div className="col-md-6">
                          <label className={classes.offerLabel}>Title</label>
                          <Field name="Enter Title">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  autocomplete="off"
                                  value={formikBag.values.title}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "title",
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
                                  placeholder="News Title"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-6">
                          <label className={classes.offerLabel}>
                            Author Name
                          </label>
                          <Field name="Enter author name">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  autocomplete="off"
                                  value={formikBag.values.authorName}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "authorName",
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
                                  placeholder="Author Name"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-6">
                          <label className={classes.offerLabel}>Keywords</label>
                          <Field name="Enter keywords name">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  autocomplete="off"
                                  value={formikBag.values.keywords}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "keywords",
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
                                  placeholder="Keywords"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-6">
                          <label className={classes.offerLabel}>
                            Short Description
                          </label>
                          <Field name="Enter short description">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  autocomplete="off"
                                  value={formikBag.values.shortDescription}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "shortDescription",
                                      e.target.value
                                    );
                                  }}
                                  className="form-control"
                                  placeholder="Short Description"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>
                            Description
                          </label>
                          <Field name="Enter Description">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <JoditEditor
                                  config={{
                                    askBeforePasteFromWord: false,
                                    askBeforePasteHTML: false,
                                    defaultActionOnPaste: "insert_only_text",
                                    readonly: false,
                                    uploader: {
                                      insertImageAsBase64URI: true,
                                      url: "/upload",
                                      format: "json",
                                      method: "POST",
                                    },
                                  }}
                                  value={newsData.longDescription}
                                  onBlur={(newContent) => {
                                    formikBag.setFieldValue(
                                      "longDescription",
                                      newContent
                                    );
                                  }}
                                  ref={editor}
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>
                            Table of Content
                          </label>
                          <Field name="Enter Table of Content">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <JoditEditor
                                  config={{
                                    askBeforePasteFromWord: false,
                                    askBeforePasteHTML: false,
                                    defaultActionOnPaste: "insert_only_text",
                                    readonly: false,
                                    uploader: {
                                      insertImageAsBase64URI: true,
                                      url: "/upload",
                                      format: "json",
                                      method: "POST",
                                    },
                                  }}
                                  value={newsData.tableContent}
                                  onBlur={(newContent) => {
                                    formikBag.setFieldValue(
                                      "tableContent",
                                      newContent
                                    );
                                  }}
                                  ref={tableRef}
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12 mt-2">
                          <label>News Banner Image</label>
                          <Field name="icon">
                            {({ field }) => (
                              <div className="py-2">
                                <FileInput
                                  className="file-input"
                                  id="facility_images"
                                  limit="1"
                                  dictionary="dictionary"
                                  images={
                                    formikBag.values.bannerImage
                                      ? [formikBag.values.bannerImage]
                                      : []
                                  }
                                  onDelete={(image) => {
                                    formikBag.setFieldValue("bannerImage", "");
                                  }}
                                  type="text"
                                  label="upload_products_facility_photos"
                                  info="eg_img"
                                  onChange={async (e) => {
                                    const fileSize =
                                      e.target.files[0].size / 1024 / 1024; // in MiB
                                    if (fileSize > 2) {
                                      alert("ex_2mb");
                                    } else {
                                      var image = await handleImageUpload(
                                        e.target.files[0]
                                      );
                                      // console.log("this is image url", image);
                                      formikBag.setFieldValue(
                                        "bannerImage",
                                        image
                                      );
                                    }
                                  }}
                                />
                                {formikBag.touched.icon &&
                                  formikBag.errors.icon && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.icon}
                                    </div>
                                  )}
                              </div>
                            )}
                          </Field>
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
      {isLoading && <Overlay />} */}
      <></>
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
