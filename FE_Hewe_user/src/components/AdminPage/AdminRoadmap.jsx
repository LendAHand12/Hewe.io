import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Input, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { showAlert } from "../../function/showAlert";
import { showToast } from "../../function/showToast";
import { axiosService } from "../../util/service";

export default function AdminRoadmap() {
  const [roadData, setRoadData] = useState([]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    time: "",
    title: "",
    detail: "",
  });
  const showModal = () => {
    setModalData({
      time: "",
      title: "",
      detail: "",
    });
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    await addRoadmap(modalData);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Modal

  // Modal edit
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [modalData2, setModalData2] = useState({
    idRoadmap: undefined,
    time: "",
    title: "",
    detail: "",
  });
  const showModal2 = (record) => {
    setModalData2({
      idRoadmap: record.id,
      time: record.time,
      title: record.title,
      detail: record.detail,
    });
    setIsModalOpen2(true);
  };
  const handleOk2 = async () => {
    await editRoadmap(modalData2);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  // Modal edit

  const getRoadmap = async () => {
    try {
      let response = await axiosService.post("api/news/getRoadmap");
      setRoadData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addRoadmap = async (payload) => {
    try {
      let response = await axiosService.post("api/news/addRoadmap", payload);
      setIsModalOpen(false); // close modal and reset form
      showToast("success", response.data.message);
      await getRoadmap();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const editRoadmap = async (payload) => {
    try {
      let response = await axiosService.post("api/news/updateRoadmap", payload);
      setIsModalOpen2(false); // close modal
      showToast("success", response.data.message);
      await getRoadmap();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const deleteRoadmap = async (id) => {
    try {
      let response = await axiosService.post("api/news/deleteRoadmap", { idRoadmap: id });
      showToast("success", response.data.message);
      await getRoadmap();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const showConfirmToDelete = (record) => {
    Modal.confirm({
      title: "Do you want to delete this item?",
      icon: <QuestionCircleFilled />,
      content: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginTop: 5 }}>
            Time: <span style={{ fontWeight: 600 }}>{record.time}</span>
          </div>
          <div style={{ marginTop: 5 }}>
            Title: <span style={{ fontWeight: 600 }}>{record.title}</span>
          </div>
          <div style={{ marginTop: 5 }}>
            Detail: <span style={{ fontWeight: 600 }}>{record.detail}</span>
          </div>
        </div>
      ),
      onOk() {
        deleteRoadmap(record.id);
      },
    });
  };

  useEffect(() => {
    getRoadmap();
  }, []);

  const columns = [
    {
      title: "Time",
      key: "Time",
      dataIndex: "time",
      width: 100,
    },
    {
      title: "Title",
      key: "Title",
      dataIndex: "title",
      width: 250,
    },
    {
      title: "Detail",
      key: "Detail",
      dataIndex: "detail",
      width: 480,
    },
    {
      title: "",
      key: "Action",
      width: 80,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button size="small" onClick={() => showModal2(record)}>
              Edit
            </Button>
            <Button size="small" danger onClick={() => showConfirmToDelete(record)} style={{ marginLeft: 5 }}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const columnsMobile = [
    {
      title: "Item",
      key: "Item",
      width: 300,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>{record.time}</div>
            <div style={{ marginTop: 3, fontWeight: 500 }}>{record.title}</div>
            <div style={{ marginTop: 3 }}>{record.detail}</div>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "Action",
      width: 70,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button size="small" onClick={() => showModal2(record)}>
              <i className="fa-solid fa-pen-to-square"></i>
            </Button>
            <Button size="small" danger onClick={() => showConfirmToDelete(record)} style={{ marginLeft: 5 }}>
              <i className="fa-solid fa-trash-can"></i>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="admin-roadmap-edit">
      <div className="title-area">
        <h2 className="title">Roadmap</h2>

        <Button type="primary" size="middle" onClick={showModal}>
          <i className="fa-solid fa-plus" style={{ marginRight: 5 }}></i>
          Add item
        </Button>
      </div>

      <Table
        columns={window.innerWidth <= 768 ? columnsMobile : columns}
        size={window.innerWidth <= 768 ? "small" : "middle"}
        dataSource={roadData}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={window.innerWidth <= 768 ? {} : { x: 910 }}
        showHeader={window.innerWidth <= 768 ? false : true}
      />

      <Modal
        title="Add item"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
        className="add-roadmap-modal-admin"
        maskClosable={false}
      >
        <form>
          <div className="field timeField">
            <label htmlFor="timeField">Time</label>
            <Input
              placeholder="Time"
              id="timeField"
              value={modalData.time}
              onChange={(e) => setModalData({ ...modalData, time: e.target.value })}
            />
          </div>

          <div className="field titleField">
            <label htmlFor="titleField">Title</label>
            <Input.TextArea
              rows={2}
              placeholder="Title"
              id="titleField"
              value={modalData.title}
              onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
            />
          </div>

          <div className="field detailField">
            <label htmlFor="detailField">Detail</label>
            <Input.TextArea
              rows={3}
              placeholder="Detail"
              id="detailField"
              value={modalData.detail}
              onChange={(e) => setModalData({ ...modalData, detail: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      <Modal
        title="Edit item"
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        okText="Update"
        className="add-roadmap-modal-admin"
        maskClosable={false}
      >
        <form>
          <div className="field timeField">
            <label htmlFor="timeField">Time</label>
            <Input
              placeholder="Time"
              id="timeField"
              value={modalData2.time}
              onChange={(e) => setModalData2({ ...modalData2, time: e.target.value })}
            />
          </div>

          <div className="field titleField">
            <label htmlFor="titleField">Title</label>
            <Input.TextArea
              rows={2}
              placeholder="Title"
              id="titleField"
              value={modalData2.title}
              onChange={(e) => setModalData2({ ...modalData2, title: e.target.value })}
            />
          </div>

          <div className="field detailField">
            <label htmlFor="detailField">Detail</label>
            <Input.TextArea
              rows={3}
              placeholder="Detail"
              id="detailField"
              value={modalData2.detail}
              onChange={(e) => setModalData2({ ...modalData2, detail: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
