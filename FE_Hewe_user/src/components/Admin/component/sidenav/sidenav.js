import React from "react";
import "./sidenav.css";
import { House, ChartBar, Gear, Info, SignOut } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";

const Sidenav = () => {
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("amchain");
    localStorage.removeItem("email");
    // setIsAuthenticated(false);
    history.push("/");
    toast.success("logout successfully");
  };
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };
  return (
    <div className="sidenav">
      <ul>
        <li className={isActive("/admin/dashboard")} onClick={() => history.push("/admin/dashboard")}>
          <House size={32} />
          Dashboard
        </li>
        <li className={isActive("/admin/my-referral")} onClick={() => history.push("/admin/my-referral")}>
          <ChartBar size={32} />
          My Referral
        </li>
        <li className="line"></li>
        <li>
          <Gear size={32} />
          Settings
        </li>
        <li>
          <Info size={32} /> Help
        </li>
        <li onClick={() => logout()}>
          <SignOut size={32} /> Log out
        </li>
      </ul>
    </div>
  );
};

export default Sidenav;
