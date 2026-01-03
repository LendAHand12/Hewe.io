import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { loginValidator } from "../../util/validators.js";
import { axiosService } from "../../util/service.js";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
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
  const handleLogin = async (values) => {
    setLoginValues(values);
    setIsLoading(true);
    let url = "/login";
    let formvalues = {
      email: values.email,
      password: values.password,
    };
    try {
      const { data } = await axiosService.post(url, formvalues);
      console.log("Data is", data);
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
      </section>
    </>
  );
};

export default Login;
