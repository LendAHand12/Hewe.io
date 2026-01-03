import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Image, Modal, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { showAlert } from "../../function/showAlert";
import { showToast } from "../../function/showToast";
import { axiosService, DOMAIN } from "../../util/service";
import { ROW_PER_TABLE } from "../../constant/constant";
import { useSelector } from "react-redux";

export default function Media() {
  const [img, setImg] = useState(undefined); // for uploading
  const [path, setPath] = useState(undefined); // for showing preview

  const [listImage, setListImage] = useState([]);

  const { user } = useSelector((root) => root.userReducer);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const showModal = (item) => {
    setIsModalOpen(true);
    setSelectedItem(item);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

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

  useEffect(() => {
    setCurrent(1);
    getAllImages(ROW_PER_TABLE, 1);
  }, []);

  const uploadImage = async (data) => {
    try {
      let response = await axiosService.post("api/news/addImage", data);
      showAlert("success", response.data.message);
      // reset
      document.getElementById("photoInput").value = "";
      setImg(undefined);
      setPath(undefined);
      // get data
      getAllImages(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const getAllImages = async (limit, page) => {
    const API = "api/news/getImageAll";

    try {
      let response = await axiosService.post(API, {
        limit: limit.toString(),
        page: page.toString(),
      });
      setListImage(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (!img) {
      showAlert("error", "Please choose an image");
    } else {
      let formData = new FormData();
      formData.append("image", img);
      uploadImage(formData);
    }
  };

  const copyURL = () => {
    navigator.clipboard.writeText(`${DOMAIN}${selectedItem.link}`);
    showToast("success", "URL copied");
    handleCancel();
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <QuestionCircleFilled />,
      content: (
        <span>
          Are you sure to delete this image <b>{selectedItem.name}</b>?
        </span>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        deleteImage();
      },
    });
  };

  const deleteImage = async () => {
    try {
      let response = await axiosService.post("api/news/deleteImage", {
        idImage: selectedItem.id,
      });
      showToast("success", response.data.message);
      handleCancel();
      getAllImages(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      handleCancel();
      showAlert("error", error.response.data.message);
    }
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getAllImages(ROW_PER_TABLE, page);
  };

  return (
    <div className="admin-media">
      <div className="media-upload">
        <h2 className="title">Upload images</h2>

        <form>
          <div className="photo-field field">
            <input type="file" accept="image/*" id="photoInput" name="photoInput" onChange={handleChangeImage} />
          </div>

          {path && (
            <div className="img-preview-wrapper">
              <Image src={path} alt="Image preview" className="img-preview" />
            </div>
          )}

          <Button type="primary" style={{ marginTop: 25, width: 150 }} onClick={handleSubmit}>
            Upload
          </Button>
        </form>
      </div>

      <div className="media-list">
        <div className="title-area">
          <h2 className="title">Images list</h2>

          <Pagination
            defaultCurrent={1}
            total={totalRecord}
            current={current}
            onChange={onPaginationChange}
            showSizeChanger={false}
            showQuickJumper={false}
            pageSize={10}
            hideOnSinglePage={true}
            className="pagination-box"
          />
        </div>

        {listImage.length != 0 && (
          <div className="list">
            {listImage.map((item, index) => {
              return (
                <div className="image-wrapper" key={index} onClick={() => showModal(item)}>
                  <img src={`${DOMAIN}${item.link}`} />
                </div>
              );
            })}
          </div>
        )}
        {listImage.length == 0 && <span>No images</span>}
      </div>

      <Modal
        title="Image detail"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="image-modal"
        centered
        footer={[
          <Button type="default" key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button type="primary" key="copy" onClick={() => copyURL()}>
            Copy URL
          </Button>,
          <Button type="primary" danger key="delete" onClick={() => confirmDelete()}>
            Delete
          </Button>,
        ]}
      >
        {selectedItem && (
          <>
            <div style={{ textAlign: "center" }}>
              <img src={`${DOMAIN}${selectedItem.link}`} />
              <div className="image-name">Name: {selectedItem.name}</div>
              <div className="image-time">Time: {selectedItem.created_at}</div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
