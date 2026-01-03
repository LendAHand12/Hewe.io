import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "../../../../util/socket";
import { chartActions } from "../../../../redux/reducers/chartReducer";

export const useGetRealTimeData = ({ timeframe }) => {
  const dispatch = useDispatch();

  const handleUpdateCurrentCandle = (data, tf) => {
    const currentCandleFound = data.find((d) => d.period === tf);

    if (currentCandleFound) {
      dispatch({
        type: chartActions.UPDATE_CURRENT_CANDLE,
        payload: currentCandleFound,
      });
    }
  };

  useEffect(() => {
    socket.on("chartData", (data) => {
      handleUpdateCurrentCandle(data, timeframe);
    });

    socket.on("pool", (data) => {
      dispatch({ type: chartActions.UPDATE_POOLS, payload: data });
    });

    return () => {
      socket.off("chartData");
    };
  }, [timeframe]);
};
