import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/icons/Menu";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { SlClose } from "react-icons/sl";
import "react-phone-input-2/lib/style.css";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
import Input from "../../components/Input";
import { Modal } from "../../components/Modal";
import logoLogin from "../../images/logo.png";
import dashboardLogo from "../../images/sarox_logo.svg";
import { HeadingButton } from "../../pages/User Management/BlogElements";
import * as actionTypes from "../../store/actions";
import { signUpValidator } from "../../utils/validators";
import { loginObjOne } from "../LoginSection/Data";
import Overlay from "../Overlay";
import SidebarOverlay from "../SidebarOverlay";
import "./Nav.css";
import {
  MobileIcon,
  Nav,
  NavBtn,
  NavBtnLink,
  NavLogo,
  NavMenu,
  NavbarContainer,
  SvgLogo,
} from "./NavbarElements";

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

const Navbar = (props) => {
  const { userData, history, sidebar, setSidebar, setUsers } = props;
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [scrollNav, setScrollNav] = useState(false);
  const [bgLogin, setBgLogin] = useState(false);
  const [logoColor, setLogoColor] = useState(dashboardLogo);
  const [defaultState, setDefaultState] = useState({
    isLogin: "",
    isSignup: "",
    isForget: "",
    isOtp: "",
    isReset: "",
    isProfileUpdate: "",
    isApproved: "",
    isRejected: "",
    isProfileComplete: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingSidebarBackground, setIsLoadingSidebarBackground] =
    useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [DisplayMenu, setDisplayMenu] = useState(false);
  const [sidebarShow, setSidebarShow] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const showBackOverlay = () =>
    setIsLoadingSidebarBackground(!isLoadingSidebarBackground);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        props.getSidebar(false);
      } else {
        props.getSidebar(true);
      }
    };
    console.log(window.innerWidth, "this is inner width");
    // Call handleResize initially
    handleResize();

    // Add event listener to window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);
  const handleConfirm = async () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      try {
        const token = localStorage.getItem("token");
        console.log(localStorage.getItem("token"));
        const { data } = await axios.post(
          `/adminLogout`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );

        // console.log("working");
      } catch (error) {
        console.log(error);
      }

      setUsers("");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("currentPage");
      localStorage.removeItem("rowsPerPage");
      localStorage.removeItem("isSuperAdmin");

      history.push("/");
      setDefaultState(loginObjOne);
      history.go(0);
    }
  };
  const handleSubmit = async (values) => {
    console.log(values);
    const formData = {
      currentPassword: values.curPass,
      newPassword: values.newPass,
    };
    try {
      const token = localStorage.getItem("token");
      console.log(localStorage.getItem("token"));
      const { data } = await axios.put(`/changePassword`, formData, {
        headers: {
          Authorization: token,
        },
      });
      if (data.status !== 200) {
        toast.error("Current Password is Invalid", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.success("Password Changed Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      setIsOpen(false);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };
  const showDisplaymenu = () => {
    setDisplayMenu(!DisplayMenu);
  };

  const leftBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (leftBoxRef.current && !leftBoxRef.current.contains(event.target)) {
        setDisplayMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const loginBox = (
    <>
      {!userData ? (
        <>
          <NavBtn>
            <NavBtnLink
              to="/"
              primary="true"
              onClick={() => {
                setDefaultState({
                  isSignup: false,
                  isLogin: true,
                });
              }}
            >
              Login
            </NavBtnLink>

            <NavBtnLink
              to="/"
              onClick={() => {
                setDefaultState({
                  isSignup: true,
                  isLogin: false,
                });
              }}
            >
              Create Account
            </NavBtnLink>
          </NavBtn>
        </>
      ) : (
        <>
          {userData.is_profile_completed === true &&
          userData.is_approved_by_admin === "1" ? (
            <>
              <Menu userIcon={logoLogin} name="qwerfd">
                <div className="user_content">
                  <ul>
                    <li>
                      <NavLink to="/profile-details">
                        my_account
                        <i
                          className="fa fa-chevron-right"
                          aria-hidden="true"
                        ></i>
                      </NavLink>
                    </li>
                    <li>
                      <a href="javascript:void()">
                        logout
                        <i
                          className="fa fa-chevron-right"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </Menu>
            </>
          ) : (
            <>
              <NavBtn>
                <NavBtnLink
                  to="/restaurant"
                  primary="true"
                  onClick={() => {
                    if (userData.is_profile_completed == false) {
                      setDefaultState({
                        isSignup: false,
                        isLogin: false,
                        isProfileComplete: true,
                      });
                    } else {
                      if (userData.is_approved_by_admin == "0") {
                        setDefaultState({
                          isSignup: false,
                          isLogin: false,
                          isApproved: true,
                        });
                      } else if (userData.is_approved_by_admin == "2") {
                        setDefaultState({
                          isSignup: false,
                          isLogin: false,
                          isRejected: true,
                        });
                      }
                    }
                  }}
                >
                  Check Status
                </NavBtnLink>
                <NavBtnLink>Logout</NavBtnLink>
              </NavBtn>
            </>
          )}
        </>
      )}
    </>
  );

  const leftBox = (
    <>
      <NavMenu ref={leftBoxRef}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "2rem",
            }}
          >
            <div
              style={{ fontWeight: "bold", fontSize: "1rem", color: "white" }}
            >{`${"Admin"}`}</div>
            {/* {console.log(userData, 'this is user ka data')} */}
            <Button onClick={() => showDisplaymenu()}>
              <Menu style={{ color: "white" }} />
            </Button>
          </div>
          {DisplayMenu ? (
            <div
              id="yourFilterMenuId"
              style={{
                position: "fixed",
                right: "10px",
                top: "92px",
                borderRadius: "5px",
                backgroundColor: "#02001c",
                padding: "1rem",
                color: "#958FE6",
                height: "100px",
                display: "flex",
                alignItems: "center",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  className="customButton d-flex align-items-center justify-content-space-between pb-2"
                  style={{ width: "100%", borderBottom: "2px solid white" }}
                  onClick={() => {
                    setIsOpen(true);
                    setDisplayMenu(false);
                  }}
                >
                  <i className="fa-solid fa-lock mr-1"></i>
                  <span> Change Password </span>

                  <i
                    class="fa-solid fa-chevron-right"
                    style={{ fontSize: "12px" }}
                  ></i>
                </div>
                <div
                  className="customButton d-flex align-items-center justify-content-space-between "
                  style={{ width: "100%" }}
                  onClick={() => handleConfirm()}
                >
                  <i className="ri-shut-down-line align-middle mr-1"></i>
                  <span>Logout</span>
                  <i
                    class="fa-solid fa-chevron-right"
                    style={{ fontSize: "12px" }}
                  ></i>
                </div>
              </div>
            </div>
          ) : (
            false
          )}
        </div>
        <Modal
          maxWidth="lg"
          width="400px"
          height="auto"
          RoundedCorners={true}
          isOpen={isOpen}
          // RoundedCorners={true}
          onClose={(event, reason) => {
            if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            } else {
              setIsOpen(false);
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
                {"Change Password"}
              </div>
              <div className="">
                <SlClose
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    cursor: "pointer",
                    color: "black",
                  }}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          }
          content={
            <>
              <Formik
                enableReinitialize
                initialValues={{
                  curPass: "",
                  newPass: "",
                  cnewPass: "",
                }}
                validate={signUpValidator}
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
                          <div className="col-md-12">
                            <label className={classes.offerLabel}>
                              Current Password
                            </label>
                            <Field name="Current Password">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="text"
                                    variant="outlined"
                                    autocomplete="off"
                                    value={formikBag.values.curPass}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "curPass",
                                        e.target.value
                                      );
                                    }}
                                    error={
                                      formikBag.touched.curPass &&
                                      formikBag.errors.curPass
                                        ? formikBag.errors.curPass
                                        : null
                                    }
                                    className="form-control"
                                    placeholder="Current Password"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-12">
                            <label className={classes.offerLabel}>
                              New Password
                            </label>
                            <Field name="New Password">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type="text"
                                    variant="outlined"
                                    value={formikBag.values.newPass}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "newPass",
                                        e.target.value
                                      );
                                    }}
                                    error={
                                      formikBag.touched.newPass &&
                                      formikBag.errors.newPass
                                        ? formikBag.errors.newPass
                                        : null
                                    }
                                    className="form-control"
                                    placeholder="New Password"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-12">
                            <label className={classes.offerLabel}>
                              Confirm New Password
                            </label>
                            <Field name="Coach Designation">
                              {({ field }) => (
                                <div className="pb-2 mt-1">
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    variant="outlined"
                                    autocomplete="off"
                                    value={formikBag.values.cnewPass}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "cnewPass",
                                        e.target.value
                                      );
                                    }}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={() =>
                                            setShowPassword(!showPassword)
                                          }
                                          edge="end"
                                        >
                                          {showPassword ? (
                                            <i class="fa-solid fa-eye-slash"></i>
                                          ) : (
                                            <i class="fa-solid fa-eye"></i>
                                          )}
                                        </IconButton>
                                      </InputAdornment>
                                    }
                                    error={
                                      formikBag.touched.cnewPass &&
                                      formikBag.errors.cnewPass
                                        ? formikBag.errors.cnewPass
                                        : null
                                    }
                                    className="form-control"
                                    placeholder="Confirm New Password"
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
      </NavMenu>
    </>
  );

  return (
    <>
      <IconContext.Provider value={{ color: "#ffffff" }}>
        <Nav scrollNav={scrollNav} bgLogin={bgLogin}>
          <NavbarContainer>
            <NavLogo>
              <div className="d-flex align-items-center">
                <SvgLogo
                  className="logoImage"
                  style={{ padding: "5px", width: "10rem" }}
                  src={logoColor}
                />
                {/* <h1 style={{ fontSize: "30px", margin: "0px", color: "white" }}>
                  Sarox
                </h1> */}
              </div>
            </NavLogo>

            <MobileIcon
              onClick={() => {
                // showBackOverlay();
                // showSidebar();
                // setDisplayMenu(!DisplayMenu);
                console.log("CLICK ?????????", sidebarShow);
                setSidebarShow(!sidebarShow);
                props.getSidebar(sidebarShow);
              }}
            >
              <FaBars />
            </MobileIcon>
            {leftBox}
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
      {isLoading && <Overlay />}
      {!sidebar ? <SidebarOverlay /> : ""}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    locationData: state.locations,
    defaultState: state.defaultState,
    sidebar: state.sidebar,
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
    setSidebar: (updatedValue) => {
      dispatch({
        type: actionTypes.UPDATE_SIDEBAR,
        updateSidebar: updatedValue,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
