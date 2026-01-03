import { useEffect, useRef, useState } from "react";
import { axiosService } from "../../util/service";
import { Button, Form, Select, Table, message } from "antd";
import "./BanksPage.scss";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../Modal/Modal";
import { Input } from "../Input/Input";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { BANKS } from "../../constant/constant";

const LIMIT = 10;

export const BanksPage = () => {
  const [bankData, setBankData] = useState([]);
  const [loadings, setLoadings] = useState({
    add: false,
    update: false,
    delete: false,
  });
  const {
    isOpen: isOpenModalAddBank,
    handleCloseModal: handleCloseModalAddBank,
    handleOpenModal: handleOpenModalAddBank,
  } = useModal();
  const {
    isOpen: isOpenModalUpdateBank,
    handleCloseModal: handleCloseModalUpdateBank,
    handleOpenModal: handleOpenModalUpdateBank,
  } = useModal();
  const {
    isOpen: isOpenModalDelBank,
    handleCloseModal: handleCloseModalDelBank,
    handleOpenModal: handleOpenModalDelBank,
  } = useModal();
  const inputBankNameRef = useRef(null);
  const inputNumberAccountRef = useRef(null);
  const inputOwnerAccountRef = useRef(null);
  const [formData, setFormData] = useState({
    bankName: "",
    numberAccount: "",
    ownerAccount: "",
  });
  const isDisabledBtnAdd =
    formData.bankName === "" ||
    formData.numberAccount === "" ||
    formData.ownerAccount === "";
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);

  const handleGetBanks = async ({ page, limit = LIMIT }) => {
    await axiosService
      .post("api/depositVND/getAllBanking", { page, limit })
      .then((res) => {
        setBankData(res.data.data);
      });
  };

  const handleClickUpdateBank = (data) => () => {
    setFormData({
      bankName: data.name_banking,
      ownerAccount: data.owner_banking,
      numberAccount: data.number_banking,
      id: data.id,
    });
    handleOpenModalUpdateBank();
  };

  const handleClickDeleteBank = (data) => () => {
    setFormData({
      bankName: data.name_banking,
      ownerAccount: data.owner_banking,
      numberAccount: data.number_banking,
      id: data.id,
    });
    handleOpenModalDelBank();
  };

  const handleAddNewBank = async () => {
    setLoadings({ ...loadings, add: true });

    try {
      const res = await axiosService.post("api/depositVND/addBankingAdmin", {
        name_banking: formData.bankName,
        number_banking: formData.numberAccount,
        owner_banking: formData.ownerAccount,
      });

      message.success(res.data.message);
      setLoadings({ ...loadings, add: false });
      handleCloseModalAddBank();
      handleGetBanks({ page: currentPage });
    } catch (error) {
      message.error(error.response.data.message);
      setLoadings({ ...loadings, add: false });
    }
  };

  // const handleChangeBankName = (value) => {
  //   setFormData({ ...formData, bankName: value.target.value.trim() });
  // };

  const handleChangeBankName = (value) => {
    setFormData({ ...formData, bankName: value });
  };

  const handleChangeNumberAccount = (value) => {
    const inputValue = value.target.value.trim();
    const regCheckIsNumber = /^[0-9]+(\.[0-9]*)?$/;

    if (inputValue.length === 0) {
      setFormData({ ...formData, numberAccount: "" });
      return;
    }

    if (!regCheckIsNumber.test(inputValue)) {
      return;
    }

    setFormData({ ...formData, numberAccount: inputValue });
  };

  const handleChangeOwnerAccount = (value) => {
    setFormData({ ...formData, ownerAccount: value.target.value.trim() });
  };

  const handleRequestUpdateBank = async () => {
    setLoadings({ ...loadings, update: true });

    try {
      const res = await axiosService.post("api/depositVND/editBankingAdmin", {
        name_banking: formData.bankName,
        number_banking: formData.numberAccount,
        owner_banking: formData.ownerAccount,
        idBanking: formData.id,
      });

      message.success(res.data.message);
      setLoadings({ ...loadings, update: false });
      handleCloseModalUpdateBank();
      handleGetBanks({ page: currentPage });
    } catch (error) {
      message.error(error.response.data.message);
      setLoadings({ ...loadings, update: false });
    }
  };

  const handleRequestDeleteBank = async () => {
    setLoadings({ ...loadings, delete: true });

    try {
      const res = await axiosService.post("api/depositVND/deleteBankingAdmin", {
        name_banking: formData.bankName,
        number_banking: formData.numberAccount,
        owner_banking: formData.ownerAccount,
        id: formData.id,
      });

      message.success(res.data.message);
      handleCloseModalDelBank();
      handleGetBanks({ page: currentPage });
      setLoadings({ ...loadings, delete: false });
    } catch (error) {
      message.error(error.response.data.message);
      setLoadings({ ...loadings, delete: false });
    }
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Bank name", dataIndex: "name_banking" },
    { title: "Account number", dataIndex: "number_banking" },
    { title: "Account owner", dataIndex: "owner_banking" },
    {
      render: (_, record) => {
        return (
          <div className="btns">
            <Button onClick={handleClickUpdateBank(record)}>Update</Button>
            <Button onClick={handleClickDeleteBank(record)} type="danger">
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const bankOptions = BANKS.map((bank) => {
    return {
      value: bank.name,
      label: (
        <div className="bankOption">
          <img src={bank.logo} /> <div>{bank.name}</div>
        </div>
      ),
    };
  });

  useEffect(() => {
    handleGetBanks({ page: currentPage });
  }, [currentPage]);

  return (
    <div className="banksContainer">
      <div className="header">
        <h2 className="titleContainer">Banks</h2>

        <Button onClick={handleOpenModalAddBank}>Add bank</Button>
      </div>

      <Table
        rowKey={"id"}
        columns={columns}
        dataSource={bankData}
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
        title="Add new bank"
        isOpen={isOpenModalAddBank}
        confirmLoading={loadings.add}
        onCancel={handleCloseModalAddBank}
        onConfirm={handleAddNewBank}
        isDisabledBtn={isDisabledBtnAdd}
      >
        <div className="formAddBank">
          {/* <Input
            label="Bank name"
            ref={inputBankNameRef}
            onChange={handleChangeBankName}
            value={formData.bankName}
          /> */}
          <div>
            <div style={{ fontWeight: 500, marginBottom: "6px" }}>
              Bank name
            </div>
            <Select
              style={{ width: "100%" }}
              value={formData.bankName}
              onChange={handleChangeBankName}
              options={bankOptions}
            />
          </div>
          <Input
            label="Account number"
            ref={inputNumberAccountRef}
            onChange={handleChangeNumberAccount}
            value={formData.numberAccount}
          />
          <Input
            label="Account owner"
            ref={inputOwnerAccountRef}
            onChange={handleChangeOwnerAccount}
            value={formData.ownerAccount}
          />
        </div>
      </Modal>

      <Modal
        title="Update bank information"
        isOpen={isOpenModalUpdateBank}
        confirmLoading={loadings.update}
        onCancel={handleCloseModalUpdateBank}
        onConfirm={handleRequestUpdateBank}
        isDisabledBtn={isDisabledBtnAdd}
        okText="Update"
      >
        <div className="formAddBank">
          <Input
            label="Bank name"
            ref={inputBankNameRef}
            onChange={handleChangeBankName}
            value={formData.bankName}
          />
          <Input
            label="Account number"
            ref={inputNumberAccountRef}
            onChange={handleChangeNumberAccount}
            value={formData.numberAccount}
          />
          <Input
            label="Account owner"
            ref={inputOwnerAccountRef}
            onChange={handleChangeOwnerAccount}
            value={formData.ownerAccount}
          />
        </div>
      </Modal>

      <Modal
        title="Delete bank"
        isOpen={isOpenModalDelBank}
        confirmLoading={loadings.delete}
        onCancel={handleCloseModalDelBank}
        onConfirm={handleRequestDeleteBank}
        isDisabledBtn={isDisabledBtnAdd}
        okText="Confirm"
      >
        <div>Do you want to delete this bank?</div>
      </Modal>
    </div>
  );
};
