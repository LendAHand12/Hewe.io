import { useUpdateLastCandleChart } from "../../hooks/useUpdateLastCandleChart";

export const ChartLogicUpdateLastCandle = ({ chartEl }) => {
  useUpdateLastCandleChart({ chartEl });

  return null;
};
