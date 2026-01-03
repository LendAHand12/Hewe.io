import Sidenav from "../Sidenav/sidenav";
import HeaderAdmin from "../header/header";
import { ChartVisualize } from "./components/ChartVisualize/ChartVisualize";

export const ChartPage = () => {
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
            style={{
              height: "90vh",

              overflowY: "auto",
              paddingRight: "0px",
              paddingLeft: "0px",
            }}
          >
            <div
              className="adminboardcontt pe-3"
              style={{
                paddingBottom: "100px",
                paddingRight: "8px",
                paddingLeft: "8px",
              }}
            >
              <ChartVisualize />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
