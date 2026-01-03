import {
  Input,
  Paper
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import JoditEditor from "jodit-react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import axios from "../../axios";
import FileInput from "../../components/FileInput";
import Overlay from "../../components/Overlay";
import { handleImageUpload } from "../../utils/functions";
import { SectionADataValidator, SectionBDataValidator, SectionCDataValidator } from "../../utils/validators";
import Team from "../TeamManagement/Team";
import {
  DashHeading,
  DashboardContainer,
  DashboardHeading,
  DashboardWrapper,
  HeadingButton,
  MenuAndBack,
} from "./BlogElements";

const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "5px",
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: "800",
  },
  tableContainerHeight: {
    maxHeight: "77vh",
  },
  paperTableHeight: {
    height: "650px",
    width: "95%",
    marginLeft: "2rem",
    display: "flex",

    flexDirection: "column",
  },
  "@media (max-width: 780px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  "@media (max-width: 480px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  tablePaginationStyle: {
    border: "1px solid #0000001a",
    borderRadius: "0rem 0rem 0.4rem 0.4rem",
    overflowY: "hidden",
  },
  tableFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  searchDesign: {
    borderRadius: "20px",
    boxShadow: "none",
    width: "21%",
  },
}));
const AboutUs = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [sectionA, setSectionA] = useState({
    heading: "",
    content: "",
    image: [],
  });
  const [sectionB, setSectionB] = useState({
    heading: "",
    content: "",
    image: [],
  });

  const [sectionC, setSectionC] = useState({
    heading: "",
    content: "",
    image: [],
  }); 

  const [inputData, setInputData] = useState();
  const editor = useRef(null);

  const handleSubmitA = async (values) => {
    console.log(values);
    const token = localStorage.getItem("token");
    try {
      const data = await axios.post(
        "/admin/sectionAaboutUs",
        {
          a_heading: values.heading,
          a_paragraph: values.content,
          a_image: values.image,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const message=data?.data?.message
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
      }); 
    } catch (e) {
      console.log(e);
    }
  };
  const handleSubmitB = async (values) => {
    console.log(values);
    const token = localStorage.getItem("token");
    try {
      const data = await axios.post(
        "/admin/sectionBaboutUs",
        {
          b_heading: values.heading,
          b_paragraph: values.content,
          b_image: values.image,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const message=data?.data?.message
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleSubmitC = async (values) => {
    console.log(values);
    const token = localStorage.getItem("token");
    try {
      const data = await axios.post(
        "/admin/sectionCaboutUs",
        {
          c_heading: values.heading,
          c_paragraph: values.content,
          c_image: values.image,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const message=data?.data?.message
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getAboutUs = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await axios.get("/admin/getAboutUs", {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      console.log(data.data) 
      setSectionA({
        heading: data?.data?.data[0]?.section_a?.a_content?.a_heading,
        content: data?.data?.data[0]?.section_a?.a_content?.a_paragraph,
        image: data?.data?.data[0]?.section_a?.a_image,
      });

      setSectionB({
        heading: data?.data?.data[0]?.section_b?.b_content?.b_heading,
        content: data?.data?.data[0]?.section_b?.b_content?.b_paragraph,
        image: data?.data?.data[0]?.section_b?.b_image,
      });

      setSectionC({
        heading: data?.data?.data[0]?.section_c?.c_content?.c_heading,
        content: data?.data?.data[0]?.section_c?.c_content?.c_paragraph,
        image: data?.data?.data[0]?.section_c?.c_image,
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => [getAboutUs()], []);
  return (
    <>
      <div>
        <DashboardContainer>
          <DashboardWrapper>
            <DashboardHeading
              style={{ display: "flex", flexDirection: "column" }}
            >
              <MenuAndBack
                style={{
                  backgroundColor: "#02001c",
                  width: "100%",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i
                  class="fa-regular fa-address-card"
                  style={{ fontSize: "25px", margin: "8px" }}
                ></i>

                <DashHeading
                  style={{ color: "white", flex: "1", padding: "8px" }}
                >
                  About Us
                </DashHeading>
              </MenuAndBack>
            </DashboardHeading>

            <Paper
              className={classes.paperTableHeight}
              style={{
                overflowX: "hidden",
                height: "100%",
                marginBottom: "0.5rem",
              }}
            >
              <Accordion>
                <AccordionSummary
                  expandIcon={<i class="fa-solid fa-chevron-down"></i>}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography style={{ fontWeight: "600" }}>
                    Section A
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Formik
                    //   key={tourData}
                    enableReinitialize
                    initialValues={sectionA}
                      validate={SectionADataValidator}
                    validateOnChange
                    onSubmit={(values) => {
                      console.log(values);
                      handleSubmitA(values);
                    }}
                  >
                    {(formikBag) => {
                      return (
                        <Form style={{ margin: "1rem 1rem 0 1rem" }}>
                          <div className="signup-cont">
                            <div className="row d-flex flex-column">
                              {/* <div className="col-md-12"> */}

                              {/* <div className="col-md-12">
                                <label className={classes.offerLabel}>
                                  Heading
                                </label>
                                <Field name="Section A Heading">
                                  {({ field }) => (
                                    <div className="pb-2 mt-1">
                                      <Input
                                        {...field}
                                        type="text"
                                        variant="outlined"
                                        value={formikBag.values.heading}
                                        onChange={(e) => {
                                          formikBag.setFieldValue(
                                            "heading",
                                            e.target.value
                                          );
                                        }}
                                      
                                          
                                        className="form-control"
                                        placeholder="Section A Heading"
                                      />
                                        {formikBag.touched.heading &&
                                            formikBag.errors.heading && (
                                              <div style={{ color: "red" }}>
                                                {formikBag.errors.heading}
                                              </div>
                                            )}
                                    </div>
                                  )}
                                </Field>
                              </div> */}
                              <div className="col-md-12">
                                <label className={classes.offerLabel}>
                                Description
                                </label>
                                <Field name="PickUp Vehicle">
                                  {({ field }) => (
                                    <div className="pb-2 mt-1">
                                      <JoditEditor
                                        config={{
                                          askBeforePasteFromWord: false,
                                          askBeforePasteHTML: false,
                                          defaultActionOnPaste:
                                            "insert_only_text",
                                          readonly: false,
                                        }}
                                        value={formikBag.values.content}
                                        onBlur={(newContent) => {
                                          setSectionA((prevState) => ({
                                            ...prevState,
                                            content: newContent,
                                          }));
                                        }}
                                        ref={editor}
                                      />
                                         {formikBag.touched.content &&
                                  formikBag.errors.content && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.content}
                                    </div>
                                  )}
                                    </div>
                                  )}
                                </Field>
                              </div>

                              <div className="mt-2">
                                <label>Images</label>
                                <Field name="image">
                                  {({ field }) => (
                                    <div className="py-2">
                                      <FileInput
                                        className="file-input"
                                        id="facility_images"
                                        limit="1"
                                        dictionary="dictionary"
                                        images={
                                          formikBag.values.image
                                            ? [formikBag.values.image]
                                            : []
                                        }
                                        onDelete={(image) => {
                                          formikBag.setFieldValue("image", "");
                                        }}
                                        type="text"
                                        label="upload_products_facility_photos"
                                        info="eg_img"
                                        onChange={async (e) => {
                                          const fileSize =
                                            e.target.files[0].size /
                                            1024 /
                                            1024; // in MiB
                                          if (fileSize > 2) {
                                            alert("ex_2mb");
                                          } else {
                                            var image = await handleImageUpload(
                                              e.target.files[0]
                                            );
                                            // console.log("this is image url", image);
                                            formikBag.setFieldValue(
                                              "image",
                                              image
                                            );
                                          }
                                        }}
                                      />
                                      {formikBag.touched.image &&
                                  formikBag.errors.image && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.image}
                                    </div>
                                  )}
                                    </div>
                                  )}
                                </Field>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div
                              className="col-md-12"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <HeadingButton
                                type="submit"
                                style={{ padding: "0.5em 2em" }}
                              >
                                Save
                              </HeadingButton>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<i class="fa-solid fa-chevron-down"></i>}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography style={{ fontWeight: "600" }}>
                    Section B
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Formik
                    //   key={tourData}
                    enableReinitialize
                    initialValues={sectionB}
                      validate={SectionBDataValidator}
                    validateOnChange
                    onSubmit={(values) => {
                      console.log(values);
                      handleSubmitB(values);
                    }}
                  >
                    {(formikBag) => {
                      return (
                        <Form style={{ margin: "1rem 1rem 0 1rem" }}>
                          <div className="signup-cont">
                            <div className="row d-flex flex-column">
                              {/* <div className="col-md-12"> */}

                              <div className="col-md-12">
                                <label className={classes.offerLabel}>
                                Heading
                                </label>
                                <Field name="Section B Heading">
                                  {({ field }) => (
                                    <div className="pb-2 mt-1">
                                      <Input
                                        {...field}
                                        type="text"
                                        variant="outlined"
                                        value={formikBag.values.heading}
                                        onChange={(e) => {
                                          formikBag.setFieldValue(
                                            "heading",
                                            e.target.value
                                          );
                                        }}
                                    
                                        className="form-control"
                                        placeholder="Section B Heading"
                                      />
                                        {formikBag.touched.heading &&
                                            formikBag.errors.heading && (
                                              <div style={{ color: "red" }}>
                                                {formikBag.errors.heading}
                                              </div>
                                            )}
                                    </div>
                                  )}
                                </Field>
                              </div>
                              <div className="col-md-12">
                                <label className={classes.offerLabel}>
                                Description
                                </label>
                                <Field name="PickUp Vehicle">
                                  {({ field }) => (
                                    <div className="pb-2 mt-1">
                                      <JoditEditor
                                        config={{
                                          askBeforePasteFromWord: false,
                                          askBeforePasteHTML: false,
                                          defaultActionOnPaste:
                                            "insert_only_text",
                                          readonly: false,
                                        }}
                                        value={formikBag.values.content}
                                        onBlur={(newContent) => {
                                          setSectionB((prevState) => ({
                                            ...prevState,
                                            content: newContent,
                                          }));
                                        }}
                                        ref={editor}
                                      />
                                         {formikBag.touched.content &&
                                  formikBag.errors.content && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.content}
                                    </div>
                                  )}
                                    </div>
                                  )}
                                </Field>
                              </div>

                              <div className="mt-2">
                                <label>Images</label>
                                <Field name="image">
                                  {({ field }) => (
                                    <div className="py-2">
                                      <FileInput
                                        className="file-input"
                                        id="facility_images"
                                        limit="1"
                                        dictionary="dictionary"
                                        images={
                                          formikBag.values.image
                                            ? [formikBag.values.image]
                                            : []
                                        }
                                        onDelete={(image) => {
                                          formikBag.setFieldValue("image", "");
                                        }}
                                        type="text"
                                        label="upload_products_facility_photos"
                                        info="eg_img"
                                        onChange={async (e) => {
                                          const fileSize =
                                            e.target.files[0].size /
                                            1024 /
                                            1024; // in MiB
                                          if (fileSize > 2) {
                                            alert("ex_2mb");
                                          } else {
                                            var image = await handleImageUpload(
                                              e.target.files[0]
                                            );
                                            // console.log("this is image url", image);
                                            formikBag.setFieldValue(
                                              "image",
                                              image
                                            );
                                          }
                                        }}
                                      />
                                      {formikBag.touched.image &&
                                  formikBag.errors.image && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.image}
                                    </div>
                                  )}
                                    </div>
                                  )}
                                </Field>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div
                              className="col-md-12"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <HeadingButton
                                type="submit"
                                style={{ padding: "0.5em 2em" }}
                              >
                                Save
                              </HeadingButton>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<i class="fa-solid fa-chevron-down"></i>}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography style={{ fontWeight: "600" }}>
                    Section C
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Formik
                    //   key={tourData}
                    enableReinitialize
                    initialValues={sectionC}
                      validate={SectionCDataValidator}
                    validateOnChange
                    onSubmit={(values) => {
                      console.log(values);
                      handleSubmitC(values);
                    }}
                  >
                    {(formikBag) => {
                      return (
                        <Form style={{ margin: "1rem 1rem 0 1rem" }}>
                          <div className="signup-cont">
                            <div className="row d-flex flex-column">
                              {/* <div className="col-md-12"> */}

                              <div className="col-md-12">
                                <label className={classes.offerLabel}>
                                  Heading
                                </label>
                                <Field name="Section C Heading">
                                  {({ field }) => (
                                    <div className="pb-2 mt-1">
                                      <Input
                                        {...field}
                                        type="text"
                                        variant="outlined"
                                        value={formikBag.values.heading}
                                        onChange={(e) => {
                                          formikBag.setFieldValue(
                                            "heading",
                                            e.target.value
                                          );
                                        }}
                                        
                                        className="form-control"
                                        placeholder="Section C Heading"
                                      />
                                        {formikBag.touched.heading &&
                                            formikBag.errors.heading && (
                                              <div style={{ color: "red" }}>
                                                {formikBag.errors.heading}
                                              </div>
                                            )}
                                    </div>
                                  )}
                                </Field>
                              </div>
                              <div className="col-md-12">
                                <label className={classes.offerLabel}>
                                Description
                                </label>
                                <Field name="PickUp Vehicle">
                                  {({ field }) => (
                                    <div className="pb-2 mt-1">
                                      <JoditEditor
                                        config={{
                                          askBeforePasteFromWord: false,
                                          askBeforePasteHTML: false,
                                          defaultActionOnPaste:
                                            "insert_only_text",
                                          readonly: false,
                                        }}
                                        value={formikBag.values.content}
                                        onBlur={(newContent) => {
                                          setSectionC((prevState) => ({
                                            ...prevState,
                                            content: newContent,
                                          }));
                                        }}
                                        ref={editor}
                                      />
                                         {formikBag.touched.content &&
                                  formikBag.errors.content && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.content}
                                    </div>
                                  )}
                                    </div>
                                  )}
                                </Field>
                              </div>

                              <div className="mt-2">
                                <label>Images</label>
                                <Field name="image">
                                  {({ field }) => (
                                    <div className="py-2">
                                      <FileInput
                                        className="file-input"
                                        id="facility_images"
                                        limit="1"
                                        dictionary="dictionary"
                                        images={
                                          formikBag.values.image
                                            ? [formikBag.values.image]
                                            : []
                                        }
                                        onDelete={(image) => {
                                          formikBag.setFieldValue("image", "");
                                        }}
                                        type="text"
                                        label="upload_products_facility_photos"
                                        info="eg_img"
                                        onChange={async (e) => {
                                          const fileSize =
                                            e.target.files[0].size /
                                            1024 /
                                            1024; // in MiB
                                          if (fileSize > 2) {
                                            alert("ex_2mb");
                                          } else {
                                            var image = await handleImageUpload(
                                              e.target.files[0]
                                            );
                                            // console.log("this is image url", image);
                                            formikBag.setFieldValue(
                                              "image",
                                              image
                                            );
                                          }
                                        }}
                                      />
                                      {formikBag.touched.image &&
                                  formikBag.errors.image && (
                                    <div style={{ color: "red" }}>
                                      {formikBag.errors.image}
                                    </div>
                                  )}
                                    </div>
                                  )}
                                </Field>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div
                              className="col-md-12"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <HeadingButton
                                type="submit"
                                style={{ padding: "0.5em 2em" }}
                              >
                                Save
                              </HeadingButton>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik> 
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<i class="fa-solid fa-chevron-down"></i>}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography style={{ fontWeight: "600" }}>
                    Team Management
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Team/>  
                </AccordionDetails>
              </Accordion>
            </Paper>
          </DashboardWrapper>
        </DashboardContainer>
      </div>

      {isLoading && <Overlay />}
    </>
  );
};

export default AboutUs;
