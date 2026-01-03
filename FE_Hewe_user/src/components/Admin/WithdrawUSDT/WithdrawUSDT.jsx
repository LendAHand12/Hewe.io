import WithdrawUSDTPage from "../../WithdrawUSDTPage/WithdrawUSDTPage";
import Sidenav from "../Sidenav/sidenav";
import HeaderAdmin from "../header/header";

export const WithdrawUSDT = () => {
  return (
    <>
      <HeaderAdmin />
      <div className="dashboards">
        <div className="d-flex row">
          <div className="col-xl-2 h-100">
            <Sidenav />
          </div>

          <div
            className="col-xl-10 myrefpage overflow-y-scroll p-4"
            style={{ height: "90vh", overflowY: "auto", minHeight: "unset" }}
          >
            <WithdrawUSDTPage />
          </div>
        </div>
      </div>
    </>
  );
};
