import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { loginValidator } from "../../util/validators.js";
import { axiosService } from "../../util/service.js";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
import { Modal, Input, Button } from "antd";
import Header from "../HomePage/Header.jsx";
import Overlay from "../../components/Overlay.js";
// img
import { EyeClosed } from "@phosphor-icons/react";
import side1 from "../../assets/images/login/rightside.png";
import sideleft from "../../assets/images/login/leftside.png";
import Footer1 from "../HomePage/Footer1.js";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const handleLogin = async (values) => {
    setLoginValues(values);
    setIsLoading(true);
    let url = "/login";
    let formvalues = {
      email: values.email,
      password: values.password,
      twoFactorToken: twoFactorToken || undefined,
    };
    try {
      const { data } = await axiosService.post(url, formvalues);

      // Check if 2FA is required
      if (data.require2FA) {
        setShow2FAModal(true);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_Token);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({
        type: "USER_LOGIN",
        payload: data,
      });
      setIsLoading(false);
      toast.success("login successefully");
      history.push("/adminDashboard");
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.status === 901) {
        toast.error(error?.response?.data?.message);
        setTimeout(() => {
          history.push("/verifyOtp", formvalues);
        }, 1500);
      } else if (error?.response?.data?.errors) {
        toast.error(`${error.response.data.errors[0].msg}`);
      } else {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const handle2FAVerify = async () => {
    if (!twoFactorToken || twoFactorToken.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying2FA(true);
    let url = "/login";
    let formvalues = {
      email: loginValues.email,
      password: loginValues.password,
      twoFactorToken: twoFactorToken,
    };

    try {
      const { data } = await axiosService.post(url, formvalues);
      localStorage.setItem("token", data.access_Token);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({
        type: "USER_LOGIN",
        payload: data,
      });
      setIsVerifying2FA(false);
      setShow2FAModal(false);
      setTwoFactorToken("");
      toast.success("Login successfully");
      history.push("/adminDashboard");
    } catch (error) {
      setIsVerifying2FA(false);
      if (error?.response?.data?.errors) {
        toast.error(`${error.response.data.errors[0].msg}`);
      } else {
        toast.error(error?.response?.data?.message || "Invalid 2FA code");
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const showpassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      history.push("/admin/dashboard");
    }
  }, []);

  return (
    <>
      <section className="loginforms w-100">
        <Header />
        <div className="formbody">
          <h2>Log in to your account</h2>
          <p>
            Don’t have an account?{" "}
            <span onClick={() => history.push("/signup")}>Create Account</span>
          </p>

          <Formik
            enableReinitialize
            initialValues={loginValues}
            validate={(values) => loginValidator(values)}
            validateOnChange
            onSubmit={(values) => {
              console.log(values);
              handleLogin(values);
            }}
          >
            {(formikBag) => (
              <Form action="">
                <div className="mt-7">
                  <label htmlFor="">Email</label>
                  <div className="form-controls">
                    <Field
                      className="border-0"
                      type="text"
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
                <div className="mt-3">
                  <label htmlFor="">Password</label>
                  <div className="form-controls flex items-center">
                    <Field
                      className="border-0"
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      value={formikBag.values.password}
                      onChange={(e) => {
                        formikBag.setFieldValue("password", e.target.value);
                      }}
                    />
                    <EyeClosed
                      size={32}
                      class="text-white eyebtn"
                      onClick={() => showpassword()}
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="errormessage"
                  />
                </div>
                <div className="flex items-center justify-between my-3">
                  {/* <div>
                    <div for="myCheckbox01" class="checkbox">
                      <input
                        class="checkbox__input"
                        type="checkbox"
                        // id="myCheckbox01"
                      />
                      <svg
                        class="checkbox__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 22 22"
                      >
                        <rect
                          width="21"
                          height="21"
                          x=".5"
                          y=".5"
                          fill="#043A53"
                          stroke="#043C56"
                          rx="3"
                        />
                        <path
                          class="tick"
                          stroke="#000"
                          fill="none"
                          stroke-linecap="round"
                          stroke-width="4"
                          d="M4 10l5 5 9-9"
                        />
                      </svg>
                    </div>
                  </div> */}
                  <p
                    className="cursor-pointer"
                    onClick={() => history.push("/verifyEmail")}
                  >
                    Forget Password
                  </p>
                </div>
                <div className="px-7">
                  <button className="loginbtn custom-btn">Login</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div>
          <img src={side1} alt="side1" className="side1 img-fluid" />
          <img src={sideleft} alt="img" className="sideleft img-fluid" />
        </div>

        <div className="w-100">
          <Footer1 />
        </div>

        {isLoading && <Overlay />}

        {/* 2FA Verification Modal */}
        <Modal
          title="Two-Factor Authentication"
          open={show2FAModal}
          onCancel={() => {
            setShow2FAModal(false);
            setTwoFactorToken("");
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setShow2FAModal(false);
                setTwoFactorToken("");
              }}
            >
              Cancel
            </Button>,
            <Button
              key="verify"
              type="primary"
              onClick={handle2FAVerify}
              loading={isVerifying2FA}
              disabled={!twoFactorToken || twoFactorToken.length !== 6}
            >
              Verify
            </Button>,
          ]}
          width={400}
          className="twofa-login-modal"
        >
          <div style={{ padding: '20px 0' }}>
            <p style={{ marginBottom: '16px', color: '#b0b0b0' }}>
              Enter the 6-digit code from your Google Authenticator app
            </p>
            <Input
              placeholder="000000"
              value={twoFactorToken}
              onChange={(e) => setTwoFactorToken(e.target.value)}
              maxLength={6}
              size="large"
              style={{
                textAlign: 'center',
                fontSize: '24px',
                letterSpacing: '8px',
                fontWeight: 'bold',
              }}
              onPressEnter={handle2FAVerify}
            />
          </div>
        </Modal>
      </section>
    </>
  );
};

export default Login;
