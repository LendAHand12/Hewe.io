import BuyTokenV2 from "../BuyTokenPage/BuyTokenV2";
import Sidenav from "../Sidenav/sidenav";
import HeaderAdmin from "../header/header";

export const SwapHewe = () => {
  return (
    <>
      <HeaderAdmin />
      <div className="dashboards">
        <div className="d-flex row">
          <div className="col-xl-3">
            <Sidenav />
          </div>
          <div
            className="col-xl-9 myrefpage overflow-y-scroll"
            style={{ height: "90vh", overflowY: "auto", minHeight: "unset" }}
          >
            {/* <SwapHewePage /> */}
            <BuyTokenV2 type="api" />
          </div>
        </div>
      </div>
    </>
  );
};
