import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LoginSection from "./components/LoginSection";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SidebarHaydii/Sidebar";
import "./index.css";

import { connect } from "react-redux";
import { withRouter } from "react-router";
import UserManagement from "../src/pages/User Management/UserManagement";
import BuyHeweByUSDT from "./pages/BuyHeweByUSDT/BuyHeweByUSDT";
import BuyHeweByVND from "./pages/BuyHeweByVND/BuyHeweByVND";
import Commission from "./pages/Commission/Commission";
import Contact from "./pages/Contact/Contact";
import DepositUSDT from "./pages/DepositUSDT/DepositUSDT";
import NewHeweDB from "./pages/NewHeweDB/NewHeweDB";
import NewsManagement from "./pages/NewsManagement/NewsManagement";
import SubadminManagement from "./pages/SubAdmin Management/SubadminManagement";
import SwapUSDTToHewe from "./pages/SwapUSDTToHewe/SwapUSDTToHewe";
import TransactionMangement from "./pages/Transaction Management/TransactionManagement";
import Referral from "./pages/User Management/Referral";
import Transactions from "./pages/User Management/Transactions";
import UserTransactions from "./pages/User Management/UserTransactions";
import WithdrawAMC from "./pages/WithdrawHewe/WithdrawAMC";
import WithdrawHewe from "./pages/WithdrawHewe/WithdrawHewe";
import WithdrawUSDT from "./pages/WithdrawUSDT/WithdrawUSDT";
import * as actionTypes from "./store/actions";
import UserDetail from "./pages/UserDetail/UserDetail";
import axios from "./axios";
import Revenue from "./pages/Revenue/Revenue";
import DepositAMC from "./pages/DepositAMC/DepositAMC";
import Pool from "./pages/Pool/Pool";
import HistoryUpdateAddress from "./pages/HistoryUpdateAddress/HistoryUpdateAddress";
import DepositHEWE from "./pages/DepositHEWE/DepositHEWE";
import { useGetModulesOfAdmin } from "./hooks/useGetModulesOfAdmin";
import { SidebarData } from "./components/SidebarHaydii/SidebarData";
import GetListUpdateHeweDBPage from "./pages/NewHeweDB/GetListUpdateHeweDB";
import AdminProfile from "./pages/AdminProfile";
const PublicRoute = (props) => {
  const { defaultState, setDefaultState } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Switch>
      <Route path="/adminPanel" exact>
        <LoginSection {...defaultState} />
      </Route>
      <Route path="/">
        <Redirect to="/adminPanel" />
      </Route>
    </Switch>
  );
};

const PrivateRoute = (props) => {
  const { defaultState, setDefaultState, userData } = props;
  const [sidebarShow, setSidebarShow] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const getSidebar = (sidebarShow) => {
    setSidebarShow(sidebarShow);
  };
  const { isLoading, modules, handleGetModulesOfAdmin } =
    useGetModulesOfAdmin();
  const [r, setR] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    handleGetModulesOfAdmin(token);
  }, []);

  const renderRoute = () => {
    const routes = [];

    modules.forEach((m) => {
      if (m.access_module === "User Management") {
        routes.push(
          <Route path="/adminPanel/user-management" exact>
            <Navbar toggle={toggle} getSidebar={getSidebar} />
            {sidebarShow && <Sidebar />}
            <UserManagement />
          </Route>
        );
        routes.push(
          <Route path="/adminPanel/getListUpdateHeweDB" exact>
            <Navbar toggle={toggle} getSidebar={getSidebar} />
            {sidebarShow && <Sidebar />}
            <GetListUpdateHeweDBPage />
          </Route>
        );

        routes.push(
          <Route path="/adminPanel/user-management/:id" exact>
            <Navbar toggle={toggle} getSidebar={getSidebar} />
            {sidebarShow && <Sidebar />}
            <UserDetail />
          </Route>
        );

        routes.push(
          <Route path="/adminPanel/user-management/referrals">
            <Navbar toggle={toggle} getSidebar={getSidebar} />

            {sidebarShow && <Sidebar />}

            <Referral />
          </Route>
        );

        routes.push(
          <Route path="/adminPanel/user-management/transactions">
            <Navbar toggle={toggle} getSidebar={getSidebar} />

            {sidebarShow && <Sidebar />}

            <Transactions />
          </Route>
        );

        routes.push(
          <Route path="/adminPanel/user-management/referralsTransactions">
            <Navbar toggle={toggle} getSidebar={getSidebar} />

            {sidebarShow && <Sidebar />}

            <UserTransactions />
          </Route>
        );
      }

      const routeExisted = SidebarData.find((d) => d.title === m.access_module);

      if (routeExisted) {
        routes.push(
          <Route path={routeExisted.path} exact>
            <Navbar toggle={toggle} getSidebar={getSidebar} />
            {sidebarShow && <Sidebar />}
            {routeExisted.component}
          </Route>
        );
      }
    });

    // do not remove this route
    routes.push(
      <>
        <Route path="/adminPanel/profile" exact>
          <Navbar toggle={toggle} getSidebar={getSidebar} />
          {sidebarShow && <Sidebar />}
          <AdminProfile />
        </Route>

        <Route path="/adminPanel/history-update-address">
          <Navbar toggle={toggle} getSidebar={getSidebar} />

          {sidebarShow && <Sidebar />}

          <HistoryUpdateAddress />
        </Route>

        <Route exact path="/adminPanel">
          <LoginSection {...defaultState} />
        </Route>

        <Route path="/">
          <Redirect to="/adminPanel" />
        </Route>
      </>
    );

    setR(routes);
  };

  console.log("=>>>>>>>>>>>>>>>> sidebarShow", sidebarShow);

  useEffect(() => {
    renderRoute();
  }, [modules, sidebarShow]);

  return (
    <Switch>
      {r}
      {/* <Route path="/adminPanel/user-management" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <UserManagement />
      </Route>
      <Route path="/adminPanel/user-management/:id" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <UserDetail />
      </Route>
      <Route path="/adminPanel/subadmin-management" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <SubadminManagement />
      </Route>
      <Route path="/adminPanel/buy-hewe-by-vnd" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <BuyHeweByVND />
      </Route>
      <Route path="/adminPanel/withdraw-hewe" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <WithdrawHewe />
      </Route>
      <Route path="/adminPanel/withdraw-amc" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <WithdrawAMC />
      </Route>
      <Route path="/adminPanel/swap-usdt-to-hewe" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <SwapUSDTToHewe />
      </Route>
      <Route path="/adminPanel/deposit-usdt" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <DepositUSDT />
      </Route>
      <Route path="/adminPanel/deposit-amc" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <DepositAMC />
      </Route>
      <Route path="/adminPanel/deposit-hewe" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <DepositHEWE />
      </Route>
      <Route path="/adminPanel/withdraw-usdt" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <WithdrawUSDT />
      </Route>
      <Route path="/adminPanel/buy-hewe-by-usdt" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <BuyHeweByUSDT />
      </Route>
      <Route path="/adminPanel/commission" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <Commission />
      </Route>
      <Route path="/adminPanel/hewe-db" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <NewHeweDB />
      </Route>
      <Route path="/adminPanel/support-ticket" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <Contact />
      </Route>
      <Route path="/adminPanel/history-update-balance" exact>
        <Navbar toggle={toggle} getSidebar={getSidebar} />
        {sidebarShow && <Sidebar />}
        <TransactionMangement />
      </Route>
      <Route path="/adminPanel/user-management/referrals">
        <Navbar toggle={toggle} getSidebar={getSidebar} />

        {sidebarShow && <Sidebar />}

        <Referral />
      </Route>
      <Route path="/adminPanel/user-management/transactions">
        <Navbar toggle={toggle} getSidebar={getSidebar} />

        {sidebarShow && <Sidebar />}

        <Transactions />
      </Route>

      <Route path="/adminPanel/user-management/referralsTransactions">
        <Navbar toggle={toggle} getSidebar={getSidebar} />

        {sidebarShow && <Sidebar />}

        <UserTransactions />
      </Route>
      <Route path="/adminPanel/news-management">
        <Navbar toggle={toggle} getSidebar={getSidebar} />

        {sidebarShow && <Sidebar />}

        <NewsManagement />
      </Route>

      <Route path="/adminPanel/revenue">
        <Navbar toggle={toggle} getSidebar={getSidebar} />

        {sidebarShow && <Sidebar />}

        <Revenue />
      </Route>

      <Route path="/adminPanel/pool">
        <Navbar toggle={toggle} getSidebar={getSidebar} />

        {sidebarShow && <Sidebar />}

        <Pool />
      </Route>

      <Route path="/adminPanel/history-update-address">
        <Navbar toggle={toggle} getSidebar={getSidebar} />

        {sidebarShow && <Sidebar />}

        <HistoryUpdateAddress />
      </Route>

      <Route exact path="/adminPanel">
        <LoginSection {...defaultState} />
      </Route>

      <Route path="/">
        <Redirect to="/adminPanel" />
      </Route> */}
    </Switch>
  );
};

function App(props) {
  const { defaultState, setDefaultState, userData } = props;
  const history = useHistory();
  const [userToken, setUserToken] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const { data } = await axios.get(`/getModulesOfAdmin?email=${email}`, {
          headers: {
            Authorization: token || "",
          },
        });
      } catch (err) {
        const token = localStorage.getItem("token");

        if (token) {
          if (err.response.status == 401) {
            localStorage.clear();
            window.location.reload();
          }
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {token ? <PrivateRoute /> : <PublicRoute />}
      <ToastContainer theme="colored" />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    locationData: state.locations,
    defaultState: state.defaultState,
    userData: state.userData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setUsers: (updatedValue) => {
      dispatch({
        type: actionTypes.UPDATE_USER,
        updatedUser: updatedValue,
      });
    },
    setLocations: (updatedValue) => {
      dispatch({
        type: actionTypes.GET_LOCATIONS,
        locationData: updatedValue,
      });
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
