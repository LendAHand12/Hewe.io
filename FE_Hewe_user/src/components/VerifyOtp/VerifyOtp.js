import React, { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import OtpInput from "react-otp-input";
import { Formik, Field, Form } from "formik";
import { toast } from "react-toastify";
import { axiosService } from "../../util/service.js";
import Overlay from "../../components/Overlay";
import { otpValidator } from "../../util/validators";
import CountdownTimer from "../../components/CountdownTimer";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import side1 from "../../assets/images/login/rightside.png";
import sideleft from "../../assets/images/login/leftside.png";
import "./style.scss";
import Header from "../HomePage/Header.jsx";
import Footer1 from "../HomePage/Footer1.js";
const VerifyOtp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const Location = useLocation();
  const { state } = Location;

  console.log(state);

  const [userDetails, setUserDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [OTPFormValues, setOtpFormValues] = useState({
    email: state?.email,
    verificationCode: "",
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const verifyOTP = async (values) => {
    setOtpFormValues(values);
    setIsLoading(true);
    try {
      const { data } = await axiosService.post("/otpVerification", {
        email: values.email,
        otp: values.verificationCode,
      });
      setIsLoading(false);
      localStorage.setItem("token", data.access_Token);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({
        type: "USER_LOGIN",
        payload: data,
      });
      history.push("/adminDashboard");
      toast.success(data?.message);
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.data?.errors) {
        toast.error(`${error.response.data.errors[0].msg}`);
      } else {
        toast.error(`${error?.response?.data?.message}`);
      }
    }
  };
  console.log("userDeatils is ", userDetails);
  return (
    <>
      <section className="otpcont">
        <Header />
        <div className="otps">
          <div className="formbody">
            <h2>OTP</h2>
            <h2>Please check your email</h2>
            <p className="text-center">
              We've sent a code to <span>{state?.email}</span>
            </p>
            <Formik
              enableReinitialize
              initialValues={OTPFormValues}
              validate={(values) => otpValidator(values)}
              validateOnChange
              onSubmit={verifyOTP}
            >
              {(formikBag) => {
                return (
                  <Form className="otpsection">
                    <OtpInput
                      isInputNum={true}
                      value={formikBag.values.verificationCode}
                      onChange={(e) =>
                        formikBag.setFieldValue("verificationCode", e)
                      }
                      renderInput={(props) => <input {...props} />}
                      numInputs={4}
                      error={
                        formikBag.touched.verificationCode &&
                        formikBag.errors.verificationCode
                          ? formikBag.errors.verificationCode
                          : null
                      }
                    />
                    <div className="mt-5 mb-3">
                      <CountdownTimer
                        className="text-white"
                        totalSec={5 * 6000}
                        otpData={state}
                      />
                    </div>
                    <div className="custom-btn-wrap px-7">
                      <button type="submit" className="loginbtn custom-btn">
                        Verify
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>

          {isLoading && <Overlay />}
        </div>

        <Footer1 />
        <div>
          <img src={side1} alt="side1" className="side1 img-fluid" />
          <img src={sideleft} alt="img" className="sideleft img-fluid" />
        </div>
      </section>
    </>
  );
};

export default VerifyOtp;
