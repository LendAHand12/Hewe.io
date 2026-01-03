import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Image, Modal, Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { showAlert } from "../../function/showAlert";
import { ROW_PER_TABLE } from "../../constant/constant";
import { axiosService, DOMAIN } from "../../util/service";

export default function ManagePost() {
  const [postsArray, setPostsArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const { user } = useSelector((root) => root.userReducer);

  const history = useHistory();

  const getPosts = async (limit, page) => {
    const API = "api/news/getPosts";

    try {
      let response = await axiosService.post(API, {
        limit: limit.toString(),
        page: page.toString(),
      });
      setPostsArray(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id) => {
    try {
      let response = await axiosService.post("api/news/detelePosts", {
        idPost: id.toString(),
      });
      showAlert("success", response.data.message);
      getPosts(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const confirmDelete = (item) => {
    Modal.confirm({
      title: "Confirm",
      icon: <QuestionCircleFilled />,
      content: (
        <span>
          Are you sure that you want to delete the post <b>{item.title}</b>?
        </span>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        deletePost(item.id);
      },
    });
  };

  const columns = [
    {
      title: "Menu",
      key: "Menu",
      dataIndex: "titleMenu",
      width: 220,
    },
    {
      title: "Title",
      key: "Tiêu đề",
      dataIndex: "title",
      width: 400,
    },
    {
      title: "URL",
      key: "URL",
      dataIndex: "url",
      width: 350,
    },
    {
      title: "Author",
      key: "Tác giả",
      dataIndex: "userName",
      width: 150,
    },
    {
      title: "Image",
      key: "Hình ảnh",
      render: (_, record) => {
        return <Image src={DOMAIN + record.image} height={50} />;
      },
      width: 150,
    },
    {
      title: "Time",
      key: "Thời gian tạo",
      dataIndex: "created_at",
      width: 220,
    },
    {
      title: "Action",
      key: "Action",
      render: (_, item) => {
        return (
          <>
            <Button size="small" onClick={() => window.open(DOMAIN + item.urlMenu + "/" + item.id + "/" + item.url)}>
              View
            </Button>
            <Button size="small" onClick={() => history.push("/admin/edit-news/" + item.id)} style={{ marginLeft: 8 }}>
              Edit
            </Button>
            <Button size="small" danger onClick={() => confirmDelete(item)} style={{ marginLeft: 8 }}>
              Delete
            </Button>
          </>
        );
      },
      width: 220,
    },
  ];

  const onPaginationChange = (page) => {
    setCurrent(page);
    getPosts(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    setCurrent(1);
    getPosts(ROW_PER_TABLE, 1);
  }, []);

  return (
    <div className="admin-posts">
      <div className="title-area">
        <h2 className="title">All news</h2>

        <Pagination
          defaultCurrent={1}
          total={totalRecord}
          current={current}
          onChange={onPaginationChange}
          showSizeChanger={false}
          showQuickJumper={false}
          className="pagination-box"
        />
      </div>

      <Table
        columns={columns}
        dataSource={postsArray}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ x: 1300 }}
      />
    </div>
  );
}
