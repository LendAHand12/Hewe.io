import { TIME_FRAME_OPTIONS } from "../../hooks/useTimeframe";
import "./SelectTimeframe.scss";

export const SelectTimeframe = ({ timeframe, handleChangeTimeframe }) => {
  const timeframes = TIME_FRAME_OPTIONS.map((tf, idx) => {
    const isSelected = timeframe === tf ? "selected" : "";
    return (
      <div
        className={`item ${isSelected}`}
        onClick={() => handleChangeTimeframe(tf)}
      >
        {tf}
      </div>
    );
  });

  return (
    <div className="SelectTimeframe">
      <div className="logo">AMC</div>
      <div className="items">{timeframes}</div>
    </div>
  );
};
