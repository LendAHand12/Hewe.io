import WalletUSDTPage from "../../WalletUSDTPage/WalletUSDTPage";
import Sidenav from "../Sidenav/sidenav";
import HeaderAdmin from "../header/header";

export const WalletUSDT = () => {
  return (
    <>
      <HeaderAdmin />
      <div className="dashboards">
        <div className="d-flex row">
          <div className="col-xl-3 h-100">
            <Sidenav />
          </div>

          <div
            className="col-xl-9 myrefpage overflow-y-scroll"
            style={{ height: "90vh", overflowY: "auto", minHeight: "unset" }}
          >
            <div className="adminboardcontt">
              <WalletUSDTPage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
