import { Button, Descriptions, Drawer, Image, Input, Modal, Pagination, Switch, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ROW_PER_TABLE } from "../../constant/constant";
import { exportToExcel } from "../../function/exportToExcel";
import { showAlert } from "../../function/showAlert";
import { showToast } from "../../function/showToast";
import { axiosService, DOMAIN2 } from "../../util/service";

const { Search } = Input;

export default function AdminUser() {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  // for sorting balance - total ran
  const [isSorting, setIsSorting] = useState(false);
  const [isSorting2, setIsSorting2] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  // loading
  const [loadingDeny, setLoadingDeny] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  // for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [balanceField, setBalanceField] = useState("");

  // loading export
  const [loading, setLoading] = useState(false);

  const showModal = (record) => {
    setIsModalVisible(true);
    setRecord(record);
    setBalanceField(Number.isInteger(record.balance) ? record.balance : record.balance?.toFixed(2));
  };

  const handleOk = () => {
    setBalance(record.id, balanceField);

    setIsModalVisible(false);
    setRecord(null);
    setBalanceField("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRecord(null);
    setBalanceField("");
  };

  // for modal 2
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [kycinfo, setkycinfo] = useState(undefined);
  const showModal2 = (id) => {
    // todo
    getKYCInfo(id);

    setIsModalVisible2(true);
  };
  const handleOk2 = () => {
    setIsModalVisible2(false);
  };
  const handleCancel2 = () => {
    setIsModalVisible2(false);
    setkycinfo(undefined);
  };

  // for drawer
  const [open, setOpen] = useState(false);
  const [userDrawer, setUserDrawer] = useState(null);
  const showDrawer = (record) => {
    setUserDrawer(record);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setUserDrawer(null);
  };

  const handleChangeBalance = (e) => {
    setBalanceField(e.target.value);
  };

  const setBalance = async (id, balance) => {
    try {
      const response = await axiosService.post("api/admin/setBalance", {
        id: id.toString(),
        balance: balance.toString(),
      });
      showAlert("success", response.data.message);
      getAllUsers(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const getKYCInfo = async (id) => {
    try {
      const response = await axiosService.post("api/admin/sreachKycUserToId", { id });
      setkycinfo(response.data.data);
    } catch (error) {
      console.log(error);
      setkycinfo(undefined);
    }
  };

  const getAllUsers = async (limit, page) => {
    let payload;

    if (isSorting) {
      payload = {
        limit,
        page,
        order: "ORDER BY balance DESC",
      };
    } else if (isSorting2) {
      payload = {
        limit,
        page,
        order: "ORDER BY totalRan DESC",
      };
    } else {
      payload = { limit, page };
    }

    try {
      const response = await axiosService.post("api/admin/getAllUser", payload);

      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearch = (keyword) => {
    setSearchWord(keyword);

    if (keyword !== "") {
      searchUsers(keyword);
      setIsSearching(true);
    } else {
      setCurrent(1);
      getAllUsers(ROW_PER_TABLE, 1);
      setIsSearching(false);
    }
  };

  const onChange = (e) => {
    const keyword = e.target.value;
    setSearchWord(keyword);

    if (keyword === "") {
      setCurrent(1);
      getAllUsers(ROW_PER_TABLE, 1);
      setIsSearching(false);
    }
  };

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
      getAllUsers(ROW_PER_TABLE, current);

      setLoadingDeny(false);
      setLoadingApprove(false);

      handleCancel2();
    }
  };

  async function searchUsers(keyword) {
    try {
      const response = await axiosService.post("api/admin/sreachListUser", {
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

  const onPaginationChange = (page) => {
    setCurrent(page);
    getAllUsers(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    setCurrent(1);
    getAllUsers(ROW_PER_TABLE, 1);
  }, [isSorting, isSorting2]);

  const columns = [
    {
      title: "No.",
      key: "No.",
      width: 60,
      render: (t, r, i) => {
        return <span>{(current - 1) * 10 + i + 1}</span>;
      },
    },
    {
      title: "User ID",
      key: "uid",
      width: 80,
      render: (_, { id }) => {
        return <span>{id}</span>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Referral",
      dataIndex: "referral",
      key: "referral",
      width: 170,
    },
    {
      title: (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Balance</span>
          {!isSearching && (
            <Button
              size="small"
              onClick={() => {
                setIsSorting((prev) => !prev);
                if (isSorting2) setIsSorting2(false);
              }}
              type={isSorting ? "primary" : "default"}
            >
              <i className="fa-solid fa-arrow-down-wide-short"></i>
            </Button>
          )}
        </div>
      ),
      dataIndex: "balance",
      key: "balance",
      width: 150,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{Number.isInteger(record.balance) ? record.balance : record.balance?.toFixed(2)}</span>
            <Tooltip title="Edit balance">
              <i
                className="fa-solid fa-pen-to-square"
                style={{ cursor: "pointer" }}
                onClick={() => showModal(record)}
              ></i>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Total ran</span>
          {!isSearching && (
            <Button
              size="small"
              onClick={() => {
                setIsSorting2((prev) => !prev);
                if (isSorting) setIsSorting(false);
              }}
              type={isSorting2 ? "primary" : "default"}
            >
              <i className="fa-solid fa-arrow-down-wide-short"></i>
            </Button>
          )}
        </div>
      ),
      key: "Total ran",
      dataIndex: "totalRan",
      width: 150,
      render: (num) => {
        let x = Number(num);
        if (Number.isInteger(x)) {
          return <center>{x}</center>;
        } else {
          return <center>{x.toFixed(2)}</center>;
        }
      },
    },
    {
      title: "Parent ID",
      key: "parentId",
      width: 100,
      dataIndex: "parentId",
    },
    {
      title: "Network",
      key: "Network",
      width: 110,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => history.push("/admin/user-network/" + record.id + "?e=" + record.email)}>
            Network
          </Button>
        );
      },
    },
    {
      title: "KYC Info",
      key: "KYC Info",
      width: 110,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => showModal2(record.id)}>
            View
          </Button>
        );
      },
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: 80,
      render: (_, record) => {
        if (record.active === 0) {
          return (
            <Button
              size="small"
              //  onClick={() => activeUser(record.id)}
            >
              Active
            </Button>
          );
        } else {
          return (
            <Tag color={"green"}>
              <strong>ACTIVE</strong>
            </Tag>
          );
        }
      },
    },
    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (time) => {
        if (time.toString().includes("Z") && time.toString().includes("T")) {
          // time format is "2022-10-25T00:20:29.000Z"
          try {
            const x = new Date(Date.parse(time)).toLocaleString();
            return <span>{x}</span>;
          } catch (error) {
            return <span>-</span>;
          }
        } else {
          return <span>{time}</span>;
        }
      },
    },
    {
      title: "Permission",
      key: "Permission",
      width: 150,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => showDrawer(record)}>
            Set permission
          </Button>
        );
      },
    },
  ];

  const renderStatus = () => {
    if (!kycinfo.kyc_status) return;

    let color;
    if (kycinfo?.kyc_status === "PENDING") color = "orange";
    if (kycinfo?.kyc_status === "APPROVED") color = "green";
    if (kycinfo?.kyc_status === "CANCEL") color = "red";
    return (
      <Tag color={color}>
        <strong>{kycinfo?.kyc_status.toUpperCase()}</strong>
      </Tag>
    );
  };

  const renderRole = () => {
    if (!userDrawer) return;

    if (userDrawer.id == 1) {
      return "ADMIN";
    } else if (userDrawer.id != 1 && userDrawer.type == 1) {
      return "MODERATOR";
    } else {
      return "USER";
    }
  };

  const renderSetPermission = () => {
    if (!userDrawer) return <></>;

    if (userDrawer.id == 1) return <></>;

    if (userDrawer.id != 1) {
      return (
        <>
          <div style={{ marginTop: 25, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Set as moderator</span>
            <Switch defaultChecked={userDrawer.type == 1} onChange={onSW1Change} />
          </div>

          {userDrawer.type == 1 && (
            <div style={{ marginTop: 25, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Allow to edit KYC</span>
              <Switch defaultChecked={userDrawer.kyc == 1} onChange={onSW2Change} />
            </div>
          )}

          {userDrawer.type == 1 && (
            <div style={{ marginTop: 25, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Allow to edit content</span>
              <Switch defaultChecked={userDrawer.content == 1} onChange={onSW3Change} />
            </div>
          )}
        </>
      );
    }
  };

  const onSW1Change = (checked) => {
    if (checked === true) {
      setQuyen(userDrawer?.id, "type", 1);
    } else {
      setQuyen(userDrawer?.id, "type", 0);
    }
  };

  const onSW2Change = (checked) => {
    if (checked === true) {
      setQuyen(userDrawer?.id, "kyc", 1);
    } else {
      setQuyen(userDrawer?.id, "kyc", 0);
    }
  };

  const onSW3Change = (checked) => {
    if (checked === true) {
      setQuyen(userDrawer?.id, "content", 1);
    } else {
      setQuyen(userDrawer?.id, "content", 0);
    }
  };

  const setQuyen = async (id, name, value) => {
    try {
      const response = await axiosService.post("api/admin/updateUser", {
        userid: id,
        name,
        number: value,
      });

      showToast("success", response.data.message);

      if (searchWord == "") {
        await getAllUsers(ROW_PER_TABLE, current);
      } else {
        await searchUsers(searchWord);
      }

      setUserDrawer({
        ...userDrawer,
        [name]: value,
      });
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const getFullData = async () => {
    try {
      const response = await axiosService.post("api/admin/getAllFullAllUser");
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportDataToExcel = async () => {
    try {
      setLoading(true);
      const data = await getFullData();
      exportToExcel(data, "hewe-users-data");
    } catch (error) {
      console.log(error);
      showAlert("error", "Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-user">
      <div className="title-area">
        <div style={{ display: "flex", alignContent: "center" }}>
          <h2 className="title">Users</h2>
          <Button type="primary" style={{ marginLeft: 10 }} onClick={() => handleExportDataToExcel()} loading={loading}>
            Export
          </Button>
        </div>

        <Search placeholder="Search" className="search-box" allowClear onSearch={onSearch} onChange={onChange} />

        <Pagination
          defaultCurrent={1}
          total={totalRecord}
          current={current}
          onChange={onPaginationChange}
          showSizeChanger={false}
          showQuickJumper={false}
          showLessItems
          hideOnSinglePage
          className="pagination-box"
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ x: 1710 }}
      />

      {/* Modal */}
      <Modal title="Edit balance" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} centered>
        <div className="field balance_field">
          <label htmlFor="balance_field">Balance</label>
          <Input
            type="number"
            size="large"
            id="balance_field"
            name="balance_field"
            addonBefore="$"
            value={balanceField}
            onChange={handleChangeBalance}
          />
        </div>
      </Modal>
      {/* End modal */}

      {/* Modal 2 */}
      <Modal
        title="Review User KYC"
        open={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        width={kycinfo ? 1000 : 520}
        footer={
          kycinfo?.kyc_status == "PENDING"
            ? [
                <Button key="cancel" onClick={handleCancel2}>
                  Cancel
                </Button>,
                <Button
                  key="denyKYC"
                  type="primary"
                  danger
                  loading={loadingDeny}
                  onClick={() => updateKYC(kycinfo?.id, "CANCEL")}
                >
                  Deny KYC
                </Button>,
                <Button
                  key="approveKYC"
                  type="primary"
                  loading={loadingApprove}
                  onClick={() => updateKYC(kycinfo?.id, "APPROVED")}
                >
                  Approve KYC
                </Button>,
              ]
            : null
        }
      >
        {kycinfo ? (
          <Descriptions bordered column={window.innerWidth <= 576 ? 1 : 2} size="middle">
            <Descriptions.Item label="Status">{renderStatus()}</Descriptions.Item>
            <Descriptions.Item label="User ID">{kycinfo?.userid}</Descriptions.Item>
            <Descriptions.Item label="Email">{kycinfo?.email}</Descriptions.Item>
            <Descriptions.Item label="Firstname">{kycinfo?.firstname}</Descriptions.Item>
            <Descriptions.Item label="Lastname">{kycinfo?.lastname}</Descriptions.Item>
            <Descriptions.Item label="Gender">{kycinfo?.gender == 1 ? "Male" : "Female"}</Descriptions.Item>
            <Descriptions.Item label="Phone">{kycinfo?.phone}</Descriptions.Item>
            <Descriptions.Item label="Passport">{kycinfo?.passport}</Descriptions.Item>
            <Descriptions.Item label="Country">{kycinfo?.country}</Descriptions.Item>
            <Descriptions.Item label="Created at">{kycinfo?.created_at}</Descriptions.Item>
            <Descriptions.Item label="Front image">
              <Image height={80} src={`${DOMAIN2}${kycinfo?.front_image}`} fallback="/img/fallback.png" />
            </Descriptions.Item>
            <Descriptions.Item label="Back image">
              <Image height={80} src={`${DOMAIN2}${kycinfo?.back_image}`} fallback="/img/fallback.png" />
            </Descriptions.Item>
            <Descriptions.Item label="Selfie image">
              <Image height={80} src={`${DOMAIN2}${kycinfo?.selfie_image}`} fallback="/img/fallback.png" />
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div>User has not been KYC</div>
        )}
      </Modal>
      {/* End modal 2 */}

      {/* Drawer */}
      <Drawer title="Set permission" onClose={onClose} open={open}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Email</span>
          <b>{userDrawer?.email}</b>
        </div>

        <div style={{ marginTop: 25, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Current role</span>
          <b>{renderRole()}</b>
        </div>

        {renderSetPermission()}
      </Drawer>
      {/* End drawer */}
    </div>
  );
}
