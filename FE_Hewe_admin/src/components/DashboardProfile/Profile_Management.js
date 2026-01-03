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
} from "./Profile_ManagementElements";
import { LoginButton } from "../LoginSection/LoginElements";
import { HeadingButton } from "../Dashboard/DashboardElements";
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
} from "@material-ui/core";
import {
  loginObjOne,
  signUpObjOne,
  forgotObjOne,
  resetObjOne,
  restaurantDetailsObjOne,
  bankDetailsObjOne,
  verifyOtpObjOne,
  pendingApprovalObjOne,
} from "../LoginSection/Data";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Field, Form } from "formik";
import InputLogin from "../InputLogin";
import YearInput from "../YearInput";
import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from "../Overlay";
import { toast } from "react-toastify";
import EditIcon from "../../images/edit_profile_button_table.png";
import DeleteIcon from "../../images/delete_profile_button_table.png";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

import * as IoIcons from "react-icons/io";
import * as HiIcons from "react-icons/hi";
import { get } from "lodash";
import classNames from "classnames";

import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter } from "react-router-dom";
import SearchBar from "../SearchBar/Search";
import { offerValidator } from "../../utils/validators";
import "./ProfileManagementStyles.css";
import placeholder from "../../images/lady.png";
import cameraIcon from "../../images/camera.png";
import { uploadImage } from "../../utils/functions";
import PhoneInput from "react-phone-input-2";
import {
  restaurantDetailsValidator,
  bankDetailsValidator,
  passwordProfileValidator,
} from "../../utils/validators";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "0.5rem",
    textAlign: "center",
    fontSize: "0.8rem",
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
}));

const OfferManagement = ({ history, setUsers, userData }) => {
  const classes = useStyles();
  const Data = localStorage.getItem("userData");
  const JSONdata = JSON.parse(Data);

  const [defaultState, setDefaultState] = useState({
    isAddMenu: "",
    isRestaurantDetails: "",
  });
  const [menuState, setMenuState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [offersData, setOffersData] = useState([]);

  const [offerValues, setOfferValues] = useState({
    offer_name: "",
    offer_type: "",
    offer_code: "",
    offer_validity: {
      from: "",
      to: "",
    },
    min_amount: "",
    max_amount: "",
  });

  useEffect(() => {
    if (!userData) {
      history.push("/");
    }
  }, []);

  const [profileImage, setProfileImage] = useState(
    get(userData, "profile_image", "")
  );

  const [updateProfileValues, setUpdateProfileValues] = useState({
    whole_number:
      get(userData, "country_code", "") + get(userData, "mobile_number", ""),
    username: get(userData, "username", ""),
    mobile_number: get(userData, "mobile_number", ""),
    email: get(userData, "email", ""),
    bank_name: get(userData, "bank_details.bank_name", ""),
    account_holder_name: get(userData, "bank_details.account_holder_name", ""),
    account_number: get(userData, "bank_details.account_number", ""),
    re_account_number: get(userData, "bank_details.account_number", ""),
    ifsc: get(userData, "bank_details.branch_code", ""),
  });

  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handleCompleteProfile = async (values) => {
    var fromData = {
      country_code: values.country_code,
      mobile_number: values.mobile_number,
      email: values.email,
      profile_image: profileImage,
      bank_details: {
        bank_name: values.bank_name,
        account_holder_name: values.account_holder_name,
        account_number: values.account_number,
        branch_code: values.ifsc,
      },
    };
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "/auth/superMarket/updateProfile",
        fromData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUpdateProfileValues({
        ...updateProfileValues,
        country_code: values.country_code,
        mobile_number: values.mobile_number,
        whole_number: values.whole_number,
        email: values.email,
        bank_name: get(values, "bank_name", ""),
        account_holder_name: get(values, "account_holder_name", ""),
        account_number: get(values, "account_number", ""),
        re_account_number: get(values, "account_number", ""),
        ifsc: get(values, "ifsc", ""),
      });

      setIsLoading(false);
      localStorage.setItem("token", data.data.access_token);
      localStorage.setItem("userData", JSON.stringify(data.data));
      localStorage.setItem("isUser", true);

      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.response.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (error.response.status === 401) {
        history.push("/");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        // setUsers("");
      }
    }
  };

  const handleChangePassword = async (values) => {
    setIsLoading(true);

    const formData = {
      old_password: values.oldPassword,
      new_password: values.password,
      confirmPassword: values.confirmPassword,
    };

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post("/admin/change-password", formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setIsLoading(false);
      handleConfirm();
    } catch (error) {
      setIsLoading(false);

      toast.error(`${error.response.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    }
  };
  const handleConfirm = (async) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUsers("");
    history.push("/");
    history.go("0");
  };

  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading>
              <MenuAndBack>
                <DashHeading>Change Password</DashHeading>
              </MenuAndBack>
            </DashboardHeading>

            <Paper
              className={classes.paperTableHeight}
              style={{ overflow: "hidden" }}
            >
              <RetaurantDetailsForm>
                <Formik
                  enableReinitialize
                  initialValues={changePassword}
                  validate={passwordProfileValidator}
                  validateOnChange
                  onSubmit={handleChangePassword}
                >
                  {(formikBag) => {
                    return (
                      <Form
                        className={classNames(
                          "mobileViewPadding",
                          "designScrollbar"
                        )}
                        style={{
                          width: "100%",
                          padding: "2rem",
                          height: "80vh",
                          overflow: "scroll",
                        }}
                      >
                        <InputDivide className="col-md-12">
                          <div className="col-md-6" style={{ padding: "1rem" }}>
                            <label>Enter Current Password</label>
                            <Field name="oldPassword">
                              {({ field }) => (
                                <div className="py-2">
                                  <InputLogin
                                    {...field}
                                    type="password"
                                    value={formikBag.values.oldPassword}
                                    // icon={RestaurantIcon}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "oldPassword",
                                        e.target.value
                                      );
                                    }}
                                    error={
                                      formikBag.touched.oldPassword &&
                                      formikBag.errors.oldPassword
                                        ? formikBag.errors.oldPassword
                                        : null
                                    }
                                    className="form-control"
                                    placeholder="Enter Current Password"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                          <div className="col-md-6" style={{ padding: "1rem" }}>
                            <label>Enter New Password</label>
                            <Field name="password">
                              {({ field }) => (
                                <div className="py-2">
                                  <InputLogin
                                    {...field}
                                    type="password"
                                    value={formikBag.values.password}
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
                                    placeholder="Enter New Password"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                        </InputDivide>
                        <InputDivide className="col-md-12">
                          <div className="col-md-6" style={{ padding: "1rem" }}>
                            <label>Confirm New Password</label>
                            <Field name="confirmPassword">
                              {({ field }) => (
                                <div className="py-2">
                                  <InputLogin
                                    {...field}
                                    type="password"
                                    value={formikBag.values.confirmPassword}
                                    // icon={LocationIcon}
                                    onChange={(e) => {
                                      formikBag.setFieldValue(
                                        "confirmPassword",
                                        e.target.value
                                      );
                                    }}
                                    error={
                                      formikBag.touched.confirmPassword &&
                                      formikBag.errors.confirmPassword
                                        ? formikBag.errors.confirmPassword
                                        : null
                                    }
                                    className="form-control"
                                    placeholder="Confirm New Password"
                                  />
                                </div>
                              )}
                            </Field>
                          </div>
                        </InputDivide>

                        <div
                          className="text-center login_btn_group"
                          style={{ justifyContent: "center" }}
                        >
                          <LoginButton
                            type="submit"
                            className="buttonWidthResponsive"
                          >
                            Update
                          </LoginButton>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </RetaurantDetailsForm>
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
