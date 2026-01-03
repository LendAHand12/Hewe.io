import "./Swap2025.scss";
import { useSwap2025 } from "./useSwap2025";
import { Input as InputAntd, Radio, Modal, Button } from "antd";
import { Table as TableAntd } from "../../components/AntdComponent";

const Swap2025 = () => {
  const {
    type,
    keyword,
    totalItems,
    currentPage,
    data,
    loading,
    columns,
    limitPerRow,
    handleChangeType,
    handleChangeKeyword,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    approveModal,
    setApproveModal,
    transactionHash,
    setTransactionHash,
    handleMarkTransaction,
  } = useSwap2025();

  return (
    <div className="Swap2025">
      <h4 className="titleContainer">Swap 2025</h4>

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
          <Radio.Group onChange={handleChangeType} value={type}>
            <Radio value="USDT(BEP20)=>AMC(AMC20)">
              USDT(BEP20)={'>'}AMC(AMC20)
            </Radio>
            <Radio value="AMC(AMC20)=>AMC(BEP20)">AMC(AMC20)={'>'}AMC(BEP20)</Radio>
          </Radio.Group>
          <InputAntd
            value={keyword}
            onChange={handleChangeKeyword}
            style={{ maxWidth: "300px" }}
            placeholder="Search by wallet address or transaction hash..."
          />
        </div>

        <TableAntd
          isShowTitle={true}
          title="Swap History"
          rowKey="id"
          totalItems={totalItems}
          data={data}
          currentPage={currentPage}
          isLoading={loading}
          columns={columns}
          onChangePage={handleSetCurrentPage}
          limit={limitPerRow}
          onChangeLimitPerRow={handleSetLimitPerRow}
        />

        {/* Modal for Transaction Hash input when approving (second tab only) */}
        {type === "AMC(AMC20)=>AMC(BEP20)" && approveModal.visible && (
          <Modal
            title="Approve Transaction"
            open={approveModal.visible}
            onCancel={() => {
              setApproveModal({ visible: false, record: null });
              setTransactionHash("");
            }}
            onOk={() => handleMarkTransaction(approveModal.record._id, "approve", transactionHash)}
            okText="Approve"
            cancelText="Cancel"
          >
            <div style={{ marginBottom: 8 }}>Transaction Hash (BEP20):</div>
            <InputAntd
              value={transactionHash}
              onChange={e => setTransactionHash(e.target.value)}
              placeholder="Enter BEP20 transaction hash"
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Swap2025;
