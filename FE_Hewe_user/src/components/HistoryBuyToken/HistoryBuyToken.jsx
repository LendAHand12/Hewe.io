import { Button, Image, Table, Tag, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { DOMAIN, DOMAIN2, axiosService } from "../../util/service";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../Modal/Modal";
import { Input } from "../Input/Input";
import { Bounce, toast } from "react-toastify";

const LIMIT = 10;

export const HistoryBuyToken = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [isPendingGetHistory, setIsPendingGetHistory] = useState(false);
  const { isOpen, handleCloseModal, handleOpenModal } = useModal();
  const {
    isOpen: isOpenReject,
    handleCloseModal: handleCloseModalReject,
    handleOpenModal: handleOpenModalReject,
  } = useModal();
  const [currentHistoryFocus, setCurrentHistoryFocus] = useState(null);
  const [isPendingApprove, setIsPendingApprove] = useState(false);
  const [isPendingReject, setIsPendingReject] = useState(false);
  const [hash, setHash] = useState("");
  const [reason, setReason] = useState("");
  const hashInputRef = useRef(null);
  const rejectInputRef = useRef(null);

  const handleChangeHash = (value) => {
    setHash(value.target.value.trim());
  };

  const handleChangeReason = (value) => {
    setReason(value.target.value.trim());
  };

  const handleCloseModalMdw = () => {
    handleCloseModal();
    setHash("");
    setCurrentHistoryFocus(null);
    setIsPendingApprove(false);
  };

  const handleCloseModalRejectMdw = () => {
    handleCloseModalReject();
    setReason("");
    setCurrentHistoryFocus(null);
    setIsPendingReject(false);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleGetHistory = async ({ page, limit = LIMIT }) => {
    await axiosService
      .post("api/depositVND/historyDepositVndAdmin", { page, limit })
      .then((res) => {
        setData(res.data.data.array);
        setTotalItem(res.data.data.total);
      });
  };

  const handleClickApproval = (id) => () => {
    setCurrentHistoryFocus(id);
    handleOpenModal();
  };

  const handleClickReject = (id) => () => {
    setCurrentHistoryFocus(id);
    handleOpenModalReject();
  };

  const handleRequestApprove = async () => {
    setIsPendingApprove(true);

    try {
      const res = await axiosService.post(
        "api/depositVND/activeDepositVNDAdmin",
        { id: currentHistoryFocus, hash }
      );

      message.success(res.data.message);
      handleCloseModal();
      setCurrentHistoryFocus(null);
      setHash("");
      setIsPendingApprove(false);
      handleGetHistory({ page: currentPage });
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingApprove(false);
    }
  };

  const handleRequestReject = async () => {
    setIsPendingReject(true);

    try {
      const res = await axiosService.post(
        "api/depositVND/cancelDepositVNDAdmin",
        { id: currentHistoryFocus, note: reason }
      );

      message.success(res.data.message);
      handleCloseModalReject();
      setCurrentHistoryFocus(null);
      setReason("");
      setIsPendingReject(false);
      handleGetHistory({ page: currentPage });
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingReject(false);
    }
  };

  const hanldeCopy = (value) => () => {
    navigator.clipboard.writeText(value.toString());
    message.success("Copy success");

    return true;
  };

  const columns = [
    {
      title: "UserID",
      key: "UserID",
      dataIndex: "userid",
    },
    {
      title: "Email",
      key: "Email",
      dataIndex: "email",
    },
    {
      title: "Bank",
      key: "Ngân hàng",
      render: (_, { bank_name }) => {
        return <div className="bank-column">{bank_name}</div>;
      },
    },
    {
      title: "VND money",
      key: "Số tiền",
      dataIndex: "amount",
      render: (a) => {
        return <span>{Number(a).toLocaleString("en-US")}</span>;
      },
    },
    {
      title: "Amount HEWE received",
      dataIndex: "amountToken",
      render: (a) => {
        return <span>{Number(a).toLocaleString("en-US")}</span>;
      },
    },
    {
      title: "Amount AMC bonus",
      dataIndex: "coinBonus",
      render: (a) => {
        return <span>{Number(a).toLocaleString("en-US")}</span>;
      },
    },
    {
      title: "Message",
      key: "Nội dung chuyển khoản",
      dataIndex: "code_unique",
    },
    {
      title: "Address received",
      dataIndex: "addressReceive",

      render: (value) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {value}
            <i
              onClick={hanldeCopy(value)}
              className="fa-solid fa-copy"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        );
      },
    },
    {
      title: "Image",
      key: "Hình ảnh",
      render: (_, record) => {
        if (record.images === null) return null;

        return (
          <Image
            className="imageAntdContainer"
            src={`${DOMAIN}${record.images}`}
          />
        );
      },
    },
    {
      title: "Time",
      key: "Thời gian",
      dataIndex: "created_at",
    },
    {
      title: "Status",
      key: "Trạng thái",
      render: (_, { type_admin, type_user, note }) => {
        if (type_admin == 0 && type_user == 0) {
          return (
            <Tag color="orange">
              <b>WAITING</b>
            </Tag>
          );
        } else if (type_admin == 0 && type_user == 2) {
          return (
            <Tag color="grey">
              <b>USER CANCEL</b>
            </Tag>
          );
        } else if (type_admin == 2 && type_user == 0) {
          return (
            <Tag color="blue">
              <b>USER HAS TRANSFER MONEY</b>
            </Tag>
          );
        } else if (type_admin == 3) {
          return (
            <div>
              <Tag color="red">
                <b>REJECT</b>
              </Tag>
              <div style={{ marginTop: "8px" }}>Reason reject: {note}</div>
            </div>
          );
        } else if (type_admin == 1) {
          return (
            <Tag color="green">
              <b>SUCCESS</b>
            </Tag>
          );
        }
      },
    },
    {
      key: "Xetduyet",
      width: 120,
      render: (_, record) => {
        if (record.type_admin == 0 && record.type_user == 0) {
          // pending -> không hiển thị nút review
          return <></>;
        } else if (record.type_admin == 0 && record.type_user == 2) {
          // user huỷ lệnh chuyển tiền
          return <></>;
        } else if (record.type_admin == 3 && record.type_user == 3) {
          // đã từ chối rồi, không xét duyệt nữa
          return <></>;
        } else if (record.type_admin == 1 && record.type_user == 1) {
          // đã thành công rồi, không xét duyệt nữa, chỉ xem thôi
          return <></>;
        } else {
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="primary"
                size="small"
                onClick={handleClickApproval(record.id)}
              >
                Approve
              </Button>
              <Button
                type="danger"
                size="small"
                onClick={handleClickReject(record.id)}
              >
                Reject
              </Button>
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    handleGetHistory({ page: currentPage });
  }, [currentPage]);

  return (
    <div className="banksContainer">
      <div className="header">
        <h2 className="titleContainer">History buy token</h2>
      </div>

      <Table
        rowKey={"id"}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: LIMIT,
          total: totalItem,
          current: currentPage,
          onChange: handleChangePage,
          showSizeChanger: false,
          showQuickJumper: false,
          showLessItems: false,
        }}
      />

      <Modal
        title="Approve this transaction"
        isOpen={isOpen}
        confirmLoading={isPendingApprove}
        onCancel={handleCloseModalMdw}
        onConfirm={handleRequestApprove}
        okText="Confirm"
      >
        <Input
          isFullWidth={true}
          value={hash}
          onChange={handleChangeHash}
          label="Hash"
          ref={hashInputRef}
        />
      </Modal>

      <Modal
        title="Reject this transaction"
        isOpen={isOpenReject}
        confirmLoading={isPendingReject}
        onCancel={handleCloseModalRejectMdw}
        onConfirm={handleRequestReject}
        okText="Confirm"
        isDangerButton={true}
      >
        <Input
          isFullWidth={true}
          value={reason}
          onChange={handleChangeReason}
          label="Reason reject"
          ref={rejectInputRef}
        />
      </Modal>
    </div>
  );
};
