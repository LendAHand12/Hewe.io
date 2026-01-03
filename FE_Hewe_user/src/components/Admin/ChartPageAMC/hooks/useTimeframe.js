import { useState } from "react";

export const TIME_FRAME_OPTIONS = ["1m", "1h", "12h", "1d", "3d", "7d"];

export const useTimeframe = () => {
  const [timeframe, setTimeframe] = useState(TIME_FRAME_OPTIONS[0]);

  const handleChangeTimeframe = (timeframe) => {
    setTimeframe(timeframe);
  };

  return { timeframe, handleChangeTimeframe };
};
