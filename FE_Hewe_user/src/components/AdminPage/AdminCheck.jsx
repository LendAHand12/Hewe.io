import React from "react";
import { Redirect } from "react-router-dom";

// user đăng nhập có id==1 -> admin chính
// user đăng nhập có id != 1 nhưng type==1 -> admin phụ

export default function AdminCheck() {
  if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
    // nếu chưa đăng nhập
    return <Redirect to="/login" />;
  } else {
    // đã đăng nhập
    const x = JSON.parse(localStorage.getItem("user"));

    if (x.id != 1 && x.type == 1) {
      // admin phụ -> ở lại trang trắng này chờ nhấn vô menu bên sidebar mới đi tiếp
    } else if (x.id == 1) {
      // admin chính -> chuyển đến /admin/dashboard để quản lý
      return <Redirect to="/admin/dashboard" />;
    } else {
      return <Redirect to="/" />;
    }
  }

  return <></>;
}
