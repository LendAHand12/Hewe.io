import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router-dom";

import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";

export default function AdminTemplate(props) {
  const { showSidebar } = useSelector((root) => root.sidebarReducer);
  const dispatch = useDispatch();

  let componentExpandClass = showSidebar ? "" : "component-expand";

  let Component = props.component;

  const toggleSidebar = () => {
    dispatch({
      type: "TOGGLE_SIDEBAR",
    });
  };

  if (window.innerWidth < 576) {
    // mobile
    return (
      <Route
        exact
        path={props.path}
        render={(propsRoute) => {
          return (
            <div className="admin-template">
              <NavbarAdmin history={props.history} {...propsRoute} />
              <SidebarAdmin history={props.history} {...propsRoute} />

              {showSidebar ? (
                <div className="overlay" onClick={toggleSidebar}></div>
              ) : (
                <div className="component-fullwidth-mobile">
                  <Component {...propsRoute} />
                </div>
              )}
            </div>
          );
        }}
      />
    );
  } else {
    // desktop
    return (
      <Route
        exact
        path={props.path}
        render={(propsRoute) => {
          return (
            <div className="admin-template">
              <NavbarAdmin history={props.history} {...propsRoute} />
              <SidebarAdmin history={props.history} {...propsRoute} />
              <div className={`component ${componentExpandClass}`}>
                <Component {...propsRoute} />
              </div>
            </div>
          );
        }}
      />
    );
  }
}
