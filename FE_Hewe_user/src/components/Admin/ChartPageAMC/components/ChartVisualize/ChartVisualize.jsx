import {
  init,
  dispose,
  registerOverlay,
  getSupportedOverlays,
} from "klinecharts";
import { useEffect, useMemo, useRef, useState } from "react";
import { configStyle } from "../../configs/configStyle";
import { getStyleChart } from "../../utils/getStyleChart";
import "./ChartVisualize.scss";
import { useChart } from "../../hooks/useChart";
import { ChartLogicContainer } from "../ChartLogicContainer/ChartLogicContainer";
import { SelectTimeframe } from "../SelectTimeframe/SelectTimeframe";
import { useTimeframe } from "../../hooks/useTimeframe";
import { OrderTools } from "../OrderTools/OrderTools";
import { ChartLogicUpdateLastCandle } from "../ChartLogicUpdateLastCandle/ChartLogicUpdateLastCandle";
import { useGetWalletPool } from "../../hooks/useGetWalletPool";
import { OrderTransactions } from "../OrderTransactions/OrderTransactions";

export const ChartVisualize = ({ onlyShowChart = false, height, width }) => {
  const chartRef = useRef(null);
  const [chartEl, setChartEl] = useState(null);
  const { timeframe, handleChangeTimeframe } = useTimeframe();
  useGetWalletPool();

  const handleChangeStyle = () => {
    const styleChart = getStyleChart(chartRef.current);

    const newStyleChart = configStyle(styleChart);

    chartRef.current.setStyles(newStyleChart);
  };

  useEffect(() => {
    const chart = init("chart", {
      decimalFoldThreshold: 10,
    });
    chartRef.current = chart;
    setChartEl(chart);

    // custom decimal number
    chart.setPriceVolumePrecision(4, 4);

    return () => {
      dispose("chart");
    };
  }, []);

  useEffect(() => {
    handleChangeStyle();
  }, []);

  if (onlyShowChart) {
    return (
      <div className="ChartVisualize">
        <SelectTimeframe
          timeframe={timeframe}
          handleChangeTimeframe={handleChangeTimeframe}
        />
        <div id="chart" style={{ height: height }} />
        {chartEl && (
          <ChartLogicContainer
            chartEl={chartRef.current}
            timeframe={timeframe}
          />
        )}
        {chartEl && <ChartLogicUpdateLastCandle chartEl={chartRef.current} />}
      </div>
    );
  }

  return (
    <>
      <div className="ChartVisualize">
        <SelectTimeframe
          timeframe={timeframe}
          handleChangeTimeframe={handleChangeTimeframe}
        />
        <div
          id="chart"
          style={{ height: window.innerWidth > 600 ? 600 : 400 }}
        />
        {chartEl && (
          <ChartLogicContainer
            chartEl={chartRef.current}
            timeframe={timeframe}
          />
        )}
        {chartEl && <ChartLogicUpdateLastCandle chartEl={chartRef.current} />}
      </div>
      {/* <OrderTools /> */}
      {/* <OrderTransactions /> */}
    </>
  );
};
