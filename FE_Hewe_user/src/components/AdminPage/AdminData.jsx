import { Button, Input, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { exportToExcel } from "../../function/exportToExcel";
import { showAlert } from "../../function/showAlert";
import { convertTZtoTimeString } from "../../function/timeFormat";
import { axiosService } from "../../util/service";

const ROWS = 20;

export default function AdminData() {
  const [data, setData] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  // keyword
  const [tuKhoa, setTuKhoa] = useState("");

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
      title: "Status",
      key: "Status",
      render: (_, { run }) => {
        if (run === 0) return <Tag color="green">Running</Tag>;
        else if (run === 1) return <Tag color="blue">Finished</Tag>;
      },
      width: 100,
    },
    {
      title: "Start Coordinates",
      key: "Start Coordinates",
      render: (_, { latitudeStart, longitudeStart }) => {
        // toạ độ bắt đầu luôn luôn có
        return (
          <div>
            <div>
              <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "grey", marginRight: 5 }}>x:</span>
              {latitudeStart}
            </div>
            <div>
              <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "grey", marginRight: 5 }}>y:</span>
              {longitudeStart}
            </div>
          </div>
        );
      },
      width: 200,
    },
    {
      title: "End Coordinates",
      key: "End Coordinates",
      render: (_, { latitudeEnd, longitudeEnd, run }) => {
        // toạ độ kết thúc phải chạy xong (run === 1) mới có
        if (run === 1)
          return (
            <div>
              <div>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "grey", marginRight: 5 }}>x:</span>
                {latitudeEnd}
              </div>
              <div>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "grey", marginRight: 5 }}>y:</span>
                {longitudeEnd}
              </div>
            </div>
          );
        else return <>-</>;
      },
      width: 200,
    },
    {
      title: "Distance",
      key: "Distance",
      render: (_, { run, ran }) => {
        if (run === 1) {
          // chạy xong
          return ran + " km";
        } else return <>-</>;
      },
      width: 130,
    },
    {
      title: "Total Time",
      key: "Total Time",
      render: (_, { run, created_time_start, created_time_end }) => {
        if (run === 1) {
          // chạy xong
          return toHoursAndMinutes(created_time_end - created_time_start);
        } else return <>-</>;
      },
      width: 130,
    },
    {
      title: "Time Start",
      key: "Time Start",
      dataIndex: "created_at",
      width: 200,
      render: (time) => convertTZtoTimeString(time),
    },
  ];

  const getData = async (limit, page) => {
    try {
      const response = await axiosService.post("api/admin/getListRun", {
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
      const response = await axiosService.post("api/admin/getAllListRun");
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const searchData = async (limit, page, keyword) => {
    try {
      const response = await axiosService.post("api/admin/sreachListRun", {
        limit,
        page,
        keyWord: keyword,
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
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
        id: item.id,
        userid: item.userid,
        email: item.email,
        status: item.run === 0 ? "running" : "finished",
        startLatitude: item.latitudeStart,
        startLongitude: item.longitudeStart,
        endLatitude: item.run === 0 ? "" : item.latitudeEnd,
        endLongitude: item.run === 0 ? "" : item.longitudeEnd,
        distance: item.run === 0 ? "" : item.ran,
        totalTime: item.run === 0 ? "" : toHoursAndMinutes(item.created_time_end - item.created_time_start),
        timeStart: item.created_time_start.toString(),
        timeEnd: item.run === 0 ? "" : item.created_time_end.toString(),
      };

      result.push(obj);
    }

    return result;
  };

  const handleExportDataToExcel = async () => {
    try {
      setLoading(true);
      const data = await getFullData();
      exportToExcel(preProcessData(data), "hewe-running-data");
    } catch (error) {
      console.log(error);
      showAlert("error", "Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-data">
      <div className="title-area">
        <div style={{ display: "flex", alignContent: "center" }}>
          <h2 className="title">Running data</h2>
          <Button type="primary" style={{ marginLeft: 10 }} onClick={() => handleExportDataToExcel()} loading={loading}>
            Export
          </Button>
        </div>

        <Input.Search placeholder="Search" className="search-box" allowClear onSearch={onSearch} onChange={onChange} />

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
          x: 1200,
        }}
      />
    </div>
  );
}
