import React, { useState, useEffect } from 'react'
import { DashboardContainer, DashboardWrapper, DashboardHeading, DashHeading, SvgLogo, BackIcon, MenuAndBack, PreperationTime, LabelHeading, RetaurantDetailsForm, InputDivide, MiddleColumnProfile, InputPic, HeadingBlock, HeadingProfile, HeadingPara, MultipleButtons, TripleButton, MultipleButton, VoucherHeading, VoucherHeadingMain, FullWidthMobileInput, OfferRadioSection, OfferSectionLabel, MobileViewCalender } from './Product_ManagementElements'
import { LoginButton } from '../LoginSection/LoginElements';
import { HeadingButton } from '../Dashboard/DashboardElements'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Field, Form } from "formik";
import Input from "../Input";
import YearInput from '../YearInput';
import { extractDate } from "../../utils/functions";
import axios from "../../axios";
import Overlay from '../Overlay'
import { toast } from "react-toastify";
import EditIcon from "../../images/edit_profile_button_table.png"
import DeleteIcon from "../../images/delete_profile_button_table.png"
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import * as IoIcons from 'react-icons/io';
import * as HiIcons from 'react-icons/hi';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import Select from "../Select";

import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
import { withRouter } from 'react-router-dom';
// import SearchBar from "material-ui-search-bar";
import {
    ProductValidator
} from "../../utils/validators";
import './ProductStyles.css';
import TextArea from "./TextArea";
import FileInput from "../FileInput";
import { uploadImage } from "../../utils/functions";
import { FaSearch } from 'react-icons/fa';
import { SearchContainer, SearchBar, SearchIcon, SearchInput } from '../SearchBar/SearchElements'
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
        height: "650px",
        width: "95%",
        marginLeft: "2rem",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column"
    },
    "@media (max-width: 780px)": {
        paperTableHeight: {
            marginLeft: "0.75rem"
        }
    },
    "@media (max-width: 480px)": {
        paperTableHeight: {
            marginLeft: "0.75rem"
        }
    },
    tablePaginationStyle: {
        border: "1px solid #0000001a",
        borderRadius: "0rem 0rem 0.4rem 0.4rem",
        overflowY: "hidden"
    },
    tableFlex: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    searchDesign: {
        borderRadius: '20px',
        boxShadow: 'none',
        width: '21%'
    }
}));





const OfferManagement = ({ history, setUsers, userData, }) => {
    const classes = useStyles();


    const [defaultState, setDefaultState] = useState({ isAddMenu: "", isRestaurantDetails: "" })
    const [menuState, setMenuState] = useState({ isOfferVoucher: true, isAddOffer: false })
    const [isLoading, setIsLoading] = useState(false);
    const [offersData, setOffersData] = useState([]);
    const [offerRadio, setOfferRadio] = useState([
        {
            label: "spend more earn more",
            isActive: false
        },
        {
            label: "free/heavy discount",
            isActive: false
        },
    ]);
    const [categoryList, setCategoryList] = useState([]);
    const [searched, setSearched] = useState("");
    const [searchedData, setSearchedData] = useState([]);
    const [order, setOrder] = useState();
    const [orderBy, setOrderBy] = useState();
    const [subCategoryList, setSubCategoryList] = useState([]);


    const [offerValues, setOfferValues] = useState({
        product_name: "",
        category: "",
        category_name: "",
        subCategory: "",
        subcategory_name: "",
        quantity: "",
        unit: "",
        price: "",
        selling_price: "",
        discount_price: "",
        barcode_number: "",
        product_description: "",
        unit_measurement: "",
        images: [],
    });

    useEffect(() => {
        if (!userData) {
            history.push("/supermarket")
        }
        if (get(userData, "is_approved_by_admin", "") == "0") {
            history.push("/supermarket")
        }
    }, []);

    useEffect(() => {
        getOffers();
        fetchCategoryList();
        // fetchSubcategoryList();
    }, []);


    // For Pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const getOffers = async () => {
        try {
            const { data } = await axios.get("/superMarket/get_product");
            console.log(data);
            setOffersData(data.data);
            setSearchedData(data.data)
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                history.push('/supermarket')
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
            }
        }
    };


    const handleOfferProfile = async (values) => {
        console.log(values);

        var fromData = {
            product_name: values.product_name,
            quantity: values.quantity,
            unit: values.unit,
            price: values.price,
            images: values.images,
            superMarket_id: get(userData, '_id', ''),
            category: values.category,
            subCategory: values.subCategory,
            product_description: values.product_description,
            barcode_number: values.barcode_number,
            unit_measurement: values.unit_measurement,
            selling_price: values.selling_price,
            discount_price: values.price - values.selling_price

        };

        console.log(fromData);
        setIsLoading(true);
        // setDefaultState((prevState) => {
        //     return {
        //         ...prevState,
        //         isDishAdd: false,
        //     };
        // });

        try {
            if (values._id) {
                const { data } = await axios.post("/superMarket/update_product", {
                    _id: values._id,
                    product_name: values.product_name,
                    quantity: values.quantity,
                    unit: values.unit,
                    price: values.price,
                    images: values.images,
                    superMarket_id: get(userData, '_id', ''),
                    category: values.category,
                    subCategory: values.subCategory,
                    product_description: values.product_description,
                    barcode_number: values.barcode_number,
                    unit_measurement: values.unit_measurement,
                    selling_price: values.selling_price,
                    discount_price: values.price - values.selling_price
                });
                toast.success(`${data.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setIsLoading(false);
                getOffers();
            } else {
                const { data } = await axios.post("/superMarket/add_product", fromData);
                toast.success(`${data.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setIsLoading(false);
                getOffers();
            }
            setMenuState({
                isOfferVoucher: true,
                isAddOffer: false
            });

        } catch (error) {
            setIsLoading(false);
            setMenuState({
                isOfferVoucher: true,
                isAddOffer: false
            });
            toast.error(`${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.status === 401) {
                history.push('/')
                localStorage.removeItem("token");
                localStorage.removeItem("userData");

            }
        }
    };

    const handleDeleteOffers = async (id) => {
        if (window.confirm('Are you sure you want to delete this Product ?')) {
            try {
                const { data } = await axios.post("/superMarket/delete_product", {
                    _id: id,
                });
                getOffers();
                toast.success(`${data.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            } catch (error) {
                console.log(error);
                toast.error(`${error.response.data.message}`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } else {
            getOffers();
        }
    };

    const fetchCategoryList = async () => {
        try {
            let { data } = await axios.get("admin-business/get_categories");
            console.log(data);
            setCategoryList(
                data.data.map((item) => {
                    return { label: item.category, value: item._id };
                })
            );
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    // const fetchSubcategoryList = async () => {
    //     try {
    //         let { data } = await axios.get("supermarket/get_subCategories");
    //         setSubcategoryList(
    //             data.data.map((item) => {
    //                 return { label: item.subcategory_name, value: item._id };
    //             })
    //         );
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Something went wrong.", {
    //             position: toast.POSITION.TOP_RIGHT,
    //         });
    //     }
    // };

    const showUnitOptions = [
        {
            label: "Kg",
            value: "1"
        },
        {
            label: "Gm",
            value: "2"
        },
        {
            label: "Ltr",
            value: "3"
        },
        {
            label: "Ml",
            value: "4"
        },
        {
            label: "Piece",
            value: "5"
        },
        {
            label: "Dozen",
            value: "6"
        }
    ]

    const unitFun = (e) => {
        if (e === "Kg") {
            return "1"
        } else if (e === "Gm") {
            return "2"
        } else if (e === "Ltr") {
            return "3"
        } else if (e === "Ml") {
            return "4"
        } else if (e === "Piece") {
            return "5"
        } else if (e === "Dozen") {
            return "6"
        }
    }

    const requestSearch = (searchedVal) => {
        const filteredRows = searchedData.filter((row) => {
            return row.product_name.toLowerCase().includes(searchedVal.target.value.toLowerCase());
        });
        setOffersData(filteredRows);
    };

    const cancelSearch = () => {
        setSearched("");
        getOffers();
    };

    const recordsAfterPagingAndSorting = () => {
        return stableSort(offersData, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }


    const handleSortRequest = cellId => {
        const isAsc = orderBy === cellId && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(cellId)
    }
    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function getComparator(order, orderBy) {
        return order === "desc"
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const subCategorydata = async (option) => {
        console.log("xy", option);
        try {
            let { data } = await axios.get(`/superMarket/get_subCategories?category_name=${option.label}&category=${option.value}`);
            setSubCategoryList(
                data.data.map((item) => {
                    return { label: item.subcategory_name, value: item._id };
                })
            );
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    console.log("bui", subCategoryList);

    return (
        <>
            <div>
                <DashboardContainer>
                    <DashboardWrapper>
                        <DashboardHeading style={{ display: "flex", flexDirection: "column", }}>

                            <MenuAndBack style={{ backgroundColor: "#02001c", width: "100%", marginBottom: "10px", display: "flex", alignItems: "center" }}>

                                <i className="fa-solid fa-cart-shopping" style={{ fontSize: "25px", margin: "5px" }}></i>
                                <DashHeading style={{ color: "white", flex: "1", padding: "8px" }}>Add Product</DashHeading>
                            </MenuAndBack>
                        </DashboardHeading>


                        <Paper className={classes.paperTableHeight} style={{ overflow: "hidden", height: "100%" }}>
                            {menuState.isOfferVoucher ? (
                                <>
                                    <TableContainer className={classes.tableContainerHeight}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tablePadding}>S.&nbsp;No.</TableCell>
                                                    <TableCell className={classes.tablePadding}>
                                                        <TableSortLabel
                                                            active={true}
                                                            direction={orderBy === "product_name" ? order : "asc"}
                                                            onClick={() => {
                                                                handleSortRequest("product_name");
                                                            }}
                                                        >
                                                            Product Name
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell className={classes.tablePadding}>Product&nbsp;Image</TableCell>
                                                    <TableCell className={classes.tablePadding}>Unit</TableCell>
                                                    {/* <TableCell className={classes.tablePadding}>Quantity</TableCell> */}
                                                    <TableCell className={classes.tablePadding}><TableSortLabel
                                                        active={true}
                                                        direction={orderBy === "price" ? order : "asc"}
                                                        onClick={() => {
                                                            handleSortRequest("price");
                                                        }}
                                                    >
                                                        Product&nbsp;Price
                                                    </TableSortLabel></TableCell>
                                                    <TableCell className={classes.tablePadding}><TableSortLabel
                                                        active={true}
                                                        direction={orderBy === "selling_price" ? order : "asc"}
                                                        onClick={() => {
                                                            handleSortRequest("selling_price");
                                                        }}
                                                    >
                                                        Selling Price
                                                    </TableSortLabel></TableCell>
                                                    <TableCell className={classes.tablePadding}><TableSortLabel
                                                        active={true}
                                                        direction={orderBy === "barcode_number" ? order : "asc"}
                                                        onClick={() => {
                                                            handleSortRequest("barcode_number");
                                                        }}
                                                    >
                                                        Barcode Number
                                                    </TableSortLabel></TableCell>
                                                    <TableCell className={classes.tablePadding}>Category</TableCell>
                                                    <TableCell className={classes.tablePadding}>Sub Category</TableCell>
                                                    <TableCell className={classes.tablePadding}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {recordsAfterPagingAndSorting().map((category, index) => (
                                                    <TableRow key={category._id}>
                                                        <TableCell component="th" scope="row" className={classes.textMiddle}>
                                                            {index + 1 + (page) * rowsPerPage}
                                                        </TableCell>
                                                        <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                {get(category, 'product_name', '')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                <img className="selected_image" width="100" src={category.images[0]} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                {get(category, 'unit_measurement', '')} {get(category, 'unit', '')}
                                                            </div>
                                                        </TableCell>
                                                        {/* <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                {get(category, 'quantity', '')}
                                                            </div>
                                                        </TableCell> */}
                                                        <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                ₺ {get(category, 'price', '')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                ₺ {get(category, 'selling_price', '')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                {get(category, 'barcode_number', '')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                {get(category, 'category.category', '')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={classes.textMiddle}>
                                                            <div>
                                                                {get(category, 'subCategory.subcategory_name', '')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={classes.textMiddle}>
                                                            <div className={classes.tableFlex}>
                                                                <SvgLogo
                                                                    style={{ padding: "0rem 0.2rem" }}
                                                                    className="logoImage"
                                                                    src={EditIcon}
                                                                    onClick={() => {
                                                                        setOfferValues({
                                                                            _id: get(category, '_id', ''),
                                                                            product_name: get(category, 'product_name', ''),
                                                                            category: get(category, 'category._id', ''),
                                                                            category_name: get(category, 'category.category', ''),
                                                                            subCategory: get(category, 'subCategory._id', ''),
                                                                            subcategory_name: get(category, 'subCategory.subcategory_name', ''),
                                                                            quantity: get(category, 'quantity', ''),
                                                                            unit: get(category, 'unit', ''),
                                                                            price: get(category, 'price', ''),
                                                                            selling_price: get(category, 'selling_price', ''),
                                                                            discount_price: get(category, 'discount_price', ''),
                                                                            images: get(category, 'images', ''),
                                                                            product_description: get(category, 'product_description', ''),
                                                                            barcode_number: get(category, 'barcode_number', ''),
                                                                            unit_measurement: get(category, 'unit_measurement', ''),
                                                                        });
                                                                        setMenuState({
                                                                            isOfferVoucher: false,
                                                                            isAddOffer: true
                                                                        });
                                                                    }}
                                                                />
                                                                {/* <SvgLogo
                                                                    style={{ padding: "0rem 0.2rem" }}
                                                                    className="logoImage"
                                                                    src={DeleteIcon}
                                                                    onClick={() => {
                                                                        handleDeleteOffers(category._id)
                                                                    }
                                                                    }
                                                                /> */}
                                                            </div>
                                                        </TableCell>

                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        className={classes.tablePaginationStyle}
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={offersData.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </>
                            ) : ""}
                            {menuState.isAddOffer ? (
                                <>
                                    <RetaurantDetailsForm>
                                        <Formik
                                            enableReinitialize
                                            initialValues={offerValues}
                                            validate={ProductValidator}
                                            validateOnChange
                                            onSubmit={handleOfferProfile}
                                        >
                                            {(formikBag) => {
                                                return (
                                                    <Form className={classNames("mobileViewPadding", "designScrollbar")} style={{ width: "100%", padding: "2rem", height: "80vh", overflow: "scroll" }}>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Product Name</label>
                                                                <Field name="product_name">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.product_name}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("product_name", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.product_name && formikBag.errors.product_name
                                                                                        ? formikBag.errors.product_name
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Product Name"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Product Price</label>
                                                                <Field name="price">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="number"
                                                                                value={formikBag.values.price}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("price", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.price && formikBag.errors.price
                                                                                        ? formikBag.errors.price
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Enter Price"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>



                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Selling Price</label>
                                                                <Field name="selling_price">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="number"
                                                                                value={formikBag.values.selling_price}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("selling_price", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.selling_price && formikBag.errors.selling_price
                                                                                        ? formikBag.errors.selling_price
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Selling Price"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Discount</label>
                                                                <Field name="discount_price">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="number"
                                                                                style={{ cursor: "not-allowed" }}
                                                                                value={formikBag.values.price - formikBag.values.selling_price || formikBag.values.discount_price}
                                                                                // icon={RestaurantIcon}
                                                                                disabled
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("discount_price", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.discount_price && formikBag.errors.discount_price
                                                                                        ? formikBag.errors.discount_price
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Discount"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label className="mb-2">Category</label>
                                                                <Select
                                                                    options={categoryList}
                                                                    isClearable={false}
                                                                    isSearchable={false}
                                                                    placeholder="Select Category"
                                                                    defaultValue={!isEmpty(formikBag.values.category) ? { label: formikBag.values.category_name, value: formikBag.values.category } : ""}
                                                                    onChange={(option) => {
                                                                        formikBag.setFieldValue(
                                                                            "category",
                                                                            option.value
                                                                        );
                                                                        subCategorydata(option);
                                                                    }}
                                                                    error={
                                                                        formikBag.touched.category && formikBag.errors.category
                                                                            ? formikBag.errors.category
                                                                            : null
                                                                    }
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label className="mb-2" >Sub Category</label>
                                                                <Select
                                                                    options={subCategoryList}
                                                                    placeholder="Select Sub Category"
                                                                    defaultValue={!isEmpty(formikBag.values.subCategory) ? { label: formikBag.values.subcategory_name, value: formikBag.values.subCategory } : ""}
                                                                    onChange={(option) => {
                                                                        formikBag.setFieldValue(
                                                                            "subCategory",
                                                                            option.value
                                                                        );
                                                                    }}
                                                                    error={
                                                                        formikBag.touched.subCategory && formikBag.errors.subCategory
                                                                            ? formikBag.errors.subCategory
                                                                            : null
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Unit Measurement</label>
                                                                <Field name="unit_measurement">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                min="0"
                                                                                value={formikBag.values.unit_measurement}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("unit_measurement", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.unit_measurement && formikBag.errors.unit_measurement
                                                                                        ? formikBag.errors.unit_measurement
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Unit Measurement"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label className="mb-2">Select Unit</label>
                                                                <Field name="unit">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Select
                                                                                defaultValue={!isEmpty(formikBag.values.unit) ? { label: formikBag.values.unit, value: unitFun(formikBag.values.unit) } : ""}
                                                                                // value={formikBag.values.unit}
                                                                                placeholder="Select Unit"
                                                                                options={showUnitOptions}
                                                                                onChange={(option) => {
                                                                                    formikBag.setFieldValue(
                                                                                        "unit",
                                                                                        option.label
                                                                                    );
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.unit &&
                                                                                        formikBag.errors.unit
                                                                                        ? formikBag.errors.unit
                                                                                        : null
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>

                                                        </InputDivide>


                                                        <InputDivide className="col-md-12">

                                                            {/* <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Enter Quantity (SKU)</label>
                                                                <Field name="quantity">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="number"
                                                                                value={formikBag.values.quantity}
                                                                                // icon={LocationIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("quantity", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.quantity && formikBag.errors.quantity
                                                                                        ? formikBag.errors.quantity
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Enter Quantity"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div> */}
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Barcode Number</label>
                                                                <Field name="barcode_number">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <Input
                                                                                {...field}
                                                                                type="text"
                                                                                value={formikBag.values.barcode_number}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("barcode_number", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.barcode_number && formikBag.errors.barcode_number
                                                                                        ? formikBag.errors.barcode_number
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Barcode Number"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>

                                                        <InputDivide className="col-md-12">
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Product Description</label>
                                                                <Field name="product_description">
                                                                    {({ field }) => (
                                                                        <div className="py-2">
                                                                            <TextArea
                                                                                {...field}
                                                                                type="text"
                                                                                rows="3"
                                                                                value={formikBag.values.product_description}
                                                                                // icon={RestaurantIcon}
                                                                                onChange={(e) => {
                                                                                    formikBag.setFieldValue("product_description", e.target.value);
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.product_description && formikBag.errors.product_description
                                                                                        ? formikBag.errors.product_description
                                                                                        : null
                                                                                }
                                                                                className="form-control"
                                                                                placeholder="Product Description"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6" style={{ padding: "1rem" }}>
                                                                <label>Product Images</label>
                                                                <Field name="images">
                                                                    {({ field }) => (
                                                                        <div className="py-2">

                                                                            <FileInput
                                                                                id="facility_images"
                                                                                limit="5"
                                                                                dictionary="dictionary"
                                                                                images={formikBag.values.images}
                                                                                onDelete={(image) => {
                                                                                    var images = [...formikBag.values.images];
                                                                                    images.splice(images.indexOf(image), 1);
                                                                                    formikBag.setFieldValue('images', images)

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
                                                                                        var images = [...formikBag.values.images];
                                                                                        images.push(image.path);
                                                                                        formikBag.setFieldValue('images', images)

                                                                                        setIsLoading(false);
                                                                                    }
                                                                                }}
                                                                                error={
                                                                                    formikBag.touched.images &&
                                                                                        formikBag.errors.images
                                                                                        ? formikBag.errors.images
                                                                                        : null
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </InputDivide>




                                                        <div className="text-center login_btn_group mt-0" style={{ justifyContent: "center" }}>
                                                            <LoginButton
                                                                type="submit"
                                                                className="buttonWidthResponsive"
                                                            >
                                                                Save Details
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OfferManagement));
