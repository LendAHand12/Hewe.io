import { Button, Drawer, Input, message, Modal } from "antd";
import React, { useState } from "react";
import instance from "../../axios";

export default function DrawerChangeBranch({ openDrawer, setOpenDrawer, id, profile }) {
  const [keyword, setKeyword] = useState("");
  const [listUser, setListUser] = useState([]);
  const [modal, contextHolder] = Modal.useModal();

  const hdClose = () => {
    setOpenDrawer(false);
    setKeyword("");
    setListUser([]);
  };

  const handleSearch = async () => {
    if (!keyword || keyword.length < 4) {
      message.error("Vui lòng nhập từ khoá cụ thể hơn");
      return;
    }

    setListUser([]);
    try {
      const res = await instance.post(
        `searchUserByKeyword`,
        {
          keyword,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // loại user hiện tại khỏi kết quả tìm kiếm
      let result = res.data.data.filter((user) => user._id != id);
      if (!result.length) {
        message.warning("Không tìm thấy kết quả nào");
      } else {
        setListUser(result);
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const handleConfirm = async (user) => {
    const confirmed = await modal.confirm({
      title: "Xác nhận đổi người giới thiệu",
      content: (
        <span>
          Người giới thiệu mới cho user <b>{profile?.userData?.name}</b> sẽ là <b>{user?.name}</b>
        </span>
      ),
    });

    if (confirmed) {
      try {
        const res = await instance.post(
          `changeBranch`,
          {
            userId: id,
            newParentId: user._id,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        message.success(res.data.message);
        hdClose(0);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message);
      }
    }
  };

  if (!id || !profile) return null;
  return (
    <>
      {contextHolder}

      <Drawer open={openDrawer} onClose={() => hdClose()} title="Đổi người giới thiệu" destroyOnClose>
        <div>
          <div>User:</div>
          <div>
            * Name: <b>{profile?.userData?.name}</b>
          </div>
          <div>
            * Email: <b>{profile?.userData?.email}</b>
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <div>Người giới thiệu hiện tại:</div>

          {profile?.parentData ? (
            <>
              <div>
                * Name: <b>{profile?.parentData?.name}</b>
              </div>
              <div>
                * Email: <b>{profile?.parentData?.email}</b>
              </div>
            </>
          ) : (
            <>Không có</>
          )}
        </div>

        <div style={{ marginTop: 15 }}>
          <div>Người giới thiệu mới:</div>
          <div style={{ display: "flex", gap: 5 }}>
            <Input placeholder="Search" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <Button onClick={() => handleSearch()}>Search</Button>
          </div>

          <div style={{ marginTop: 15 }}>
            {listUser.map((user) => (
              <div
                key={user._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 5,
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <div>
                  <b>{user.name}</b>
                  <div>{user.email}</div>
                </div>
                <Button onClick={() => handleConfirm(user)}>OK</Button>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
