import "./TransactionMangement.scss";
import { useTransactionManagement } from "./useTransactionManagement";
import { Input as InputAntd, Radio } from "antd";
import { Table as TableAntd } from "../../components/AntdComponent";

const TransactionMangement = () => {
  const {
    x,
    y,
    totalItems,
    currentPage,
    data,
    loading,
    columns,
    limitPerRow,
    inputValue,
    tokenFilter,
    keyword,
    handleChangeKeyword,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    handleChangeTokenFilter,
  } = useTransactionManagement();

  return (
    <div className="TransactionMangement">
      <h4 className="titleContainer">History Update Balance</h4>

      <div
        style={{
          padding: "16px",
          maxHeight: "75vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Radio.Group onChange={handleChangeTokenFilter} value={tokenFilter}>
            <Radio value={"usdt"}>USDT</Radio>
            <Radio value={"hewe"}>HEWE</Radio>
            <Radio value={"hewedeposit"}>HEWE DEPOSIT</Radio>
            <Radio value={"amc"}>AMC</Radio>
          </Radio.Group>
          <InputAntd
            value={keyword}
            onChange={handleChangeKeyword}
            style={{ maxWidth: "300px" }}
            placeholder="Search..."
          />
        </div>

        <TableAntd
          isShowTitle={true}
          title="History transaction"
          rowKey="id"
          x={x}
          y={y}
          totalItems={totalItems}
          data={data}
          currentPage={currentPage}
          isLoading={loading}
          columns={columns}
          onChangePage={handleSetCurrentPage}
          limit={limitPerRow}
          onChangeLimitPerRow={handleSetLimitPerRow}
        />
      </div>
    </div>
  );
};

export default TransactionMangement;
