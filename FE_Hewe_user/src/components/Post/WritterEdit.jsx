import { Editor } from "@tinymce/tinymce-react";
import { Button, Drawer, Image, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Prompt, Redirect, useHistory, useParams } from "react-router-dom";
import { API_KEY } from "../../constant/constant";
import { showAlert } from "../../function/showAlert";
import { showToast } from "../../function/showToast";
import { editorConfig } from "../../util/editorConfig";
import { axiosService, DOMAIN } from "../../util/service";

const { Option } = Select;
const { TextArea } = Input;

export default function WritterEdit() {
  const { user } = useSelector((root) => root.userReducer);

  // for drawer
  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  // end drawer

  // for drawer 2
  const [open2, setOpen2] = useState(false);
  const showDrawer2 = () => setOpen2(true);
  const onClose2 = () => setOpen2(false);
  // end drawer 2

  // ---------- for modal ----------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    setOpen(false);
    setOpen2(false);
  };
  const handleOk = () => {
    document.getElementById("photoInput").value = "";
    setIsModalOpen(false);

    if (!img) {
      showAlert("error", "Please choose an image");
    } else {
      let formData = new FormData();
      formData.append("image", img);
      uploadImage(formData);
    }
  };
  const handleCancel = () => {
    document.getElementById("photoInput").value = "";
    setIsModalOpen(false);
    setImg(undefined);
    setPath(undefined);
  };
  const [img, setImg] = useState(undefined); // for uploading
  const [path, setPath] = useState(undefined); // for showing preview

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  useEffect(() => {
    if (img) {
      const path = URL.createObjectURL(img);
      setPath(path);
    }
  }, [img]);

  const uploadImage = async (data) => {
    try {
      let response = await axiosService.post("api/news/addImage", data);
      showAlert("success", response.data.message);
      // reset
      setImg(undefined);
      setPath(undefined);
      // get data
      getAllImages();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };
  // ---------- end modal ----------

  // post detail
  const [post, setPost] = useState(null);

  const [imgList, setImgList] = useState([]);
  const [menuList, setMenuList] = useState([]);

  // slug
  const [slug, setSlug] = useState("");

  const params = useParams();

  // tiny mce editor
  const editorRef = useRef(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      url: "",
      content: "",
      image: undefined,
      imageLink: "",
      alt: "",
      menuId: undefined,
      meta: "",
    },
    onSubmit: (values) => {
      updatePost({
        image: values.image.link,
        title: values.title,
        detail: editorRef.current.getContent(),
        idMenu: values.menuId,
        url: values.url,
        alt: values.alt,
        idPost: params.id,
        metaDescription: values.meta,
      });
    },
  });

  const getAllImages = async () => {
    const API = "api/news/getImageAll";
    try {
      let response = await axiosService.post(API, {
        limit: 1000,
        page: 1,
      });
      setImgList(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllMenu = async () => {
    try {
      let response = await axiosService.post("api/news/getAllMenu");
      setMenuList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async (data) => {
    try {
      let response = await axiosService.post("api/news/updatePosts", data);
      showAlert("success", response.data.message);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const getPostDetail = async (id) => {
    try {
      let response = await axiosService.post("api/news/getDetailPosts", {
        idPost: id.toString(),
      });
      setPost(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const validateContent = () => {
    let isValidated = true;

    if (formik.values.title == "") isValidated = false;
    if (formik.values.url == "") isValidated = false;
    if (editorRef.current.getContent() == "") isValidated = false;
    if (formik.values.imageLink == "") isValidated = false;
    if (formik.values.alt == "") isValidated = false;
    if (!formik.values.menuId) isValidated = false;
    if (formik.values.meta == "") isValidated = false;

    if (isValidated) {
      formik.handleSubmit();
    } else {
      showAlert("error", "Please enter all fields");
    }
  };

  const stringToSlug = (str) => {
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-]/g, "-")
      .replace(/-+/g, "-");

    return str;
  };

  const handleChangeTitle = (e) => {
    const title = e.target.value;
    formik.setFieldValue("title", title);
    const slugTitle = stringToSlug(title);
    formik.setFieldValue("url", slugTitle);
  };

  useEffect(() => {
    getAllImages();
    getAllMenu();
    getPostDetail(params.id);
  }, []);

  useEffect(() => {
    if (post && menuList) {
      formik.setFieldValue("title", post.title);
      formik.setFieldValue("url", post.url);
      formik.setFieldValue("image", {
        link: post.image,
      });
      formik.setFieldValue("imageLink", post.image);
      formik.setFieldValue("alt", post.alt);
      formik.setFieldValue("menuId", post.idMenu);
      formik.setFieldValue("meta", post.metaDescription);

      // setSlug = url of the menu
      const menuURL = menuList.find((item) => item.id == post.idMenu)?.url;
      setSlug(menuURL);
    }
  }, [post, menuList]);

  const history = useHistory();
  if (history.action != "PUSH") {
    return <Redirect to="/admin/manage-news" />;
  }

  return (
    <div className="admin-writter">
      <div className="title-field field">
        <label htmlFor="title">Title</label>
        <Input
          size="large"
          type="text"
          id="title"
          name="title"
          value={formik.values.title}
          onChange={handleChangeTitle}
        />
      </div>

      <div className="menu-field field">
        <div>Menu</div>
        <Select
          size="large"
          style={{ width: "100%" }}
          onChange={(v) => {
            formik.setFieldValue("menuId", v);
            const url = menuList.find((item) => item.id == v)?.url;
            setSlug(url);
          }}
          value={formik.values.menuId}
        >
          {menuList.map((item, index) => {
            return (
              <Option key={index} value={item.id}>
                {item.title}
              </Option>
            );
          })}
        </Select>
      </div>

      <div className="url-field field">
        <label htmlFor="url">URL</label>
        <Input
          size="large"
          type="text"
          id="url"
          name="url"
          value={formik.values.url}
          onChange={formik.handleChange}
          addonBefore={slug == "" ? DOMAIN : DOMAIN + slug + "/"}
        />
      </div>

      <div className="content-field field">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label>Content</label>
          <Button onClick={showDrawer2}>Gallery</Button>
        </div>

        <Editor
          apiKey={API_KEY}
          onInit={(e, editor) => (editorRef.current = editor)}
          initialValue={post?.detail}
          init={editorConfig}
        />
      </div>

      <div className="meta-field field">
        <label htmlFor="meta">Meta description</label>
        <TextArea
          size="large"
          rows={3}
          id="meta"
          name="meta"
          value={formik.values.meta}
          onChange={formik.handleChange}
        />
      </div>

      <div className="image-field field">
        <Button onClick={showDrawer} style={{ marginRight: 20 }}>
          Choose an image
        </Button>
        {formik.values.image && (
          <Image src={`${DOMAIN}${formik.values.image.link}`} alt="Image preview" className="img-preview" />
        )}
      </div>

      <div className="alt-field field">
        <label htmlFor="alt">Image alternative text</label>
        <Input size="large" type="text" id="alt" name="alt" value={formik.values.alt} onChange={formik.handleChange} />
      </div>

      <div className="action-area">
        <Button
          onClick={validateContent}
          style={{ width: 200 }}
          type="primary"
          size={window.innerWidth <= 768 ? "middle" : "large"}
        >
          Update post
        </Button>
      </div>

      <Drawer
        title="Choose an image"
        placement="right"
        onClose={onClose}
        open={open}
        className="writter-image-chooser-drawer"
      >
        <Button type="primary" style={{ marginBottom: 24 }} onClick={() => showModal()}>
          <i className="fa-solid fa-plus" style={{ marginRight: 5 }}></i>
          Upload images
        </Button>

        <div className="list">
          {imgList.map((item, index) => {
            return (
              <div
                className="image-wrapper"
                key={index}
                onClick={() => {
                  onClose();
                  formik.setFieldValue("image", item);
                  formik.setFieldValue("imageLink", `${DOMAIN}${item.link}`);
                }}
              >
                <img src={`${DOMAIN}${item.link}`} />
              </div>
            );
          })}
        </div>
      </Drawer>

      <Drawer
        title="Gallery"
        placement="right"
        onClose={onClose2}
        open={open2}
        className="writter-image-chooser-drawer"
      >
        <Button type="primary" style={{ marginBottom: 24 }} onClick={() => showModal()}>
          <i className="fa-solid fa-plus" style={{ marginRight: 5 }}></i>
          Upload images
        </Button>

        <div className="list">
          {imgList.map((item, index) => {
            return (
              <div
                className="image-wrapper"
                key={index}
                onClick={() => {
                  onClose2();
                  navigator.clipboard.writeText(DOMAIN + item.link);
                  showToast("success", "URL copied");
                }}
              >
                <img src={`${DOMAIN}${item.link}`} />
              </div>
            );
          })}
        </div>
      </Drawer>

      <Modal centered title="Upload images" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Upload">
        <form>
          <div className="photo-field field">
            <input type="file" accept="image/*" id="photoInput" name="photoInput" onChange={handleChangeImage} />
            {path && <Image src={path} alt="Image preview" className="img-preview" />}
          </div>
        </form>
      </Modal>

      <Prompt when={true} message="The post may not have been saved yet. Are you sure to leave this page?" />
    </div>
  );
}
