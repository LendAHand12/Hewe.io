import { useEffect, useState } from "react";
import { axiosService, DOMAIN2 } from "../../../../../../util/service";

export const useGetListOrderTransaction = () => {
  const [data, setData] = useState([]);

  const handleGetData = async () => {
    try {
      const res = await axiosService.get(
        `v2/getPublicHistoryTransactionChart?limit=10&page=1&timeStart=1&timeEnd=9999999999999`
      );

      setData(res.data.data.array);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetData();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { data };
};
