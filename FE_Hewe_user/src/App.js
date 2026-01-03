import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";

import { useSelector } from "react-redux";

import { Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "./components";
import TermPageV2 from "./components/TermPageV2/TermPageV2.jsx";
import BuyTokenPage from "./components/Admin/BuyTokenPage/BuyTokenPage.js";
import { Commission } from "./components/Admin/Commission/Commission";
import DashBoardPage from "./components/Admin/DashBoardPage/DashBoardPage";
import HeweDBPage from "./components/Admin/HeweDB/HeweDBPage.jsx";
import ReferralPage from "./components/Admin/ReferralPage/referral";
import { SwapHewe } from "./components/Admin/SwapHewe/SwapHewe";
import SwapTokenPage from "./components/Admin/SwapTokenPage/SwapTokenPage";
import { WalletUSDT } from "./components/Admin/WalletUSDT/WalletUSDT";
import { WithdrawHewe } from "./components/Admin/WithdrawHewe/WithdrawHewe";
import { WithdrawUSDT } from "./components/Admin/WithdrawUSDT/WithdrawUSDT";
import HowToBuy from "./components/coins/coins";
import NewSwap from "./components/NewSwap/NewSwap.js";
import Contactus from "./components/Contact_us/Contactus";
import ForgetPasswordVerifyOtp from "./components/ForgetVerifyOtp/VerifyOtp";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/LoginPage/LoginPage";
import News from "./components/news_section/News";
import NewsDetails from "./components/newsDetials/NewsDetails";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Roadmap from "./components/roadmap/roadmap";
import Signup from "./components/SignupPage/SignupPage";
import SwapPage from "./components/Swap/SwapPage";
import Team from "./components/Team/Team";
import PrivacyPage from "./components/TermPage/PrivacyPage";
import TermPage from "./components/TermPage/TermPage";
import Tokenomics from "./components/Tokenomics/Tokenomics";
import TokenPage from "./components/TokenPage/TokenPage";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import VerifyOtp from "./components/VerifyOtp/VerifyOtp";
import { useUpdateWalletAddress } from "./components/WalletUSDTPage/components/DepositContent/hooks/useUpdateWalletAddress";
import WhitePaper from "./components/WhitePaper/WhitePaper";
import { getProfileAPI } from "./services/userService";
import { axiosService } from "./util/service";
import { ChartPage } from "./components/Admin/ChartPage/ChartPage.jsx";
import { ChartPageAMC } from "./components/Admin/ChartPageAMC/ChartPageAMC.jsx";

const UserRoute = () => {
  const { user } = useSelector((root) => root.userReducer);
  const [data, setData] = useState([]);
  const [code, setCode] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosService.get("/getAllReferrals");
        setData(res?.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const url = window.location.href;
    localStorage.setItem("linkDetails", JSON.stringify({ url, metadata: {} }));

    const linkDetails = JSON.parse(localStorage.getItem("linkDetails"));

    const regex = /ref=([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    if (match) {
      const value = match[1];
      setCode(value);
      console.log(value); // Output: 0F72E80
    } else {
      console.log("No match found");
    }
  }, []); // Empty dependency array ensures this useEffect only runs once on component mount

  const matchReferralCode = () => {
    return data.some((item) => item.referralCode === code);
  };

  useEffect(() => {
    console.log(matchReferralCode());
  }, [data, code]);

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("user")) {
      getProfileAPI()
        .then((res) => {
          dispatch({ type: "SET_PROFILE", payload: res.data.data });
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        });
    }
  }, []);
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={"/home"} component={HomePage} />
        {matchReferralCode() ? (
          <Route exact path="/ref=:code" component={Signup} />
        ) : null}
        {/* <Route exact path={"/adminpanel"} component={LoginPage} /> */}
        <Route exact path={"/login"} component={LoginPage} />
        <Route exact path={"/signup"} component={Signup} />
        <Route exact path={"/reset-password"} component={ForgotPassword} />
        <Route exact path={"/signup/:refCode"} component={Signup} />
        <Route exact path={"/term"} component={TermPage} />
        {/* <Route exact path={"/termV2"} component={TermPageV2} /> */}
        <Route exact path={"/privacy"} component={PrivacyPage} />
        <Route exact path={"/whitepaper"} component={WhitePaper} />
        <Route exact path={"/token"} component={TokenPage} />
        <Route exact path={"/swap"} component={SwapPage} />
        <Route exact path={"/"} component={HomePage} />
        <Route exact path={"/verifyOtp"} component={VerifyOtp} />
        <Route exact path={"/how-to-buy"} component={HowToBuy} />
        <Route
          exact
          path={"/forgetverifyOtp"}
          component={ForgetPasswordVerifyOtp}
        />
        <Route exact path={"/verifyEmail"} component={VerifyEmail} />
        <Route exact path={"/adminDashboard"} component={DashBoardPage} />
        {/* <Route exact path={"/adminReferral"} component={ReferralPage} /> */}
        <Route exact path={"/depositUSDT"} component={WalletUSDT} />

        <Route exact path={"/withdrawUSDT"} component={WithdrawUSDT} />
        <Route exact path={"/withdrawToken"} component={WithdrawHewe} />
        <Route exact path={"/hewedb"} component={HeweDBPage} />
        <Route exact path={"/commission"} component={Commission} />
        <Route exact path={"/swapHewe"} component={SwapHewe} />
        <Route exact path={"/chart"} component={ChartPage} />
        <Route exact path={"/chartAMC"} component={ChartPageAMC} />
        <Route exact path={"/adminBuyToken"} component={BuyTokenPage} />
        <Route exact path={"/adminSwapToken"} component={SwapTokenPage} />
        <Route exact path={"/resetPassword"} component={ResetPassword} />
        <Route exact path={"/tokenomics"} component={Tokenomics} />
        <Route exact path={"/contactus"} component={Contactus} />
        <Route exact path={"/our-team"} component={Team} />
        <Route exact path={"/swapV3"} component={NewSwap} />
        <Route exact path={"/road-map"} component={Roadmap} />
        <Route exact path={"/news"} component={News} />
        <Route exact path={"/news-details/:id"} component={NewsDetails} />
      </Switch>
    </BrowserRouter>
  );
};

function App() {
  const {
    isOpen,
    isPendingUpdate,
    isDisabledBtnUpdate,
    addressWallet,
    handleCloseModal,
    handleChangeAddressWallet,
    handleRequestUpgradeAddress,
  } = useUpdateWalletAddress();
  return (
    <>
      <UserRoute />
      <ToastContainer />
      <Modal
        title="Update your main wallet address to receive commissions"
        isOpen={isOpen}
        onCancel={handleCloseModal}
        onConfirm={handleRequestUpgradeAddress}
        isDisabledBtn={isDisabledBtnUpdate}
      >
        <Input
          value={addressWallet}
          onChange={handleChangeAddressWallet}
          size="large"
        />
      </Modal>
    </>
  );
}

export default App;
