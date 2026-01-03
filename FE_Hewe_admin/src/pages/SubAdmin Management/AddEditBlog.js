import React, { useState, useEffect } from "react";
import {
  DashboardContainer,
  DashboardWrapper,
  DashboardHeading,
  DashHeading,
  SvgLogo,
  BackIcon,
  MenuAndBack,
  PreperationTime,
  LabelHeading,
  RetaurantDetailsForm,
  InputDivide,
  MiddleColumnProfile,
  InputPic,
  HeadingBlock,
  HeadingProfile,
  HeadingPara,
  MultipleButtons,
  TripleButton,
  MultipleButton,
  VoucherHeading,
  VoucherHeadingMain,
  FullWidthMobileInput,
  OfferRadioSection,
  OfferSectionLabel,
  MobileViewCalender,
  HeadingButton,
  LoginButton,
} from "./BlogElements";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Input from "../../components/Input";
import YearInput from "../../components/YearInput";
// import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from "../../components/Overlay";
import { toast } from "react-toastify";
import EditIcon from "../../images/edit_profile_button_table.png";
import DeleteIcon from "../../images/delete_profile_button_table.png";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

import * as IoIcons from "react-icons/io";
import * as HiIcons from "react-icons/hi";
import { get, isEmpty } from "lodash";
import classNames from "classnames";
import Select from "../../components/Select";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter } from "react-router-dom";
// import SearchBar from "material-ui-search-bar";
import { BlogDataValidator } from "../../utils/validators";
import TextArea from "../../components/TextArea";
import FileInput from "../../components/FileInput";
// import { uploadImage } from "../../utils/functions";
import { FaSearch } from "react-icons/fa";
import BlockIcon from "@material-ui/icons/Block";
import {
  SearchContainer,
  SearchBar,
  SearchIcon,
  SearchInput,
} from "../../components/SearchBar/SearchElements";
import DatePicker from "react-date-picker";
import { BsFilter } from "react-icons/bs";
import { useLocation } from "react-router-dom";

import moment from "moment";
import NoDataFound from "../../components/NoDataFound";
import Nodata from "../../components/Nodata";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Modal } from "../../components/Modal";
import { SlClose } from "react-icons/sl";
import AddIcon from "@material-ui/icons/Add";
import { handleImageUpload } from "../../utils/functions";
import { DeleteOutline } from "@material-ui/icons";
import { Edit } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import LexicalEditor from "../../LexicalEditor/index";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import "./AddEditBlog.css";

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
    justifyContent: "space-evenly",
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
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.8rem",
    marginBottom: theme.spacing(2),
  },
  detail: {
    fontSize: "1.2rem",
    marginBottom: theme.spacing(1),
  },
}));

const OfferManagement = ({ history, setUsers, userData }) => {
  // console.log("jsdjsjdsjdjsdjsdsd", history);
  const classes = useStyles();
  const {
    location: { state },
  } = history;

  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  useEffect(() => {
    setIsLoading(true)
    getBlogDetails();
  }, []);
  const getBlogDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await axios.get(`/get_user/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(data.data.data)
      setSearchedData(data.data.data.user_info);
      setShow(true)
      setIsLoading(false)
      // console.log(userDetails.data.data, 'this is user details')
    } catch (e) {
      console.log(e);
    }
  };
  console.log(searchedData);

  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
          <DashboardHeading
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "2rem",
              }}
            >
             <MenuAndBack
                style={{
                  backgroundColor: "#1692B4",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  // variant="outlined"
                  aria-label="add"
                  // style={{c}}
                  // className={classes.iconMargin}
                  onClick={() => {
                    // if (window.confirm("Leave without saving changes?")) {
                    history.push({
                      pathname: "/user-management",
                    });
                    // }
                  }}
                >
                  <ArrowBackIcon style={{ color: "white", margin: "8px", cursor: "pointer" }} />
                </Button>
                <DashHeading style={{ color: "white", flex: "1" }}>
                  View</DashHeading>
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
      <Typography variant="h3" className={classes.heading}>
        User Details
      </Typography>
      <section className="blogdetail">
        <Typography variant="h5" className={classes.heading}>
        <strong>Name:</strong> {searchedData.first_name} {searchedData.last_name}
        </Typography>
        <Typography variant="body1" className={classes.detail}>
          <strong>Email:</strong> {searchedData.email}
        </Typography>
        <Typography variant="body1" className={classes.detail}>
          <strong>Mobile:</strong> {searchedData.mobile_no}
        </Typography>
       
  
      </section>
    </Paper>
         
          </DashboardWrapper>
        </DashboardContainer>
      </div>

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
