import React, { useState, useEffect } from "react";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import { signUPValidator } from "../../util/validators";
import { axiosService } from "../../util/service.js";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { EyeClosed } from "@phosphor-icons/react";
import side1 from "../../assets/images/login/rightside.png";
import sideleft from "../../assets/images/login/leftside.png";
import Footer1 from "../HomePage/Footer1.js";
// img

import "react-phone-number-input/style.css";
import Overlay from "../../components/Overlay.js";

import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import Header from "../HomePage/Header.jsx";

const Signup = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // referral link----

  const [signUpformValues, setSignUpformValues] = useState({
    UserName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirm_password: "",
    referralLink: "",
    Lah_member: "",
  });
  const [referralCode, setReferralCode] = useState();
  const linkDetails = JSON.parse(localStorage.getItem("linkDetails"));
  console.log(linkDetails.url);
  const [showRef, setShowRef] = useState(false);
  let match;
  useEffect(() => {
    const regex = /ref=([a-zA-Z0-9]+)/;
    match = linkDetails?.url?.match(regex);
    console.log(match);

    if (match) {
      const value = match[1];
      setReferralCode(value);
      setSignUpformValues((prev) => ({
        ...prev,
        referralLink: value,
      }));
      console.log(value);
    } else {
      console.log("No match found");
    }

    if (match != null) {
      setShowRef(true);
    } else {
      setShowRef(false);
    }
  }, []);

  console.log(referralCode);

  // regerrak link end---

  // toggle passowrd
  const [showConf_Password, setShowConf_Password] = useState(false);
  const togglePasswordVisibilityConf = () => {
    setShowConf_Password(!showConf_Password);
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  console.log(signUpformValues);
  console.log(showRef, "showref ");
  const handleSignUp = async (values) => {
    setIsLoading(true);
    const callingCode = parsePhoneNumber(values.mobileNumber);
    const countrycodeis = callingCode.countryCallingCode;
    const newphoneNumber = values.mobileNumber
      .replace(countrycodeis, "")
      .replace(/^(\+)+/, "")
      .trim();
    const formValues = {
      name: values.UserName,
      email: values.email,
      phone_number: `${newphoneNumber}`,
      countryCode: `+${countrycodeis}`,
      password: values.password,
      referralCode: values.referralLink,
      LAH_member: values.Lah_member,
    };

    console.log(formValues);

    try {
      const { data } = await axiosService.post("/signup", formValues);
      console.log(data);
      setSignUpformValues({
        UserName: "",
        email: "",
        password: "",
        confirm_password: "",
        referralLink: "",
        Lah_member: "",
      });
      setIsLoading(false);
      toast.success(data?.message);
      history.push(`/verifyOtp`, formValues);
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.status === 902) {
        history.push(`/login`);
      }
      console.error(error);
      if (error?.response?.data?.errors) {
        toast.error(`${error.response.data.errors[0].msg}`);
      } else {
        toast.error(`${error?.response?.data?.message}`);
      }
    }
  };
  return (
    <>
      <Header />
      <section className="signups">
        <div className="formbody">
          <h2>Create an account</h2>
          <p>
            Have an account?{" "}
            <span onClick={() => history.push("/login")}>Login</span>
          </p>
          <Formik
            enableReinitialize
            initialValues={signUpformValues}
            validate={(values) => signUPValidator(values)}
            validateOnChange
            onSubmit={(values) => {
              handleSignUp(values);
            }}
          >
            {(formikBag) => (
              <Form action="" className="w-100">
                {console.log(formikBag)}
                <div className="">
                  <div className="mt-3">
                    <label htmlFor="">User Name</label>
                    <div className="form-controls form-control-user">
                      <input
                        type="text"
                        name="UserName"
                        maxLength={15}
                        className="text-capitalize"
                        placeholder="User Name"
                        value={formikBag.values.UserName}
                        onChange={(e) => {
                          formikBag.setFieldValue("UserName", e.target.value);
                        }}
                      />
                      <ErrorMessage
                        name="UserName"
                        component="div"
                        className="errormessage"
                      />
                    </div>
                  </div>
                </div>
                <div className="d-md-flex justify-content-between">
                  <div className="col-md-6">
                    <div className="mt-3 me-md-2">
                      <label htmlFor="">Phone</label>
                      <div className="form-controls flex items-center">
                        <PhoneInput
                          autoComplete="on"
                          defaultCountry="US"
                          international
                          name="mobileNumber"
                          className="w-100"
                          placeholder="Enter phone number"
                          value={formikBag?.values?.mobileNumber}
                          onChange={(value) => {
                            formikBag.setFieldValue("mobileNumber", value);
                          }}
                          error={
                            formikBag.touched.mobileNumber &&
                            formikBag.errors.mobileNumber
                              ? formikBag.errors.mobileNumber
                              : null
                          }
                        />
                      </div>
                      <div className="errormessage text-red-600">
                        {formikBag.errors.mobileNumber}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mt-3 ms-md-2">
                      <label htmlFor="">Email</label>
                      <div className="form-controls">
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formikBag.values.email}
                          onChange={(e) => {
                            formikBag.setFieldValue("email", e.target.value);
                          }}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="errormessage"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-md-flex justify-content-between">
                  <div className="col-md-6">
                    {showRef ? (
                      <div className="mt-3 me-md-2">
                        <label htmlFor="referralLink">
                          Referral ID (Optional)
                        </label>
                        <div className="form-controls">
                          <Field
                            type="text"
                            name="referralLink"
                            value={formikBag.values.referralLink}
                            onChange={(e) => {
                              formikBag.setFieldValue(
                                "referralLink",
                                e.target.value
                              );
                            }}
                            readOnly
                          />
                          <ErrorMessage
                            name="referralLink"
                            component="div"
                            className="errormessage"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 me-md-2">
                        <label htmlFor="referralLink">
                          Referral ID (Optional)
                        </label>
                        <div className="form-controls">
                          <Field
                            type="text"
                            name="referralLink"
                            value={formikBag.values.referralLink}
                            onChange={(e) => {
                              formikBag.setFieldValue(
                                "referralLink",
                                e.target.value
                              );
                            }}
                          />
                          <ErrorMessage
                            name="referralLink"
                            component="div"
                            className="errormessage"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <div className="mt-3 ms-md-2">
                      <label htmlFor="">LAH Member (Optional)</label>
                      <div className="form-controls">
                        <Field
                          type="text"
                          name="Lah_member"
                          value={formikBag.values.Lah_member}
                          onChange={(e) => {
                            formikBag.setFieldValue(
                              "Lah_member",
                              e.target.value
                            );
                          }}
                        />
                        <ErrorMessage
                          name="Lah_member"
                          component="div"
                          className="errormessage"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-md-flex justify-content-between">
                  <div className="col-md-6">
                    <div className="mt-3 me-md-2">
                      <label htmlFor="">Password</label>
                      <div className="form-controls flex items-center">
                        <Field
                          placeholder="Enter Password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formikBag.values.password}
                          onChange={(e) => {
                            formikBag.setFieldValue("password", e.target.value);
                          }}
                        />
                        <EyeClosed
                          size={32}
                          class="text-white eyebtn"
                          onClick={togglePasswordVisibility}
                        />
                      </div>

                      <ErrorMessage
                        name="password"
                        component="div"
                        className="errormessage"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mt-3 ms-md-2">
                      <label htmlFor="">Confirm Password</label>
                      <div className="form-controls flex items-center">
                        <Field
                          placeholder="Please Re-enter Password"
                          type={showConf_Password ? "text" : "password"}
                          name="confirm_password"
                          onChange={(e) => {
                            formikBag.setFieldValue(
                              "confirm_password",
                              e.target.value
                            );
                          }}
                          value={formikBag.values.confirm_password}
                        />
                        <EyeClosed
                          size={32}
                          class="text-white eyebtn"
                          onClick={togglePasswordVisibilityConf}
                        />
                      </div>
                      <ErrorMessage
                        name="confirm_password"
                        component="div"
                        className="errormessage"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5"></div>

                <div className=" mt-3">
                  <button className="signupbtn">Create Account</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div>
          <img src={side1} alt="side1" className="side1 img-fluid" />
          <img src={sideleft} alt="img" className="sideleft img-fluid" />
        </div>
        {isLoading && <Overlay />}
      </section>
      <Footer1 />
    </>
  );
};

export default Signup;
