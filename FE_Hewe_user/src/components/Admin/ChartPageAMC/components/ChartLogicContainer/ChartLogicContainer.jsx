import { useChart } from "../../hooks/useChart";

export const ChartLogicContainer = ({ chartEl, timeframe }) => {
  useChart({ chartEl, timeframe });

  return null;
};
