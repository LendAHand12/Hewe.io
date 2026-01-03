import React from "react";
import { FaRegNewspaper } from "react-icons/fa";
import UserManagement from "../../pages/User Management/UserManagement";
import TransactionMangement from "../../pages/Transaction Management/TransactionManagement";
import NewsManagement from "../../pages/NewsManagement/NewsManagement";
import Swap2025 from "../../pages/Swap2025/Swap2025";
import Contact from "../../pages/Contact/Contact";
import SubadminManagement from "../../pages/SubAdmin Management/SubadminManagement";
import BuyHeweByVND from "../../pages/BuyHeweByVND/BuyHeweByVND";
import SwapUSDTToHewe from "../../pages/SwapUSDTToHewe/SwapUSDTToHewe";
import DepositUSDT from "../../pages/DepositUSDT/DepositUSDT";
import DepositHEWE from "../../pages/DepositHEWE/DepositHEWE";
import DepositAMC from "../../pages/DepositAMC/DepositAMC";
import WithdrawUSDT from "../../pages/WithdrawUSDT/WithdrawUSDT";
import WithdrawHewe from "../../pages/WithdrawHewe/WithdrawHewe";
import WithdrawAMC from "../../pages/WithdrawHewe/WithdrawAMC";
import BuyHeweByUSDT from "../../pages/BuyHeweByUSDT/BuyHeweByUSDT";
import Commission from "../../pages/Commission/Commission";
import NewHeweDB from "../../pages/NewHeweDB/NewHeweDB";
import Revenue from "../../pages/Revenue/Revenue";
import Pool from "../../pages/Pool/Pool";

export const SidebarData = [
  {
    title: "User Management",
    path: "/adminPanel/user-management",
    icon: <i class="fa-solid fa-users"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <UserManagement />,
  },
  {
    title: "History Update Balance",
    path: "/adminPanel/history-update-balance",
    icon: <i class="fa-solid fa-hand-holding-dollar"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <TransactionMangement />,
  },
  {
    title: "Swap 2025",
    path: "/adminPanel/swap-2025",
    icon: <i class="fa-solid fa-hand-holding-dollar"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <Swap2025 />,
  },
  {
    title: "News Management",
    path: "/adminPanel/news-management",
    icon: <FaRegNewspaper />,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <NewsManagement />,
  },
  {
    title: "Support Ticket",
    path: "/adminPanel/support-ticket",
    icon: <i class="fa-solid fa-address-book"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <Contact />,
  },

  {
    title: "SubAdmin Management",
    path: "/adminPanel/subadmin-management",
    icon: <i class="fa-solid fa-user-tie"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <SubadminManagement />,
  },

  {
    title: "Buy HEWE by VND",
    path: "/adminPanel/buy-hewe-by-vnd",
    icon: <i class="fa-solid fa-money-bill"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <BuyHeweByVND />,
  },

  {
    title: "Buy Token",
    path: "/adminPanel/swap-usdt-to-hewe",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <SwapUSDTToHewe />,
  },

  {
    title: "Deposit USDT",
    path: "/adminPanel/deposit-usdt",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <DepositUSDT />,
  },
  {
    title: "Deposit HEWE",
    path: "/adminPanel/deposit-hewe",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <DepositHEWE />,
  },
  {
    title: "Deposit AMC",
    path: "/adminPanel/deposit-amc",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <DepositAMC />,
  },
  {
    title: "Withdraw USDT",
    path: "/adminPanel/withdraw-usdt",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <WithdrawUSDT />,
  },
  {
    title: "Withdraw HEWE",
    path: "/adminPanel/withdraw-hewe",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <WithdrawHewe />,
  },
  {
    title: "Withdraw AMC",
    path: "/adminPanel/withdraw-amc",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <WithdrawAMC />,
  },
  {
    title: "Buy HEWE by USDT",
    path: "/adminPanel/buy-hewe-by-usdt",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <BuyHeweByUSDT />,
  },
  {
    title: "Commission",
    path: "/adminPanel/commission",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <Commission />,
  },
  {
    title: "HEWE DB",
    path: "/adminPanel/hewe-db",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <NewHeweDB />,
  },
  {
    title: "Revenue",
    path: "/adminPanel/revenue",
    icon: <i class="fa-solid fa-wallet"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <Revenue />,
  },
  {
    title: "Pool",
    path: "/adminPanel/pool",
    icon: <i class="fa-solid fa-money-bill-transfer"></i>,
    sideicon: <i class="fa-solid fa-arrow-right"></i>,
    component: <Pool />,
  },
];
