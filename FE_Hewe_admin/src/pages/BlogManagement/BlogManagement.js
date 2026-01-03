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
  styled
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import JoditEditor from "jodit-react";
import React, { useEffect, useRef, useState } from "react";
import { FaBloggerB } from "react-icons/fa";
import Input from "../../components/Input";
import './AddEditBlog.css';
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  HeadingButton,
  MenuAndBack
} from "./BlogElements";
// import { extractDate } from "../../utils/functions";
import * as AiIcons from "react-icons/ai";
import axios from "../../axios";
import Overlay from "../../components/Overlay";

import { toast } from "react-toastify";

import { get } from "lodash";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions";
// import SearchBar from "material-ui-search-bar";
import FileInput from "../../components/FileInput";
import TextArea from "../../components/TextArea";
import { BlogDataValidator } from "../../utils/validators";
// import { uploadImage } from "../../utils/functions";
import { DeleteOutline, Edit } from "@material-ui/icons";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { FaSearch } from "react-icons/fa";
import { SlClose } from "react-icons/sl";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Modal } from "../../components/Modal";
import MoreLess from "../../components/MoreLess";
import Nodata from "../../components/Nodata";
import {
  SearchBar,
  SearchContainer,
  SearchIcon,
  SearchInput,
} from "../../components/SearchBar/SearchElements";
import { handleImageUpload } from "../../utils/functions";

const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "5px",
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: "800",
  },
  tableContainerHeight: {
    maxHeight: "77vh",
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
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#02001c",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
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
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const OfferManagement = ({ history, setUsers, userData }) => {
  // console.log("jsdjsjdsjdjsdjsdsd", history);
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [datefiltervalue, setDateFilter] = useState();
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [NameText, setNameText] = useState(null);
  const [NameTextTitle, setNameTextTitle] = useState(null);
  const editor = useRef(null);
  const [plaintext, setPlaintext] = useState("");
  const [LinkNameText, setLinkNameText] = useState(null);
  const [LinkText, setLinkText] = useState(null);
  const [open, setOpen]=useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalData, setTotalData] = useState(90);
  const [categoryList, setCategoryList] = useState([]);
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [showDesc, setShowDesc] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [BlogData, setBlogData] = useState({
    title: "",
    image: "",
    sort_description: "",
    detail_description: "",
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

  useEffect(() => {
    if (!userData) {
      history.push("/");
    }
    console.log(userData);
  }, []);

  useEffect(() => {
    getBlogList();

    // fetchCategoryList();
    // fetchSubcategoryList();
  }, []);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    getBlogList(newPage + 1, rowsPerPage, searchValue);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(+event.target.value);
    // setPage(0);

    getBlogList(1, event.target.value, searchValue);
    console.log("checkrows");
    console.log(parseInt(event.target.value, 10));
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };
  const statusSwitch = async (e, category) => {
    // console.log("category", category);
    if(e.target.checked){
      if (window.confirm("Are you sure you want to block the blog?")) {
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.post(
            `/admin/edit-blog-status`,
            {
              id: category.id,
              status: !e.target.checked,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
  
          toast.error(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getBlogList();
        } catch (error) {
          console.log(error);
        }
      }

    }
    else if(!e.target.checked){
      if (window.confirm("Are you sure you want to unblock the blog?")) {
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.post(
            `/admin/edit-blog-status`,
            {
              id: category.id,
              status: !e.target.checked,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
  
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getBlogList();
        } catch (error) {
          console.log(error);
        }
      }
    }
 
  };

  const requestSearch = (searchedVal) => {
    console.log("searchedVal", searchedVal);
    console.log("searchedVal", searchedData);
    const filteredRows = searchedData.filter((row) => {
      let name = get(row, "firstName", "") + " " + get(row, "lastName", "");
      let mobileNumber = JSON.stringify(get(row, "mobileNumber", ""));
      let email = get(row, "email", "");
      // let sequenceId = JSON.stringify(get(row, "sequenceId", ""));
      return (
        name.toLowerCase().includes(searchedVal.target.value.toLowerCase()) ||
        mobileNumber
          .toLowerCase()
          .includes(searchedVal.target.value.toLowerCase()) ||
        email.toLowerCase().includes(searchedVal.target.value.toLowerCase())
        // sequenceId.toLowerCase().includes(searchedVal.target.value.toLowerCase())
      );
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    getBlogList(page + 1, rowsPerPage, searchValue);
    // getBlogList()
  };

  const recordsAfterPagingAndSorting = () => {
    return stableSort(tableData, getComparator(order, orderBy));
    //  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
    return stabilizedThis.map((el) => el[0]);
  };

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const blogBlocked = async (e) => {
    // console.log(e);
    if (e.categoryBlocked === true) {
      if (window.confirm("Are you sure you want to unblock this blog?")) {
        try {
          const { data } = await axios.post("/admin/block_unblock_blog", {
            id: e.categoryId,
            isBlocked: false,
          });
          getBlogList(page + 1, rowsPerPage, searchValue);
          // getBlogList()
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // getCategory();
      }
    } else if (e.categoryBlocked === false) {
      if (window.confirm("Are you sure you want to block this blog?")) {
        try {
          const { data } = await axios.post("/admin/block_unblock_blog", {
            id: e.categoryId,
            isBlocked: true,
          });
          getBlogList(page + 1, rowsPerPage, searchValue);
          // getBlogList();
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // getCategory();
      }
    } else {
      return "error";
    }
  };
  const deleteBlog = async (e) => {
    // console.log(e);

    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.delete(
          `/admin/delete-blog/${e.categoryId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        getBlogList(page + 1, rowsPerPage, searchValue);
        // getBlogList()
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      // getCategory();
    }
  };
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
  const getBlogList = async (
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
        `/admin/get-blogs?page=${page}&pageSize=${rowsPerPage}&searchTerm=${searchValue}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setTableData(data.data);
      setSearchedData(data.data);
      setTotalData(data.data.length);
      setPage(page - 1);
      setRowsPerPage(rowsPerPage);
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

  function myDeb(call, d = 1000) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        call(...args);
      }, d);
    };
  }

  const SearchUser = (searchedVal) => {
    const filteredRows = searchedData.filter((row) => {
      
      let blog = row.title;  
      return (
        blog.toLowerCase().includes(searchedVal.target.value.toLowerCase()) 
      );
    });
      setTableData(filteredRows);
  };
  const handleSubmit = async (values) => {
    // console.log("this is submit api");
    // if (!id) {
    //   //add profile

    let addUrl = `/admin/add-blog`;
    let BlogData;

    BlogData = {
      title: values.title,

      image: values.image,
      // link: values.link,
      sort_description: values.sort_description,
      detail_description: values.detail_description,
    };
    // console.log(BlogData)
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(addUrl, BlogData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getBlogList();
      setBlogData({
        title: "",
        image: "",
        sort_description: "",
        detail_description: "",
        id: "",
      });
    } catch (err) {
      if (err.response.status == "400") {
        toast.error(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    // } else {

    // }
  };
 
  const handleEditBlog = async (values) => {
    //   //update profile

    let updateUrl = `/admin/edit-blog/`;
    let BlogData;

    BlogData = {
      date: values.date,
      title: values.title,

      image: values.image,
      // link: values.link,
      sort_description: values.sort_description,
      detail_description: values.detail_description,
      id: values.id,
    };

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(updateUrl, BlogData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpenModal(false);
      getBlogList();
      setBlogData({
        title: "",
        image: "",
        sort_description: "",
        detail_description: "",
        id: "",
      });
    } catch (err) {
      if (err.response.status == "400") {
        toast.error(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      console.log(err.response);
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
                  backgroundColor: "#02001c",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaBloggerB style={{ fontSize: "25px", margin: "8px" }} />
                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  Blog Management
                </DashHeading>
              </MenuAndBack>
              <div style={{ display: "flex",width:"100%", gap:"1rem", justifyContent:"end", alignItems:"center" }}>
                <SearchContainer>
                  <SearchBar>
                    <SearchIcon>
                      <FaSearch style={{ color: "#c4c4c4" }} />
                      {/*<SearchIconn color="#000000" style={{fontWeight:"200"}}/>*/}
                      {/*<IconSearch/>*/}
                    </SearchIcon>
                    <SearchInput
                      type="text"
                      onChange={(searchVal) => SearchUser(searchVal)}
                      // value={searched}
                      placeholder="Search by title"
                    ></SearchInput>
                  </SearchBar>
                </SearchContainer>
                <div>
              <button
                type="button"
                class="btn btn-primary"
                style={{ background: "#02001c", border: "#02001c" }}
                onClick={() => {
                  setOpenModal(true);
                }}
                >
                ADD NEW
              </button>
            </div>
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
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "createdAt" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("createdAt");
                          }}
                        > */}
                        Date
                        {/* </TableSortLabel> */}
                      </TableCell>
                      {/* <TableCell className={classes.tablePadding}>   <TableSortLabel
                          active={true}
                          direction={orderBy === "sequenceId" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("sequenceId");
                          }}
                        >User Id</TableSortLabel></TableCell> */}
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "email" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("email");
                          }}
                        > */}
                        Image
                        {/* </TableSortLabel> */}
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "firstName" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("firstName");
                          }}
                        > */}
                        Title
                        {/* </TableSortLabel> */}
                      </TableCell>

                      <TableCell className={classes.tablePadding}>
                        {/* <TableSortLabel
                          active={true}
                          direction={orderBy === "mobileNumber" ? order : "asc"}
                          onClick={() => {
                            handleSortRequest("mobileNumber");
                          }}
                        > */}
                        Short Description
                        {/* </TableSortLabel> */}
                      </TableCell>
                      {/* <TableCell className={classes.tablePadding}>Link</TableCell> */}
                      <TableCell className={classes.tablePadding}>
                        Status
                      </TableCell>
                      <TableCell className={classes.tablePadding}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      // tableData
                      recordsAfterPagingAndSorting().map((category, index) => (
                        <TableRow key={category.id}>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.textMiddle}
                          >
                            {index + 1 + page * rowsPerPage}
                          </TableCell>
                          <TableCell className={classes.textMiddle}>
                            {/* <div>{dateOfJoining(category.createdAt)}</div> */}
                            <div>
                              {" "}
                              {moment(category?.date).format("DD/MM/YYYY")}
                            </div>
                          </TableCell>
                          {/* <Tooltip title="Click to view"> */}
                          <TableCell className={classes.textMiddle}>
                            {!get(category, "image", "") ? (
                              "N/A"
                            ) : (
                              <div style={{ width: "30px", height: "30px" }}>
                                <img src={get(category, "image", "")} width="45px"/>
                            {/* <ModalImage
                              small={get(category, "image", "")}
                              large={get(category, "image", "")}
                              alt="Image Preview"
                              hideDownload
                              hideZoom
                            />  */}
                          </div>
                            )}
                          </TableCell>
                          {/* </Tooltip> */}
                          <TableCell className={classes.textMiddle}>
                            {/* <div>{dateOfJoining(category.createdAt)}</div> */}
                            <div>{get(category, "title")}</div>
                          </TableCell>
                          <Tooltip title={"View Detail Description"} arrow>
                          <TableCell className={classes.textMiddle}>
                              {" "}
                              <MoreLess desc={category.sort_description} />
                            </TableCell>
                            {/* <TableCell
                              onClick={() => setIsOpen(true)}
                              style={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:"center"
                              }}
                              className={classes.textMiddle}
                            >
                              <div>
                                {get(category, "sort_description").slice(0, 25)}
                              </div>
                              <Button
                                style={{
                                  fontSize: "14px",
                                  paddingLeft: "0px",
                                  paddingTop: "0.5rem",
                                  color: "blue",
                                }}
                                class="btn"
                                onClick={() => 
                                 {console.log(get(category, 'sort_description', ''))
                                   setOpen(true)}
                                }
                              >
                                ...more
                              </Button>
                               {open && (
                                <div class="modal-container">
                                  <div class="modal-content">
                                    <div className="close">
                                      <i
                                        style={{ cursor: "pointer" }}
                                        onClick={()=>{setOpen(false)}}
                                        class="fa-regular fa-circle-xmark"
                                      ></i>
                                    </div>
                                    <p>{get(category, "sort_description", "")}</p>
                                  </div>
                                </div>
                              )}
                            </TableCell> */}
                          </Tooltip>
                         

                            <Tooltip
                              title={category.status ? "Block" : "Unblock"}
                              arrow
                            >
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                  <IOSSwitch
                                    onChange={(e) => {
                                      statusSwitch(e, category);
                                    }}
                                    checked={!category.status}
                                  />
                              </div>
                            </div>
                          </TableCell>
                                </Tooltip>

                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {/* <div style={{ marginRight: "1rem" }}>
                            <Button
                              variant="outlined"
                              aria-label="add"
                              className={classes.iconMargin}
                              onClick={() => {
                                history.push({
                                  pathname: `//user/${category.id}`,
                                });
                              }}
                            >
                              <VisibilityIcon color="primary" />
                            </Button>
                          </div> */}
                              <div>
                                <Tooltip title={"Edit"} arrow>
                                  <Button
                                    // variant="outlined"
                                    aria-label="Edit"
                                    // className={classes.Marginbutton}
                                    onClick={() => {
                                      // history.push({
                                      //   pathname: "//blog/AddEdit",
                                      //   state: category,
                                      // }
                                      // );
                                      setBlogData({
                                        title: category.title,

                                        image: category.image,
                                        sort_description:
                                          category.sort_description,

                                        detail_description:
                                          category.detail_description,

                                        id: category.id,
                                      });
                                      setOpenModal(true);
                                      // setModalState({ isAddEditTaxiSingle: true });
                                      //             setSelectedTaxiDataAddEdit(category);
                                    }}
                                  >
                                    <Edit />
                                  </Button>
                                </Tooltip>
                              </div>
                              <div>
                                <Tooltip title={"View"} arrow>
                                  <Button aria-label="add">
                                    <Link
                                      to={`//blog/AddEdit?id=${category.id}`}
                                    >
                                      <AiIcons.AiFillEye
                                        style={{ fontSize: "1.5rem" }}
                                      />
                                    </Link>
                                  </Button>
                                </Tooltip>
                              </div>
                              <div>
                                <Tooltip title={"Delete"} arrow>
                                  <Button
                                    // variant="outlined"
                                    aria-label="delete"
                                    // className={classes.Marginbutton}
                                    onClick={() => {
                                      deleteBlog({ categoryId: category.id });
                                    }}
                                  >
                                    <DeleteOutline />
                                  </Button>
                                </Tooltip>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              {
                // totalData === 0
                tableData.length === 0 ? (
                  <Nodata TextToDisplay="No Data Found." fontSize="24px" />
                ) : (
                  false
                )
              }
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
        // RoundedCorners={true}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
          } else {
            setOpenModal(false);
            setBlogData({
              title: "",
              image: "",
              sort_description: "",
              detail_description: "",
              id: "",
            });
            // if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            //   console.log(reason);
            //   setOpenModal(true);
            // } else {
            //   setOpenModal(false);
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
              {!BlogData.id ? `Add Blog` : `Edit Blog`}
            </div>
            <div className="">
              <SlClose
                style={{
                  // fontSize: "1.5rem",
                  position: "absolute",
                  top: 16,
                  right: 16,
                  // color: "#fff",
                  // borderRadius: "50%",
                  // backgroundColor: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenModal(false);
                  setBlogData({
                    title: "",
                    image: "",
                    sort_description: "",
                    detail_description: "",
                    id: "",
                  });
                  // setSelectedPetCategoryData(null);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              key={BlogData}
              enableReinitialize
              initialValues={BlogData}
              validate={BlogDataValidator}
              validateOnChange
              onSubmit={(values) => {
                // console.log('button clicked')
                if (values.id) {
                  handleEditBlog(values);
                } else {
                  handleSubmit(values);
                }
              }}
            >
              {(formikBag) => {
                return (
                  <Form style={{ margin: "1rem 1rem 0 1rem" }}>
                    <div className="signup-cont">
                      <div className="row">
                        {/* <div className="col-md-12"> */}

                        <div className="col-md-12">
                          <label className={classes.offerLabel}>Title</label>
                          <Field name="title">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <Input
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.title}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "title",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.title &&
                                    formikBag.errors.title
                                      ? formikBag.errors.title
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Title"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>
                            Short Description
                          </label>
                          <Field name="Short Description">
                            {({ field }) => (
                              <div className="pb-2 mt-1">
                                <TextArea
                                  {...field}
                                  type="text"
                                  variant="outlined"
                                  value={formikBag.values.sort_description}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "sort_description",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.sort_description &&
                                    formikBag.errors.sort_description
                                      ? formikBag.errors.sort_description
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Enter Short description"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="col-md-12">
                          <label className={classes.offerLabel}>
                            Detail Description
                          </label>
                          <Field name="Detail Description">
                            {({ field, form }) => (
                              <div className="pb-2 mt-1">
                                <JoditEditor
                                  style={{
                                    padding: "0.375rem 0.75rem",
                                    fontSize: "1rem",
                                    fontWeight: "400",
                                  }}
                                  ref={editor}
                                  value={(formikBag.values.detail_description)}
                                  onChange={(newContent) => {
                                    form.setFieldValue("detail_description", newContent);
                                  }}
                                  
                                />
                                {/* <LexicalEditor
                                  initialEditorState={
                                    formikBag.values.detail_description
                                  }
                                  onChange={(editorState, editorInstance) => {
                                    formikBag.setFieldValue(
                                      "detail_description",
                                      editorState
                                    );
                                  }}
                                /> */}
                                {formikBag.errors.detail_description ? (
                                  <p
                                    style={{
                                      paddingTop: 5,
                                      fontSize: 13,
                                      color: "red",
                                    }}
                                  >
                                    {formikBag.errors.detail_description}
                                  </p>
                                ) : null}

                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="col-md-12 mt-2">
                          <label>Blog Image</label>
                          <Field name="image">
                            {({ field }) => (
                              <div className="py-2">
                                <FileInput
                                  className="file-input"
                                  id="facility_images"
                                  limit="1"
                                  dictionary="dictionary"
                                  images={
                                    formikBag.values.image
                                      ? [formikBag.values.image]
                                      : []
                                  }
                                  onDelete={(image) => {
                                    formikBag.setFieldValue("image", "");
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
                                      formikBag.setFieldValue("image", image);
                                    }
                                  }}
                                />
                                  {formikBag.touched.image &&
                                  formikBag.errors.image && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.image}
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
