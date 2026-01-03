import { useEffect } from "react";
import { useSelector } from "react-redux";

export const useUpdateLastCandleChart = ({ chartEl }) => {
  const { currentCandle } = useSelector((state) => state.chartReducer);

  const handleUpdateLastCandle = (d) => {
    chartEl.updateData(d);
  };

  useEffect(() => {
    if (currentCandle) {
      handleUpdateLastCandle(currentCandle);
    }
  }, [currentCandle]);
};
