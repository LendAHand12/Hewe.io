import React, { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { axiosService } from "../../util/service.js";
import Overlay from "../../components/Overlay";
import { forgetValidator } from "../../util/validators";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./style.scss";
import Header from "../HomePage/Header.jsx";
import side1 from "../../assets/images/login/rightside.png";
import sideleft from "../../assets/images/login/leftside.png";
import Footer1 from "../HomePage/Footer1.js";
var CryptoJS = require("crypto-js");

const VerifyEmail = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sendOTP = async (values) => {
    setIsLoading(true);
    try {
      const { data } = await axiosService.post("/forgotPassword", {
        email: values.email,
      });

      console.log(data);

      var ciphertext = CryptoJS.AES.encrypt(
        values.email,
        "secret_key_123"
      ).toString();
      console.log(ciphertext);

      history.push(`/forgetverifyOtp?id=${ciphertext}`, values);
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
  return (
    <>
      <section className="position-relative verifyemailscont">
        <Header />
        <div className="verifyemails">
          <div className="formbody">
            <h2>Please Verify your email</h2>
            <Formik
              enableReinitialize
              initialValues={{
                email: "",
              }}
              validate={(values) => forgetValidator(values)}
              validateOnChange
              onSubmit={(values) => sendOTP(values)}
            >
              {(formikBag) => {
                {
                  console.log(formikBag);
                }
                return (
                  <Form className="formStyle">
                    <div className="form-field m-auto form-controls my-5">
                      <Field
                        type="email"
                        name="email"
                        value={formikBag.values.email}
                        onChange={(e) => {
                          formikBag.setFieldValue("email", e.target.value);
                        }}
                        placeholder="Email Address"
                        className="border-0"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="errormessage"
                      />
                    </div>
                    <div className="">
                      <button
                        type="submit"
                        className="loginbtn "
                        disabled={sendOTP}
                      >
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
        <div>
          <img src={side1} alt="side1" className="side1 img-fluid" />
          <img src={sideleft} alt="img" className="sideleft img-fluid" />
        </div>
        <Footer1 />
      </section>
    </>
  );
};

export default VerifyEmail;
