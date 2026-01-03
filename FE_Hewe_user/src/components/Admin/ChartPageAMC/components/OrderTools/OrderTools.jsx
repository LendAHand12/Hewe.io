import { Drawer } from "antd";
import { BuyTool } from "../BuyTool/BuyTool";
import { SellTool } from "../SellTool/SellTool";
import { useOpenMobileTools } from "./hooks/useOpenMobileTools";
import "./OrderTools.scss";
import { useFadedIn } from "../../../../../hooks/useFadedIn";

export const OrderTools = () => {
  const { side, isOpenTools, handleCloseTools, handleOpenTools } =
    useOpenMobileTools();
  const { domRef } = useFadedIn();

  return (
    <div className="OrderTools" ref={domRef}>
      <div className="desktop">
        <BuyTool />
        <SellTool />
      </div>

      <div className="mobile">
        <div className="btnTransaction buy" onClick={handleOpenTools("buy")}>
          Buy HEWE
        </div>
        <div className="btnTransaction sell" onClick={handleOpenTools("sell")}>
          Sell HEWE
        </div>
      </div>

      <Drawer
        placement={"bottom"}
        onClose={handleCloseTools}
        open={isOpenTools}
        headerStyle={{ display: "none" }}
        // height="fit-content"
      >
        <>
          {side !== null ? (
            side === "buy" ? (
              <BuyTool callbackCloseTools={handleCloseTools} />
            ) : (
              <SellTool callbackCloseTools={handleCloseTools} />
            )
          ) : (
            <div style={{ height: "210px" }}></div>
          )}
        </>
      </Drawer>
    </div>
  );
};
