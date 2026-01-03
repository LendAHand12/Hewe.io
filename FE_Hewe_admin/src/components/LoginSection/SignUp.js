import React, { useEffect, useState } from "react";

// import { Button } from '../ButtonElements'
import { Field, Form, Formik } from "formik";
import Input from "../Input";
import { Column1, Column2, ImgWrap, InfoContainer, InfoRow, InfoWrapper, InputBox, LanguageIcon, LanguageLogout, LoginBox, LoginButton, LoginButtonLink, LoginHeading, LoginPara, LogoutIcon, TextWrapper } from './LoginElements';
// import { IconUser, IconEmail } from '../SvgElements'
import { makeStyles } from '@material-ui/core/styles';
import { get } from "lodash";
import PhoneInput from "react-phone-input-2";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "../../axios";
import EmailIcon from '../../images/email.png';
import haydiSupermarket from '../../images/haydiSupermarket.png';
import languageIcon from '../../images/languageBlack.png';
import logoutIcon from '../../images/logout.png';
import NameIcon from '../../images/name.png';
import PassIcon from '../../images/password.png';
import * as actionTypes from "../../store/actions";
import Overlay from '../Overlay';

import {
    signUpValidator
} from "../../utils/validators";

import { bankDetailsObjOne, forgotObjOne, loginObjOne, pendingApprovalObjOne, resetObjOne, restaurantDetailsObjOne, signUpObjOne, verifyOtpObjOne } from './Data';

import './locationdropdown.css';





const useStyles = makeStyles((theme) => ({

    formStyle: {
        width: "100%",
        padding: "2rem",
        height: "80vh",
        overflow: "scroll",
    },
    "@media (max-width: 780px)": {
        formStyle: {
            padding: "1.8rem",
        },
        formStyleOnly: {
            padding: "1.8rem",
        }
    },
    "@media (max-width: 480px)": {
        formStyle: {
            padding: "1.3rem",
        },
        formStyleOnly: {
            padding: "1.3rem",
        }
    },

    formStyleOnly: {
        width: "100%",
        padding: "2rem",
        height: "80vh",
        overflow: "scroll",
    },

}));



const InfoSection = ({ lightBg, imgStart, img, pageHeading, pagePara, form, history, setUsers, userData, defaultState, setDefaultState, }) => {
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





    const [signUpformValues, setSignUpformValues] = useState({
        username: "",
        email: "",
        whole_number: "",
        country_code: "",
        mobile_number: "",
        password: "",
        confirm_password: "",
        terms: false,
        terms_check: false,
    });

    const [OTPFormValues, setOtpFormValues] = useState({
        country_code: "",
        mobile_number: "",
        verification_code: "",
    });


    const [loginValues, setLoginValues] = useState({
        country_code: "",
        mobile_number: "",
        whole_number: "",
        password: "",
    });



    const [updateProfileValues, setUpdateProfileValues] = useState({
        whole_number: get(userData, 'country_code', '') + get(userData, 'mobile_number', ''),
        username: get(userData, 'username', ''),
        mobile_number: get(userData, 'mobile_number', ''),
        email: get(userData, 'email', ''),
        profile_image: get(userData, 'profile_image', "") ? [get(userData, 'profile_image', "")] : [],
        bank_name: get(userData, 'bank_details.bank_name', ''),
        account_holder_name: get(userData, 'bank_details.account_holder_name', ''),
        account_number: get(userData, 'bank_details.account_number', ''),
        re_account_number: get(userData, 'bank_details.account_number', ''),
        ifsc: get(userData, 'bank_details.branch_code', ''),
        is_profile_completed: get(userData, 'is_profile_completed', ''),
    });

    console.log(userData)



    const handleConfirm = (async) => {
        let modal = { ...modalData };

        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("order_data");
        setUsers("");
        setDefaultState(loginObjOne)
        // setDailogType("");
        modal.type = "success";

        // setUsers(null);
        modal.isOpen = false;
        setModalData(modal);
        history.go(0);
    };


    const checkProfile = (e) => {
        if (e) {
            return "2"
        } else {
            return "1"
        }
    }

    const handleLogin = async (values, isSocial = false) => {
        // console.log(values)
        setLoginValues(values);
        setIsLoading(true);
        // setDefaultState({
        //     isLogin: false,
        //     isSignup: false,
        //     isProfileUpdate: false,
        // });
        var url = "/auth/supermarket/login";
        var formvalues = {
            country_code: values.country_code,
            mobile_number: values.mobile_number,
            password: values.password,
        }
        // device_token:deviceToken,
        // if(isSocial){
        //   url = "/user/isSocialLogin";
        //   formvalues = {
        //     apple_social_id:values.apple_social_id,
        //     email:values.email,
        //     firstName:values.firstName,
        //     lastName:values.lastName,
        //     profile_image:values.profile_image,
        //     // device_token:deviceToken,
        //   }
        // }
        try {
            const { data } = await axios.post(url, formvalues);
            console.log(data);
            if (data.data.is_verified) {
                localStorage.setItem("token", data.data.access_token);
                localStorage.setItem("userData", JSON.stringify(data.data));
                localStorage.setItem("isUser", true);
                setUsers(data.data);
                // console.log(data);
                if (data.data.is_profile_completed == "2" || data.data.is_profile_completed) {
                    if (data.data.is_approved_by_admin == "1") {
                        history.push('/supermarket/dashboard')
                    } else if (data.data.is_approved_by_admin == "0") {
                        setDefaultState(pendingApprovalObjOne)
                    } else if (data.data.is_approved_by_admin == "2") {
                        setDefaultState(pendingApprovalObjOne)
                    }
                } else if (data.data.is_profile_completed == "1") {
                    setDefaultState(bankDetailsObjOne)
                } else if (data.data.is_profile_completed == "0") {
                    setUpdateProfileValues({
                        ...updateProfileValues,
                        email: data.data.email || "",
                        username: data.data.username || "",
                        mobile_number: data.data.mobile_number || "",
                        whole_number: (data.data.country_code + data.data.mobile_number) || "",
                        country_code: data.data.country_code || "",

                    });
                    setDefaultState(restaurantDetailsObjOne)
                }
                // props.history.go(0);
            } else {
                setOtpFormValues({
                    country_code: values.country_code,
                    mobile_number: values.mobile_number,
                });
                sendOTP({
                    country_code: values.country_code,
                    mobile_number: values.mobile_number,
                });
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            // setDefaultState((prevState) => {
            //     return {
            //         ...prevState,
            //         isLogin: true,
            //     };
            // });

            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                //window.location.pathname = "/";
            }
        }
    };



    const handleSignUP = async (values) => {

        var formvalues = {
            username: values.username,
            email: values.email,
            country_code: values.country_code,
            mobile_number: values.mobile_number,
            password: values.password,
        }
        console.log(formvalues);


        setSignUpformValues({ ...formvalues, confirm_password: values.confirm_password });
        setIsLoading(true);
        // setDefaultState((prevState) => {
        //   return {
        //     ...prevState,
        //     isSignup: false,
        //   };
        // });
        try {
            const { data } = await axios.post("/auth/supermarket/signup", formvalues);
            console.log(data);
            setOtpFormValues({
                country_code: values.country_code,
                mobile_number: values.mobile_number,
            });

            setUpdateProfileValues({
                ...updateProfileValues,
                email: values.email,
                password: values.password,
                username: values.username,
                country_code: values.country_code,
                mobile_number: values.mobile_number,
                whole_number: values.country_code + values.mobile_number,
            });
            localStorage.setItem("token", data.data.token || data.data.access_token);
            localStorage.setItem("userData", JSON.stringify(data.data));
            localStorage.setItem("isUser", true);
            setUsers(data.data);
            setOtpPhone({
                country_code: values.country_code,
                mobile_number: values.mobile_number,
            });
            setIsLoading(false);
            toast.success(`OTP send to the Registered Mobile Number sucessfully.`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            // setOtpSend(true);
            // setDefaultState(verifyOtpObjOne);
            history.push("/supermarket/otp");
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            //   setDefaultState({
            //     isSignup: true,
            //     isLogin: false,
            //   });
            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                //window.location.pathname = "/";
            }
        }
    };


    const sendOTP = async (values, forget = false) => {
        console.log(values);
        setIsLoading(true);
        // setDefaultState({
        //   isSignup: false,
        //   isLogin: false,
        // });
        try {
            const { data } = await axios.post("/auth/supermarket/sendOtp", {
                country_code: values.country_code,
                mobile_number: values.mobile_number,
            });
            // console.log(data);
            setOtpPhone({
                country_code: values.country_code,
                mobile_number: values.mobile_number,
            });
            toast.success(`${data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setOtpSend(true);
            //   setDefaultState({
            //     isSignup: true,
            //     isLogin: false,
            //   });
            setDefaultState(verifyOtpObjOne)
            // history.push("/webPanel/verifyOtp");
            if (forget) {
                setIsForgetting(true);
            }

            setOtpFormValues({
                country_code: values.country_code,
                mobile_number: values.mobile_number,
                verification_code: "",
            });

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            if (forget) {
                // setDefaultState({
                //   isSignup: false,
                //   isLogin: false,
                //   isForget: true,
                // });
                setDefaultState(forgotObjOne)
                // history.push("/webPanel/forgot");
            } else {
                setDefaultState(signUpObjOne)
                // history.push("/webPanel/signup");
                // setDefaultState({
                //   isSignup: true,
                //   isLogin: false,
                // });
            }
            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                //window.location.pathname = "/";
            }
        }
    };


    const verifyOTP = async (values) => {
        console.log(values);
        setOtpFormValues(values);
        // setDefaultState((prevState) => {
        //   return {
        //     ...prevState,
        //     isSignup: false,
        //   };
        // });
        setIsLoading(true);
        try {
            const { data } = await axios.post("/auth/supermarket/verifyOtp", {
                country_code: values.country_code,
                mobile_number: values.mobile_number,
                verification_code: values.verification_code,
            });
            console.log(data);
            setIsLoading(false);

            if (updateProfileValues.mobile_number == "") {
                if (!isForgetiing) {
                    // let modal = { ...modalData };
                    // modal.isOpen = true;
                    // modal.message = data.message;
                    //setModalData(modal);
                    setIsLoading(false);

                    setLoginValues({
                        country_code: values.country_code,
                        mobile_number: values.mobile_number,
                        password: "",
                    });
                    setSignUpformValues({
                        username: "",
                        company_name: "",
                        mobileNumber: "",
                        email: "",
                        password: "",
                    });
                    setDefaultState(loginObjOne)
                    // history.push("/webPanel/login");
                    //   setDefaultState({
                    //     isLogin: true,
                    //     isSignup: false,
                    //   });
                } else {
                    //   setDefaultState({
                    //     isSignup: false,
                    //     isReset: true,
                    //   });
                    setDefaultState(resetObjOne)
                    // history.push("/webPanel/reset");
                    setLoginValues({
                        country_code: values.country_code,
                        mobile_number: values.mobile_number,
                        password: "",
                    });
                    setOtpSend(false);
                }
            } else {
                localStorage.setItem("token", data.data.access_token);
                localStorage.setItem("userData", JSON.stringify(data.data));
                setOtpSend(false)
                setDefaultState(restaurantDetailsObjOne)
                // history.push("/webPanel/restaurantDetails");
                // setProfileUpdating(true)
                // setDefaultState({
                //   isLogin: false,
                //   isSignup: false,
                //   isProfileUpdate: true,
                // });
            }
        } catch (error) {
            setIsLoading(false);
            setDefaultState(verifyOtpObjOne)
            // history.push("/webPanel/verifyOtp");
            //   setDefaultState({
            //     isSignup: true,
            //     isLogin: false,
            //   });
            //   setLoginValues({
            //     country_code: values.country_code,
            //     mobile_number: values.mobile_number,
            //     password: "",
            //   });
            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                //window.location.pathname = "/";
            }
            setOtpSend(true);
        }
    };


    const handleReset = async (values) => {
        setLoginValues(values);
        setIsLoading(true);
        // setDefaultState((prevState) => {
        //   return {
        //     ...prevState,
        //     isReset: false,
        //   };
        // });

        try {
            const { data } = await axios.post("/auth/supermarket/resetPassword", {
                country_code: values.country_code,
                mobile_number: values.mobile_number,
                password: values.password,
            });
            toast.success(`${data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });

            setLoginValues({
                country_code: "",
                mobile_number: "",
                password: "",
            });
            //   setDefaultState((prevState) => {
            //     return {
            //       ...prevState,
            //       isLogin: true,
            //     };
            //   });
            setDefaultState(loginObjOne)
            // history.push('/webPanel/login');
            setIsLoading(false);
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            setUsers(data.response);
        } catch (error) {
            setIsLoading(false);
            //   setDefaultState((prevState) => {
            //     return {
            //       ...prevState,
            //       isLogin: true,
            //     };
            //   });
            setDefaultState(loginObjOne)
            // history.push('/webPanel/login');
            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                setDefaultState(loginObjOne)
                history.go(0);
                setUsers("");

            }
        }
    };



    const handleCompleteProfile = async (values) => {
        console.log(values);
        //setLoginValues(values);

        var fromData = {
            username: get(userData, 'username', ''),
            country_code: get(userData, 'country_code', ''),
            mobile_number: get(userData, 'mobile_number', ''),
            email: get(userData, 'email', ''),
            profile_image: values.profile_image[0],
            is_profile_completed: checkProfile(values.account_number),
            bank_details: {
                bank_name: values.bank_name,
                account_holder_name: values.account_holder_name,
                account_number: values.account_number,
                branch_code: values.ifsc
            },
        };
        console.log(fromData);
        // working_hours: "",
        setIsLoading(true);
        // setProfileUpdating(false)
        // setDefaultState((prevState) => {
        //   return {
        //     ...prevState,
        //     isProfileUpdate: false,
        //   };
        // });
        // if (history.location.pathname == "/webPanel/restaurantDetails") {
        //     history.push('/webPanel/bankDetails');
        // }
        try {
            const { data } = await axios.post("/auth/supermarket/updateProfile", fromData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            // 'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVfbnVtYmVyIjoiMTExNDQ0Nzc3NyIsImlhdCI6MTYzNTE0MjEzOX0.MtU5p7_OJxz4_KJZ8JtnyOjQ23gYdUTiKj7613RUR8I'

            console.log(data);
            // console.log(values.categories);


            setUpdateProfileValues({
                ...updateProfileValues,
                username: values.username,
                country_code: values.country_code,
                mobile_number: values.mobile_number,
                whole_number: values.country_code + values.mobile_number,
                email: values.email,
                profile_image: values.profile_image,
                bank_name: get(values, 'bank_name', ''),
                account_holder_name: get(values, 'account_holder_name', ''),
                account_number: get(values, 'account_number', ''),
                ifsc: get(values, 'ifsc', ''),
            });

            setIsLoading(false);
            if (defaultState.form == "bankDetailsForm") {
                if (data.data.is_verified) {
                    localStorage.setItem("token", data.data.access_token);
                    localStorage.setItem("userData", JSON.stringify(data.data));
                    localStorage.setItem("isUser", true);
                    setUsers(data.data);
                    // history.push('/webPanel/dashboard');
                } else {
                    console.log(data.data);
                    setOtpFormValues({
                        country_code: data.data.country_code,
                        mobile_number: data.data.mobile_number,
                    });
                    sendOTP({
                        country_code: data.data.country_code,
                        mobile_number: data.data.mobile_number
                    });
                }
                if (data.data.is_approved_by_admin == "1") {
                    localStorage.setItem("token", data.data.access_token);
                    history.push('/supermarket/dashboard')
                } else if (data.data.is_approved_by_admin == "0") {
                    setDefaultState(pendingApprovalObjOne)
                    // history.push('/webPanel/pendingApproval')
                    // setDefaultState({
                    //   isLogin: false,
                    //   isSignup: false,
                    //   isApproved: true,
                    // });
                } else if (data.data.is_approved_by_admin == "2") {
                    setDefaultState(pendingApprovalObjOne)
                    // history.push('/webPanel/rejectedApproval')
                    // setDefaultState({
                    //   isLogin: false,
                    //   isSignup: false,
                    //   isApproved: false,
                    //   isRejected: true,
                    // });

                }
            } else {
                localStorage.setItem("token", data.data.access_token);
                localStorage.setItem("userData", JSON.stringify(data.data));
                localStorage.setItem("isUser", true);
                setUsers(data.data);
                setDefaultState(bankDetailsObjOne)
                // history.push('/webPanel/bankDetails');

            }

            toast.success(`${data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (error) {
            setIsLoading(false);
            //   setDefaultState((prevState) => {
            //     return {
            //       ...prevState,
            //       isProfileUpdate: true,
            //     };
            //   });
            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                setUsers("");
                setDefaultState(loginObjOne)
                history.go(0);
            }
        }
    };

    const handleStatus = async (values) => {
        try {
            const { data } = await axios.get("/auth/supermarket/checkStatus",
            );
            toast.success(`${data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(data);
            if (data.data.is_verified) {
                localStorage.setItem("token", data.data.access_token);
                localStorage.setItem("userData", JSON.stringify(data.data));
                localStorage.setItem("isUser", true);
                setUsers(data.data);
                // history.push('/webPanel/dashboard');
            } else {
                setOtpFormValues({
                    country_code: data.data.country_code,
                    mobile_number: data.data.mobile_number,
                });
                sendOTP({
                    country_code: data.data.country_code,
                    mobile_number: data.data.mobile_number
                });
            }
            if (data.data.is_approved_by_admin == "1") {
                localStorage.setItem("token", data.data.access_token);
                history.push('/supermarket/dashboard')
            } else if (data.data.is_approved_by_admin == "0") {
                setDefaultState(pendingApprovalObjOne)
                // history.push('/webPanel/pendingApproval')
                // setDefaultState({
                //   isLogin: false,
                //   isSignup: false,
                //   isApproved: true,
                // });
            } else if (data.data.is_approved_by_admin == "2") {
                setDefaultState(pendingApprovalObjOne)
                // history.push('/webPanel/rejectedApproval')
            }


            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);

            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                setUsers("");
                setDefaultState(loginObjOne)
                history.go(0);
            }
        }

    }

    const [ locationKeys, setLocationKeys ] = useState([])
// const history = useHistory()

useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event){
        window.history.pushState(null, document.title,  window.location.href);
    });
}, [ ])


    return (
        <div>
            <InfoContainer lightBg={lightBg}>
                <InfoWrapper>
                    <InfoRow imgStart={imgStart}>
                        <Column2>
                            <ImgWrap>
                                <div>
                                    <img style={{ height: "300px" }} src={haydiSupermarket}></img>
                                </div>
                            </ImgWrap>
                        </Column2>
                        <Column1>
                            <LanguageLogout>
                                <LanguageIcon>
                                    <img src={languageIcon}></img>
                                </LanguageIcon>
                                {(defaultState.form == "restaurantDetailsForm" || defaultState.form == "bankDetailsForm" || defaultState.form == "pendingApproval") ? (
                                    <LogoutIcon>
                                        <img src={logoutIcon} style={{ height: "35px" }} onClick={handleConfirm}></img>
                                    </LogoutIcon>
                                ) : ("")}
                            </LanguageLogout>
                            <TextWrapper
                                contentAlign={defaultState.form == "pendingApproval" ? true : false}
                            >
                                <LoginBox>

                                    <LoginHeading
                                    >
                                        Sign up
                                    </LoginHeading>
                                    <LoginPara
                                    >
                                        or Create an Account
                                    </LoginPara>
                                </LoginBox>
                                <InputBox>
                                        <Formik
                                            enableReinitialize
                                            initialValues={signUpformValues}
                                            validate={signUpValidator}
                                            validateOnChange
                                            onSubmit={handleSignUP}
                                        >
                                            {(formikBag) => {
                                                return (
                                                    <Form className={classes.formStyleOnly}>
                                                        <Field name="username">
                                                            {({ field }) => (
                                                                <div className="py-2">
                                                                    <Input
                                                                        {...field}
                                                                        type="text"
                                                                        value={formikBag.values.username}
                                                                        icon={NameIcon}
                                                                        onChange={(e) => {
                                                                            formikBag.setFieldValue("username", e.target.value);
                                                                        }}
                                                                        error={
                                                                            formikBag.touched.username && formikBag.errors.username
                                                                                ? formikBag.errors.username
                                                                                : null
                                                                        }
                                                                        className="form-control"
                                                                        placeholder="Supermarket name"
                                                                    />
                                                                </div>
                                                            )}
                                                        </Field>
                                                        <Field name="phone">
                                                            {({ field }) => (
                                                                <div className="py-2">
                                                                    <PhoneInput
                                                                        {...field}
                                                                        country="tr"
                                                                        type="phone"
                                                                        value={formikBag.values.whole_number}
                                                                        countryCodeEditable={false}
                                                                        onChange={(phone, data) => {
                                                                            formikBag.setFieldValue(
                                                                                "country_code",
                                                                                data.format.slice(0, 1) + data.dialCode
                                                                            );
                                                                            formikBag.setFieldValue(
                                                                                "mobile_number",
                                                                                phone.slice(data.dialCode.length)
                                                                            );
                                                                        }}
                                                                        error={
                                                                            formikBag.touched.mobile_number &&
                                                                                formikBag.errors.mobile_number
                                                                                ? formikBag.errors.mobile_number
                                                                                : null
                                                                        }
                                                                        className="form-control"
                                                                        placeholder="Mobile Number"
                                                                    />
                                                                    {formikBag.touched.mobile_number &&
                                                                        formikBag.errors.mobile_number && (
                                                                            <p
                                                                                style={{
                                                                                    paddingTop: 5,
                                                                                    fontSize: 13,
                                                                                    color: "red",
                                                                                }}
                                                                            >
                                                                                {formikBag.errors.mobile_number}
                                                                            </p>
                                                                        )}
                                                                </div>
                                                            )}
                                                        </Field>
                                                        <Field name="email">
                                                            {({ field }) => (
                                                                <div className="py-2">
                                                                    <Input
                                                                        {...field}
                                                                        type="text"
                                                                        value={formikBag.values.email}
                                                                        icon={EmailIcon}
                                                                        onChange={(e) => {
                                                                            formikBag.setFieldValue("email", e.target.value);
                                                                        }}
                                                                        error={
                                                                            formikBag.touched.email && formikBag.errors.email
                                                                                ? formikBag.errors.email
                                                                                : null
                                                                        }
                                                                        className="form-control"
                                                                        placeholder="E-mail ID"
                                                                    />
                                                                </div>
                                                            )}
                                                        </Field>
                                                        <Field name="password">
                                                            {({ field }) => (
                                                                <div className="py-2">
                                                                    <Input
                                                                        {...field}
                                                                        type="password"
                                                                        icon={PassIcon}
                                                                        value={formikBag.values.password}
                                                                        onChange={(e) => {
                                                                            formikBag.setFieldValue("password", e.target.value);
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
                                                        <Field name="confirm_password">
                                                            {({ field }) => (
                                                                <div className="py-2">
                                                                    <Input
                                                                        {...field}
                                                                        type="password"
                                                                        icon={PassIcon}
                                                                        value={formikBag.values.confirm_password}
                                                                        onChange={(e) => {
                                                                            formikBag.setFieldValue("confirm_password", e.target.value);
                                                                        }}
                                                                        error={
                                                                            formikBag.touched.confirm_password &&
                                                                                formikBag.errors.confirm_password
                                                                                ? formikBag.errors.confirm_password
                                                                                : null
                                                                        }
                                                                        className="form-control"
                                                                        placeholder="Confirm Password"
                                                                    />
                                                                </div>
                                                            )}
                                                        </Field>

                                                        <div className="row" style={{ padding: "1rem" }}>
                                                            <div className="col-md-12">
                                                                <Field name="terms_check">
                                                                    {({ field }) => (
                                                                        <div className="py-2" style={{ display: "flex", alignItems: "center" }}>
                                                                            <Input
                                                                                {...field}
                                                                                type="checkbox"
                                                                                // value={formikBag.values.terms_check}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue(
                                                                                        "terms_check",
                                                                                        !formikBag.values.terms_check
                                                                                    );
                                                                                }}
                                                                                noBorderBottom={true}
                                                                            />
                                                                            <label style={{ paddingLeft: "1rem" }}>
                                                                                I agree to accept 
                                                                                <a href="/supermarket/term-condition" target="_blank"> terms and conditions.</a>
                                                                            </label>
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            {formikBag.touched.terms_check && formikBag.errors.terms_check && (
                                                                <p
                                                                    style={{
                                                                        paddingTop: 5,
                                                                        fontSize: 13,
                                                                        color: "red",
                                                                    }}
                                                                >
                                                                    {formikBag.errors.terms_check}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/*<div className="row" style={{ padding: "1rem" }}>
                                                            <div className="col-md-12 terms_condition">
                                                                <Field name="terms">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="checkbox"
                                                                                value={formikBag.values.terms}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue(
                                                                                        "terms",
                                                                                        !formikBag.values.terms
                                                                                    );
                                                                                }}
                                                                            />
                                                                            <label>
                                                                                Remember me
                                                                            </label>
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                                            </div>*/}


                                                        <div className="text-center login_btn_group">
                                                            <LoginButton
                                                                type="submit"
                                                            >
                                                                Sign Up
                                                            </LoginButton>
                                                        </div>
                                                        <p className="text-center" style={{ padding: "0.3rem", color: "#777777" }}>
                                                                Already have an account?
                                                        </p>
                                                        <div className="text-center login_btn_group">
                                                        <LoginButtonLink
                                                                primary="true"
                                                                to="/supermarket"
                                                            >
                                                                Login
                                                            </LoginButtonLink>
                                                        </div>
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
    )
}


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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InfoSection));
