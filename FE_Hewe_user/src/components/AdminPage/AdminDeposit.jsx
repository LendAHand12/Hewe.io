import { Input, Pagination, Table } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { ROW_PER_TABLE } from "../../constant/constant";
import { axiosService } from "../../util/service";

const { Search } = Input;

export default function AdminDeposit() {
  const [data, setData] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  async function getDepositHistory(limit, page) {
    try {
      const response = await axiosService.post("api/crypto/getHistoryDepositAdmin", {
        limit: limit.toString(),
        page: page.toString(),
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  }

  const onPaginationChange = (page) => {
    setCurrent(page);
    getDepositHistory(ROW_PER_TABLE, page);
  };

  const columns = [];

  useEffect(() => {
    setCurrent(1);
    getDepositHistory(ROW_PER_TABLE, 1);
  }, []);

  return (
    <div className="admin-deposit">
      <div className="title-area">
        <h2 className="title">Deposit</h2>

        <Search
          placeholder="Search"
          className="search-box"
          allowClear
          // onSearch={onSearch}
          // onChange={onChange}
        />

        <Pagination
          defaultCurrent={1}
          total={totalRecord}
          current={current}
          onChange={onPaginationChange}
          showSizeChanger={false}
          showQuickJumper={false}
          showLessItems={true}
          className="pagination-box"
        />
      </div>

      <Table columns={columns} dataSource={data} rowKey={(record) => record.id} pagination={false} />
    </div>
  );
}
