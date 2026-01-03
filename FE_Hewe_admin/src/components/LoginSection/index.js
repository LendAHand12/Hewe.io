import React, { useEffect, useState } from "react";

// import { Button } from '../ButtonElements'
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
import * as actionTypes from "../../store/actions";
import InputLogin from "../InputLogin";
import Overlay from "../Overlay";
import {
  Column1,
  Column2,
  InfoContainer,
  InfoRow,
  InfoWrapper,
  InputBox,
  LoginBox,
  LoginBtnWrapper,
  LoginButton,
  LoginHeading,
  LoginPara,
  TextWrapper,
} from "./LoginElements";
// import savypackLogoWhite from "../../images/savypackLogoWhite.png";

import { loginValidator } from "../../utils/validators";

import { RiLockPasswordLine, RiUserLine } from "react-icons/ri";
import "./locationdropdown.css";
import { useGetModulesOfAdmin } from "../../hooks/useGetModulesOfAdmin";
import { SidebarData } from "../SidebarHaydii/SidebarData";
// import { FaRegUser } from 'react-icons/fa';
const useStyles = makeStyles((theme) => ({
  formStyle: {
    width: "100%",
    padding: "2rem",
    // height: "80vh",
    overflow: "scroll",
  },
  "@media (max-width: 780px)": {
    formStyle: {
      padding: "1.8rem",
    },
    formStyleOnly: {
      padding: "1.8rem",
    },
  },
  "@media (max-width: 480px)": {
    formStyle: {
      padding: "1.3rem",
    },
    formStyleOnly: {
      padding: "1.3rem",
    },
  },

  formStyleOnly: {
    width: "100%",
    padding: "2rem",
    // height: "80vh",
    // overflow: "scroll",
  },
}));

const InfoSection = ({
  lightBg,
  imgStart,
  img,
  pageHeading,
  pagePara,
  form,
  history,
  setUsers,
  userData,
  defaultState,
  setDefaultState,
}) => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [OTPSend, setOtpSend] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [isForgetiing, setIsForgetting] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    header: "success_message",
    message: "Your add will post Shortly",
  });
  const token = localStorage.getItem("token");

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const handleGetModules = async (token) => {
    try {
      const res = await axios.get(`/getModulesOfAdmin?email=`, {
        headers: {
          Authorization: token,
        },
      });

      return res.data.data.access_module;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (token !== null) {
      // history.push("/adminPanel/user-management");

      const helper = async () => {
        const modules = await handleGetModules(token);

        if (modules.length === 0) {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          history.push("/adminPanel");
          return;
        }

        const routeDefault = SidebarData.find(
          (s) => s.title == modules[0].access_module
        ).path;

        history.push(routeDefault);
      };

      helper();
    }
  }, []);

  const handleLogin = async (values) => {
    // setLoginValues(values);
    setIsLoading(true);
    var url = "/adminLogin";
    var formvalues = {
      email: values.email,
      password: values.password,
    };

    try {
      const { data } = await axios.post(url, formvalues);
      setUsers(data.session.access_token);

      console.log(data.session.access_token);
      if (data && data.session.access_token) {
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("email", data.data.email);

        const modules = await handleGetModules(data.session.access_token);

        if (modules.length === 0) {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          history.push("/adminPanel");
          return;
        }

        const routeDefault = SidebarData.find(
          (s) => s.title == modules[0].access_module
        ).path;

        history.push(routeDefault);
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(`Wrong Email or Password`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div>
      <InfoContainer lightBg={lightBg}>
        <InfoWrapper>
          <InfoRow imgStart={imgStart}>
            <Column2></Column2>
            <Column1 style={{ borderRadius: "16px" }}>
              <TextWrapper
                contentAlign={
                  defaultState.form === "pendingApproval" ? true : false
                }
              >
                <LoginBox>
                  <LoginHeading>Welcome Back!</LoginHeading>
                  <LoginPara>Sign In to Hewe.io Admin Panel</LoginPara>
                </LoginBox>
                <InputBox>
                  <Formik
                    enableReinitialize
                    initialValues={loginValues}
                    validate={loginValidator}
                    validateOnChange
                    onSubmit={(values) => handleLogin(values, false)}
                  >
                    {(formikBag) => {
                      return (
                        <Form className={classes.formStyleOnly}>
                          <Field name="email">
                            {({ field }) => (
                              <div className="py-2">
                                <div
                                  className="mb-2 d-flex align-items-center"
                                  style={{
                                    width: "70px",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <RiUserLine
                                    style={{ fontSize: "20px", color: "white" }}
                                  />
                                  <span
                                    style={{
                                      fontSize: "18px",
                                      color: "#c0c0c0",
                                    }}
                                  >
                                    Email
                                  </span>
                                </div>

                                <InputLogin
                                  {...field}
                                  type="email"
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "email",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.email &&
                                    formikBag.errors.email
                                      ? formikBag.errors.email
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Email"
                                />
                              </div>
                            )}
                          </Field>
                          <Field name="password">
                            {({ field }) => (
                              <div className="py-2">
                                <div
                                  className="mb-2 d-flex align-items-center"
                                  style={{
                                    width: "100px",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <RiLockPasswordLine
                                    style={{ fontSize: "20px", color: "white" }}
                                  />
                                  <span
                                    style={{
                                      fontSize: "18px",
                                      color: "#c0c0c0",
                                    }}
                                  >
                                    Password
                                  </span>
                                </div>

                                <InputLogin
                                  {...field}
                                  type="password"
                                  // icon={PassIcon}

                                  //   value={formikBag.values.password}
                                  onChange={(e) => {
                                    formikBag.setFieldValue(
                                      "password",
                                      e.target.value
                                    );
                                  }}
                                  error={
                                    formikBag.touched.password &&
                                    formikBag.errors.password
                                      ? formikBag.errors.password
                                      : null
                                  }
                                  className="form-control"
                                  placeholder="Password"
                                />
                              </div>
                            )}
                          </Field>

                          <LoginBtnWrapper>
                            <LoginButton type="submit">Log In</LoginButton>
                          </LoginBtnWrapper>
                          <p
                            className="text-center"
                            style={{
                              padding: "0.3rem",
                              marginBottom: "1.5rem",
                              color: "#ffffff",
                            }}
                          >
                            © 2024 Hewe.io
                          </p>
                        </Form>
                      );
                    }}
                  </Formik>
                </InputBox>
              </TextWrapper>
            </Column1>
          </InfoRow>
        </InfoWrapper>
      </InfoContainer>
      {isLoading && <Overlay />}
    </div>
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
)(withRouter(InfoSection));
