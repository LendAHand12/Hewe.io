import React, { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { axiosService } from "../../util/service.js";
import Overlay from "../../components/Overlay";
import { resetPasswordValidator } from "../../util/validators";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./style.scss";
import Header from "../HomePage/Header.jsx";
import { EyeClosed } from "@phosphor-icons/react";
import Footer1 from "../HomePage/Footer1.js";
import side1 from "../../assets/images/login/rightside.png";
import sideleft from "../../assets/images/login/leftside.png";
var CryptoJS = require("crypto-js");

const ResetPassword = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let searchParamData = window.location.search;
  let newParamData = searchParamData.replace("?id=", "");

  // Decrypt
  var bytes = CryptoJS.AES.decrypt(newParamData, "secret_key_123");
  var originalText = bytes.toString(CryptoJS.enc.Utf8);

  console.log(originalText);

  const handleReset = async (values) => {
    setIsLoading(true);
    try {
      const { data } = await axiosService.put("/setNewPassword", {
        email: originalText,
        newPassword: values.password,
      });
      console.log(data);
      toast.success(`${data.message}`);

      history.push("/login");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.data?.errors) {
        toast.error(`${error.response.data.errors[0].msg}`);
      } else {
        toast.error(`${error?.response?.data?.message}`);
      }
    }
  };
  // toggle passowrd
  const [showConf_Password, setShowConf_Password] = useState(false);
  const togglePasswordVisibilityConf = () => {
    setShowConf_Password(!showConf_Password);
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // -----

  return (
    <>
      <section className="resetPasswordcont">
        <Header />
        <div className="resetPasswords">
          <div className="formbody">
            <h2 className="mb-5">Please Enter Your New Password</h2>
            <Formik
              enableReinitialize
              initialValues={{
                email: originalText,
                password: "",
                confirm_password: "",
              }}
              validate={(values) => resetPasswordValidator(values)}
              validateOnChange
              onSubmit={(values) => {
                handleReset(values);
              }}
            >
              {(formikBag) => {
                return (
                  <Form className="formStyle">
                    {console.log(formikBag)}
                    <div className="form-field">
                      <div className="d-flex align-items-center form-controls">
                        <Field
                          placeholder="Enter Password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formikBag.values.password}
                          onChange={(e) => {
                            formikBag.setFieldValue("password", e.target.value);
                          }}
                          className="border-0"
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
                    {/* {console.log(formikBag, "formikBag")} */}
                    <div className="form-field mt-5">
                      <div className="d-flex align-items-center form-controls">
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
                          className="border-0"
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
                    <button type="submit" className="loginbtn mt-5">
                      Reset Password
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>

          {isLoading && <Overlay />}
        </div>
        <div>
          <img src={side1} alt="side1" className="side1 img-fluid" />
          <img src={sideleft} alt="img" className="sideleft img-fluid" />
        </div>
        <Footer1 />
      </section>
    </>
  );
};

export default ResetPassword;
