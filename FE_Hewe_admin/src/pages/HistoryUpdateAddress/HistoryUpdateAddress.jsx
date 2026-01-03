import React from "react";
import "./HistoryUpdateAddress.scss";
import { useHistoryUpdateAddress } from "./useHistoryUpdateAddress";
import { Table } from "../../components/AntdComponent";
import { Input } from "antd";

export default function HistoryUpdateAddress() {
  const {
    x,
    y,
    totalItems,
    currentPage,
    data,
    loading,
    columns,
    limitPerRow,
    keyword,
    handleChangeKeyword,
    handleSetCurrentPage,
    handleSetLimitPerRow,
  } = useHistoryUpdateAddress();

  return (
    <div className="HistoryUpdateAddress">
      <h4>History update address</h4>

      <div style={{ marginTop: 50 }}></div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Input
          value={keyword}
          onChange={handleChangeKeyword}
          style={{ maxWidth: "300px" }}
          placeholder="Search..."
        />
      </div>

      <Table
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
  );
}
