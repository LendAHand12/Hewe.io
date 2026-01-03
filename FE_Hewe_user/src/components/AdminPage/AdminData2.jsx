import { Button, Input, Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { exportToExcel } from "../../function/exportToExcel";
import { showAlert } from "../../function/showAlert";
import { convertTZtoTimeString } from "../../function/timeFormat";
import { axiosService } from "../../util/service";
import UpdateRewardValue from "./UpdateRewardValue";

const ROWS = 20;

export default function AdminData2() {
  const [data, setData] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  // keyword
  const [tuKhoa, setTuKhoa] = useState("");
  const [searchType, setSearchType] = useState("email"); // tìm theo email hoặc id

  // loading export
  const [loading, setLoading] = useState(false);

  const toHoursAndMinutes = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours >= 10 ? hours : "0" + hours}:${minutes >= 10 ? minutes : "0" + minutes}:${
      seconds >= 10 ? seconds : "0" + seconds
    }`;
  };

  const columns = [
    {
      title: "Email",
      key: "Email",
      dataIndex: "email",
      width: 230,
    },
    {
      title: "Parent Email",
      key: "Parent Email",
      dataIndex: "emailParent",
      width: 230,
    },
    {
      title: "Received Amount",
      key: "Received Amount",
      dataIndex: "amountReceive",
      width: 150,
    },
    {
      title: "Time",
      key: "Time",
      dataIndex: "created_at",
      width: 200,
      render: (time) => convertTZtoTimeString(time),
    },
  ];

  const getData = async (limit, page) => {
    try {
      const response = await axiosService.post("api/admin/getRewardAdmin", {
        limit,
        page,
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getFullData = async () => {
    try {
      const response = await axiosService.post("api/admin/getAllReward");
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const searchData = async (limit, page, keyword) => {
    let url = "";
    if (searchType == "email") {
      url = "api/admin/sreachListReward";
    } else if (searchType == "id") {
      url = "api/admin/sreachListRewardToUserid";
    }

    try {
      const response = await axiosService.post(url, {
        limit,
        page,
        keyWord: keyword, // dùng search bằng email
        userid: keyword, // dùng search bằng id
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  useEffect(() => {
    setCurrent(1);
    getData(ROWS, 1);
  }, []);

  const onPaginationChange = (page) => {
    if (tuKhoa.length > 0) {
      // hiện đang ở trong chế độ tìm kiếm, có từ khoá
      setCurrent(page);
      searchData(ROWS, page, tuKhoa);
    } else {
      // đang ở tất cả list
      setCurrent(page);
      getData(ROWS, page);
    }
  };

  const onSearch = (keyword) => {
    if (keyword !== "") {
      setCurrent(1);
      searchData(ROWS, 1, keyword);
    } else {
      setCurrent(1);
      getData(ROWS, 1);
    }
  };

  const onChange = (e) => {
    const keyword = e.target.value;
    setTuKhoa(keyword);
    if (keyword === "") {
      setCurrent(1);
      getData(ROWS, 1);
    }
  };

  const preProcessData = (data) => {
    let result = [];

    for (let item of data) {
      const obj = {
        userid: item.userid,
        email: item.email,
        parentId: item.parentId,
        parentEmail: item.emailParent,
        amountReceived: item.amountReceive,
        time: convertTZtoTimeString(item.created_at),
      };

      result.push(obj);
    }

    return result;
  };

  const handleExportDataToExcel = async () => {
    try {
      setLoading(true);
      const data = await getFullData();
      exportToExcel(preProcessData(data), "hewe-reward-data");
    } catch (error) {
      console.log(error);
      showAlert("error", "Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UpdateRewardValue />

      <div className="divider" style={{ marginBottom: 50 }}></div>

      <div className="admin-data2">
        <div className="title-area">
          <div style={{ display: "flex", alignContent: "center" }}>
            <h2 className="title">Reward data</h2>
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={() => handleExportDataToExcel()}
              loading={loading}
            >
              Export
            </Button>
          </div>

          <Input.Search
            placeholder={searchType == "id" ? "Search by ID" : "Search by email"}
            className="search-box"
            allowClear
            onSearch={onSearch}
            onChange={onChange}
            prefix={
              <div>
                <Button
                  type={searchType == "email" ? "primary" : "text"}
                  size="small"
                  onClick={() => setSearchType("email")}
                >
                  Email
                </Button>
                <Button type={searchType == "id" ? "primary" : "text"} size="small" onClick={() => setSearchType("id")}>
                  ID
                </Button>
              </div>
            }
          />

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
            pageSize={20}
          />
        </div>

        <Table
          size="small"
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{
            x: 810,
          }}
        />
      </div>
    </>
  );
}
