import React, { useState, useEffect } from "react";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import { contactusValidator } from "../../util/validators";
import { axiosService } from "../../util/service.js";

import { Formik, Field, Form, ErrorMessage } from "formik";
import "./style.scss";
// img
import lock from "../../assets/images/img/call.png";

import "react-phone-number-input/style.css";
import Overlay from "../../components/Overlay.js";
import user from "../../assets/images/img/contactus.png";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import Header from "../HomePage/Header.jsx";
import Footer1 from "../HomePage/Footer1.js";

const Contactus = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [contractformValues, setContractformValues] = useState({
    name: "",
    email: "",
    phone_number: "",
    subject: "",
    description: "",
  });

  console.log(contractformValues);

  const handleSignUp = async (values) => {
    setIsLoading(true);
    const callingCode = parsePhoneNumber(values.phone_number);
    const countrycodeis = callingCode.countryCallingCode;
    const newphoneNumber = values.phone_number
      .replace(countrycodeis, "")
      .replace(/^(\+)+/, "")
      .trim();
    const formValues = {
      name: values.name,
      email: values.email,
      phone_number: `${newphoneNumber}`,
      country_code: `+${countrycodeis}`,
      subject: values.subject,
      description: values.description,
    };

    console.log(formValues);

    try {
      const { data } = await axiosService.post("/contactUs", formValues);
      console.log(data);
      setContractformValues({
        name: "",
        email: "",
        phone_number: "",
        subject: "",
        description: "",
      });
      history.push("/");
      setIsLoading(false);
      toast.success(data?.message);
    } catch (error) {
      setIsLoading(false);
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
      <section className="contactus">
        <div className="formbody">
          <div className="row align-items-center">
            <div className="">
              <div className="p-md-5">
                <h2>Let’s Connect</h2>
                <p className="text-center">
                  Looking for help? Fill the form and start a new adventure.
                </p>
                <Formik
                  enableReinitialize
                  initialValues={contractformValues}
                  validate={(values) => contactusValidator(values)}
                  validateOnChange
                  onSubmit={(values) => {
                    handleSignUp(values);
                  }}
                >
                  {(formikBag) => (
                    <Form action="" className="w-100">
                      {console.log(formikBag)}

                      <div className="d-md-flex justify-content-between">
                        <div className="col-md-6">
                          <div className="mt-3">
                            <label htmlFor="">Name</label>
                            <div className="form-controls form-control-user">
                              <input
                                type="text"
                                name="name"
                                maxLength={15}
                                className="text-capitalize"
                                placeholder="User Name"
                                value={formikBag.values.name}
                                onChange={(e) => {
                                  formikBag.setFieldValue(
                                    "name",
                                    e.target.value
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="errormessage"
                              />
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
                                  formikBag.setFieldValue(
                                    "email",
                                    e.target.value
                                  );
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
                          <div className="mt-3 ">
                            <label htmlFor="">Phone</label>
                            <div className="form-controls flex items-center">
                              <PhoneInput
                                autoComplete="on"
                                defaultCountry="US"
                                international
                                name="phone_number"
                                className="w-100"
                                placeholder="Enter phone number"
                                value={formikBag?.values?.phone_number}
                                onChange={(value) => {
                                  formikBag.setFieldValue(
                                    "phone_number",
                                    value
                                  );
                                }}
                                error={
                                  formikBag.touched.phone_number &&
                                  formikBag.errors.phone_number
                                    ? formikBag.errors.phone_number
                                    : null
                                }
                              />
                            </div>
                            <div className="errormessage text-red-600">
                              {formikBag.errors.phone_number}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mt-3 ms-md-2">
                            <label htmlFor="">Subject</label>
                            <div className="form-controls form-control-user">
                              <input
                                type="text"
                                name="subject"
                                className="text-capitalize"
                                placeholder="Subject"
                                value={formikBag.values.subject}
                                onChange={(e) => {
                                  formikBag.setFieldValue(
                                    "subject",
                                    e.target.value
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="subject"
                                component="div"
                                className="errormessage"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 mt-3">
                          <label htmlFor="">How can we help?</label>
                          <div className="form-controls form-controlstext form-control-user">
                            <textarea
                              name=""
                              id=""
                              className="w-100"
                              placeholder="How Can We Help?"
                              value={formikBag.values.description}
                              onChange={(e) => {
                                formikBag.setFieldValue(
                                  "description",
                                  e.target.value
                                );
                              }}
                            ></textarea>
                            <ErrorMessage
                              name="description"
                              component="div"
                              className="errormessage"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5"></div>

                      <div className="mt-3">
                        <div className="custom-btn-wrap">
                          <button className="loginbtn custom-btn">
                            Send Message
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>

        {isLoading && <Overlay />}
      </section>

      <Footer1 />
    </>
  );
};

export default Contactus;
