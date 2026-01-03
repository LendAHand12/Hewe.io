import { Button, Input } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { showAlert } from "../../function/showAlert";
import { axiosService } from "../../util/service";
import AdminTeam from "./AdminTeam";

const { TextArea } = Input;

export default function AdminContent() {
  const dispatch = useDispatch();
  const [content, setContent] = useState(null);

  const { id } = useParams();
  const index = Number.parseInt(id) - 1;

  const getContent = async () => {
    try {
      let response = await axiosService.post("api/user/getContent");
      setContent(response.data.data[index]);
      dispatch({
        type: "SIDEBAR_CONTENT",
        payload: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateContent = async (data) => {
    try {
      let response = await axiosService.post("api/user/updateContent", data);
      showAlert("success", response.data.message);
      getContent();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  useEffect(() => {
    if (content) {
      formik.setFieldValue("title", content.title);
      formik.setFieldValue("content", content.content);
    }
  }, [content]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      content: "",
    },
    onSubmit: (values) => {
      updateContent({
        idContent: id,
        content: values.content.toString().trim(),
        title: values.title.toString().trim(),
      });
    },
  });

  useEffect(() => {
    getContent();
  }, [id]);

  if (id != "1" && id != "2" && id != "3" && id != "4") {
    return <Redirect to="/admin" />;
  }

  return (
    <div className="admin-content">
      <h2 className="title">Edit content</h2>

      <div className="content-field field" key={index}>
        <Input type="text" id="title" name="title" value={formik.values.title} onChange={formik.handleChange} />
        <div style={{ marginBottom: 16 }}></div>
        <TextArea rows={6} id="content" name="content" value={formik.values.content} onChange={formik.handleChange} />
      </div>

      <Button type="primary" style={{ marginTop: 25 }} onClick={formik.handleSubmit}>
        Submit
      </Button>

      {id == 4 && (
        <>
          <div style={{ marginBottom: 50 }}></div>
          <AdminTeam />
        </>
      )}
    </div>
  );
}
