import { useState } from "react";
import { axiosService } from "../../../../util/service";
import { message } from "antd";

export const useGetData = () => {
  const [dataInitial, setDataInitial] = useState([]);
  const [totalCandle, setTotalCandle] = useState(0);

  const handleGetData = async (
    timeframe,
    limitCandle,
    currentPage,
    isShouldSetState = true
  ) => {
    try {
      const res = await axiosService.get(
        `v2/getChart?period=${timeframe}&limit=${limitCandle}&page=${currentPage}`
      );

      if (!isShouldSetState) {
        setTotalCandle(res.data.data.total);
        return res.data.data.array;
      }

      setTotalCandle(res.data.data.total);
      setDataInitial(res.data.data.array);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleClearData = () => {
    setDataInitial([]);
  };

  return {
    totalCandle,
    dataInitial,
    handleGetData,
    handleClearData,
  };
};
