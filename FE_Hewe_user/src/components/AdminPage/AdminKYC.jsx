import { Button, Descriptions, Image, Input, Modal, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ROW_PER_TABLE } from "../../constant/constant";
import { showAlert } from "../../function/showAlert";
import { axiosService, DOMAIN2 } from "../../util/service";

const { Search } = Input;

export default function AdminKYC() {
  const [data, setData] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  // for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [record, setRecord] = useState({});

  // loading
  const [loadingDeny, setLoadingDeny] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const showModal = (record) => {
    setIsModalVisible(true);
    setRecord(record);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function getAllUsersKYC(limit, page) {
    try {
      const response = await axiosService.post("api/admin/getAllUserKyc", {
        limit: limit.toString(),
        page: page.toString(),
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  }

  const onSearch = (keyword) => {
    if (keyword !== "") {
      searchUsers(keyword);
    } else {
      setCurrent(1);
      getAllUsersKYC(ROW_PER_TABLE, 1);
    }
  };

  const onChange = (e) => {
    const keyword = e.target.value;
    if (keyword === "") {
      setCurrent(1);
      getAllUsersKYC(ROW_PER_TABLE, 1);
    }
  };

  async function searchUsers(keyword) {
    try {
      const response = await axiosService.post("api/admin/sreachListUserKyc", {
        limit: ROW_PER_TABLE,
        page: 1,
        keyWord: keyword,
      });
      setCurrent(1);
      setTotalRecord(10);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const updateKYC = async (id, status) => {
    if (status == "CANCEL") setLoadingDeny(true);
    if (status == "APPROVED") setLoadingApprove(true);
    try {
      const response = await axiosService.post("api/admin/updateKyc", {
        idKyc: id,
        type: status,
      });
      showAlert("success", response.data.message);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      getAllUsersKYC(ROW_PER_TABLE, current);
      setLoadingDeny(false);
      setLoadingApprove(false);
      setIsModalVisible(false);
    }
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getAllUsersKYC(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    setCurrent(1);
    getAllUsersKYC(ROW_PER_TABLE, 1);
  }, []);

  const columns = [
    {
      title: "No.",
      key: "No.",
      width: 80,
      render: (t, r, i) => {
        return <span>{(current - 1) * 10 + i + 1}</span>;
      },
    },
    // {
    //   title: "Username",
    //   dataIndex: "userName",
    //   key: "userName",
    //   width: 100,
    // },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
      width: 150,
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
      width: 150,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (_, { gender }) => {
        if (gender === 1) return <span>Male</span>;
        if (gender === 2) return <span>Female</span>;
        return <span></span>;
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 200,
    },
    {
      title: "Passport",
      dataIndex: "passport",
      key: "passport",
      width: 200,
    },
    {
      title: "KYC Status",
      key: "kyc_status",
      dataIndex: "kyc_status",
      width: 120,
      fixed: "right",
      render: (_, { kyc_status }) => {
        let color;
        if (kyc_status === "PENDING") color = "orange";
        if (kyc_status === "APPROVED") color = "green";
        if (kyc_status === "CANCEL") color = "red";
        return (
          <Tag color={color}>
            <strong>{kyc_status.toUpperCase()}</strong>
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Button size="small" onClick={() => showModal(record)}>
          Review
        </Button>
      ),
    },
  ];

  const columnsMobile = [
    {
      title: "No.",
      key: "No.",
      width: 80,
      render: (t, r, i) => {
        return <span>{(current - 1) * 10 + i + 1}</span>;
      },
    },
    // {
    //   title: "Username",
    //   dataIndex: "userName",
    //   key: "userName",
    //   width: 100,
    // },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
      width: 150,
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
      width: 150,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (_, { gender }) => {
        if (gender === 1) return <span>Male</span>;
        if (gender === 2) return <span>Female</span>;
        return <span></span>;
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 200,
    },
    {
      title: "Passport",
      dataIndex: "passport",
      key: "passport",
      width: 200,
    },
    {
      title: "KYC Status",
      key: "kyc_status",
      dataIndex: "kyc_status",
      width: 120,
      render: (_, { kyc_status }) => {
        let color;
        if (kyc_status === "PENDING") color = "orange";
        if (kyc_status === "APPROVED") color = "green";
        if (kyc_status === "CANCEL") color = "red";
        return (
          <Tag color={color}>
            <strong>{kyc_status.toUpperCase()}</strong>
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button size="small" onClick={() => showModal(record)}>
          Review
        </Button>
      ),
    },
  ];

  const renderStatus = () => {
    if (!record.kyc_status) return;

    let color;
    if (record.kyc_status === "PENDING") color = "orange";
    if (record.kyc_status === "APPROVED") color = "green";
    if (record.kyc_status === "CANCEL") color = "red";
    return (
      <Tag color={color}>
        <strong>{record.kyc_status.toUpperCase()}</strong>
      </Tag>
    );
  };

  return (
    <div className="admin-kyc">
      <div className="title-area">
        <h2 className="title">KYC</h2>

        <Search placeholder="Search" className="search-box" allowClear onSearch={onSearch} onChange={onChange} />

        <Pagination
          defaultCurrent={1}
          total={totalRecord}
          current={current}
          onChange={onPaginationChange}
          showSizeChanger={false}
          showQuickJumper={false}
          showLessItems={true}
          hideOnSinglePage
          className="pagination-box"
        />
      </div>

      <Table
        columns={window.innerWidth <= 576 ? columnsMobile : columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{
          x: 1300,
        }}
      />

      {/* Modal */}
      <Modal
        title="Review User KYC"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        centered
        footer={
          record.kyc_status == "PENDING"
            ? [
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button
                  key="denyKYC"
                  type="primary"
                  danger
                  loading={loadingDeny}
                  onClick={() => updateKYC(record.id, "CANCEL")}
                >
                  Deny KYC
                </Button>,
                <Button
                  key="approveKYC"
                  type="primary"
                  loading={loadingApprove}
                  onClick={() => updateKYC(record.id, "APPROVED")}
                >
                  Approve KYC
                </Button>,
              ]
            : null
        }
      >
        <Descriptions bordered column={window.innerWidth <= 576 ? 1 : 2} size="middle">
          <Descriptions.Item label="Status">{renderStatus()}</Descriptions.Item>
          <Descriptions.Item label="User ID">{record.userid}</Descriptions.Item>
          {/* <Descriptions.Item label="Username">{record.userName}</Descriptions.Item> */}
          <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
          <Descriptions.Item label="Firstname">{record.firstname}</Descriptions.Item>
          <Descriptions.Item label="Lastname">{record.lastname}</Descriptions.Item>
          <Descriptions.Item label="Gender">{record.gender == 1 ? "Male" : "Female"}</Descriptions.Item>
          <Descriptions.Item label="Phone">{record.phone}</Descriptions.Item>
          <Descriptions.Item label="Passport">{record.passport}</Descriptions.Item>
          <Descriptions.Item label="Country">{record.country}</Descriptions.Item>
          <Descriptions.Item label="Created at">{record.created_at}</Descriptions.Item>
          <Descriptions.Item label="Front image">
            <Image height={80} src={`${DOMAIN2}${record.front_image}`} fallback="/img/fallback.png" />
          </Descriptions.Item>
          <Descriptions.Item label="Back image">
            <Image height={80} src={`${DOMAIN2}${record.back_image}`} fallback="/img/fallback.png" />
          </Descriptions.Item>
          <Descriptions.Item label="Selfie image">
            <Image height={80} src={`${DOMAIN2}${record.selfie_image}`} fallback="/img/fallback.png" />
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      {/* End modal */}
    </div>
  );
}
