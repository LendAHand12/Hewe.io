import React, { useState, useEffect } from 'react'
import { DashboardContainer, DashboardWrapper, DashboardHeading, DashHeading, HeadingButton, SvgLogo, BackIcon, MenuAndBack, PreperationTime, LabelHeading, RetaurantDetailsForm, InputDivide, MiddleColumnProfile, InputPic, HeadingBlock, HeadingProfile, HeadingPara } from './ProfileElements'
import { LabelPara, SelectServiceBox, LoginButton } from '../LoginSection/LoginElements';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Field, Form } from "formik";
import { Modal } from '../Modal/Modal'
import Input from "../Input";
import Select from "../Select";
import FileInput from "./FileInputProfile";
import { uploadImage } from "../../utils/functions";
import axios from "../../axios";
import Overlay from '../Overlay'
import { toast } from "react-toastify";
import EditIcon from "../../images/edit_profile_button_table.png"
import DeleteIcon from "../../images/delete_profile_button_table.png"
import AddIcon from "../../images/addIcon.png"
import placeholder from "../../images/lady.png";
import cameraIcon from "../../images/camera.png";
import { ProfileTime, ProfileDayTime } from './ProfileElements'
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import TimeInput from '../TimeInput';

import * as IoIcons from 'react-icons/io';
import * as AiIcons from 'react-icons/ai';
import * as HiIcons from 'react-icons/hi';
import * as BsIcons from 'react-icons/bs';
import { get } from 'lodash';
import PhoneInput from "react-phone-input-2";
import classNames from 'classnames';

import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter, NavLink } from 'react-router-dom';
import { loginObjOne, signUpObjOne, forgotObjOne, resetObjOne, restaurantDetailsObjOne, bankDetailsObjOne, verifyOtpObjOne, pendingApprovalObjOne } from '../LoginSection/Data'

import {
    restaurantDetailsValidator,
    bankDetailsValidator,
    passwordProfileValidator
} from "../../utils/validators";

import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import './FileInput.css'
import './profile.css'
const useStyles = makeStyles((theme) => ({

    textMiddle: {
        verticalAlign: 'middle !important',
        textAlign: "center"
    },
    tablePadding: {
        padding: "0.5rem",
        textAlign: "center",
        fontSize: "0.8rem"
    },
    paperTableHeight: {
        height: "88%",
        width: "95%",
        marginLeft: "2rem",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        overflow: "scroll",
        overflowX: "hidden",
    },
    "@media (max-width: 480px)": {
        paperTableHeight: {
            marginLeft: "0.75rem"
        }
    },
    tablePaginationStyle: {
        border: "1px solid #0000001a",
        borderRadius: "0rem 0rem 0.4rem 0.4rem",
    },
    tableFlex: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }
}));




const Profile = ({ history, setUsers, userData, }) => {
    const classes = useStyles();


    const [defaultState, setDefaultState] = useState({ isAddMenu: "", isRestaurantDetails: "" })
    const [menuState, setMenuState] = useState({ isProfile: true, isRestaurantDetails: false, isRestaurantAddress: false, isBankDetails: false, isEditProfile: false, isChangePassword: false, isFaq: false, isTermsAndConditions: false, isPrivacyPolicy: false, isLegal: false, isSupport: false })
    const [dropdown, setDropdown] = useState({ isVisibleAccount: false, isVisibleHelp: false })
    const [isLoading, setIsLoading] = useState(false);
    const [selectCuisines, setSelectCuisines] = useState()

    const [profileImage, setProfileImage] = useState(
        get(userData, "profile_image", "")
    );



    const defaultWorkingHours = [
        { "day": "Monday", "start_time": "", "end_time": "", "is_holyday": false },
        { "day": "Tuesday", "start_time": "", "end_time": "", "is_holyday": false },
        { "day": "WednesDay", "start_time": "", "end_time": "", "is_holyday": false },
        { "day": "Thursday", "start_time": "", "end_time": "", "is_holyday": false },
        { "day": "Friday", "start_time": "", "end_time": "", "is_holyday": false },
        { "day": "Saturday", "start_time": "", "end_time": "", "is_holyday": false }
    ]

    const [changePassword, setChangePassword] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });


    useEffect(() => {
        if (!userData) {
            history.push("/supermarket")
        }
        if (userData.is_approved_by_admin == "0") {
            history.push("/supermarket")
        }
    }, [])

    useEffect(() => {
        dataForCuisines();
    }, [])



    const dataForCuisines = async () => {
        let { data } = await axios.get("/admin-business/get_cuisine");
        setSelectCuisines(
            data.data.map((item) => {
                return { label: item.title, value: item._id };
            })
        )
    };




    const [updateProfileValues, setUpdateProfileValues] = useState({
        whole_number: get(userData, 'country_code', '') + get(userData, 'mobile_number', ''),
        restaurant_images: get(userData, "restaurant_images", []),
        restaurant_name: get(userData, 'restaurant_name', ''),
        owner_name: get(userData, 'owner_name', ''),
        mobile_number: get(userData, 'mobile_number', ''),
        restaurant_location: get(userData, 'restaurant_location', ''),
        email: get(userData, 'email', ''),
        restaurant_about: get(userData, 'restaurant_about', ''),
        document_type: get(userData, 'document_type', ''),
        upload_first: get(userData, 'upload_first', "") ? [get(userData, 'upload_first', "")] : [],
        upload_second: get(userData, 'upload_second', "") ? [get(userData, 'upload_second', "")] : [],
        banner_image: get(userData, 'banner_image', "") ? [get(userData, 'banner_image', "")] : [],
        categories: get(userData, "categories", []).map(item => {
            return { label: get(item, "title", ""), value: get(item, "_id", "") };
        }),
        food_type: get(userData, 'food_type', []),
        lat: get(userData, 'lat', ''),
        long: get(userData, 'long', ''),
        working_hours: get(userData, 'working_hours', []).length > 0 ? get(userData, 'working_hours', []) : defaultWorkingHours,
        service_type: get(userData, 'service_type', ''),
        self_pickup_time: get(userData, 'self_pickup_time', ''),
        bank_name: get(userData, 'bank_detail.bank_name', ''),
        account_holder_name: get(userData, 'bank_detail.account_holder_name', ''),
        account_number: get(userData, 'bank_detail.account_number', ''),
        re_account_number: get(userData, 'bank_detail.account_number', ''),
        ifsc: get(userData, 'bank_detail.ifsc', ''),        // working_hours: get(userData, "working_hours", []) !== []
        //   ? get(userData, "working_hours", []).map((item) => item)
        //   : "",
    });



    const handleCompleteProfile = async (values) => {

        var fromData = {
            restaurant_name: values.restaurant_name,
            restaurant_images: values.restaurant_images,
            document_type: "aadhar",
            country_code: values.country_code,
            mobile_number: values.mobile_number,
            restaurant_location: values.restaurant_location,
            email: values.email,
            restaurant_about: "awesome restaurant",
            upload_first: values.upload_first[0],
            upload_second: values.upload_second[0],
            banner_image: values.banner_image[0],
            categories: values.categories.map(item => item.value),
            food_type: values.food_type,
            working_hours: values.working_hours,
            lat: "34.464",
            long: "56.568",
            service_type: values.service_type,
            self_pickup_time: values.self_pickup_time,
            bank_detail: {
                bank_name: values.bank_name,
                account_holder_name: values.account_holder_name,
                account_number: values.account_number,
                ifsc: values.ifsc
            },
        };
        setIsLoading(true);
        try {
            const { data } = await axios.post("/auth/restaurant/updateProfile", fromData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

            setUpdateProfileValues({
                ...updateProfileValues,
                restaurant_name: values.restaurant_name,
                restaurant_images: values.restaurant_images,
                document_type: "aadhar",
                country_code: values.country_code,
                mobile_number: values.mobile_number,
                whole_number: values.whole_number,
                restaurant_location: values.restaurant_location,
                email: values.email,
                restaurant_about: "awesome restaurant",
                upload_first: values.upload_first,
                upload_second: values.upload_second,
                banner_image: values.banner_image,
                categories: values.categories,
                food_type: values.food_type,
                working_hours: values.working_hours,
                service_type: values.service_type,
                lat: "34.464",
                long: "56.568",
                self_pickup_time: values.self_pickup_time,
                bank_name: get(values, 'bank_name', ''),
                account_holder_name: get(values, 'account_holder_name', ''),
                account_number: get(values, 'account_number', ''),
                re_account_number: get(values, 'account_number', ''),
                ifsc: get(values, 'ifsc', ''),
            });

            setIsLoading(false);
            localStorage.setItem("token", data.data.access_token);
            localStorage.setItem("userData", JSON.stringify(data.data));
            localStorage.setItem("isUser", true);
            setUsers(data.data);
            // console.log(data);
            setMenuState({
                isProfile: true,
                isRestaurantDetails: false,
                isRestaurantAddress: false,
                isBankDetails: false,
                isEditProfile: false,
                isFaq: false,
                isTermsAndConditions: false,
                isPrivacyPolicy: false,
                isLegal: false,
                isSupport: false
            });

            toast.success(`${data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (error) {
            setIsLoading(false);
            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                history.push('/')
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
            new_password: values.newPassword,
          };
            // confirmPassword: values.confirmPassword,
        
        console.log('yjo ', formData)

        try {
        const token = localStorage.getItem("token");

            const { data } = await axios.post("/admin/change-password", formData,{
                headers:{
                    Authorization: "Bearer " + token
                }
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
        localStorage.removeItem("order_data");
        setUsers("");
        history.push('/')
        history.go("0");
        setDefaultState(loginObjOne)

    };






    const serviceValueFoodDelivery = (e) => {
        console.log(e);
        if (e == 1 || e == 3) {
            return true
        } else {
            return false
        }
    }

    const serviceValueSelfPickUp = (e) => {
        if (e == 2 || e == 3) {
            return true
        } else {
            return false
        }
    }




    const displayValue = (e) => {
        if (e == false) {
            return "none"
        } else {
            return "inline"
        }
    }

    const dropdownTransform = (e) => {
        if (e == false) {
            return "none"
        } else {
            return "rotate(180deg)"
        }
    }


    return (
        <>
            <div>
                <DashboardContainer>
                    <DashboardWrapper>
                        <DashboardHeading>
                            <MenuAndBack>
                                <BackIcon>
                                    {(menuState.isRestaurantDetails || menuState.isRestaurantAddress || menuState.isBankDetails || menuState.isEditProfile || menuState.isFaq || menuState.isTermsAndConditions || menuState.isPrivacyPolicy || menuState.isLegal || menuState.isSupport || menuState.isChangePassword) ? (
                                        <>
                                            <HeadingButton
                                                style={{ fontSize: "1.5rem", padding: "0.2em 0.2em", borderRadius: "32px", justifyContent: "center", marginBottom: "0.4em" }}
                                                onClick={() => {
                                                    setMenuState({
                                                        isProfile: true,
                                                        isRestaurantDetails: false,
                                                        isRestaurantAddress: false,
                                                        isBankDetails: false,
                                                        isEditProfile: false,
                                                        isChangePassword: false,
                                                        isFaq: false,
                                                        isTermsAndConditions: false,
                                                        isPrivacyPolicy: false,
                                                        isLegal: false,
                                                        isSupport: false
                                                    });
                                                }}
                                            >
                                                <IoIcons.IoIosArrowRoundBack />
                                            </HeadingButton>
                                        </>
                                    ) : ""}
                                </BackIcon>
                                <DashHeading>
                                    {menuState.isProfile ? "Profile" : ""}
                                    {menuState.isRestaurantDetails ? "Restaurant Details" : ""}
                                    {menuState.isRestaurantAddress ? "Restaurant Address" : ""}
                                    {menuState.isBankDetails ? "Bank Details" : ""}
                                    {menuState.isEditProfile ? "Edit Profile" : ""}
                                    {menuState.isChangePassword ? "Change Password" : ""}
                                    {menuState.isFaq ? "Faq's" : ""}
                                    {menuState.isTermsAndConditions ? "Terms & Conditions" : ""}
                                    {menuState.isPrivacyPolicy ? "Privacy Policy" : ""}
                                    {menuState.isLegal ? "Legal" : ""}
                                    {menuState.isSupport ? "Contact Us" : ""}
                                </DashHeading>
                            </MenuAndBack>
                            {/*<HeadingButton onClick={() => {
                                
                            }}>
                                {menuState.isMenu ? "Add Menu" : ""}
                                {menuState.isDish ? "Add New Dish" : ""}
                        </HeadingButton>*/}
                        </DashboardHeading>
                        <Paper className={classes.paperTableHeight} style={{ overflow: "hidden" }}>
                            {menuState.isProfile ? (
                                <>
                                    <div className={classNames("col-md-3", "columnHideOnMobile")}></div>
                                    <MiddleColumnProfile className={classNames("col-md-6", "profileScroller")}>
                                        <HeadingButton onClick={() => {
                                            setMenuState({
                                                isProfile: false,
                                                isRestaurantDetails: true,
                                                isRestaurantAddress: false,
                                                isBankDetails: false,
                                                isEditProfile: false,
                                                isChangePassword: false,
                                                isFaq: false,
                                                isTermsAndConditions: false,
                                                isPrivacyPolicy: false,
                                                isLegal: false,
                                                isSupport: false
                                            });
                                        }}>
                                            Supermarket
                                        </HeadingButton>
                                        <HeadingButton onClick={() => {
                                            setDropdown({
                                                isVisibleAccount: !dropdown.isVisibleAccount,
                                                isVisibleHelp: dropdown.isVisibleHelp
                                            });
                                        }}>
                                            My Account
                                            <BsIcons.BsChevronDown style={{ fontSize: "1.7rem", transform: dropdownTransform(dropdown.isVisibleAccount) }} />
                                        </HeadingButton>
                                        <div style={{ display: displayValue(dropdown.isVisibleAccount) }}>
                                            <HeadingButton dropDown={true} onClick={() => {
                                                setMenuState({
                                                    isProfile: false,
                                                    isRestaurantDetails: false,
                                                    isRestaurantAddress: true,
                                                    isBankDetails: false,
                                                    isEditProfile: false,
                                                    isChangePassword: false,
                                                    isFaq: false,
                                                    isTermsAndConditions: false,
                                                    isPrivacyPolicy: false,
                                                    isLegal: false,
                                                    isSupport: false
                                                });
                                            }}>
                                                Manage Restaurant Address
                                            </HeadingButton>
                                            <HeadingButton dropDown={true} onClick={() => {
                                                setMenuState({
                                                    isProfile: false,
                                                    isRestaurantDetails: false,
                                                    isRestaurantAddress: false,
                                                    isBankDetails: true,
                                                    isEditProfile: false,
                                                    isChangePassword: false,
                                                    isFaq: false,
                                                    isTermsAndConditions: false,
                                                    isPrivacyPolicy: false,
                                                    isLegal: false,
                                                    isSupport: false
                                                });
                                            }}>
                                                Bank Details
                                            </HeadingButton>
                                            <HeadingButton dropDown={true} onClick={() => {
                                                setMenuState({
                                                    isProfile: false,
                                                    isRestaurantDetails: false,
                                                    isRestaurantAddress: false,
                                                    isBankDetails: false,
                                                    isEditProfile: true,
                                                    isChangePassword: false,
                                                    isFaq: false,
                                                    isTermsAndConditions: false,
                                                    isPrivacyPolicy: false,
                                                    isLegal: false,
                                                    isSupport: false
                                                });
                                            }}>
                                                Edit Profile
                                            </HeadingButton>
                                        </div>
                                        <HeadingButton onClick={() => {
                                            setDropdown({
                                                isVisibleAccount: dropdown.isVisibleAccount,
                                                isVisibleHelp: !dropdown.isVisibleHelp
                                            });
                                        }}>
                                            Help
                                            <BsIcons.BsChevronDown style={{ fontSize: "1.7rem", transform: dropdownTransform(dropdown.isVisibleHelp) }} />
                                        </HeadingButton>
                                        <div style={{ display: displayValue(dropdown.isVisibleHelp) }}>

                                            <HeadingButton dropDown={true} onClick={() => {
                                                setMenuState({
                                                    isProfile: false,
                                                    isRestaurantDetails: false,
                                                    isRestaurantAddress: false,
                                                    isBankDetails: false,
                                                    isEditProfile: false,
                                                    isChangePassword: false,
                                                    isFaq: true,
                                                    isTermsAndConditions: false,
                                                    isPrivacyPolicy: false,
                                                    isLegal: false,
                                                    isSupport: false
                                                });
                                            }}>
                                                FAQ's
                                            </HeadingButton>
                                            <HeadingButton dropDown={true} onClick={() => {
                                                setMenuState({
                                                    isProfile: false,
                                                    isRestaurantDetails: false,
                                                    isRestaurantAddress: false,
                                                    isBankDetails: false,
                                                    isEditProfile: false,
                                                    isChangePassword: false,
                                                    isFaq: false,
                                                    isTermsAndConditions: true,
                                                    isPrivacyPolicy: false,
                                                    isLegal: false,
                                                    isSupport: false
                                                });
                                            }}>
                                                Terms & Conditions
                                            </HeadingButton>
                                            <HeadingButton dropDown={true} onClick={() => {
                                                setMenuState({
                                                    isProfile: false,
                                                    isRestaurantDetails: false,
                                                    isRestaurantAddress: false,
                                                    isBankDetails: false,
                                                    isEditProfile: false,
                                                    isChangePassword: false,
                                                    isFaq: false,
                                                    isTermsAndConditions: false,
                                                    isPrivacyPolicy: true,
                                                    isLegal: false,
                                                    isSupport: false
                                                });
                                            }}>
                                                Privacy Policy
                                            </HeadingButton>
                                            <HeadingButton dropDown={true} onClick={() => {
                                                setMenuState({
                                                    isProfile: false,
                                                    isRestaurantDetails: false,
                                                    isRestaurantAddress: false,
                                                    isBankDetails: false,
                                                    isEditProfile: false,
                                                    isChangePassword: false,
                                                    isFaq: false,
                                                    isTermsAndConditions: false,
                                                    isPrivacyPolicy: false,
                                                    isLegal: true,
                                                    isSupport: false
                                                });
                                            }}>
                                                Legal
                                            </HeadingButton>
                                        </div>
                                        <HeadingButton onClick={() => {
                                            setMenuState({
                                                isProfile: false,
                                                isRestaurantDetails: false,
                                                isRestaurantAddress: false,
                                                isBankDetails: false,
                                                isEditProfile: false,
                                                isChangePassword: false,
                                                isFaq: false,
                                                isTermsAndConditions: false,
                                                isPrivacyPolicy: false,
                                                isLegal: false,
                                                isSupport: true
                                            });
                                        }}>
                                            Support
                                        </HeadingButton>
                                        <HeadingButton onClick={handleConfirm}>
                                            Logout
                                        </HeadingButton>
                                    </MiddleColumnProfile>
                                    <div className={classNames("col-md-3", "columnHideOnMobile")}></div>
                                </>
                            ) : ""}
                            {menuState.isRestaurantDetails ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <Formik
                                            enableReinitialize
                                            initialValues={updateProfileValues}
                                            validate={restaurantDetailsValidator}
                                            validateOnChange
                                            onSubmit={handleCompleteProfile}
                                        >
                                            {(formikBag) => {
                                                return (
                                                    <Form className={classNames("mobileViewPadding", "designScrollbar")} style={{ width: "100%", padding: "2rem", height: "80vh", overflow: "scroll" }}>

                                                        {/*<LabelHeading>Add Restaurant Images</LabelHeading>*/}
                                                        <div className="col-md-12">
                                                            <label>Restaurant Banner Image</label>
                                                            <Field name="banner_image">
                                                                {({ field }) => (
                                                                    <div className="py-2">

                                                                        <FileInput
                                                                            id="facility_images"
                                                                            limit="1"
                                                                            dictionary="dictionary"
                                                                            images={formikBag.values.banner_image}
                                                                            onDelete={(image) => {
                                                                                var images = [...formikBag.values.banner_image];
                                                                                images.splice(images.indexOf(image), 1);
                                                                                formikBag.setFieldValue('banner_image', images)

                                                                            }}
                                                                            type="text"
                                                                            label="upload_products_facility_photos"
                                                                            info="eg_img"
                                                                            onChange={async (e) => {
                                                                                const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
                                                                                if (fileSize > 2) {
                                                                                    alert("ex_2mb");
                                                                                    // $(file).val(''); //for clearing with Jquery
                                                                                } else {
                                                                                    setIsLoading(true);
                                                                                    var image = await uploadImage(e.target.files[0]);
                                                                                    var images = [...formikBag.values.banner_image];
                                                                                    images.push(image.path);
                                                                                    formikBag.setFieldValue('banner_image', images)

                                                                                    setIsLoading(false);
                                                                                }
                                                                            }}
                                                                            error={
                                                                                formikBag.touched.banner_image &&
                                                                                    formikBag.errors.banner_image
                                                                                    ? formikBag.errors.banner_image
                                                                                    : null
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Field>
                                                        </div>

                                                        <div className="col-md-12">
                                                            <label>Restaurant Images</label>
                                                            <Field name="restaurant_images">
                                                                {({ field }) => (
                                                                    <div className="py-2">

                                                                        <FileInput
                                                                            id="facility_images"
                                                                            limit="5"
                                                                            dictionary="dictionary"
                                                                            images={formikBag.values.restaurant_images}
                                                                            onDelete={(image) => {
                                                                                var images = [...formikBag.values.restaurant_images];
                                                                                images.splice(images.indexOf(image), 1);
                                                                                formikBag.setFieldValue('restaurant_images', images)

                                                                            }}
                                                                            type="text"
                                                                            label="upload_products_facility_photos"
                                                                            info="eg_img"
                                                                            onChange={async (e) => {
                                                                                const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
                                                                                if (fileSize > 2) {
                                                                                    alert("ex_2mb");
                                                                                    // $(file).val(''); //for clearing with Jquery
                                                                                } else {
                                                                                    setIsLoading(true);
                                                                                    var image = await uploadImage(e.target.files[0]);
                                                                                    var images = [...formikBag.values.restaurant_images];
                                                                                    images.push(image.path);
                                                                                    formikBag.setFieldValue('restaurant_images', images)

                                                                                    setIsLoading(false);
                                                                                }
                                                                            }}
                                                                            error={
                                                                                formikBag.touched.restaurant_images &&
                                                                                    formikBag.errors.restaurant_images
                                                                                    ? formikBag.errors.restaurant_images
                                                                                    : null
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Field>
                                                        </div>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Restaurant Name</label>
                                                                <Field name="restaurant_name">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.restaurant_name}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("restaurant_name", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.restaurant_name && formikBag.errors.restaurant_name
                                                                                        ? formikBag.errors.restaurant_name
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Enter Restaurant Name"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Restaurant Contact</label>
                                                                <Field name="phone">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <PhoneInput
                                                                                {...field}
                                                                                country="in"
                                                                                type="phone"
                                                                                disabled
                                                                                value={formikBag.values.whole_number}
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
                                                                                placeholder="Enter Mobile Number"
                                                                            />
                                                                            {formikBag.errors.mobile_number && (
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
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Restaurant Address</label>
                                                                <Field name="restaurant_location">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.restaurant_location}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("restaurant_location", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.restaurant_location && formikBag.errors.restaurant_location
                                                                                        ? formikBag.errors.restaurant_location
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Enter Restaurant Location"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Email Address</label>
                                                                <Field name="email">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                // style={{ cursor: "not-allowed" }}
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.email}
                                                                                // icon={EmailIcon}
                                                                                // disabled
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("email", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.email && formikBag.errors.email
                                                                                        ? formikBag.errors.email
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Enter E-mail ID"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>


                                                        <InputDivide className={classNames("col-md-12", "timeInputDivide")}>
                                                            <div className={classNames("col-md-6", "widthAfterTimeDivide")} style={{ padding: "1rem" }}>
                                                                <label>Select Business Days & Hours</label>
                                                                {formikBag.values.working_hours.map((item, index) => {
                                                                    return (
                                                                        <>
                                                                            <ProfileDayTime
                                                                                error={
                                                                                    formikBag.touched.working_hours &&
                                                                                        formikBag.errors.working_hours
                                                                                        ? formikBag.errors.working_hours
                                                                                        : null
                                                                                }
                                                                            >
                                                                                <FormControlLabel value={item.day} control={<Radio
                                                                                    onClick={() => {
                                                                                        var cloneState = [...formikBag.values.working_hours];
                                                                                        cloneState[index].is_holyday = !cloneState[index].is_holyday
                                                                                        // console.log(cloneState)
                                                                                        formikBag.setFieldValue('working_hours', cloneState)
                                                                                        if (updateProfileValues.working_hours[index].is_holyday == false) {
                                                                                            var cloneStateD = [...formikBag.values.working_hours];
                                                                                            // console.log(cloneStateD)
                                                                                            cloneStateD[index].start_time = "";
                                                                                            cloneStateD[index].end_time = "";
                                                                                            formikBag.setFieldValue('working_hours', cloneStateD)

                                                                                            // formikBag.setFieldValue(
                                                                                            //   "working_hours",
                                                                                            //   {
                                                                                            //     day: null,
                                                                                            //     start_time: null,
                                                                                            //     end_time: null
                                                                                            //   }
                                                                                            // );
                                                                                        }

                                                                                    }}
                                                                                    checked={updateProfileValues.working_hours[index].is_holyday || item.is_holyday}
                                                                                />}
                                                                                    label={item.day}
                                                                                />
                                                                                <ProfileTime>

                                                                                    <Field name="start_time">
                                                                                        {({ field }) => (
                                                                                            <div className="py-2" style={{ width: "100%", marginRight: "0.5rem" }}>
                                                                                                <TimeInput
                                                                                                    // selected={
                                                                                                    //   // "2021-11-01T07:45:00.236Z"
                                                                                                    //   // formikBag.values.working_hours[index].start_time
                                                                                                    //   // formikBag.values.start_time
                                                                                                    //   // defaultWorkingHours[index].start_time
                                                                                                    //   // get(formikBag.values, "working_hours[index].start_time")
                                                                                                    // }
                                                                                                    // selected={formikBag.values.working_hours[index].start_time || null}
                                                                                                    // value={"1590757517834"}
                                                                                                    value={formikBag.values.working_hours[index].start_time}
                                                                                                    onChange={(date) => {
                                                                                                        var cloneState = [...formikBag.values.working_hours];
                                                                                                        const event = new Date(date).toLocaleTimeString('en-US');
                                                                                                        cloneState[index].start_time = event;
                                                                                                        // console.log(cloneState)
                                                                                                        formikBag.setFieldValue("working_hours", cloneState)
                                                                                                        // console.log(formikBag.values.working_hours[index].start_time);
                                                                                                    }}
                                                                                                    disabled={!formikBag.values.working_hours[index].is_holyday}
                                                                                                    selectsStart
                                                                                                    showTimeSelect
                                                                                                    showTimeSelectOnly
                                                                                                    timeIntervals={15}
                                                                                                    timeCaption="Time"
                                                                                                    dateFormat="h:mm aa"
                                                                                                    className="form-control"
                                                                                                    placeholderText="Open"
                                                                                                    error={
                                                                                                        formikBag.touched.mondayStart &&
                                                                                                            formikBag.errors.mondayStart
                                                                                                            ? formikBag.errors.mondayStart
                                                                                                            : null
                                                                                                    }
                                                                                                />

                                                                                            </div>
                                                                                        )}
                                                                                    </Field>

                                                                                    <Field name="end_time">
                                                                                        {({ field }) => (
                                                                                            <div className="py-2" style={{ width: "100%" }}>
                                                                                                <TimeInput
                                                                                                    value={formikBag.values.working_hours[index].end_time}
                                                                                                    onChange={(date) => {
                                                                                                        var cloneState = [...formikBag.values.working_hours];
                                                                                                        const event = new Date(date).toLocaleTimeString('en-US');
                                                                                                        cloneState[index].end_time = event;
                                                                                                        // console.log(cloneState)
                                                                                                        formikBag.setFieldValue("working_hours", cloneState)
                                                                                                        // console.log(formikBag.values.working_hours[index].end_time);
                                                                                                    }}
                                                                                                    disabled={!formikBag.values.working_hours[index].is_holyday}
                                                                                                    selectsStart
                                                                                                    showTimeSelect
                                                                                                    showTimeSelectOnly
                                                                                                    timeIntervals={15}
                                                                                                    timeCaption="Time"
                                                                                                    dateFormat="h:mm aa"
                                                                                                    className="form-control"
                                                                                                    placeholderText="Close"
                                                                                                    error={
                                                                                                        formikBag.touched.mondayEnd &&
                                                                                                            formikBag.errors.mondayEnd
                                                                                                            ? formikBag.errors.mondayEnd
                                                                                                            : null
                                                                                                    }
                                                                                                />

                                                                                            </div>
                                                                                        )}
                                                                                    </Field>
                                                                                </ProfileTime>
                                                                            </ProfileDayTime>
                                                                        </>
                                                                    )
                                                                })}
                                                                {formikBag.errors.working_hours && (
                                                                    <p
                                                                        style={{
                                                                            paddingTop: 5,
                                                                            fontSize: 13,
                                                                            color: "red",
                                                                        }}
                                                                    >
                                                                        {formikBag.errors.working_hours}
                                                                    </p>
                                                                )}

                                                            </div>
                                                            <div className={classNames("col-md-6", "widthAfterTimeDivide")} style={{ padding: "1rem" }}>
                                                                <label>Upload Document (Proof of Business)(Front Image)</label>
                                                                <Field name="front_image">
                                                                    {({ field }) => (
                                                                        <div className="py-2">

                                                                            <FileInput
                                                                                id="front_images"
                                                                                limit="1"
                                                                                dictionary="dictionary"
                                                                                images={formikBag.values.upload_first}
                                                                                onDelete={(image) => {
                                                                                    var images = [...formikBag.values.upload_first];
                                                                                    images.splice(images.indexOf(image), 1);
                                                                                    formikBag.setFieldValue('upload_first', images)

                                                                                }}
                                                                                type="text"
                                                                                label="upload_products_facility_photos"
                                                                                info="eg_img"
                                                                                onChange={async (e) => {
                                                                                    const fileSize = e.target.files[0].size / 1024 / 1024; // in MiB
                                                                                    if (fileSize > 2) {
                                                                                        alert("ex_2mb");
                                                                                        // $(file).val(''); //for clearing with Jquery
                                                                                    } else {
                                                                                        setIsLoading(true);
                                                                                        var image = await uploadImage(e.target.files[0]);
                                                                                        var images = [...formikBag.values.upload_first];
                                                                                        images.push(image.path);
                                                                                        formikBag.setFieldValue('upload_first', images)

                                                                                        setIsLoading(false);
                                                                                    }
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.upload_first &&
                                                                                        formikBag.errors.upload_first
                                                                                        ? formikBag.errors.upload_first
                                                                                        : null
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>


                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Cuisine Categories</label>
                                                                <Field name="categories">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Select
                                                                                isMulti
                                                                                // className="cm-select"
                                                                                value={formikBag.values.categories}
                                                                                options={selectCuisines}
                                                                                onChange={(option) => {
                                                                                    formikBag.setFieldValue("categories", option);
                                                                                    console.log(formikBag.values.categories)
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.categories &&
                                                                                        formikBag.errors.categories
                                                                                        ? formikBag.errors.categories
                                                                                        : null
                                                                                }
                                                                                // className="form-control"
                                                                                placeholder="Cuisines"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Select Service</label>
                                                                <SelectServiceBox style={{ justifyContent: "space-between" }}>
                                                                    <div style={{ display: "flex" }}>
                                                                        <Field name="service_type_food_delivery">
                                                                            {({ field }) => (
                                                                                <div className="py-2" style={{ display: "flex", alignItems: "center" }}>
                                                                                    <Input
                                                                                        {...field}
                                                                                        type="checkbox"
                                                                                        // value={serviceValueFoodDelivery(formikBag.values.service_type)}
                                                                                        onChange={(e) => {
                                                                                            if (formikBag.values.service_type == 1) {
                                                                                                formikBag.setFieldValue(
                                                                                                    "service_type",
                                                                                                    ""
                                                                                                );
                                                                                            } else if (formikBag.values.service_type == 2) {
                                                                                                formikBag.setFieldValue(
                                                                                                    "service_type",
                                                                                                    3
                                                                                                );
                                                                                            } else if (formikBag.values.service_type == 3) {
                                                                                                formikBag.setFieldValue(
                                                                                                    "service_type",
                                                                                                    2
                                                                                                );
                                                                                            } else {
                                                                                                formikBag.setFieldValue(
                                                                                                    "service_type",
                                                                                                    1
                                                                                                );
                                                                                                formikBag.setFieldValue("self_pickup_time", "")
                                                                                            }
                                                                                        }}
                                                                                        checked={serviceValueFoodDelivery(formikBag.values.service_type)}
                                                                                        noBorderBottom={true}
                                                                                    />
                                                                                    <LabelPara>
                                                                                        Food Delivery
                                                                                    </LabelPara>
                                                                                </div>
                                                                            )}
                                                                        </Field>
                                                                        <Field name="service_type_self_pickup">
                                                                            {({ field }) => (
                                                                                <div className="py-2" style={{ display: "flex", alignItems: "center" }}>
                                                                                    <Input
                                                                                        {...field}
                                                                                        type="checkbox"
                                                                                        // value={serviceValueSelfPickUp(formikBag.values.service_type)}
                                                                                        onChange={(e) => {
                                                                                            if (formikBag.values.service_type == 2) {
                                                                                                formikBag.setFieldValue(
                                                                                                    "service_type",
                                                                                                    ""
                                                                                                );
                                                                                            } else if (formikBag.values.service_type == 1) {
                                                                                                formikBag.setFieldValue(
                                                                                                    "service_type",
                                                                                                    3
                                                                                                );
                                                                                            } else if (formikBag.values.service_type == 3) {
                                                                                                formikBag.setFieldValue(
                                                                                                    "service_type",
                                                                                                    1
                                                                                                );
                                                                                                formikBag.setFieldValue("self_pickup_time", "")
                                                                                            } else {
                                                                                                formikBag.setFieldValue(
                                                                                                    "service_type",
                                                                                                    2
                                                                                                );
                                                                                            }

                                                                                        }}
                                                                                        checked={serviceValueSelfPickUp(formikBag.values.service_type)}
                                                                                        noBorderBottom={true}
                                                                                    />
                                                                                    <LabelPara>
                                                                                        Self Pick-Up
                                                                                    </LabelPara>
                                                                                </div>
                                                                            )}
                                                                        </Field>
                                                                    </div>
                                                                    {(formikBag.values.service_type == 2 || formikBag.values.service_type == 3) ? (
                                                                        <Field name="self_pickup_time">
                                                                            {({ field }) => (
                                                                                <div className="py-2" style={{ width: "25%" }}>
                                                                                    <TimeInput
                                                                                        value={formikBag.values.self_pickup_time}
                                                                                        onChange={(date) => {
                                                                                            const event = new Date(date).toLocaleTimeString('en-US');
                                                                                            formikBag.setFieldValue("self_pickup_time", event)
                                                                                        }}
                                                                                        // disabled={!formikBag.values.self_pickup_time}
                                                                                        selectsStart
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
                                                                                        timeCaption="Time"
                                                                                        dateFormat="h:mm aa"
                                                                                        className="form-control"
                                                                                        placeholderText="Select Time"
                                                                                        error={
                                                                                            formikBag.touched.self_pickup_time &&
                                                                                                formikBag.errors.self_pickup_time
                                                                                                ? formikBag.errors.self_pickup_time
                                                                                                : null
                                                                                        }
                                                                                    />

                                                                                </div>
                                                                            )}
                                                                        </Field>
                                                                    ) : ("")}
                                                                </SelectServiceBox>
                                                                {formikBag.errors.service_type && (
                                                                    <p
                                                                        style={{
                                                                            paddingTop: 5,
                                                                            fontSize: 13,
                                                                            color: "red",
                                                                        }}
                                                                    >
                                                                        {formikBag.errors.service_type}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </InputDivide>


                                                        <div className="text-center login_btn_group" style={{ justifyContent: "center" }}>
                                                            <LoginButton
                                                                type="submit"
                                                                className="buttonWidthResponsive"
                                                            >
                                                                Save
                                                                <HiIcons.HiOutlineArrowNarrowRight style={{ fontSize: "1.7rem" }} />
                                                            </LoginButton>
                                                        </div>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                            {menuState.isRestaurantAddress ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <Formik
                                            enableReinitialize
                                            initialValues={updateProfileValues}
                                            // validate={completeProfileValidator}
                                            validateOnChange
                                            onSubmit={handleCompleteProfile}
                                        >
                                            {(formikBag) => {
                                                return (
                                                    <Form className={classNames("mobileViewPadding", "designScrollbar")} style={{ width: "100%", padding: "2rem", height: "80vh", overflow: "scroll" }}>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Flat No.</label>
                                                                <Field name="flat_no">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.restaurant_name}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("restaurant_name", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.restaurant_name && formikBag.errors.restaurant_name
                                                                                        ? formikBag.errors.restaurant_name
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Flat No"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Street Name</label>
                                                                <Field name="building_no">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.restaurant_location}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("restaurant_location", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.restaurant_location && formikBag.errors.restaurant_location
                                                                                        ? formikBag.errors.restaurant_location
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Building No"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Street Name</label>
                                                                <Field name="street_name">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.restaurant_location}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("restaurant_location", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.restaurant_location && formikBag.errors.restaurant_location
                                                                                        ? formikBag.errors.restaurant_location
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Street Name"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Country</label>
                                                                <Field name="country">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.email}
                                                                                // icon={EmailIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("email", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.email && formikBag.errors.email
                                                                                        ? formikBag.errors.email
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Country"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>State</label>
                                                                <Field name="state">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.restaurant_location}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("restaurant_location", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.restaurant_location && formikBag.errors.restaurant_location
                                                                                        ? formikBag.errors.restaurant_location
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="State"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>City</label>
                                                                <Field name="city">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.email}
                                                                                // icon={EmailIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("email", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.email && formikBag.errors.email
                                                                                        ? formikBag.errors.email
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="City"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Zip Code</label>
                                                                <Field name="zip_code">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.restaurant_location}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("restaurant_location", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.restaurant_location && formikBag.errors.restaurant_location
                                                                                        ? formikBag.errors.restaurant_location
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Zip Code"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <div className="text-center login_btn_group" style={{ justifyContent: "center" }}>
                                                            <LoginButton
                                                                type="submit"
                                                                className="buttonWidthResponsive"
                                                            >
                                                                Save
                                                                <HiIcons.HiOutlineArrowNarrowRight style={{ fontSize: "1.7rem" }} />
                                                            </LoginButton>
                                                        </div>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                            {menuState.isBankDetails ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <Formik
                                            enableReinitialize
                                            initialValues={updateProfileValues}
                                            validate={bankDetailsValidator}
                                            validateOnChange
                                            onSubmit={handleCompleteProfile}
                                        >
                                            {(formikBag) => {
                                                return (
                                                    <Form className={classNames("mobileViewPadding", "designScrollbar")} style={{ width: "100%", padding: "2rem", height: "80vh", overflow: "scroll" }}>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Enter Account Holder Name</label>
                                                                <Field name="account_holder_name">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.account_holder_name}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("account_holder_name", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.account_holder_name && formikBag.errors.account_holder_name
                                                                                        ? formikBag.errors.account_holder_name
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Enter Account Holder Name"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Enter Account Number</label>
                                                                <Field name="account_number">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.account_number}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("account_number", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.account_number && formikBag.errors.account_number
                                                                                        ? formikBag.errors.account_number
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Enter Account Number"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Retype Account</label>
                                                                <Field name="re_account_number">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.re_account_number}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("re_account_number", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.re_account_number && formikBag.errors.re_account_number
                                                                                        ? formikBag.errors.re_account_number
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Retype Account"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Bank IFSC Code</label>
                                                                <Field name="ifsc">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.ifsc}
                                                                                // icon={EmailIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("ifsc", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.ifsc && formikBag.errors.ifsc
                                                                                        ? formikBag.errors.ifsc
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Bank IFSC Code"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>City</label>
                                                                <Field name="city">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.city}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("city", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.city && formikBag.errors.city
                                                                                        ? formikBag.errors.city
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="City"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>State</label>
                                                                <Field name="state">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.state}
                                                                                // icon={EmailIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("state", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.state && formikBag.errors.state
                                                                                        ? formikBag.errors.state
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="State"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>
   
                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Bank Name</label>
                                                                <Field name="bank_name">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                // value={formikBag.values.bank_name}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("bank_name", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.bank_name && formikBag.errors.bank_name
                                                                                        ? formikBag.errors.bank_name
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Bank Name"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <div className="text-center login_btn_group" style={{ justifyContent: "center" }}>
                                                            <LoginButton
                                                                type="submit"
                                                                className="buttonWidthResponsive"
                                                            >
                                                                Save
                                                                <HiIcons.HiOutlineArrowNarrowRight style={{ fontSize: "1.7rem" }} />
                                                            </LoginButton>
                                                        </div>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                            {menuState.isEditProfile ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <div className="profile_picture">
                                            <div className="profile_pic">
                                                <img src={profileImage || placeholder} />
                                                <p>
                                                    <input
                                                        type="file"
                                                        id="pic"
                                                        name="profile_picture"
                                                        onChange={async (e) => {
                                                            setIsLoading(true);
                                                            var image = await uploadImage(e.target.files[0]);
                                                            setProfileImage(image.path);
                                                            setIsLoading(false);
                                                        }}
                                                    />
                                                    <label style={{ display: "flex", alignItems: "center", justifyContent: "center" }} htmlFor="pic"><InputPic src={cameraIcon || placeholder} /></label>
                                                </p>
                                            </div>
                                        </div>
                                        <Formik
                                            enableReinitialize
                                            initialValues={updateProfileValues}
                                            // validate={completeProfileValidator}
                                            validateOnChange
                                        // onSubmit={handleCompleteProfile}
                                        >
                                            {(formikBag) => { 
                                                return (
                                                    <Form className={classNames("mobileViewPadding", "designScrollbar")} style={{ width: "100%", padding: "2rem", height: "80vh", overflow: "scroll" }}>


                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Owner Name</label>
                                                                <Field name="owner_name">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                style={{ cursor: "not-allowed" }}
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.owner_name}
                                                                                disabled
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("owner_name", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.owner_name && formikBag.errors.owner_name
                                                                                        ? formikBag.errors.owner_name
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Owner Name"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Phone Number</label>
                                                                <Field name="phone">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <PhoneInput
                                                                                {...field}
                                                                                country="in"
                                                                                type="phone"
                                                                                disabled
                                                                                value={formikBag.values.whole_number}
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
                                                                                placeholder="Enter Mobile Number"
                                                                            />
                                                                            {formikBag.errors.mobile_number && (
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
                                                            </div>
                                                        </InputDivide>
                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Email ID</label>
                                                                <Field name="email">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                style={{ cursor: "not-allowed" }}
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.email}
                                                                                // icon={LocationIcon}
                                                                                disabled
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("email", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.email && formikBag.errors.email
                                                                                        ? formikBag.errors.email
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Email ID"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <div className="text-center login_btn_group" style={{ justifyContent: "center" }}>
                                                            <LoginButton
                                                                type="button"
                                                                className="buttonWidthResponsive"
                                                                onClick={() => {
                                                                    setMenuState({
                                                                        isProfile: false,
                                                                        isRestaurantDetails: false,
                                                                        isRestaurantAddress: false,
                                                                        isBankDetails: false,
                                                                        isEditProfile: false,
                                                                        isChangePassword: true,
                                                                        isFaq: false,
                                                                        isTermsAndConditions: false,
                                                                        isPrivacyPolicy: false,
                                                                        isLegal: false,
                                                                        isSupport: false
                                                                    });
                                                                }}
                                                            >
                                                                Change Password
                                                                <HiIcons.HiOutlineArrowNarrowRight style={{ fontSize: "1.7rem" }} />
                                                            </LoginButton>
                                                        </div>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                            {menuState.isChangePassword ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <div className="profile_picture">
                                            <div className="profile_pic">
                                                <img src={profileImage || placeholder} />
                                                <p>
                                                    <input
                                                        type="file"
                                                        id="pic"
                                                        name="profile_picture"
                                                        onChange={async (e) => {
                                                            setIsLoading(true);
                                                            var image = await uploadImage(e.target.files[0]);
                                                            setProfileImage(image.path);
                                                            setIsLoading(false);
                                                        }}
                                                    />
                                                    <label style={{ display: "flex", alignItems: "center", justifyContent: "center" }} htmlFor="pic"><InputPic src={cameraIcon || placeholder} /></label>
                                                </p>
                                            </div>
                                        </div>
                                        <Formik
                                            enableReinitialize
                                            initialValues={changePassword}
                                            validate={passwordProfileValidator}
                                            validateOnChange
                                            onSubmit={handleChangePassword}
                                        >
                                            {(formikBag) => {
                                                return (
                                                    <Form className={classNames("mobileViewPadding", "designScrollbar")} style={{ width: "100%", padding: "2rem", height: "80vh", overflow: "scroll" }}>


                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Enter Current Password</label>
                                                                <Field name="oldPassword">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="password"
                                                                                value={formikBag.values.oldPassword}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("oldPassword", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.oldPassword && formikBag.errors.oldPassword
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
                                                                            <Input
                                                                                {...field}
                                                                                type="password"
                                                                                value={formikBag.values.newPassword}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("password", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.newPassword && formikBag.errors.newPassword
                                                                                        ? formikBag.errors.newPassword
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
                                                                            <Input
                                                                                {...field}
                                                                                type="password"
                                                                                value={formikBag.values.confirmPassword}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("confirmPassword", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.confirmPassword && formikBag.errors.confirmPassword
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

                                                        <div className="text-center login_btn_group" style={{ justifyContent: "center" }}>
                                                            <LoginButton
                                                                type="submit"
                                                                className="buttonWidthResponsive"
                                                            >
                                                                Save
                                                                <HiIcons.HiOutlineArrowNarrowRight style={{ fontSize: "1.7rem" }} />
                                                            </LoginButton>
                                                        </div>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                            {menuState.isFaq ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <div style={{ overflow: "scroll", height: "100%" }} className="designScrollbar">
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Question
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Question
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Question
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Question
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Question
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Question
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Question
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                        </div>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                            {menuState.isTermsAndConditions ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <div style={{ overflow: "scroll", height: "100%" }} className="designScrollbar">
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                        </div>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                            {menuState.isPrivacyPolicy ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <div style={{ overflow: "scroll", height: "100%" }} className="designScrollbar">
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                        </div>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                            {menuState.isLegal ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <div style={{ overflow: "scroll", height: "100%" }} className="designScrollbar">
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                            <HeadingBlock>
                                                <HeadingProfile>
                                                    Heading
                                                </HeadingProfile>
                                                <HeadingPara>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                                </HeadingPara>
                                            </HeadingBlock>
                                        </div>
                                    </RetaurantDetailsForm>
                                </>
                            ) : ""}
                        </Paper>
                    </DashboardWrapper>
                </DashboardContainer>
            </div>


            {isLoading && <Overlay />}

        </>

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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));

