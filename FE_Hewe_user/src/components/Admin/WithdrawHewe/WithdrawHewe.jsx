import WithdrawHewePage from "../../WithdrawHewePage/WithdrawHewePage";
import Sidenav from "../Sidenav/sidenav";
import HeaderAdmin from "../header/header";

export const WithdrawHewe = () => {
  return (
    <>
      <HeaderAdmin />
      <div className="dashboards">
        <div className="d-flex row">
          <div className="col-xl-3 h-100">
            <Sidenav />
          </div>

          <div
            className="col-xl-9 myrefpage overflow-y-scroll p-4"
            style={{ height: "90vh", overflowY: "auto", minHeight: "unset" }}
          >
            <div className="adminboardcontt pe-3">
              <WithdrawHewePage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
