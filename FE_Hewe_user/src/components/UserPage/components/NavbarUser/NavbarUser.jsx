import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
import "./NavbarUser.scss";

export function NavbarUser({ history }) {
  const dispatch = useDispatch();

  const signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({
      type: "USER_LOGOUT",
    });
    history.push("/login");
  };

  if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
    return <Redirect to="/login" />;
  } else {
    // đã đăng nhập
    const x = JSON.parse(localStorage.getItem("user"));
    if (x.id == 1 || x.type == 1) {
      return <Redirect to="/admin" />;
    }
  }

  return (
    <div className="navbar">
      <div className="logo">
        <i
          className="fa-solid fa-bars"
          onClick={() => {
            dispatch({
              type: "TOGGLE_SIDEBAR",
            });
          }}
        ></i>

        <img src="/img/logo.svg" />
      </div>

      <div className="action" onClick={signOut}>
        <Tooltip title="Log out" showArrow={false}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </Tooltip>
      </div>
    </div>
  );
}
