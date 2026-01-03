import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Drawer, Image, Input, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { showAlert } from "../../function/showAlert";
import { axiosService, DOMAIN } from "../../util/service";

export default function AdminTeam() {
  const { user } = useSelector((root) => root.userReducer);

  const [list, setList] = useState([]);
  const [imgList, setImgList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({
    name: "",
    position: "",
    avatar: "",
  });

  const [info2, setInfo2] = useState({
    name2: "",
    position2: "",
    avatar2: "",
  });

  // for drawer
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    getAllImages();
    setOpen(true);
  };
  const onClose = () => setOpen(false);

  // for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    // clear form
    setInfo({
      name: "",
      position: "",
      avatar: "",
    });

    setIsModalOpen(true);
  };
  const handleOk = async () => {
    if (!info.name || info.name == "") {
      showAlert("error", "Please enter name");
      return;
    }

    if (!info.position || info.position == "") {
      showAlert("error", "Please enter position");
      return;
    }

    if (!info.avatar || info.avatar == "") {
      showAlert("error", "Please choose an image");
      return;
    }

    await addTeam({
      title: info.name,
      image: info.avatar,
      position: info.position,
    });

    await getTeam();

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // for modal 2
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [record, setRecord] = useState(null);
  const showModal2 = (row) => {
    // global record
    setRecord(row);

    // add data to form
    setInfo2({
      name2: row.title,
      position2: row.position,
      avatar2: row.image,
    });

    setIsModalOpen2(true);
  };
  const handleOk2 = async () => {
    if (!info2.name2 || info2.name2 == "") {
      showAlert("error", "Please enter name");
      return;
    }

    if (!info2.position2 || info2.position2 == "") {
      showAlert("error", "Please enter position");
      return;
    }

    if (!info2.avatar2 || info2.avatar2 == "") {
      showAlert("error", "Please choose an image");
      return;
    }

    await updateTeam({
      title: info2.name2,
      image: info2.avatar2,
      position: info2.position2,
      idTeam: record.id,
    });

    await getTeam();

    setIsModalOpen2(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const getTeam = async () => {
    try {
      const response = await axiosService.post("api/user/getTeam");
      setList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTeam = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      const response = await axiosService.post("api/user/addTeam", data);
      showAlert("success", response.data.message);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      const response = await axiosService.post("api/user/updateTeam", data);
      showAlert("success", response.data.message);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (id) => {
    try {
      const response = await axiosService.post("api/user/deleteTeam", { idTeam: id });
      showAlert("success", response.data.message);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const getAllImages = async () => {
    const API = user.id == 1 ? "api/news/getImageAll" : "api/news/getImageToUser";
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

  const confirmDelete = (selectedItem) => {
    Modal.confirm({
      title: "Confirm",
      icon: <QuestionCircleFilled />,
      content: (
        <span>
          Are you sure to delete member{" "}
          <b>
            {selectedItem.title} - {selectedItem.position}
          </b>
          ?
        </span>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteTeam(selectedItem.id);
        await getTeam();
      },
    });
  };

  useEffect(() => {
    getTeam();
  }, []);

  const columns = [
    {
      title: "No.",
      key: "No.",
      render: (t, r, i) => <span>{i + 1}</span>,
      width: 70,
    },
    {
      title: "Image",
      key: "Image",
      width: 130,
      render: (_, { image, title }) => {
        return (
          <div className="itemimg">
            <Image src={image} alt={title} />
          </div>
        );
      },
    },
    {
      title: "Name",
      key: "Name",
      dataIndex: "title",
      width: 200,
    },
    {
      title: "Position",
      key: "Position",
      dataIndex: "position",
      width: 200,
    },
    {
      title: "Manage",
      key: "Manage",
      width: 100,
      render: (_, record) => {
        return (
          <>
            <Button size="small" onClick={() => showModal2(record)}>
              Edit
            </Button>
            <br />
            <Button size="small" danger onClick={() => confirmDelete(record)} style={{ marginTop: 10 }}>
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="admin-team">
      <div className="title-area">
        <h2 className="title">Team members</h2>
        <Button type="primary" onClick={showModal}>
          <i className="fa-solid fa-plus"></i>
          Add members
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={list}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ x: 600 }}
      />

      <Modal
        title="Add team members"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
        okButtonProps={{ loading: loading }}
      >
        <form className="add-team-members-form">
          <div className="field">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              size="large"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="position">Position</label>
            <Input
              id="position"
              size="large"
              value={info.position}
              onChange={(e) => setInfo({ ...info, position: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="imageInput">Image</label>
            <Button onClick={() => showDrawer()}>{info.avatar ? "Choose another image" : "Choose an image"}</Button>
          </div>

          {info.avatar ? (
            <div className="field-imgg">
              <img src={info.avatar} />
            </div>
          ) : (
            <></>
          )}
        </form>
      </Modal>

      <Modal
        title="Edit team members"
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        okText="Update"
        okButtonProps={{ loading: loading }}
      >
        <form className="edit-team-members-form">
          <div className="field">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              size="large"
              value={info2.name2}
              onChange={(e) => setInfo2({ ...info2, name2: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="position">Position</label>
            <Input
              id="position"
              size="large"
              value={info2.position2}
              onChange={(e) => setInfo2({ ...info2, position2: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="imageInput">Image</label>
            <Button onClick={() => showDrawer()}>Choose another image</Button>
          </div>

          {info2.avatar2 ? (
            <div className="field-imgg">
              <img src={info2.avatar2} />
            </div>
          ) : (
            <></>
          )}
        </form>
      </Modal>

      <Drawer
        zIndex={2000}
        title="Choose an image"
        placement="right"
        onClose={onClose}
        open={open}
        className="writter-image-chooser-drawer"
      >
        <div className="list">
          {imgList.map((item, index) => {
            return (
              <div
                className="image-wrapper"
                key={index}
                onClick={() => {
                  onClose();
                  setInfo({
                    ...info,
                    avatar: `${DOMAIN}${item.link}`,
                  });
                  setInfo2({
                    ...info2,
                    avatar2: `${DOMAIN}${item.link}`,
                  });
                }}
              >
                <img src={`${DOMAIN}${item.link}`} />
              </div>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}
