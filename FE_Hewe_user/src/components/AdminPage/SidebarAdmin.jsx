import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { axiosService } from "../../util/service";

export default function SidebarAdmin() {
  const [showMenu, setShowMenu] = useState(false);

  const [typeAdmin, setTypeAdmin] = useState(undefined); // ad (admin chính) hoặc mod (admin phụ)

  const { showSidebar, sidebarContent } = useSelector(
    (root) => root.sidebarReducer
  );
  const { user } = useSelector((root) => root.userReducer);
  const dispatch = useDispatch();

  const history = useHistory();

  let sidebarHideClass = showSidebar ? "" : "sidebar-hide";

  const hideSideBar = () => {
    if (window.innerWidth < 576) {
      dispatch({
        type: "TOGGLE_SIDEBAR",
      });
    }
  };

  const getContent = async () => {
    try {
      let response = await axiosService.post("api/user/getContent");
      dispatch({
        type: "SIDEBAR_CONTENT",
        payload: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContent();

    const path = history.location.pathname;
    if (
      path == "/admin/content/1" ||
      path == "/admin/content/2" ||
      path == "/admin/content/3" ||
      path == "/admin/content/4"
    ) {
      setShowMenu(true);
    }
  }, []);

  useEffect(() => {
    if (user.id == 1) {
      setTypeAdmin("ad");
    } else if (user.id != 1 && user.type == 1) {
      setTypeAdmin("mod");
    } else {
      setTypeAdmin(undefined);
    }
  }, [user]);

  const toggleMenu = () => {
    setShowMenu((showMenu) => !showMenu);
  };

  if (typeAdmin == undefined) return <></>;

  if (typeAdmin == "ad") {
    return (
      <div className={`sidebar ${sidebarHideClass}`}>
        <NavLink
          exact
          to="/admin/dashboard"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-gear"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/users"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-user"></i>
          <span>Users</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/kyc"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-user-shield"></i>
          <span>KYC</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/running-data"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-person-running"></i>
          <span>Running Data</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/reward-data"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-gift"></i>
          <span>Reward Data</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/transfer"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-money-bill-transfer"></i>
          <span>Transfer</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/withdraw"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-money-bill-transfer"></i>
          <span>Withdraw</span>
        </NavLink>

        <div className="btn btn-special" onClick={() => toggleMenu()}>
          <i className="fa-solid fa-pen-to-square"></i>
          <span>Content</span>
          <i
            className={`fa-solid fa-caret-up menuArrow ${
              showMenu ? "" : "rotate"
            }`}
          ></i>
        </div>

        <div className={`collapse-menu ${showMenu ? "" : "hide"}`}>
          <NavLink
            exact
            to="/admin/content/1"
            className="btn btn-child"
            activeClassName="btn-active"
            onClick={hideSideBar}
          >
            <i className="fa-regular fa-circle"></i>
            <span>{sidebarContent[0]?.title}</span>
          </NavLink>

          <NavLink
            exact
            to="/admin/content/2"
            className="btn btn-child"
            activeClassName="btn-active"
            onClick={hideSideBar}
          >
            <i className="fa-regular fa-circle"></i>
            <span>{sidebarContent[1]?.title}</span>
          </NavLink>

          <NavLink
            exact
            to="/admin/content/3"
            className="btn btn-child"
            activeClassName="btn-active"
            onClick={hideSideBar}
          >
            <i className="fa-regular fa-circle"></i>
            <span>{sidebarContent[2]?.title}</span>
          </NavLink>

          <NavLink
            exact
            to="/admin/content/4"
            className="btn btn-child"
            activeClassName="btn-active"
            onClick={hideSideBar}
          >
            <i className="fa-regular fa-circle"></i>
            <span>{sidebarContent[3]?.title}</span>
          </NavLink>
        </div>

        <NavLink
          exact
          to="/admin/roadmap"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-timeline"></i>
          <span>Roadmap</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/images"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-image"></i>
          <span>Images</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/add-news"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-pen-to-square"></i>
          <span>Add news</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/manage-news"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-book-open-reader"></i>
          <span>All news</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/send-email"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i className="fa-solid fa-envelope"></i>
          <span>Send email</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/banks"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i class="fa-solid fa-building-columns"></i> <span>Banks</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/history-buy-token"
          activeClassName="btn-active"
          className="btn"
          onClick={hideSideBar}
        >
          <i class="fa-solid fa-building-columns"></i>{" "}
          <span>History buy token</span>
        </NavLink>
      </div>
    );
  }

  if (typeAdmin == "mod") {
    // mod kiểm tra content==1 thì show menu content, kyc==1 thì show KYC
    // không show những cái khác
    return (
      <div className={`sidebar ${sidebarHideClass}`}>
        {user.kyc == 1 ? (
          <NavLink
            exact
            to="/admin/kyc"
            activeClassName="btn-active"
            className="btn"
            onClick={hideSideBar}
          >
            <i className="fa-solid fa-user-shield"></i>
            <span>KYC</span>
          </NavLink>
        ) : null}

        {user.content == 1 ? (
          <>
            <div className="btn btn-special" onClick={() => toggleMenu()}>
              <i className="fa-solid fa-pen-to-square"></i>
              <span>Content</span>
              <i
                className={`fa-solid fa-caret-up menuArrow ${
                  showMenu ? "" : "rotate"
                }`}
              ></i>
            </div>

            <div className={`collapse-menu ${showMenu ? "" : "hide"}`}>
              <NavLink
                exact
                to="/admin/content/1"
                className="btn btn-child"
                activeClassName="btn-active"
                onClick={hideSideBar}
              >
                <i className="fa-regular fa-circle"></i>
                <span>{sidebarContent[0]?.title}</span>
              </NavLink>

              <NavLink
                exact
                to="/admin/content/2"
                className="btn btn-child"
                activeClassName="btn-active"
                onClick={hideSideBar}
              >
                <i className="fa-regular fa-circle"></i>
                <span>{sidebarContent[1]?.title}</span>
              </NavLink>

              <NavLink
                exact
                to="/admin/content/3"
                className="btn btn-child"
                activeClassName="btn-active"
                onClick={hideSideBar}
              >
                <i className="fa-regular fa-circle"></i>
                <span>{sidebarContent[2]?.title}</span>
              </NavLink>

              <NavLink
                exact
                to="/admin/content/4"
                className="btn btn-child"
                activeClassName="btn-active"
                onClick={hideSideBar}
              >
                <i className="fa-regular fa-circle"></i>
                <span>{sidebarContent[3]?.title}</span>
              </NavLink>
            </div>

            <NavLink
              exact
              to="/admin/images"
              activeClassName="btn-active"
              className="btn"
              onClick={hideSideBar}
            >
              <i className="fa-solid fa-image"></i>
              <span>Images</span>
            </NavLink>

            <NavLink
              exact
              to="/admin/add-news"
              activeClassName="btn-active"
              className="btn"
              onClick={hideSideBar}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <span>Add news</span>
            </NavLink>

            <NavLink
              exact
              to="/admin/manage-news"
              activeClassName="btn-active"
              className="btn"
              onClick={hideSideBar}
            >
              <i className="fa-solid fa-book-open-reader"></i>
              <span>All news</span>
            </NavLink>

            <NavLink
              exact
              to="/admin/banks"
              activeClassName="btn-active"
              className="btn"
              onClick={hideSideBar}
            >
              <i class="fa-solid fa-building-columns"></i> <span>Banks</span>
            </NavLink>

            <NavLink
              exact
              to="/admin/history-buy-token"
              activeClassName="btn-active"
              className="btn"
              onClick={hideSideBar}
            >
              <i class="fa-solid fa-building-columns"></i>{" "}
              <span>History buy token</span>
            </NavLink>
          </>
        ) : null}
      </div>
    );
  }
}
