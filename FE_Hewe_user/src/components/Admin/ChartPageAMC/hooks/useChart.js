import { useEffect, useState } from "react";
import { useGetData } from "./useGetData";
import { useLimitCandle } from "./useLimitCandle";
import { useCurrentPage } from "./useCurrentPage";
import { useGetRealTimeData } from "./useGetRealtimeData";

const LIMIT_CANDLE = 1000;

export const useChart = ({ chartEl, timeframe, handleChangeTimeframe }) => {
  const { limitCandle } = useLimitCandle(LIMIT_CANDLE);
  const { currentPage, handleChangeCurrentPage } = useCurrentPage(1);
  const { totalCandle, handleClearData, handleGetData } = useGetData();
  const [isCanGetMoreCandles, setIsCanGetMoreCandles] = useState(true);
  const [isPendingGetMoreData, setIsPendingGetMoreData] = useState(false);
  useGetRealTimeData({ timeframe });

  const handleGetHistoryData = async () => {
    const res = await handleGetData(
      timeframe,
      limitCandle,
      currentPage + 1,
      false
    );
    handleChangeCurrentPage(currentPage + 1);
    return res;
  };

  // for case change timeframe
  const handleApplyNewData = (d) => {
    chartEl?.applyNewData(d);
  };

  const handleChangeTimeframeMdw = async (newTf) => {
    handleClearData();
    handleChangeCurrentPage(1);
    setIsCanGetMoreCandles(true);
    const data = await handleGetData(newTf, limitCandle, 1, false);
    handleApplyNewData(data);
  };

  const handleApplyMoreData = async () => {
    if (isPendingGetMoreData) return;

    setIsPendingGetMoreData(true);
    try {
      const moreData = await handleGetHistoryData();

      if (moreData.length === 0) {
        setIsPendingGetMoreData(false);
        setIsCanGetMoreCandles(false);
        return;
      }

      chartEl.applyMoreData(moreData, true);
      setIsPendingGetMoreData(false);
    } catch (error) {
      setIsPendingGetMoreData(false);
    }
  };

  // detect load more history data
  useEffect(() => {
    if (isCanGetMoreCandles) {
      const interval = setInterval(() => {
        const visiableRange = chartEl.getVisibleRange();

        if (visiableRange.realTo <= 3) {
          handleApplyMoreData();
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [totalCandle, isCanGetMoreCandles, isPendingGetMoreData]);

  // detect change timeframe
  useEffect(() => {
    handleChangeTimeframeMdw(timeframe);
  }, [timeframe]);
};
