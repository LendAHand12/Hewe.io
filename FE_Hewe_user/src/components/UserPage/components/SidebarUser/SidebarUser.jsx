import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./SidebarUser.scss";

export function SidebarUser() {
  const [type, setType] = useState(undefined); // ad (admin chính) hoặc mod (admin phụ)
  const { showSidebar, sidebarContent } = useSelector(
    (root) => root.sidebarReducer
  );
  const { user } = useSelector((root) => root.userReducer);
  const dispatch = useDispatch();

  let sidebarHideClass = showSidebar ? "" : "sidebar-hide";

  const hideSideBar = () => {
    if (window.innerWidth < 576) {
      dispatch({
        type: "TOGGLE_SIDEBAR",
      });
    }
  };

  useEffect(() => {
    if (user.id != 1 && user.type != 1) {
      setType("user");
    } else {
      setType(undefined);
    }
  }, [user]);

  if (type === undefined) {
    return <></>;
  }

  return (
    <div className={`sidebar ${sidebarHideClass}`}>
      {/* <NavLink
        exact
        to="/user/buy-token"
        activeClassName="btn-active"
        className="btn"
        onClick={hideSideBar}
      >
        <i class="fa-brands fa-connectdevelop"></i> <span>Buy token</span>
      </NavLink> */}

      <NavLink
        exact
        to="/user/history-buy-token"
        activeClassName="btn-active"
        className="btn"
        onClick={hideSideBar}
      >
        <i class="fa-brands fa-connectdevelop"></i>{" "}
        <span>History buy token</span>
      </NavLink>
    </div>
  );
}
