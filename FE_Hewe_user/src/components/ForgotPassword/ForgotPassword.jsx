import { Button, Input } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { showAlert } from "../../function/showAlert";
import { axiosService } from "../../util/service.js";

export default function ForgotPassword({ history }) {
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Required").email("Invalid email"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      sendMail(values.email);
    },
  });

  const formik2 = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      password2: "",
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      password2: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Password not match"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      resetPassword({
        email: formik.values.email,
        codeEmail: values.otp,
        newPassword: values.password2,
      });
    },
  });

  const sendMail = async (email) => {
    setLoading(true);

    try {
      await axiosService.post("api/user/sendMailForgotPasswordOTP", { email });
      setStep(2);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data) => {
    setLoading(true);

    try {
      let response = await axiosService.post("api/user/forgetPasswordOTP", data);
      showAlert("success", response.data.message);
      history.replace("/login");
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (localStorage.getItem("user") && localStorage.getItem("token")) {
    // đã đăng nhập
    const x = JSON.parse(localStorage.getItem("user"));
    if (x.id == 1 || x.type == 1) {
      return <Redirect to="/admin" />;
    } else {
      return <Redirect to="/user" />;
    }
  }

  return (
    <div className="password-page">
      <div className="password-area">
        <div className="password-logo">
          <img src="/img/logo.png" onClick={() => history.push("/home")} />
          <h2 className="title">Reset password</h2>
        </div>

        {step == 1 ? (
          <form id="password-form">
            <div className="email-field field">
              <label htmlFor="email">Email</label>
              <Input type="email" id="email" value={formik.values.email} onChange={formik.handleChange} name="email" />
              {formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
            </div>

            <Button
              type="primary"
              style={{ width: "100%" }}
              size="large"
              onClick={formik.handleSubmit}
              loading={loading}
            >
              Send email
            </Button>
          </form>
        ) : null}

        {step == 2 ? (
          <form id="password-form">
            <div className="password-field field">
              <label htmlFor="password">New password</label>
              <Input.Password
                type="password"
                id="password"
                value={formik2.values.password}
                onChange={formik2.handleChange}
                name="password"
              />
              {formik2.errors.password ? <div className="error">{formik2.errors.password}</div> : null}
            </div>

            <div className="password2-field field">
              <label htmlFor="password2">Confirm new password</label>
              <Input.Password
                type="password"
                id="password2"
                value={formik2.values.password2}
                onChange={formik2.handleChange}
                name="password2"
              />
              {formik2.errors.password2 ? <div className="error">{formik2.errors.password2}</div> : null}
            </div>

            <div className="otp-field field">
              <label htmlFor="otp">OTP</label>
              <Input type="text" id="otp" value={formik2.values.otp} onChange={formik2.handleChange} name="otp" />
              {formik2.errors.otp ? <div className="error">{formik2.errors.otp}</div> : null}
            </div>

            <Button
              type="primary"
              style={{ width: "100%" }}
              size="large"
              onClick={formik2.handleSubmit}
              loading={loading}
            >
              Submit
            </Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
